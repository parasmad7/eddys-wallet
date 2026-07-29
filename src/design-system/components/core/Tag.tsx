import type { CSSProperties, HTMLAttributes, MouseEvent } from 'react';
import { Icon } from './Icon';

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onClick'> {
  children?: React.ReactNode;
  icon?: string;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  style?: CSSProperties;
}

export function Tag({ children, icon, selected, onClick, onRemove, style, ...rest }: TagProps) {
  return (
    <span
      {...rest}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 34,
        padding: '0 12px',
        borderRadius: 'var(--radius-pill)',
        background: selected ? 'var(--brand)' : 'var(--surface-card)',
        color: selected ? 'var(--brand-on)' : 'var(--text-body)',
        border: selected ? '2px solid var(--brand)' : '2px solid var(--border-default)',
        font: 'var(--weight-bold) var(--text-sm)/1 var(--font-body)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background var(--dur-fast) linear,border-color var(--dur-fast) linear',
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={14} />}
      {children}
      {onRemove && (
        <Icon
          name="x"
          size={14}
          style={{ opacity: 0.7, cursor: 'pointer' }}
          onClick={(e: MouseEvent<HTMLSpanElement>) => { e.stopPropagation(); onRemove(); }}
        />
      )}
    </span>
  );
}
