import { useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

export interface TooltipProps extends HTMLAttributes<HTMLSpanElement> {
  label: string;
  children?: ReactNode;
  placement?: 'top' | 'bottom';
  style?: CSSProperties;
}

export function Tooltip({ label, children, placement = 'top', style, ...rest }: TooltipProps) {
  const [show, setShow] = useState(false);
  const pos: CSSProperties = placement === 'bottom' ? { top: 'calc(100% + 8px)' } : { bottom: 'calc(100% + 8px)' };
  return (
    <span
      {...rest}
      style={{ position: 'relative', display: 'inline-flex', ...style }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          role="tooltip"
          style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', ...pos, zIndex: 60, background: 'var(--ink-900)', color: '#fff', borderRadius: 'var(--radius-sm)', padding: '6px 10px', whiteSpace: 'nowrap', font: 'var(--weight-medium) var(--text-xs)/1.3 var(--font-body)', boxShadow: 'var(--shadow-md)' }}
        >
          {label}
        </span>
      )}
    </span>
  );
}
