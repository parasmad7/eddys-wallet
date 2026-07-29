import type { CSSProperties, HTMLAttributes } from 'react';

/** Formats integer cents as currency. Never accepts floats. */
export function formatCents(cents = 0, { currency = 'USD', signed = false }: { currency?: string; signed?: boolean } = {}) {
  const v = Math.abs(cents) / 100;
  const s = v.toLocaleString(undefined, { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (!signed) return (cents < 0 ? '-' : '') + s;
  return (cents < 0 ? '−' : '+') + s;
}

const SIZES = {
  sm: 'var(--weight-bold) var(--text-md)/1.1 var(--font-money)',
  md: 'var(--weight-bold) var(--text-xl)/1.1 var(--font-money)',
  lg: 'var(--type-money)',
  xl: 'var(--weight-heavy) var(--text-4xl)/1 var(--font-money)',
  hero: 'var(--type-money-hero)',
} as const;

const TONE_COLORS = {
  plain: 'var(--text-strong)',
  inherit: 'inherit',
  in: 'var(--money-in)',
  out: 'var(--money-out)',
  interest: 'var(--money-interest)',
  debt: 'var(--money-debt)',
} as const;

export interface MoneyAmountProps extends HTMLAttributes<HTMLSpanElement> {
  /** Integer cents - 1050 renders "$10.50". Never pass floats. */
  cents: number;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  /** auto colours by sign; plain/inherit stay neutral; in/out/interest/debt force meaning. */
  tone?: 'auto' | 'plain' | 'inherit' | 'in' | 'out' | 'interest' | 'debt';
  /** Prefixes + / - for ledger rows. */
  signed?: boolean;
  currency?: string;
  style?: CSSProperties;
}

export function MoneyAmount({ cents = 0, size = 'md', tone = 'auto', signed = false, currency = 'USD', style, ...rest }: MoneyAmountProps) {
  const color = tone === 'auto' ? (cents > 0 ? 'var(--money-in)' : cents < 0 ? 'var(--money-out)' : 'var(--money-neutral)') : TONE_COLORS[tone];
  return (
    <span {...rest} style={{ font: SIZES[size] || SIZES.md, color, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', ...style }}>
      {formatCents(cents, { currency, signed })}
    </span>
  );
}
