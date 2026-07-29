-- Create interest configs table

CREATE TABLE interest_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  annual_rate_bps INT NOT NULL DEFAULT 500,
  compound_frequency TEXT NOT NULL DEFAULT 'monthly'
    CHECK (compound_frequency IN ('daily', 'weekly', 'monthly')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
