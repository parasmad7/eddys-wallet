import type { CSSProperties, HTMLAttributes } from 'react';

export interface SwitchProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  label?: string;
  /** Secondary line - use it to explain what the child will see. */
  description?: string;
  disabled?: boolean;
  style?: CSSProperties;
}

export function Switch({ checked, onChange, label, description, disabled, style, ...rest }: SwitchProps) {
  const track: CSSProperties = {
    width: 52,
    height: 30,
    borderRadius: 'var(--radius-pill)',
    background: checked ? 'var(--brand)' : 'var(--ink-200)',
    padding: 3,
    flex: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background var(--dur-normal) var(--ease-standard)',
  };
  return (
    <div {...rest} onClick={() => !disabled && onChange && onChange(!checked)} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: disabled ? 'not-allowed' : 'pointer', ...style }}>
      <div style={track} role="switch" aria-checked={!!checked}>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 'var(--radius-circle)',
            background: '#fff',
            boxShadow: 'var(--shadow-sm)',
            transform: checked ? 'translateX(22px)' : 'none',
            transition: 'transform var(--dur-normal) var(--ease-bounce)',
          }}
        />
      </div>
      {(label || description) && (
        <div>
          {label && <div style={{ font: 'var(--type-body-strong)', color: 'var(--text-strong)' }}>{label}</div>}
          {description && <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{description}</div>}
        </div>
      )}
    </div>
  );
}
