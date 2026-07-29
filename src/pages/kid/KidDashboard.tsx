import { useState } from 'react';
import { AppHeader } from '../../design-system/components/navigation/AppHeader';
import { IconButton } from '../../design-system/components/core/IconButton';
import { BalanceCard } from '../../design-system/components/money/BalanceCard';
import { Button } from '../../design-system/components/core/Button';
import { EddyTip } from '../../design-system/components/feedback/EddyTip';
import { SectionHeader } from '../../design-system/components/core/SectionHeader';
import { Card } from '../../design-system/components/core/Card';
import { TransactionRow } from '../../design-system/components/money/TransactionRow';
import { Dialog } from '../../design-system/components/feedback/Dialog';
import { MoneyInput } from '../../design-system/components/forms/MoneyInput';
import { EmptyState } from '../../design-system/components/feedback/EmptyState';
import { Toast } from '../../design-system/components/feedback/Toast';
import { useAuth } from '../../lib/auth';
import { useAccounts, useAllowanceRules, useTransactions, useTransfer } from '../../lib/hooks';
import { dollarsToCents, formatCents, formatShortDate, formatTime } from '../../lib/format';

export function KidDashboard() {
  const { profile, family } = useAuth();
  const { data: accounts, isLoading: accountsLoading } = useAccounts(profile?.id);
  const spending = accounts?.find((a) => a.type === 'spending');
  const savings = accounts?.find((a) => a.type === 'savings');
  const { data: rules } = useAllowanceRules(family?.id);
  const { data: txns, isLoading: txnsLoading } = useTransactions(spending?.id, { limit: 5 });

  const activeRule = rules?.find((r) => r.account_id === spending?.id && r.is_active);

  const [showMove, setShowMove] = useState(false);
  const [amount, setAmount] = useState('5.00');
  const [toast, setToast] = useState('');
  const transfer = useTransfer();

  function handleMove() {
    if (!spending || !savings) return;
    const cents = dollarsToCents(amount);
    transfer.mutate(
      { fromAccountId: spending.id, toAccountId: savings.id, amountCents: cents, description: 'Moved to savings' },
      {
        onSuccess: () => {
          setShowMove(false);
          setToast(`Moved ${formatCents(cents)} to savings`);
          setTimeout(() => setToast(''), 2500);
        },
      },
    );
  }

  return (
    <div style={{ maxWidth: 'var(--app-max)', margin: '0 auto', minHeight: '100%' }}>
      <AppHeader
        mode="kid"
        subtitle={family?.name ?? ''}
        title={profile ? `Hi, ${profile.name}! 👋` : 'Hi! 👋'}
        actions={<IconButton icon="bell" label="Alerts" variant="onBrand" size="sm" />}
      >
        <BalanceCard
          kind="spending"
          cents={spending?.balance ?? 0}
          note={activeRule ? `+${formatCents(activeRule.amount)} next ${formatShortDate(activeRule.next_run_at)}` : undefined}
          noteIcon="calendar-check"
          style={{ background: 'rgba(255,255,255,.14)', boxShadow: 'none' }}
        />
      </AppHeader>

      <div style={{ padding: 'var(--space-5) var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <Button variant="accent" icon="arrow-left-right" fullWidth onClick={() => setShowMove(true)} disabled={!spending || !savings}>
            Move to savings
          </Button>
          <Button variant="secondary" icon="piggy-bank" fullWidth>
            Savings
          </Button>
        </div>

        <EddyTip title="What's interest?" mascotSrc="/assets/eddy-mascot.svg" style={{ marginBottom: 'var(--space-5)' }}>
          Your savings earn a little extra every month, just for staying put. Free money for waiting!
        </EddyTip>

        <SectionHeader title="Recent activity" action="See all" />
        {accountsLoading || txnsLoading ? (
          <Card pad="md" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</Card>
        ) : !txns || txns.length === 0 ? (
          <EmptyState icon="receipt" title="No activity yet">Your transactions will show up here.</EmptyState>
        ) : (
          <Card pad="sm">
            {txns.map((t, i) => (
              <TransactionRow
                key={t.id}
                type={t.type}
                description={t.description ?? undefined}
                date={`${formatShortDate(t.created_at)}, ${formatTime(t.created_at)}`}
                cents={t.amount}
                balanceAfter={t.balance_after}
                divider={i < txns.length - 1}
              />
            ))}
          </Card>
        )}
      </div>

      <Dialog
        open={showMove}
        variant="sheet"
        title="Move to savings"
        onClose={() => setShowMove(false)}
        footer={
          <>
            <Button variant="secondary" fullWidth onClick={() => setShowMove(false)}>
              Cancel
            </Button>
            <Button fullWidth onClick={handleMove} disabled={transfer.isPending}>
              {transfer.isPending ? 'Moving…' : 'Move it'}
            </Button>
          </>
        }
      >
        <MoneyInput value={amount} onChange={setAmount} presets={[1, 5, 10, 20]} hint="From spending → savings" />
        {transfer.isError && <div style={{ marginTop: 'var(--space-3)', color: 'var(--danger)', font: 'var(--type-caption)' }}>Something went wrong. Try again.</div>}
      </Dialog>

      {toast && (
        <div style={{ position: 'fixed', bottom: 'var(--space-6)', left: '50%', transform: 'translateX(-50%)', zIndex: 90 }}>
          <Toast tone="money">{toast}</Toast>
        </div>
      )}
    </div>
  );
}
