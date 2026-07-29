import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon } from './Icon';

const T = {
  neutral: ['var(--ink-100)', 'var(--ink-700)'],
  brand: ['var(--brand-soft)', 'var(--grape-700)'],
  mint: ['var(--mint-100)', 'var(--mint-700)'],
  gold: ['var(--gold-100)', 'var(--gold-700)'],
  berry: ['var(--berry-100)', 'var(--berry-700)'],
  sky: ['var(--sky-100)', 'var(--sky-700)'],
  accent: ['var(--tang-100)', 'var(--tang-700)'],
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  tone?: 'neutral' | 'brand' | 'mint' | 'gold' | 'berry' | 'sky' | 'accent';
  icon?: string;
  size?: 'sm' | 'md';
  style?: CSSProperties;
}

export function Badge({ children, tone = 'neutral', icon, size = 'md', style, ...rest }: BadgeProps) {
  const [bg, fg] = T[tone] || T.neutral;
  const sm = size === 'sm';
  return (
    <span
      {...rest}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: bg,
        color: fg,
        padding: sm ? '2px 8px' : '4px 10px',
        borderRadius: 'var(--radius-pill)',
        font: `var(--weight-bold) ${sm ? 'var(--text-2xs)' : 'var(--text-xs)'}/1.3 var(--font-body)`,
        letterSpacing: 'var(--tracking-wide)',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={sm ? 11 : 13} />}
      {children}
    </span>
  );
}
