export interface Family {
  id: string;
  name: string;
  family_code: string;
  owner_id: string;
  created_at: string;
}

export type ProfileRole = 'parent' | 'child';

export interface Profile {
  id: string;
  family_id: string;
  name: string;
  role: ProfileRole;
  pin_hash: string | null;
  avatar_url: string | null;
  auth_user_id: string | null;
  created_at: string;
}

export type AccountType = 'spending' | 'savings';

export interface Account {
  id: string;
  profile_id: string;
  family_id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  created_at: string;
}

export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'allowance'
  | 'interest'
  | 'loan_disbursement'
  | 'loan_payment'
  | 'transfer'
  | 'adjustment';

export interface Transaction {
  id: string;
  account_id: string;
  type: TransactionType;
  amount: number;
  balance_after: number;
  description: string | null;
  metadata: Record<string, unknown>;
  created_by: string;
  created_at: string;
}

export type AllowanceFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly';

export interface AllowanceRule {
  id: string;
  family_id: string;
  account_id: string;
  amount: number;
  frequency: AllowanceFrequency;
  day_of_week: number | null;
  day_of_month: number | null;
  is_active: boolean;
  next_run_at: string;
  created_at: string;
}

export type CompoundFrequency = 'daily' | 'weekly' | 'monthly';

export interface InterestConfig {
  id: string;
  account_id: string;
  annual_rate_bps: number;
  compound_frequency: CompoundFrequency;
  is_active: boolean;
  created_at: string;
}

export type SavingsGoalStatus = 'active' | 'reached' | 'abandoned';

export interface SavingsGoal {
  id: string;
  account_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  status: SavingsGoalStatus;
  created_at: string;
}
