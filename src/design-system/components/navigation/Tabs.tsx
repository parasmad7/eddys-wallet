import type { CSSProperties, HTMLAttributes } from 'react';

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items?: Array<string | { value: string; label: string }>;
  value?: string;
  onChange?: (next: string) => void;
  style?: CSSProperties;
}

export function Tabs({ items = [], value, onChange, style, ...rest }: TabsProps) {
  return (
    <div {...rest} style={{ display: 'flex', gap: 'var(--space-5)', borderBottom: '1px solid var(--border-default)', ...style }}>
      {items.map((it) => {
        const v = typeof it === 'string' ? it : it.value;
        const l = typeof it === 'string' ? it : it.label;
        const on = v === value;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange && onChange(v)}
            style={{ position: 'relative', padding: '0 0 10px', border: 'none', background: 'none', cursor: 'pointer', color: on ? 'var(--brand-strong)' : 'var(--text-muted)', font: 'var(--weight-bold) var(--text-md)/1 var(--font-body)' }}
          >
            {l}
            <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 3, borderRadius: 3, background: on ? 'var(--brand)' : 'transparent' }} />
          </button>
        );
      })}
    </div>
  );
}
