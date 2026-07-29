import type { CSSProperties, HTMLAttributes, MouseEvent } from 'react';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  children?: React.ReactNode;
  tone?: 'plain' | 'brand' | 'tint' | 'accent' | 'mint' | 'sunken';
  pad?: 'none' | 'sm' | 'md' | 'lg';
  /** Adds hover lift + pointer cursor. */
  interactive?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export function Card({ children, tone = 'plain', pad = 'md', interactive, onClick, style, ...rest }: CardProps) {
  const pads: Record<string, string | number> = { none: 0, sm: 'var(--space-3)', md: 'var(--space-4)', lg: 'var(--space-6)' };
  const tones: Record<string, CSSProperties> = {
    plain: { background: 'var(--surface-card)', border: '1px solid var(--border-subtle)' },
    brand: { background: 'var(--surface-brand)', border: 'none', color: 'var(--text-on-brand)' },
    tint: { background: 'var(--brand-tint)', border: '1px solid var(--border-brand)' },
    accent: { background: 'var(--accent-soft)', border: '1px solid var(--tang-200)' },
    mint: { background: 'var(--mint-50)', border: '1px solid var(--mint-200)' },
    sunken: { background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)' },
  };
  return (
    <div
      onClick={onClick}
      {...rest}
      style={{
        borderRadius: 'var(--radius-card)',
        padding: pads[pad],
        boxShadow: 'var(--shadow-sm)',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'transform var(--dur-normal) var(--ease-standard),box-shadow var(--dur-normal) var(--ease-standard)',
        ...tones[tone],
        ...style,
      }}
      onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
        if (interactive) {
          e.currentTarget.style.transform = 'translateY(var(--hover-lift))';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }
      }}
      onMouseLeave={(e: MouseEvent<HTMLDivElement>) => {
        if (interactive) {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        }
      }}
    >
      {children}
    </div>
  );
}
