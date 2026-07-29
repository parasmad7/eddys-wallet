import type { CSSProperties, HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { IconButton } from '../core/IconButton';

export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  title?: string;
  children?: ReactNode;
  /** Action row, usually two Buttons. */
  footer?: ReactNode;
  onClose?: () => void;
  /** modal = centred card; sheet = bottom sheet with a grab handle (mobile flows). */
  variant?: 'modal' | 'sheet';
  style?: CSSProperties;
}

/** Centred modal on desktop, bottom sheet on narrow screens (variant="sheet"). */
export function Dialog({ open = true, title, children, footer, onClose, variant = 'modal', style, ...rest }: DialogProps) {
  if (!open) return null;
  const sheet = variant === 'sheet';
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex', alignItems: sheet ? 'flex-end' : 'center', justifyContent: 'center', background: 'rgba(30,26,46,.45)', backdropFilter: 'blur(3px)', padding: sheet ? 0 : 'var(--space-4)' }}
      onClick={onClose}
    >
      <div
        {...rest}
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: sheet ? 'var(--app-max)' : 420,
          background: 'var(--surface-card)',
          borderRadius: sheet ? 'var(--radius-sheet) var(--radius-sheet) 0 0' : 'var(--radius-xl)',
          padding: 'var(--space-5)',
          boxShadow: 'var(--shadow-xl)',
          animation: `eddy-pop var(--dur-normal) var(--ease-bounce)`,
          ...style,
        }}
      >
        {sheet && <div style={{ width: 44, height: 5, borderRadius: 99, background: 'var(--ink-200)', margin: '0 auto var(--space-4)' }} />}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <h3 style={{ flex: 1, font: 'var(--type-title)', color: 'var(--text-strong)' }}>{title}</h3>
          {onClose && <IconButton icon="x" label="Close" variant="ghost" size="sm" onClick={onClose} />}
        </div>
        <div style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>{children}</div>
        {footer && <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-5)' }}>{footer}</div>}
      </div>
    </div>
  );
}
