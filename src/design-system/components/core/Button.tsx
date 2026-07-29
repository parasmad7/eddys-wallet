import { useState, type ButtonHTMLAttributes, type CSSProperties } from 'react';
import { Icon } from './Icon';

const SIZES = {
  sm: { padding: '0 14px', height: 36, font: 'var(--weight-bold) var(--text-sm)/1 var(--font-body)', icon: 16 },
  md: { padding: '0 20px', height: 48, font: 'var(--weight-bold) var(--text-md)/1 var(--font-body)', icon: 18 },
  lg: { padding: '0 28px', height: 56, font: 'var(--weight-heavy) var(--text-lg)/1 var(--font-display)', icon: 22 },
} as const;

const VARIANTS = {
  primary: { background: 'var(--brand)', color: 'var(--brand-on)', border: 'none', boxShadow: 'var(--shadow-chunky)' },
  accent: { background: 'var(--accent)', color: 'var(--accent-on)', border: 'none', boxShadow: 'var(--shadow-chunky-accent)' },
  secondary: { background: 'var(--surface-card)', color: 'var(--text-strong)', border: 'var(--border-width-thick) solid var(--border-default)', boxShadow: 'var(--shadow-chunky-neutral)' },
  ghost: { background: 'transparent', color: 'var(--brand-strong)', border: 'none', boxShadow: 'none' },
  danger: { background: 'var(--danger)', color: '#fff', border: 'none', boxShadow: '0 4px 0 var(--berry-700)' },
} as const;

/** Primary action control. */
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children?: React.ReactNode;
  /** primary = grape, accent = tangerine (celebratory/CTA), secondary = outlined, ghost = text-only, danger = destructive. */
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Lucide slug rendered before the label. */
  icon?: string;
  /** Lucide slug rendered after the label. */
  iconAfter?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  onClick?: () => void;
  style?: CSSProperties;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconAfter,
  fullWidth,
  disabled,
  type = 'button',
  onClick,
  style,
  ...rest
}: ButtonProps) {
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const [down, setDown] = useState(false);
  const flat = variant === 'ghost';
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      onPointerLeave={() => setDown(false)}
      {...rest}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        height: s.height,
        padding: s.padding,
        font: s.font,
        borderRadius: 'var(--radius-button)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : 'auto',
        minWidth: flat ? 0 : 'var(--hit-min)',
        whiteSpace: 'nowrap',
        transition: 'transform var(--dur-fast) var(--ease-standard),box-shadow var(--dur-fast) var(--ease-standard),filter var(--dur-fast) linear',
        opacity: disabled ? 0.45 : 1,
        transform: down && !disabled && !flat ? 'translateY(var(--press-translate))' : 'none',
        ...v,
        boxShadow: down && !disabled ? 'none' : v.boxShadow,
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={s.icon} />}
      {children}
      {iconAfter && <Icon name={iconAfter} size={s.icon} />}
    </button>
  );
}
