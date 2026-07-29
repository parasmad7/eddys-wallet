export { formatCents } from '../design-system/components/money/MoneyAmount';

/** Converts a whole-dollar string (e.g. from MoneyInput) to integer cents. */
export function dollarsToCents(dollars: string): number {
  const n = Number.parseFloat(dollars);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

/** e.g. "Fri, Jul 24" */
export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

/** e.g. "4:00 PM" */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
