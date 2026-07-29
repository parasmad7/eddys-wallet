import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../core/Icon';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: string;
  title: string;
  children?: ReactNode;
  /** Usually a single Button. */
  action?: ReactNode;
  /** Show the mascot instead of an icon (kid mode). */
  mascotSrc?: string;
  style?: CSSProperties;
}

export function EmptyState({ icon = 'inbox', title, children, action, mascotSrc, style, ...rest }: EmptyStateProps) {
  return (
    <div {...rest} style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-5)', ...style }}>
      {mascotSrc ? (
        <img src={mascotSrc} alt="" width={88} height={88} style={{ marginBottom: 'var(--space-3)' }} />
      ) : (
        <div style={{ width: 64, height: 64, margin: '0 auto var(--space-3)', borderRadius: 'var(--radius-circle)', background: 'var(--brand-soft)', color: 'var(--brand-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={30} />
        </div>
      )}
      <div style={{ font: 'var(--type-section)', color: 'var(--text-strong)' }}>{title}</div>
      {children && <div style={{ maxWidth: 320, margin: '6px auto 0', font: 'var(--type-body)', color: 'var(--text-muted)' }}>{children}</div>}
      {action && <div style={{ marginTop: 'var(--space-4)' }}>{action}</div>}
    </div>
  );
}
