import { useState } from 'react';
import { AppHeader } from '../../design-system/components/navigation/AppHeader';
import { IconButton } from '../../design-system/components/core/IconButton';
import { BalanceCard } from '../../design-system/components/money/BalanceCard';
import { Button } from '../../design-system/components/core/Button';
import { EddyTip } from '../../design-system/components/feedback/EddyTip';
import { SectionHeader } from '../../design-system/components/core/SectionHeader';
import { Card } from '../../design-system/components/core/Card';
import { TransactionRow, type TransactionRowProps } from '../../design-system/components/money/TransactionRow';
import { Dialog } from '../../design-system/components/feedback/Dialog';
import { MoneyInput } from '../../design-system/components/forms/MoneyInput';

const TXNS: TransactionRowProps[] = [
  { type: 'allowance', description: 'Weekly allowance', date: 'Fri, Jul 24', cents: 500, balanceAfter: 1240 },
  { type: 'interest', description: 'Interest - Jun 2026', date: 'Jun 30', cents: 42, balanceAfter: 740 },
  { type: 'transfer', description: 'Moved to savings', date: 'Jun 24', cents: -1000, balanceAfter: 698 },
  { type: 'deposit', description: 'Birthday money from Grandma', date: 'Jun 12', cents: 2500, balanceAfter: 1698 },
];

export function KidDashboard() {
  const [showMove, setShowMove] = useState(false);
  const [amount, setAmount] = useState('5.00');

  return (
    <div style={{ maxWidth: 'var(--app-max)', margin: '0 auto', minHeight: '100%' }}>
      <AppHeader
        mode="kid"
        subtitle="The Smith Family"
        title="Hi, Maya! 👋"
        actions={<IconButton icon="bell" label="Alerts" variant="onBrand" size="sm" />}
      >
        <BalanceCard kind="spending" cents={1240} note="+$5.00 next Friday" noteIcon="calendar-check" style={{ background: 'rgba(255,255,255,.14)', boxShadow: 'none' }} />
      </AppHeader>

      <div style={{ padding: 'var(--space-5) var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <Button variant="accent" icon="arrow-left-right" fullWidth onClick={() => setShowMove(true)}>
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
        <Card pad="sm">
          {TXNS.map((t, i) => (
            <TransactionRow key={i} {...t} divider={i < TXNS.length - 1} />
          ))}
        </Card>
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
            <Button fullWidth onClick={() => setShowMove(false)}>
              Move it
            </Button>
          </>
        }
      >
        <MoneyInput value={amount} onChange={setAmount} presets={[1, 5, 10, 20]} hint="From spending → savings" />
      </Dialog>
    </div>
  );
}
