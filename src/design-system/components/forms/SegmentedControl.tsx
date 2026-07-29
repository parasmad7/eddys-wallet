import type { CSSProperties, HTMLAttributes } from 'react';
import { Icon } from '../core/Icon';

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Strings or {value,label,icon}. */
  options?: Array<string | { value: string; label: string; icon?: string }>;
  value?: string;
  onChange?: (next: string) => void;
  size?: 'sm' | 'md';
  style?: CSSProperties;
}

export function SegmentedControl({ options = [], value, onChange, size = 'md', style, ...rest }: SegmentedControlProps) {
  const h = size === 'sm' ? 36 : 44;
  return (
    <div
      {...rest}
      style={{ display: 'inline-flex', padding: 4, gap: 2, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-subtle)', ...style }}
    >
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.value;
        const l = typeof o === 'string' ? o : o.label;
        const ic = typeof o === 'object' ? o.icon : undefined;
        const on = v === value;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange && onChange(v)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              height: h,
              padding: '0 16px',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 'var(--radius-pill)',
              background: on ? 'var(--surface-card)' : 'transparent',
              color: on ? 'var(--brand-strong)' : 'var(--text-muted)',
              boxShadow: on ? 'var(--shadow-sm)' : 'none',
              font: 'var(--weight-bold) var(--text-sm)/1 var(--font-body)',
              transition: 'background var(--dur-fast) linear,color var(--dur-fast) linear',
            }}
          >
            {ic && <Icon name={ic} size={15} />}
            {l}
          </button>
        );
      })}
    </div>
  );
}
