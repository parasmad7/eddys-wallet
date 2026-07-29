import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

const TONES = {
  gold: ['var(--gold-100)', 'var(--gold-200)'],
  grape: ['var(--grape-50)', 'var(--grape-200)'],
  mint: ['var(--mint-50)', 'var(--mint-200)'],
  tang: ['var(--tang-50)', 'var(--tang-200)'],
} as const;

/** Mascot teaching callout. */
export interface EddyTipProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  title?: string;
  /** Path to the mascot art, relative to the host page. */
  mascotSrc?: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'gold' | 'grape' | 'mint' | 'tang';
  style?: CSSProperties;
}

/** Eddy the mascot explaining a money concept. The teaching voice of the product. */
export function EddyTip({ children, title, mascotSrc = '/assets/eddy-mascot.svg', size = 'md', tone = 'gold', style, ...rest }: EddyTipProps) {
  const tones = TONES[tone];
  const d = size === 'sm' ? 44 : size === 'lg' ? 88 : 64;
  return (
    <div {...rest} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', background: tones[0], border: `1px solid ${tones[1]}`, borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', ...style }}>
      <img src={mascotSrc} alt="" width={d} height={d} style={{ flex: 'none', marginTop: -4 }} />
      <div>
        {title && <div style={{ font: 'var(--type-section)', color: 'var(--text-strong)', marginBottom: 2 }}>{title}</div>}
        <div style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>{children}</div>
      </div>
    </div>
  );
}
