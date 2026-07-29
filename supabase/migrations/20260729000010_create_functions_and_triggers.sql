-- Atomic balance update: when a transaction is inserted, update accounts.balance
-- and set transactions.balance_after in a single atomic operation.

CREATE OR REPLACE FUNCTION update_balance_on_transaction()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  new_balance BIGINT;
BEGIN
  -- Atomically update the account balance and capture the new value.
  -- SELECT ... FOR UPDATE locks the row to prevent concurrent modifications.
  UPDATE accounts
  SET balance = balance + NEW.amount
  WHERE id = NEW.account_id
  RETURNING balance INTO new_balance;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Account % not found', NEW.account_id;
  END IF;

  -- Set balance_after on the transaction row being inserted.
  NEW.balance_after := new_balance;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_update_balance_on_transaction
  BEFORE INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_balance_on_transaction();
