-- Create indexes for common queries

CREATE INDEX idx_profiles_family_id ON profiles(family_id);
CREATE INDEX idx_accounts_profile_id ON accounts(profile_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_allowance_rules_next_run ON allowance_rules(next_run_at)
  WHERE is_active = true;
