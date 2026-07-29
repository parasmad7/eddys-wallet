export { formatCents } from '../design-system/components/money/MoneyAmount';

/** Converts a whole-dollar string (e.g. from MoneyInput) to integer cents. */
export function dollarsToCents(dollars: string): number {
  const n = Number.parseFloat(dollars);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}
