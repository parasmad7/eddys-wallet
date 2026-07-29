import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon } from '../core/Icon';
import { MoneyAmount } from './MoneyAmount';

const TONES = {
  neutral: ['var(--surface-card)', 'var(--ink-100)', 'var(--ink-600)'],
  mint: ['var(--mint-50)', 'var(--mint-100)', 'var(--mint-700)'],
  gold: ['var(--gold-100)', 'var(--gold-200)', 'var(--gold-700)'],
  grape: ['var(--grape-50)', 'var(--grape-100)', 'var(--grape-700)'],
  berry: ['var(--berry-50)', 'var(--berry-100)', 'var(--berry-700)'],
} as const;

export interface StatTileProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  /** Integer cents - takes precedence over text. */
  cents?: number;
  /** Non-money value, e.g. "5.0%" or "12 weeks". */
  text?: string;
  icon?: string;
  tone?: 'neutral' | 'mint' | 'gold' | 'grape' | 'berry';
  /** Small caption under the figure, e.g. "up $4.20 this month". */
  delta?: string;
  style?: CSSProperties;
}

export function StatTile({ label, cents, text, icon, tone = 'neutral', delta, style, ...rest }: StatTileProps) {
  const tones = TONES[tone];
  return (
    <div {...rest} style={{ background: tones[0], border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
        {icon && (
          <span style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: tones[1], color: tones[2], display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={icon} size={16} />
          </span>
        )}
        <span style={{ font: 'var(--type-label)', color: 'var(--text-muted)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase' }}>{label}</span>
      </div>
      {cents != null ? <MoneyAmount cents={cents} size="md" tone="plain" /> : <div style={{ font: 'var(--weight-bold) var(--text-xl)/1.1 var(--font-money)', color: 'var(--text-strong)' }}>{text}</div>}
      {delta && <div style={{ marginTop: 4, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{delta}</div>}
    </div>
  );
}
