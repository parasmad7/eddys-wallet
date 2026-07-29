import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

const COLORS = ['var(--chip-grape)', 'var(--chip-tang)', 'var(--chip-mint)', 'var(--chip-sky)', 'var(--chip-gold)', 'var(--chip-berry)'];

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  name?: string;
  color?: string;
  size?: number;
  emojiFree?: boolean;
  style?: CSSProperties;
}

export function Avatar({ name = '', color, size = 40, style, ...rest }: AvatarProps) {
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  const bg = color || COLORS[(name.charCodeAt(0) || 0) % COLORS.length];
  return (
    <span
      {...rest}
      style={{
        width: size,
        height: size,
        flex: 'none',
        borderRadius: 'var(--radius-circle)',
        background: bg,
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        font: `var(--weight-heavy) ${Math.round(size * 0.42)}px/1 var(--font-display)`,
        ...style,
      }}
    >
      {initial}
    </span>
  );
}

export interface AvatarChipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  name: string;
  /** Overrides the auto-assigned chip colour. */
  color?: string;
  /** Secondary line, e.g. "$12.40 · 2 goals". */
  caption?: string;
  selected?: boolean;
  onClick?: () => void;
  trailing?: ReactNode;
  style?: CSSProperties;
}

export function AvatarChip({ name, color, caption, selected, onClick, trailing, style, ...rest }: AvatarChipProps) {
  return (
    <div
      {...rest}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: '6px 14px 6px 6px',
        background: selected ? 'var(--brand-soft)' : 'var(--surface-card)',
        border: `2px solid ${selected ? 'var(--brand)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-pill)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color var(--dur-fast) linear',
        ...style,
      }}
    >
      <Avatar name={name} color={color} size={36} />
      <span>
        <span style={{ display: 'block', font: 'var(--type-body-strong)', color: 'var(--text-strong)', lineHeight: 1.2 }}>{name}</span>
        {caption && <span style={{ display: 'block', font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{caption}</span>}
      </span>
      {trailing}
    </div>
  );
}
