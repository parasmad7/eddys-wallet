import { useState, type CSSProperties, type HTMLAttributes } from 'react';

export interface MoneyInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label?: string;
  /** Dollar string, e.g. "5.00". Store cents upstream. */
  value?: string;
  onChange?: (next: string) => void;
  /** Quick-pick dollar amounts, e.g. [1, 5, 10, 20]. */
  presets?: number[];
  hint?: string;
  error?: string;
  style?: CSSProperties;
}

/** Big dollar-amount entry with optional quick-pick chips. Value is a string of dollars. */
export function MoneyInput({ label, value = '', onChange, presets = [], hint, error, style, ...rest }: MoneyInputProps) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ ...style }} {...rest}>
      {label && <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', letterSpacing: 'var(--tracking-wide)', marginBottom: 8 }}>{label}</div>}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          padding: 'var(--space-4)',
          background: 'var(--brand-tint)',
          borderRadius: 'var(--radius-lg)',
          border: `var(--border-width-thick) solid ${error ? 'var(--danger)' : focus ? 'var(--brand)' : 'transparent'}`,
        }}
      >
        <span style={{ font: 'var(--weight-heavy) var(--text-4xl)/1 var(--font-money)', color: 'var(--text-faint)' }}>$</span>
        <input
          inputMode="decimal"
          value={value}
          placeholder="0.00"
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={(e) => onChange && onChange(e.target.value.replace(/[^0-9.]/g, ''))}
          style={{
            width: Math.max(3, (value || '0.00').length + 1) + 'ch',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            textAlign: 'left',
            font: 'var(--weight-heavy) var(--text-5xl)/1 var(--font-money)',
            color: 'var(--text-strong)',
            fontVariantNumeric: 'tabular-nums',
          }}
        />
      </div>
      {presets.length > 0 && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)', flexWrap: 'wrap' }}>
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange && onChange(String(p))}
              style={{
                height: 38,
                padding: '0 14px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--surface-card)',
                border: '2px solid var(--border-default)',
                color: 'var(--text-body)',
                cursor: 'pointer',
                font: 'var(--weight-bold) var(--text-sm)/1 var(--font-body)',
              }}
            >
              ${p}
            </button>
          ))}
        </div>
      )}
      {(hint || error) && <div style={{ marginTop: 6, font: 'var(--type-caption)', color: error ? 'var(--danger)' : 'var(--text-muted)' }}>{error || hint}</div>}
    </div>
  );
}
