import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon } from '../core/Icon';

/** Kid-login numeric keypad. */
export interface PinPadProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Digits expected - the PRD allows 4-6. */
  length?: number;
  value?: string;
  onChange?: (next: string) => void;
  label?: string;
  error?: string;
  style?: CSSProperties;
}

export function PinPad({ length = 4, value = '', onChange, label, error, style, ...rest }: PinPadProps) {
  const push = (d: string) => { if (value.length < length && onChange) onChange(value + d); };
  const back = () => onChange && onChange(value.slice(0, -1));
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];
  return (
    <div {...rest} style={{ ...style }}>
      {label && <div style={{ textAlign: 'center', font: 'var(--type-caption)', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>{label}</div>}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        {Array.from({ length }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 18,
              height: 18,
              borderRadius: 'var(--radius-circle)',
              background: i < value.length ? (error ? 'var(--danger)' : 'var(--brand)') : 'var(--ink-200)',
              transform: i === value.length - 1 ? 'scale(1.15)' : 'none',
              transition: 'transform var(--dur-fast) var(--ease-bounce),background var(--dur-fast) linear',
            }}
          />
        ))}
      </div>
      {error && <div style={{ textAlign: 'center', font: 'var(--type-caption)', color: 'var(--danger)', marginBottom: 'var(--space-3)' }}>{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,72px)', gap: 'var(--space-3)', justifyContent: 'center' }}>
        {keys.map((k, i) =>
          k === '' ? (
            <div key={i} />
          ) : (
            <button
              key={i}
              type="button"
              onClick={() => (k === 'del' ? back() : push(k))}
              style={{
                height: 64,
                borderRadius: 'var(--radius-lg)',
                border: 'none',
                cursor: 'pointer',
                background: k === 'del' ? 'transparent' : 'var(--surface-card)',
                boxShadow: k === 'del' ? 'none' : 'var(--shadow-chunky-neutral)',
                color: 'var(--text-strong)',
                font: 'var(--weight-heavy) var(--text-2xl)/1 var(--font-money)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {k === 'del' ? <Icon name="delete" size={22} style={{ color: 'var(--text-muted)' }} /> : k}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
