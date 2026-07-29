import type { CSSProperties, HTMLAttributes } from 'react';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  tone?: 'brand' | 'mint' | 'accent' | 'gold' | 'berry';
  height?: number;
  label?: string;
  showPct?: boolean;
  style?: CSSProperties;
}

const FILL = {
  brand: 'var(--brand)',
  mint: 'var(--mint-500)',
  accent: 'var(--accent)',
  gold: 'var(--gold-400)',
  berry: 'var(--berry-500)',
} as const;

export function ProgressBar({ value = 0, max = 100, tone = 'brand', height = 12, label, showPct, style, ...rest }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, max ? (value / max) * 100 : 0));
  const fill = FILL[tone];
  return (
    <div {...rest} style={{ ...style }}>
      {(label || showPct) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
          <span>{label}</span>
          {showPct && <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--text-strong)', fontWeight: 'var(--weight-bold)' }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div style={{ height, background: 'var(--ink-100)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
        <div style={{ width: pct + '%', height: '100%', background: fill, borderRadius: 'var(--radius-pill)', transition: 'width var(--dur-slow) var(--ease-out)' }} />
      </div>
    </div>
  );
}
