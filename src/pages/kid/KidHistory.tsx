import { useMemo, useState } from 'react';
import { AppHeader } from '../../design-system/components/navigation/AppHeader';
import { SegmentedControl } from '../../design-system/components/forms/SegmentedControl';
import { Card } from '../../design-system/components/core/Card';
import { Button } from '../../design-system/components/core/Button';
import { TransactionRow } from '../../design-system/components/money/TransactionRow';
import { EmptyState } from '../../design-system/components/feedback/EmptyState';
import { useAuth } from '../../lib/auth';
import { useAccounts, useInfiniteTransactions } from '../../lib/hooks';
import { formatShortDate, formatTime } from '../../lib/format';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'in', label: 'In' },
  { value: 'out', label: 'Out' },
];

export function KidHistory() {
  const [filter, setFilter] = useState('all');
  const { profile } = useAuth();
  const { data: accounts } = useAccounts(profile?.id);
  const spending = accounts?.find((a) => a.type === 'spending');

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteTransactions(spending?.id);

  const txns = useMemo(() => (data?.pages ?? []).flat(), [data]);
  const filtered = useMemo(() => {
    if (filter === 'in') return txns.filter((t) => t.amount > 0);
    if (filter === 'out') return txns.filter((t) => t.amount < 0);
    return txns;
  }, [filter, txns]);

  return (
    <div style={{ maxWidth: 'var(--app-max)', margin: '0 auto', minHeight: '100%' }}>
      <AppHeader mode="kid" subtitle="Spending account" title="History" />

      <div style={{ padding: 'var(--space-5) var(--space-4)' }}>
        <SegmentedControl options={FILTERS} value={filter} onChange={setFilter} style={{ marginBottom: 'var(--space-5)' }} />

        {isLoading ? (
          <Card pad="md" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</Card>
        ) : filtered.length === 0 ? (
          <EmptyState icon="receipt" title="No transactions">
            Nothing to show for this filter yet.
          </EmptyState>
        ) : (
          <>
            <Card pad="sm">
              {filtered.map((t, i) => (
                <TransactionRow
                  key={t.id}
                  type={t.type}
                  description={t.description ?? undefined}
                  date={`${formatShortDate(t.created_at)}, ${formatTime(t.created_at)}`}
                  cents={t.amount}
                  balanceAfter={t.balance_after}
                  divider={i < filtered.length - 1}
                />
              ))}
            </Card>
            {hasNextPage && (
              <Button variant="secondary" fullWidth style={{ marginTop: 'var(--space-4)' }} onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                {isFetchingNextPage ? 'Loading…' : 'Load more'}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
