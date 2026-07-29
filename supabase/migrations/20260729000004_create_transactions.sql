-- Create transactions table (immutable ledger)

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'deposit', 'withdrawal', 'allowance',
    'interest', 'loan_disbursement', 'loan_payment',
    'transfer', 'adjustment'
  )),
  amount BIGINT NOT NULL,
  balance_after BIGINT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
