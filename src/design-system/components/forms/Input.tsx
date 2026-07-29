import { useState, type ChangeEvent, type CSSProperties, type InputHTMLAttributes } from 'react';
import { Icon } from '../core/Icon';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'prefix'> {
  label?: string;
  hint?: string;
  /** Replaces hint and turns the field berry-red. */
  error?: string;
  /** Leading Lucide slug. */
  icon?: string;
  /** Leading static text, e.g. "$". */
  prefix?: string;
  type?: string;
  size?: 'sm' | 'md' | 'lg';
  value?: string;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  style?: CSSProperties;
}

export function Input({ label, hint, error, icon, prefix, type = 'text', size = 'md', value, placeholder, onChange, disabled, style, ...rest }: InputProps) {
  const [focus, setFocus] = useState(false);
  const h = size === 'lg' ? 56 : size === 'sm' ? 38 : 48;
  return (
    <label style={{ display: 'block', ...style }}>
      {label && <span style={{ display: 'block', font: 'var(--type-label)', color: 'var(--text-strong)', letterSpacing: 'var(--tracking-wide)', marginBottom: 6 }}>{label}</span>}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          height: h,
          padding: '0 14px',
          background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
          border: `var(--border-width-thick) solid ${error ? 'var(--danger)' : focus ? 'var(--brand)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-input)',
          boxShadow: focus ? 'var(--shadow-focus)' : 'none',
          transition: 'border-color var(--dur-fast) linear,box-shadow var(--dur-fast) linear',
        }}
      >
        {icon && <Icon name={icon} size={18} style={{ color: 'var(--text-faint)' }} />}
        {prefix && <span style={{ font: 'var(--weight-bold) var(--text-lg)/1 var(--font-body)', color: 'var(--text-muted)' }}>{prefix}</span>}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          {...rest}
          style={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'var(--text-strong)',
            font: `var(--weight-medium) ${size === 'lg' ? 'var(--text-lg)' : 'var(--text-md)'}/1.2 var(--font-body)`,
          }}
        />
      </span>
      {(hint || error) && <span style={{ display: 'block', marginTop: 5, font: 'var(--type-caption)', color: error ? 'var(--danger)' : 'var(--text-muted)' }}>{error || hint}</span>}
    </label>
  );
}
