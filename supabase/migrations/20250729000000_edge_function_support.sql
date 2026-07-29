-- Database functions and tables required by Supabase Edge Functions.
-- Run this migration after the core schema tables (families, profiles, accounts,
-- transactions, allowance_rules, interest_configs) are in place.

-- Rate-limit table for child login attempts
CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_code TEXT NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_lookup
  ON login_attempts (family_code, attempted_at);

-- Atomic single-account transaction: inserts a transaction row and updates the
-- account balance inside one database transaction. Returns the new transaction
-- ID and the updated balance.
CREATE OR REPLACE FUNCTION process_transaction(
  p_account_id UUID,
  p_type TEXT,
  p_amount BIGINT,
  p_description TEXT,
  p_created_by UUID
) RETURNS TABLE(transaction_id UUID, new_balance BIGINT)
LANGUAGE plpgsql AS $$
DECLARE
  v_balance BIGINT;
  v_new_balance BIGINT;
  v_txn_id UUID;
BEGIN
  SELECT balance INTO v_balance
    FROM accounts WHERE id = p_account_id
    FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Account not found';
  END IF;

  v_new_balance := v_balance + p_amount;

  IF v_new_balance < 0 THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  UPDATE accounts SET balance = v_new_balance WHERE id = p_account_id;

  INSERT INTO transactions (account_id, type, amount, balance_after, description, created_by)
  VALUES (p_account_id, p_type, p_amount, v_new_balance, p_description, p_created_by)
  RETURNING id INTO v_txn_id;

  RETURN QUERY SELECT v_txn_id, v_new_balance;
END;
$$;

-- Atomic two-account transfer: debits the source, credits the destination, and
-- inserts paired transaction rows. Locks accounts in UUID order to prevent
-- deadlocks.
CREATE OR REPLACE FUNCTION process_transfer(
  p_from_account_id UUID,
  p_to_account_id UUID,
  p_amount BIGINT,
  p_description TEXT,
  p_created_by UUID
) RETURNS TABLE(
  debit_transaction_id UUID,
  credit_transaction_id UUID,
  from_new_balance BIGINT,
  to_new_balance BIGINT
)
LANGUAGE plpgsql AS $$
DECLARE
  v_from_balance BIGINT;
  v_to_balance BIGINT;
  v_from_new BIGINT;
  v_to_new BIGINT;
  v_debit_id UUID;
  v_credit_id UUID;
BEGIN
  -- Lock in deterministic order to prevent deadlocks
  IF p_from_account_id < p_to_account_id THEN
    SELECT balance INTO v_from_balance FROM accounts WHERE id = p_from_account_id FOR UPDATE;
    SELECT balance INTO v_to_balance FROM accounts WHERE id = p_to_account_id FOR UPDATE;
  ELSE
    SELECT balance INTO v_to_balance FROM accounts WHERE id = p_to_account_id FOR UPDATE;
    SELECT balance INTO v_from_balance FROM accounts WHERE id = p_from_account_id FOR UPDATE;
  END IF;

  IF v_from_balance IS NULL OR v_to_balance IS NULL THEN
    RAISE EXCEPTION 'Account not found';
  END IF;

  v_from_new := v_from_balance - p_amount;
  IF v_from_new < 0 THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  v_to_new := v_to_balance + p_amount;

  UPDATE accounts SET balance = v_from_new WHERE id = p_from_account_id;
  UPDATE accounts SET balance = v_to_new WHERE id = p_to_account_id;

  INSERT INTO transactions (account_id, type, amount, balance_after, description, created_by)
  VALUES (p_from_account_id, 'transfer', -p_amount, v_from_new, p_description, p_created_by)
  RETURNING id INTO v_debit_id;

  INSERT INTO transactions (account_id, type, amount, balance_after, description, created_by)
  VALUES (p_to_account_id, 'transfer', p_amount, v_to_new, p_description, p_created_by)
  RETURNING id INTO v_credit_id;

  RETURN QUERY SELECT v_debit_id, v_credit_id, v_from_new, v_to_new;
END;
$$;
