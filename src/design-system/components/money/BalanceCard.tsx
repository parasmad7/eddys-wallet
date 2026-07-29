import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon } from '../core/Icon';
import { MoneyAmount } from './MoneyAmount';

const KINDS = {
  spending: { icon: 'wallet', label: 'Spending', bg: 'linear-gradient(160deg,var(--grape-500),var(--grape-700))' },
  savings: { icon: 'piggy-bank', label: 'Savings', bg: 'linear-gradient(160deg,var(--mint-400),var(--mint-600))' },
  goal: { icon: 'target', label: 'Goal', bg: 'linear-gradient(160deg,var(--tang-400),var(--tang-600))' },
  debt: { icon: 'credit-card', label: 'Owed', bg: 'linear-gradient(160deg,var(--berry-400),var(--berry-600))' },
} as const;

/** Account balance hero card. */
export interface BalanceCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  kind?: 'spending' | 'savings' | 'goal' | 'debt';
  /** Overrides the default account label. */
  name?: string;
  /** Integer cents. */
  cents: number;
  /** Small pill under the figure, e.g. "+$0.42 interest this month". */
  note?: string;
  noteIcon?: string;
  size?: 'md' | 'hero';
  onClick?: () => void;
  style?: CSSProperties;
}

export function BalanceCard({ kind = 'spending', name, cents = 0, note, noteIcon, size = 'md', onClick, style, ...rest }: BalanceCardProps) {
  const k = KINDS[kind] || KINDS.spending;
  const hero = size === 'hero';
  return (
    <div
      {...rest}
      onClick={onClick}
      style={{ position: 'relative', overflow: 'hidden', background: k.bg, color: '#fff', borderRadius: 'var(--radius-card)', padding: hero ? 'var(--space-6)' : 'var(--space-5)', boxShadow: 'var(--shadow-md)', cursor: onClick ? 'pointer' : 'default', ...style }}
    >
      <div style={{ position: 'absolute', right: -30, top: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,.10)' }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', opacity: 0.92 }}>
        <Icon name={k.icon} size={hero ? 20 : 18} />
        <span style={{ font: 'var(--weight-bold) var(--text-sm)/1 var(--font-body)', letterSpacing: 'var(--tracking-wide)' }}>{name || k.label}</span>
      </div>
      <div style={{ position: 'relative', marginTop: hero ? 'var(--space-3)' : 'var(--space-2)' }}>
        <MoneyAmount cents={cents} size={hero ? 'hero' : 'xl'} tone="inherit" />
      </div>
      {note && (
        <div style={{ position: 'relative', marginTop: 'var(--space-2)', display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.18)', borderRadius: 'var(--radius-pill)', padding: '4px 10px', font: 'var(--weight-bold) var(--text-xs)/1.3 var(--font-body)' }}>
          {noteIcon && <Icon name={noteIcon} size={13} />}
          {note}
        </div>
      )}
    </div>
  );
}
