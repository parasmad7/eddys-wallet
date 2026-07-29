import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon } from '../core/Icon';

export interface TabBarProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  items?: Array<{ value: string; label: string; icon: string; badge?: boolean }>;
  value?: string;
  onChange?: (next: string) => void;
  style?: CSSProperties;
}

export function TabBar({ items = [], value, onChange, style, ...rest }: TabBarProps) {
  return (
    <nav {...rest} style={{ display: 'flex', height: 'var(--tabbar-height)', background: 'var(--surface-card)', borderTop: '1px solid var(--border-subtle)', boxShadow: '0 -4px 16px rgba(58,40,110,.06)', ...style }}>
      {items.map((it) => {
        const on = it.value === value;
        return (
          <button
            key={it.value}
            type="button"
            onClick={() => onChange && onChange(it.value)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, border: 'none', background: 'none', cursor: 'pointer', color: on ? 'var(--brand)' : 'var(--text-faint)', font: 'var(--weight-bold) var(--text-2xs)/1 var(--font-body)', transition: 'color var(--dur-fast) linear' }}
          >
            <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 30, borderRadius: 'var(--radius-pill)', background: on ? 'var(--brand-soft)' : 'transparent', transition: 'background var(--dur-fast) linear' }}>
              <Icon name={it.icon} size={22} />
              {it.badge && <span style={{ position: 'absolute', top: 0, right: 6, width: 9, height: 9, borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--surface-card)' }} />}
            </span>
            {it.label}
          </button>
        );
      })}
    </nav>
  );
}
