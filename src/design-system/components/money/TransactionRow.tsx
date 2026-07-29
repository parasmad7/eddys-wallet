import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon } from '../core/Icon';
import { MoneyAmount, formatCents } from './MoneyAmount';

const TYPES = {
  deposit: { icon: 'arrow-down-to-line', bg: 'var(--mint-100)', fg: 'var(--mint-700)', label: 'Deposit' },
  allowance: { icon: 'calendar-check', bg: 'var(--grape-100)', fg: 'var(--grape-700)', label: 'Allowance' },
  interest: { icon: 'sparkles', bg: 'var(--gold-100)', fg: 'var(--gold-700)', label: 'Interest' },
  withdrawal: { icon: 'arrow-up-from-line', bg: 'var(--berry-100)', fg: 'var(--berry-700)', label: 'Withdrawal' },
  transfer: { icon: 'arrow-left-right', bg: 'var(--sky-100)', fg: 'var(--sky-700)', label: 'Transfer' },
  adjustment: { icon: 'pencil', bg: 'var(--ink-100)', fg: 'var(--ink-700)', label: 'Adjustment' },
  loan_disbursement: { icon: 'hand-coins', bg: 'var(--tang-100)', fg: 'var(--tang-700)', label: 'Loan' },
  loan_payment: { icon: 'receipt', bg: 'var(--berry-100)', fg: 'var(--berry-700)', label: 'Loan payment' },
} as const;

export interface TransactionRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** Matches the ledger's transaction types. */
  type?: 'deposit' | 'withdrawal' | 'allowance' | 'interest' | 'transfer' | 'adjustment' | 'loan_disbursement' | 'loan_payment';
  /** Human description, e.g. "Birthday money from Grandma". */
  description?: string;
  /** Pre-formatted date/time string. */
  date?: string;
  /** Signed integer cents. */
  cents: number;
  /** Optional running balance snapshot shown under the amount. */
  balanceAfter?: number;
  divider?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export function TransactionRow({ type = 'deposit', description, date, cents = 0, balanceAfter, divider = true, onClick, style, ...rest }: TransactionRowProps) {
  const t = TYPES[type] || TYPES.deposit;
  return (
    <div
      {...rest}
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) 0', borderBottom: divider ? '1px solid var(--border-subtle)' : 'none', cursor: onClick ? 'pointer' : 'default', ...style }}
    >
      <div style={{ width: 40, height: 40, flex: 'none', borderRadius: 'var(--radius-circle)', background: t.bg, color: t.fg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={t.icon} size={19} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: 'var(--type-body-strong)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{description || t.label}</div>
        <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{date}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <MoneyAmount cents={cents} size="sm" signed />
        {balanceAfter != null && <div style={{ font: 'var(--type-caption)', color: 'var(--text-faint)', fontVariantNumeric: 'tabular-nums' }}>{formatCents(balanceAfter)}</div>}
      </div>
    </div>
  );
}
