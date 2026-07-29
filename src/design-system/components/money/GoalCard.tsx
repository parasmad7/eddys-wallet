import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon } from '../core/Icon';
import { MoneyAmount, formatCents } from './MoneyAmount';
import { ProgressBar } from './ProgressBar';
import { Badge } from '../core/Badge';

/** Savings goal with progress. */
export interface GoalCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  name: string;
  /** Integer cents. */
  targetCents: number;
  /** Integer cents saved so far. */
  currentCents: number;
  /** Pre-formatted deadline, e.g. "Dec 2026". */
  deadline?: string;
  status?: 'active' | 'reached' | 'abandoned';
  /** Lucide slug the child picks for the goal. */
  icon?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

export function GoalCard({ name, targetCents = 0, currentCents = 0, deadline, status = 'active', icon = 'target', onClick, style, ...rest }: GoalCardProps) {
  const pct = targetCents ? Math.min(100, (currentCents / targetCents) * 100) : 0;
  const reached = status === 'reached' || pct >= 100;
  return (
    <div
      {...rest}
      onClick={onClick}
      style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', padding: 'var(--space-4)', boxShadow: 'var(--shadow-sm)', cursor: onClick ? 'pointer' : 'default', ...style }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <div style={{ width: 44, height: 44, flex: 'none', borderRadius: 'var(--radius-md)', background: reached ? 'var(--mint-100)' : 'var(--tang-100)', color: reached ? 'var(--mint-700)' : 'var(--tang-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={reached ? 'party-popper' : icon} size={22} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: 'var(--type-section)', color: 'var(--text-strong)' }}>{name}</div>
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{reached ? 'Goal reached!' : deadline ? `by ${deadline}` : 'No deadline'}</div>
        </div>
        {reached && (
          <Badge tone="mint" icon="check">
            Reached
          </Badge>
        )}
        {status === 'abandoned' && <Badge tone="neutral">Paused</Badge>}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: 'var(--space-4) 0 var(--space-2)' }}>
        <MoneyAmount cents={currentCents} size="lg" tone="plain" />
        <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>of {formatCents(targetCents)}</span>
      </div>
      <ProgressBar value={currentCents} max={targetCents} tone={reached ? 'mint' : 'accent'} height={12} />
      {!reached && (
        <div style={{ marginTop: 'var(--space-2)', font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{formatCents(Math.max(0, targetCents - currentCents))} to go</div>
      )}
    </div>
  );
}
