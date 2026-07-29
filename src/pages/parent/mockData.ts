export interface AllowanceRule {
  amountCents: number;
  frequency: 'Weekly' | 'Biweekly' | 'Monthly';
  day: string;
  nextRun: string;
}

export interface Loan {
  id: string;
  title: string;
  principalCents: number;
  remainingCents: number;
  ratePct: number;
  nextPaymentCents: number;
  nextDue: string;
  status: 'active' | 'paid_off' | 'forgiven';
}

export interface Child {
  id: string;
  name: string;
  age: number;
  spendingCents: number;
  savingsCents: number;
  goalsCount: number;
  interestRatePct: number;
  interestEarnedThisMonthCents: number;
  allowance: AllowanceRule;
  loans: Loan[];
  loansEnabled: boolean;
  creditEnabled: boolean;
}

export type TxnType = 'deposit' | 'withdrawal' | 'allowance' | 'interest' | 'transfer' | 'adjustment' | 'loan_disbursement' | 'loan_payment';

export interface Txn {
  id: string;
  childId: string;
  type: TxnType;
  description: string;
  time: string;
  dateGroup: string;
  cents: number;
  balanceAfter: number;
}

export const FAMILY = {
  name: 'The Smith Family',
  code: 'EDDY-7K3M',
};

export const CHILDREN: Child[] = [
  {
    id: 'maya',
    name: 'Maya',
    age: 11,
    spendingCents: 1240,
    savingsCents: 12480,
    goalsCount: 2,
    interestRatePct: 5.0,
    interestEarnedThisMonthCents: 52,
    allowance: { amountCents: 500, frequency: 'Weekly', day: 'Friday', nextRun: 'Fri, Aug 1' },
    loans: [
      {
        id: 'loan-maya-1',
        title: 'Skateboard loan',
        principalCents: 4000,
        remainingCents: 2600,
        ratePct: 4,
        nextPaymentCents: 500,
        nextDue: 'Fri, Aug 1',
        status: 'active',
      },
    ],
    loansEnabled: true,
    creditEnabled: false,
  },
  {
    id: 'ben',
    name: 'Ben',
    age: 8,
    spendingCents: 375,
    savingsCents: 2100,
    goalsCount: 1,
    interestRatePct: 3.0,
    interestEarnedThisMonthCents: 6,
    allowance: { amountCents: 300, frequency: 'Weekly', day: 'Friday', nextRun: 'Fri, Aug 1' },
    loans: [],
    loansEnabled: false,
    creditEnabled: false,
  },
];

export const TRANSACTIONS: Txn[] = [
  { id: 't8', childId: 'maya', type: 'deposit', description: 'Chores bonus', time: '10:00 AM', dateGroup: 'Mon, Jul 27', cents: 300, balanceAfter: 1240 },
  { id: 't1', childId: 'maya', type: 'allowance', description: 'Weekly allowance', time: '4:00 PM', dateGroup: 'Fri, Jul 24', cents: 500, balanceAfter: 940 },
  { id: 't5', childId: 'ben', type: 'allowance', description: 'Weekly allowance', time: '4:00 PM', dateGroup: 'Fri, Jul 24', cents: 300, balanceAfter: 375 },
  { id: 't4', childId: 'maya', type: 'loan_payment', description: 'Skateboard loan payment', time: '5:02 PM', dateGroup: 'Mon, Jul 20', cents: -500, balanceAfter: 440 },
  { id: 't7', childId: 'ben', type: 'withdrawal', description: 'Spent at arcade', time: '2:30 PM', dateGroup: 'Sat, Jul 18', cents: -150, balanceAfter: 225 },
  { id: 't2', childId: 'maya', type: 'interest', description: 'Savings interest', time: '12:00 AM', dateGroup: 'Tue, Jun 30', cents: 52, balanceAfter: 12480 },
  { id: 't6', childId: 'ben', type: 'interest', description: 'Savings interest', time: '12:00 AM', dateGroup: 'Tue, Jun 30', cents: 6, balanceAfter: 2100 },
  { id: 't3', childId: 'maya', type: 'deposit', description: 'Birthday money from Grandma', time: '6:14 PM', dateGroup: 'Fri, Jun 12', cents: 2500, balanceAfter: 1698 },
];

export function getChild(id: string | undefined): Child | undefined {
  return CHILDREN.find((c) => c.id === id);
}

export function getChildTransactions(childId: string): Txn[] {
  return TRANSACTIONS.filter((t) => t.childId === childId);
}

export function getFamilyTotals() {
  const totalBalanceCents = CHILDREN.reduce((sum, c) => sum + c.spendingCents + c.savingsCents, 0);
  const allowanceThisMonthCents = CHILDREN.reduce((sum, c) => sum + c.allowance.amountCents * 4, 0);
  const interestEarnedCents = CHILDREN.reduce((sum, c) => sum + c.interestEarnedThisMonthCents, 0);
  return { totalBalanceCents, allowanceThisMonthCents, interestEarnedCents };
}
