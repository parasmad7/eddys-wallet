import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon } from './Icon';

export interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  /** Optional trailing link label. */
  action?: string;
  actionIcon?: string;
  onAction?: () => void;
  style?: CSSProperties;
}

export function SectionHeader({ title, subtitle, action, actionIcon = 'chevron-right', onAction, style, ...rest }: SectionHeaderProps) {
  return (
    <div {...rest} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-3)', marginBottom: 'var(--space-3)', ...style }}>
      <div>
        <div style={{ font: 'var(--type-section)', color: 'var(--text-strong)' }}>{title}</div>
        {subtitle && <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>}
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--text-link)', font: 'var(--weight-bold) var(--text-sm)/1 var(--font-body)' }}
        >
          {action}
          <Icon name={actionIcon} size={15} />
        </button>
      )}
    </div>
  );
}
