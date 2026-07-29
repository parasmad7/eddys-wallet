import type { ChangeEvent, CSSProperties, SelectHTMLAttributes } from 'react';
import { Icon } from '../core/Icon';

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  value?: string;
  /** Plain strings or {value,label} pairs. */
  options?: Array<string | { value: string; label: string }>;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  hint?: string;
  disabled?: boolean;
  style?: CSSProperties;
}

export function Select({ label, value, options = [], onChange, hint, disabled, style, ...rest }: SelectProps) {
  return (
    <label style={{ display: 'block', ...style }}>
      {label && <span style={{ display: 'block', font: 'var(--type-label)', color: 'var(--text-strong)', letterSpacing: 'var(--tracking-wide)', marginBottom: 6 }}>{label}</span>}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 48,
          padding: '0 12px 0 14px',
          background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
          border: 'var(--border-width-thick) solid var(--border-default)',
          borderRadius: 'var(--radius-input)',
        }}
      >
        <select
          value={value}
          disabled={disabled}
          onChange={onChange}
          {...rest}
          style={{ flex: 1, appearance: 'none', border: 'none', outline: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-strong)', font: 'var(--weight-bold) var(--text-md)/1 var(--font-body)' }}
        >
          {options.map((o) => {
            const v = typeof o === 'string' ? o : o.value;
            const l = typeof o === 'string' ? o : o.label;
            return (
              <option key={v} value={v}>
                {l}
              </option>
            );
          })}
        </select>
        <Icon name="chevron-down" size={18} style={{ color: 'var(--text-muted)' }} />
      </span>
      {hint && <span style={{ display: 'block', marginTop: 5, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{hint}</span>}
    </label>
  );
}
