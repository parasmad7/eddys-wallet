import { useMemo, useState } from 'react';
import { AppHeader } from '../../design-system/components/navigation/AppHeader';
import { SegmentedControl } from '../../design-system/components/forms/SegmentedControl';
import { Card } from '../../design-system/components/core/Card';
import { TransactionRow, type TransactionRowProps } from '../../design-system/components/money/TransactionRow';
import { EmptyState } from '../../design-system/components/feedback/EmptyState';

const TXNS: TransactionRowProps[] = [
  { type: 'allowance', description: 'Weekly allowance', date: 'Fri, Jul 24', cents: 500, balanceAfter: 1240 },
  { type: 'interest', description: 'Interest - Jun 2026', date: 'Jun 30', cents: 42, balanceAfter: 740 },
  { type: 'transfer', description: 'Moved to savings', date: 'Jun 24', cents: -1000, balanceAfter: 698 },
  { type: 'deposit', description: 'Birthday money from Grandma', date: 'Jun 12', cents: 2500, balanceAfter: 1698 },
  { type: 'withdrawal', description: 'Bought a book', date: 'Jun 3', cents: -450, balanceAfter: -802 },
  { type: 'allowance', description: 'Weekly allowance', date: 'Fri, May 29', cents: 500, balanceAfter: -352 },
  { type: 'loan_payment', description: 'Loan payment', date: 'May 20', cents: -300, balanceAfter: -852 },
];

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'in', label: 'In' },
  { value: 'out', label: 'Out' },
];

export function KidHistory() {
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'in') return TXNS.filter((t) => t.cents > 0);
    if (filter === 'out') return TXNS.filter((t) => t.cents < 0);
    return TXNS;
  }, [filter]);

  return (
    <div style={{ maxWidth: 'var(--app-max)', margin: '0 auto', minHeight: '100%' }}>
      <AppHeader mode="kid" subtitle="Spending account" title="History" />

      <div style={{ padding: 'var(--space-5) var(--space-4)' }}>
        <SegmentedControl options={FILTERS} value={filter} onChange={setFilter} style={{ marginBottom: 'var(--space-5)' }} />

        {filtered.length === 0 ? (
          <EmptyState icon="receipt" title="No transactions">
            Nothing to show for this filter yet.
          </EmptyState>
        ) : (
          <Card pad="sm">
            {filtered.map((t, i) => (
              <TransactionRow key={i} {...t} divider={i < filtered.length - 1} />
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
