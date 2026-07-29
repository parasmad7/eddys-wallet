export interface TransactRequest {
  account_id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  description?: string;
}

export interface TransferRequest {
  from_account_id: string;
  to_account_id: string;
  amount: number;
  description?: string;
}

export interface ChildLoginRequest {
  family_code: string;
  pin: string;
}

export interface TransactionResult {
  transaction_id: string;
  new_balance: number;
}

export interface TransferResult {
  debit_transaction_id: string;
  credit_transaction_id: string;
  from_new_balance: number;
  to_new_balance: number;
}

export type TransactionType =
  | "deposit"
  | "withdrawal"
  | "allowance"
  | "interest"
  | "loan_disbursement"
  | "loan_payment"
  | "transfer"
  | "adjustment";

export type AllowanceFrequency = "daily" | "weekly" | "biweekly" | "monthly";

export type CompoundFrequency = "daily" | "weekly" | "monthly";
