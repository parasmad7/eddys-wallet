-- Enable RLS on all tables and create access policies
--
-- JWT claims used:
--   auth.jwt() ->> 'role'       : 'parent' or 'child'
--   auth.jwt() ->> 'family_id'  : UUID of the user's family
--   auth.jwt() ->> 'profile_id' : UUID of the user's profile

-- ============================================================
-- families
-- ============================================================
ALTER TABLE families ENABLE ROW LEVEL SECURITY;

CREATE POLICY "parents_read_own_family" ON families
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'parent'
    AND id = (auth.jwt() ->> 'family_id')::uuid
  );

CREATE POLICY "parents_update_own_family" ON families
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'parent'
    AND id = (auth.jwt() ->> 'family_id')::uuid
  );

CREATE POLICY "parents_insert_family" ON families
  FOR INSERT WITH CHECK (
    owner_id = auth.uid()
  );

CREATE POLICY "children_read_own_family" ON families
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'child'
    AND id = (auth.jwt() ->> 'family_id')::uuid
  );

-- ============================================================
-- profiles
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "parents_manage_family_profiles" ON profiles
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'parent'
    AND family_id = (auth.jwt() ->> 'family_id')::uuid
  );

CREATE POLICY "children_read_own_profile" ON profiles
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'child'
    AND id = (auth.jwt() ->> 'profile_id')::uuid
  );

-- ============================================================
-- accounts
-- ============================================================
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "parents_manage_family_accounts" ON accounts
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'parent'
    AND family_id = (auth.jwt() ->> 'family_id')::uuid
  );

CREATE POLICY "children_read_own_accounts" ON accounts
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'child'
    AND profile_id = (auth.jwt() ->> 'profile_id')::uuid
  );

-- ============================================================
-- transactions (immutable: no UPDATE or DELETE for anyone)
-- ============================================================
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "parents_read_family_transactions" ON transactions
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'parent'
    AND account_id IN (
      SELECT id FROM accounts
      WHERE family_id = (auth.jwt() ->> 'family_id')::uuid
    )
  );

CREATE POLICY "parents_insert_transactions" ON transactions
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'parent'
    AND account_id IN (
      SELECT id FROM accounts
      WHERE family_id = (auth.jwt() ->> 'family_id')::uuid
    )
  );

CREATE POLICY "children_read_own_transactions" ON transactions
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'child'
    AND account_id IN (
      SELECT id FROM accounts
      WHERE profile_id = (auth.jwt() ->> 'profile_id')::uuid
    )
  );

-- Children can insert transfer transactions (moving money between their own accounts)
CREATE POLICY "children_insert_transfer_transactions" ON transactions
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'child'
    AND type = 'transfer'
    AND account_id IN (
      SELECT id FROM accounts
      WHERE profile_id = (auth.jwt() ->> 'profile_id')::uuid
    )
    AND created_by = (auth.jwt() ->> 'profile_id')::uuid
  );

-- Service role (Edge Functions) bypasses RLS, so no explicit policy needed
-- for system-initiated transactions (allowance, interest)

-- ============================================================
-- allowance_rules
-- ============================================================
ALTER TABLE allowance_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "parents_manage_family_allowance_rules" ON allowance_rules
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'parent'
    AND family_id = (auth.jwt() ->> 'family_id')::uuid
  );

CREATE POLICY "children_read_own_allowance_rules" ON allowance_rules
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'child'
    AND account_id IN (
      SELECT id FROM accounts
      WHERE profile_id = (auth.jwt() ->> 'profile_id')::uuid
    )
  );

-- ============================================================
-- interest_configs
-- ============================================================
ALTER TABLE interest_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "parents_manage_family_interest_configs" ON interest_configs
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'parent'
    AND account_id IN (
      SELECT id FROM accounts
      WHERE family_id = (auth.jwt() ->> 'family_id')::uuid
    )
  );

CREATE POLICY "children_read_own_interest_configs" ON interest_configs
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'child'
    AND account_id IN (
      SELECT id FROM accounts
      WHERE profile_id = (auth.jwt() ->> 'profile_id')::uuid
    )
  );

-- ============================================================
-- savings_goals
-- ============================================================
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "parents_manage_family_savings_goals" ON savings_goals
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'parent'
    AND account_id IN (
      SELECT id FROM accounts
      WHERE family_id = (auth.jwt() ->> 'family_id')::uuid
    )
  );

CREATE POLICY "children_read_own_savings_goals" ON savings_goals
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'child'
    AND account_id IN (
      SELECT id FROM accounts
      WHERE profile_id = (auth.jwt() ->> 'profile_id')::uuid
    )
  );

CREATE POLICY "children_manage_own_savings_goals" ON savings_goals
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'child'
    AND account_id IN (
      SELECT id FROM accounts
      WHERE profile_id = (auth.jwt() ->> 'profile_id')::uuid
    )
  );

CREATE POLICY "children_update_own_savings_goals" ON savings_goals
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'child'
    AND account_id IN (
      SELECT id FROM accounts
      WHERE profile_id = (auth.jwt() ->> 'profile_id')::uuid
    )
  );
