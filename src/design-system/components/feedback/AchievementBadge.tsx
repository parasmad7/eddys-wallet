import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon } from '../core/Icon';

export interface AchievementBadgeProps extends HTMLAttributes<HTMLDivElement> {
  icon?: string;
  label: string;
  /** Date earned or unlock condition. */
  caption?: string;
  /** Locked badges show a dashed outline and a padlock. */
  earned?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: CSSProperties;
}

export function AchievementBadge({ icon = 'award', label, caption, earned = true, size = 'md', style, ...rest }: AchievementBadgeProps) {
  const d = size === 'sm' ? 56 : size === 'lg' ? 96 : 72;
  return (
    <div {...rest} style={{ textAlign: 'center', width: d + 24, ...style }}>
      <div
        style={{
          width: d,
          height: d,
          margin: '0 auto',
          borderRadius: 'var(--radius-circle)',
          background: earned ? 'linear-gradient(160deg,var(--gold-300),var(--gold-500))' : 'var(--ink-100)',
          color: earned ? '#fff' : 'var(--ink-300)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: earned ? 'var(--shadow-md)' : 'none',
          border: earned ? '3px solid var(--gold-200)' : '3px dashed var(--border-default)',
        }}
      >
        <Icon name={earned ? icon : 'lock'} size={d * 0.42} />
      </div>
      <div style={{ marginTop: 'var(--space-2)', font: 'var(--weight-bold) var(--text-xs)/1.25 var(--font-body)', color: earned ? 'var(--text-strong)' : 'var(--text-faint)' }}>{label}</div>
      {caption && <div style={{ font: 'var(--weight-medium) var(--text-2xs)/1.3 var(--font-body)', color: 'var(--text-faint)' }}>{caption}</div>}
    </div>
  );
}
