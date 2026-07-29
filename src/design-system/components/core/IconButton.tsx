import type { ButtonHTMLAttributes, CSSProperties, PointerEvent } from 'react';
import { Icon } from './Icon';

const S = { sm: 36, md: 44, lg: 52 } as const;

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** Lucide slug. */
  icon: string;
  /** Accessible label - required, the button has no visible text. */
  label: string;
  variant?: 'soft' | 'solid' | 'outline' | 'ghost' | 'onBrand';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export function IconButton({ icon, label, variant = 'soft', size = 'md', disabled, onClick, style, ...rest }: IconButtonProps) {
  const d = S[size] || S.md;
  const looks: Record<string, CSSProperties> = {
    soft: { background: 'var(--brand-soft)', color: 'var(--brand-strong)', border: 'none' },
    solid: { background: 'var(--brand)', color: 'var(--brand-on)', border: 'none' },
    outline: { background: 'var(--surface-card)', color: 'var(--text-body)', border: '1px solid var(--border-default)' },
    ghost: { background: 'transparent', color: 'var(--text-muted)', border: 'none' },
    onBrand: { background: 'rgba(255,255,255,.18)', color: '#fff', border: 'none' },
  };
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      {...rest}
      style={{
        width: d,
        height: d,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-circle)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'transform var(--dur-fast) var(--ease-standard),filter var(--dur-fast) linear',
        ...looks[variant],
        ...style,
      }}
      onPointerDown={(e: PointerEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = 'scale(var(--press-scale))'; }}
      onPointerUp={(e: PointerEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = 'none'; }}
      onPointerLeave={(e: PointerEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = 'none'; }}
    >
      <Icon name={icon} size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
    </button>
  );
}
