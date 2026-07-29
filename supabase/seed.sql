-- Development seed data for Eddy's Wallet
-- Run with: supabase db reset (applies migrations then seed)
--
-- This seed expects the trigger trg_update_balance_on_transaction to be active,
-- so balance_after will be computed automatically. We pass 0 as a placeholder
-- since the BEFORE INSERT trigger overwrites it.

-- ============================================================
-- 1. Create a demo auth user (parent)
-- ============================================================
-- In local dev, Supabase seeds auth.users directly.
-- Password: "demo-parent-123" (not used in seed - parent logs in via Supabase Auth)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, instance_id, aud, role)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'parent@demo.test',
  crypt('demo-parent-123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated'
);

-- ============================================================
-- 2. Create the demo family
-- ============================================================
INSERT INTO families (id, name, family_code, owner_id)
VALUES (
  'f0f0f0f0-1111-2222-3333-444444444444',
  'The Demo Family',
  'DEMO-1234',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
);

-- ============================================================
-- 3. Create profiles
-- ============================================================
-- Parent profile
INSERT INTO profiles (id, family_id, name, role, auth_user_id)
VALUES (
  'p0p0p0p0-1111-2222-3333-444444444444',
  'f0f0f0f0-1111-2222-3333-444444444444',
  'Demo Parent',
  'parent',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
);

-- Child 1: Eddy (PIN: 1234)
INSERT INTO profiles (id, family_id, name, role, pin_hash)
VALUES (
  'c1c1c1c1-1111-2222-3333-444444444444',
  'f0f0f0f0-1111-2222-3333-444444444444',
  'Eddy',
  'child',
  crypt('1234', gen_salt('bf'))
);

-- Child 2: Mia (PIN: 5678)
INSERT INTO profiles (id, family_id, name, role, pin_hash)
VALUES (
  'c2c2c2c2-1111-2222-3333-444444444444',
  'f0f0f0f0-1111-2222-3333-444444444444',
  'Mia',
  'child',
  crypt('5678', gen_salt('bf'))
);

-- ============================================================
-- 4. Create accounts
-- ============================================================
-- Eddy's spending account
INSERT INTO accounts (id, profile_id, family_id, name, type, balance, currency)
VALUES (
  'a1a1a1a1-1111-2222-3333-444444444444',
  'c1c1c1c1-1111-2222-3333-444444444444',
  'f0f0f0f0-1111-2222-3333-444444444444',
  'Spending',
  'spending',
  0,
  'USD'
);

-- Eddy's savings account
INSERT INTO accounts (id, profile_id, family_id, name, type, balance, currency)
VALUES (
  'a2a2a2a2-1111-2222-3333-444444444444',
  'c1c1c1c1-1111-2222-3333-444444444444',
  'f0f0f0f0-1111-2222-3333-444444444444',
  'Savings',
  'savings',
  0,
  'USD'
);

-- Mia's spending account
INSERT INTO accounts (id, profile_id, family_id, name, type, balance, currency)
VALUES (
  'a3a3a3a3-1111-2222-3333-444444444444',
  'c2c2c2c2-1111-2222-3333-444444444444',
  'f0f0f0f0-1111-2222-3333-444444444444',
  'Spending',
  'spending',
  0,
  'USD'
);

-- Mia's savings account
INSERT INTO accounts (id, profile_id, family_id, name, type, balance, currency)
VALUES (
  'a4a4a4a4-1111-2222-3333-444444444444',
  'c2c2c2c2-1111-2222-3333-444444444444',
  'f0f0f0f0-1111-2222-3333-444444444444',
  'Savings',
  'savings',
  0,
  'USD'
);

-- ============================================================
-- 5. Seed transactions
-- ============================================================
-- The trigger will update account balances and set balance_after automatically.

-- Eddy: initial deposit of $50.00
INSERT INTO transactions (account_id, type, amount, balance_after, description, created_by, created_at)
VALUES (
  'a1a1a1a1-1111-2222-3333-444444444444',
  'deposit',
  5000,
  0,
  'Welcome deposit from Mom & Dad',
  'p0p0p0p0-1111-2222-3333-444444444444',
  now() - interval '14 days'
);

-- Eddy: weekly allowance of $10.00
INSERT INTO transactions (account_id, type, amount, balance_after, description, created_by, created_at)
VALUES (
  'a1a1a1a1-1111-2222-3333-444444444444',
  'allowance',
  1000,
  0,
  'Weekly allowance',
  'p0p0p0p0-1111-2222-3333-444444444444',
  now() - interval '7 days'
);

-- Eddy: transfer $20.00 to savings
INSERT INTO transactions (account_id, type, amount, balance_after, description, created_by, created_at)
VALUES (
  'a1a1a1a1-1111-2222-3333-444444444444',
  'transfer',
  -2000,
  0,
  'Transfer to Savings',
  'c1c1c1c1-1111-2222-3333-444444444444',
  now() - interval '6 days'
);

INSERT INTO transactions (account_id, type, amount, balance_after, description, created_by, created_at)
VALUES (
  'a2a2a2a2-1111-2222-3333-444444444444',
  'transfer',
  2000,
  0,
  'Transfer from Spending',
  'c1c1c1c1-1111-2222-3333-444444444444',
  now() - interval '6 days'
);

-- Eddy: interest on savings ($0.08 - demonstrating interest accrual)
INSERT INTO transactions (account_id, type, amount, balance_after, description, created_by, created_at)
VALUES (
  'a2a2a2a2-1111-2222-3333-444444444444',
  'interest',
  8,
  0,
  'Monthly interest (5.00% APR)',
  'p0p0p0p0-1111-2222-3333-444444444444',
  now() - interval '1 day'
);

-- Eddy: another allowance
INSERT INTO transactions (account_id, type, amount, balance_after, description, created_by, created_at)
VALUES (
  'a1a1a1a1-1111-2222-3333-444444444444',
  'allowance',
  1000,
  0,
  'Weekly allowance',
  'p0p0p0p0-1111-2222-3333-444444444444',
  now()
);

-- Mia: initial deposit of $25.00
INSERT INTO transactions (account_id, type, amount, balance_after, description, created_by, created_at)
VALUES (
  'a3a3a3a3-1111-2222-3333-444444444444',
  'deposit',
  2500,
  0,
  'Birthday money from Grandma',
  'p0p0p0p0-1111-2222-3333-444444444444',
  now() - interval '10 days'
);

-- Mia: allowance
INSERT INTO transactions (account_id, type, amount, balance_after, description, created_by, created_at)
VALUES (
  'a3a3a3a3-1111-2222-3333-444444444444',
  'allowance',
  500,
  0,
  'Weekly allowance',
  'p0p0p0p0-1111-2222-3333-444444444444',
  now() - interval '3 days'
);

-- ============================================================
-- 6. Allowance rules
-- ============================================================
-- Eddy gets $10/week on Saturdays
INSERT INTO allowance_rules (family_id, account_id, amount, frequency, day_of_week, is_active, next_run_at)
VALUES (
  'f0f0f0f0-1111-2222-3333-444444444444',
  'a1a1a1a1-1111-2222-3333-444444444444',
  1000,
  'weekly',
  6,
  true,
  now() + interval '7 days'
);

-- Mia gets $5/week on Saturdays
INSERT INTO allowance_rules (family_id, account_id, amount, frequency, day_of_week, is_active, next_run_at)
VALUES (
  'f0f0f0f0-1111-2222-3333-444444444444',
  'a3a3a3a3-1111-2222-3333-444444444444',
  500,
  'weekly',
  6,
  true,
  now() + interval '7 days'
);

-- ============================================================
-- 7. Interest config
-- ============================================================
-- 5% APR on Eddy's savings, compounded monthly
INSERT INTO interest_configs (account_id, annual_rate_bps, compound_frequency, is_active)
VALUES (
  'a2a2a2a2-1111-2222-3333-444444444444',
  500,
  'monthly',
  true
);

-- ============================================================
-- 8. Savings goal
-- ============================================================
-- Eddy is saving for a new bike
INSERT INTO savings_goals (account_id, name, target_amount, current_amount, target_date, status)
VALUES (
  'a2a2a2a2-1111-2222-3333-444444444444',
  'New bike',
  15000,
  2008,
  (now() + interval '90 days')::date,
  'active'
);
