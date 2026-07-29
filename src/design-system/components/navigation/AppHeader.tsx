import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { IconButton } from '../core/IconButton';

export interface AppHeaderProps extends HTMLAttributes<HTMLElement> {
  title: string;
  /** Eyebrow line above the title - use it for the mode name or family name. */
  subtitle?: string;
  /** kid = rounded bottom corners + display title; parent = square, compact. */
  mode?: 'kid' | 'parent';
  onBack?: () => void;
  /** Trailing IconButtons. */
  actions?: ReactNode;
  /** Content that sits inside the coloured area (e.g. a BalanceCard overlap). */
  children?: ReactNode;
  style?: CSSProperties;
}

/** Mode-coloured app bar. The gradient is what tells you which mode you're in. */
export function AppHeader({ title, subtitle, mode = 'kid', onBack, actions, children, style, ...rest }: AppHeaderProps) {
  return (
    <header
      {...rest}
      style={{
        background: 'var(--mode-header,linear-gradient(180deg,var(--grape-500),var(--grape-600)))',
        color: '#fff',
        padding: 'var(--space-4) var(--space-4) var(--space-5)',
        borderRadius: mode === 'kid' ? '0 0 var(--radius-2xl) var(--radius-2xl)' : '0',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minHeight: 44 }}>
        {onBack && <IconButton icon="chevron-left" label="Back" variant="onBrand" size="sm" onClick={onBack} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          {subtitle && (
            <div style={{ font: 'var(--weight-bold) var(--text-xs)/1.2 var(--font-body)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', opacity: 0.75 }}>{subtitle}</div>
          )}
          <div style={{ font: mode === 'kid' ? 'var(--type-title)' : 'var(--weight-bold) var(--text-xl)/1.2 var(--font-display)', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
        </div>
        {actions && <div style={{ display: 'flex', gap: 'var(--space-2)' }}>{actions}</div>}
      </div>
      {children && <div style={{ marginTop: 'var(--space-4)' }}>{children}</div>}
    </header>
  );
}
