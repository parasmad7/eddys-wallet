import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../core/Icon';

const T = {
  success: ['var(--mint-500)', 'check-circle'],
  info: ['var(--sky-500)', 'info'],
  warning: ['var(--gold-500)', 'triangle-alert'],
  error: ['var(--berry-500)', 'circle-alert'],
  money: ['var(--grape-500)', 'coins'],
} as const;

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  tone?: 'success' | 'info' | 'warning' | 'error' | 'money';
  children?: ReactNode;
  onDismiss?: () => void;
  style?: CSSProperties;
}

export function Toast({ tone = 'success', children, onDismiss, style, ...rest }: ToastProps) {
  const [bg, ic] = T[tone] || T.success;
  return (
    <div
      {...rest}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)', background: bg, color: '#fff', borderRadius: 'var(--radius-pill)', padding: '12px 18px', boxShadow: 'var(--shadow-lg)', font: 'var(--weight-bold) var(--text-md)/1.2 var(--font-body)', animation: 'eddy-pop var(--dur-normal) var(--ease-bounce)', ...style }}
    >
      <Icon name={ic} size={20} />
      <span>{children}</span>
      {onDismiss && <Icon name="x" size={16} style={{ opacity: 0.8, cursor: 'pointer' }} onClick={onDismiss} />}
    </div>
  );
}
