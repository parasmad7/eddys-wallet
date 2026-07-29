import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon } from '../core/Icon';

export interface CheckboxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  style?: CSSProperties;
}

export function Checkbox({ checked, onChange, label, description, disabled, style, ...rest }: CheckboxProps) {
  return (
    <div
      {...rest}
      onClick={() => !disabled && onChange && onChange(!checked)}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style }}
    >
      <div
        role="checkbox"
        aria-checked={!!checked}
        style={{
          width: 26,
          height: 26,
          flex: 'none',
          borderRadius: 'var(--radius-xs)',
          background: checked ? 'var(--brand)' : 'var(--surface-card)',
          border: checked ? '2px solid var(--brand)' : '2px solid var(--border-strong)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          transition: 'background var(--dur-fast) linear',
        }}
      >
        {checked && <Icon name="check" size={16} />}
      </div>
      <div>
        {label && <div style={{ font: 'var(--type-body-strong)', color: 'var(--text-strong)' }}>{label}</div>}
        {description && <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{description}</div>}
      </div>
    </div>
  );
}
