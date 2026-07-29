import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon } from '../core/Icon';
import { MoneyAmount, formatCents } from './MoneyAmount';
import { ProgressBar } from './ProgressBar';
import { Badge } from '../core/Badge';

export interface LoanCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  title?: string;
  /** Original principal, integer cents. */
  principalCents: number;
  /** Outstanding balance, integer cents. */
  remainingCents: number;
  /** Annual rate as a percentage (basis points / 100). */
  ratePct?: number;
  /** Minimum payment for the period, integer cents. */
  nextPayment?: number;
  /** Pre-formatted due date. */
  nextDue?: string;
  status?: 'active' | 'paid_off' | 'forgiven';
  onClick?: () => void;
  style?: CSSProperties;
}

export function LoanCard({ title = 'Loan', principalCents = 0, remainingCents = 0, ratePct = 0, nextPayment, nextDue, status = 'active', onClick, style, ...rest }: LoanCardProps) {
  const paid = principalCents - remainingCents;
  return (
    <div
      {...rest}
      onClick={onClick}
      style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', padding: 'var(--space-4)', boxShadow: 'var(--shadow-sm)', cursor: onClick ? 'pointer' : 'default', ...style }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
        <div style={{ width: 44, height: 44, flex: 'none', borderRadius: 'var(--radius-md)', background: 'var(--berry-100)', color: 'var(--berry-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="hand-coins" size={22} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: 'var(--type-section)', color: 'var(--text-strong)' }}>{title}</div>
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{ratePct}% a year · borrowed {formatCents(principalCents)}</div>
        </div>
        <Badge tone={status === 'paid_off' ? 'mint' : status === 'forgiven' ? 'neutral' : 'berry'}>
          {status === 'paid_off' ? 'Paid off' : status === 'forgiven' ? 'Forgiven' : 'Active'}
        </Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 'var(--space-2)' }}>
        <MoneyAmount cents={remainingCents} size="lg" tone="debt" />
        <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>still owed</span>
      </div>
      <ProgressBar value={paid} max={principalCents} tone="mint" height={10} />
      {nextPayment != null && status === 'active' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)', font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
          <span>Next payment {nextDue ? `· ${nextDue}` : ''}</span>
          <strong style={{ color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{formatCents(nextPayment)}</strong>
        </div>
      )}
    </div>
  );
}
