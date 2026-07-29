import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AppHeader } from '../../design-system/components/navigation/AppHeader';
import { Tabs } from '../../design-system/components/navigation/Tabs';
import { Card } from '../../design-system/components/core/Card';
import { Button } from '../../design-system/components/core/Button';
import { SectionHeader } from '../../design-system/components/core/SectionHeader';
import { Select } from '../../design-system/components/forms/Select';
import { Switch } from '../../design-system/components/forms/Switch';
import { MoneyInput } from '../../design-system/components/forms/MoneyInput';
import { Dialog } from '../../design-system/components/feedback/Dialog';
import { EmptyState } from '../../design-system/components/feedback/EmptyState';
import { BalanceCard } from '../../design-system/components/money/BalanceCard';
import { StatTile } from '../../design-system/components/money/StatTile';
import { TransactionRow } from '../../design-system/components/money/TransactionRow';
import { LoanCard } from '../../design-system/components/money/LoanCard';
import { MoneyAmount, formatCents } from '../../design-system/components/money/MoneyAmount';
import { dollarsToCents } from '../../lib/format';
import { getChild, getChildTransactions, type AllowanceRule, type Child, type TxnType } from './mockData';

const TABS = ['Accounts', 'Activity', 'Rules', 'Loans'];

export function ChildDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const child = getChild(id);
  const initialTab = searchParams.get('tab');
  const [tab, setTab] = useState(initialTab && TABS.includes(initialTab) ? initialTab : 'Accounts');

  if (!child) {
    return (
      <div>
        <AppHeader mode="parent" subtitle="Parent mode" title="Child not found" onBack={() => navigate('/parent')} />
        <div style={{ padding: 'var(--space-6)', maxWidth: 960, margin: '0 auto' }}>
          <EmptyState icon="user-x" title="Child not found">This child doesn't exist or was removed.</EmptyState>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AppHeader mode="parent" subtitle="Parent mode" title={child.name} onBack={() => navigate('/parent')} />
      <div style={{ padding: 'var(--space-6) var(--space-6) var(--space-9)', maxWidth: 960, margin: '0 auto' }}>
        <Tabs items={TABS} value={tab} onChange={setTab} style={{ marginBottom: 'var(--space-6)' }} />
        {tab === 'Accounts' && <AccountsTab child={child} onDeposit={() => navigate('/parent/deposit')} />}
        {tab === 'Activity' && <ActivityTab childId={child.id} />}
        {tab === 'Rules' && <RulesTab child={child} />}
        {tab === 'Loans' && <LoansTab child={child} />}
      </div>
    </div>
  );
}

function AccountsTab({ child, onDeposit }: { child: Child; onDeposit: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 'var(--space-4)' }}>
        <BalanceCard
          kind="spending"
          cents={child.spendingCents}
          note={`+${formatCents(child.allowance.amountCents)} next ${child.allowance.day}`}
          noteIcon="calendar-check"
        />
        <BalanceCard
          kind="savings"
          cents={child.savingsCents}
          note={`${child.interestRatePct.toFixed(1)}% annual, compounds monthly`}
          noteIcon="sparkles"
        />
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <Button icon="plus" onClick={onDeposit}>Deposit</Button>
        <Button variant="secondary" icon="minus">Withdraw</Button>
        <Button variant="ghost" icon="download">Export CSV</Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 'var(--space-4)' }}>
        <StatTile label="Interest rate" text={`${child.interestRatePct.toFixed(1)}%`} icon="percent" tone="mint" delta="Compounds monthly" />
        <StatTile label="Earned this month" cents={child.interestEarnedThisMonthCents} icon="sparkles" tone="gold" />
      </div>
    </div>
  );
}

function ActivityTab({ childId }: { childId: string }) {
  const [filter, setFilter] = useState<'all' | TxnType>('all');
  const filterOptions = [
    { value: 'all', label: 'All types' },
    { value: 'deposit', label: 'Deposits' },
    { value: 'withdrawal', label: 'Withdrawals' },
    { value: 'allowance', label: 'Allowance' },
    { value: 'interest', label: 'Interest' },
    { value: 'loan_payment', label: 'Loan payments' },
  ];

  const txns = getChildTransactions(childId).filter((t) => filter === 'all' || t.type === filter);
  const groups: { label: string; items: typeof txns }[] = [];
  for (const t of txns) {
    const last = groups[groups.length - 1];
    if (last && last.label === t.dateGroup) last.items.push(t);
    else groups.push({ label: t.dateGroup, items: [t] });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <Select
        label="Filter by type"
        value={filter}
        options={filterOptions}
        onChange={(e) => setFilter(e.target.value as 'all' | TxnType)}
        style={{ maxWidth: 240 }}
      />
      {groups.length === 0 ? (
        <EmptyState icon="receipt" title="No activity yet">Transactions will show up here once they happen.</EmptyState>
      ) : (
        groups.map((group) => (
          <div key={group.label}>
            <div
              style={{
                font: 'var(--type-label)',
                color: 'var(--text-muted)',
                letterSpacing: 'var(--tracking-caps)',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-2)',
              }}
            >
              {group.label}
            </div>
            <Card pad="sm">
              {group.items.map((t, i) => (
                <TransactionRow
                  key={t.id}
                  type={t.type}
                  description={t.description}
                  date={t.time}
                  cents={t.cents}
                  balanceAfter={t.balanceAfter}
                  divider={i < group.items.length - 1}
                />
              ))}
            </Card>
          </div>
        ))
      )}
    </div>
  );
}

function RulesTab({ child }: { child: Child }) {
  const [allowance, setAllowance] = useState<AllowanceRule>(child.allowance);
  const [interestRate, setInterestRate] = useState(child.interestRatePct);
  const [loansEnabled, setLoansEnabled] = useState(child.loansEnabled);
  const [creditEnabled, setCreditEnabled] = useState(child.creditEnabled);

  const [showAllowanceDialog, setShowAllowanceDialog] = useState(false);
  const [draftAmount, setDraftAmount] = useState((allowance.amountCents / 100).toFixed(2));
  const [draftFrequency, setDraftFrequency] = useState<AllowanceRule['frequency']>(allowance.frequency);
  const [draftDay, setDraftDay] = useState(allowance.day);

  const [showInterestDialog, setShowInterestDialog] = useState(false);
  const [draftRate, setDraftRate] = useState(String(interestRate));

  const openAllowanceDialog = () => {
    setDraftAmount((allowance.amountCents / 100).toFixed(2));
    setDraftFrequency(allowance.frequency);
    setDraftDay(allowance.day);
    setShowAllowanceDialog(true);
  };

  const saveAllowance = () => {
    setAllowance({ amountCents: dollarsToCents(draftAmount), frequency: draftFrequency, day: draftDay, nextRun: allowance.nextRun });
    setShowAllowanceDialog(false);
  };

  const openInterestDialog = () => {
    setDraftRate(String(interestRate));
    setShowInterestDialog(true);
  };

  const saveInterest = () => {
    const n = Number.parseFloat(draftRate);
    setInterestRate(Number.isFinite(n) ? n : interestRate);
    setShowInterestDialog(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 520 }}>
      <div>
        <SectionHeader title="Recurring allowance" />
        <Card pad="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <MoneyAmount cents={allowance.amountCents} size="lg" tone="plain" />
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
              every {allowance.frequency.toLowerCase()} on {allowance.day}
            </span>
          </div>
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Next payment {allowance.nextRun}</div>
          <div>
            <Button size="sm" variant="secondary" icon="pencil" onClick={openAllowanceDialog}>Edit rule</Button>
          </div>
        </Card>
      </div>

      <div>
        <SectionHeader title="Savings interest" subtitle={`Configure how ${child.name}'s savings grow`} />
        <Card pad="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <StatTile label="Annual rate" text={`${interestRate.toFixed(1)}%`} icon="percent" tone="mint" delta="Compounds monthly" />
          <div>
            <Button size="sm" variant="secondary" icon="pencil" onClick={openInterestDialog}>Edit rate</Button>
          </div>
        </Card>
      </div>

      <div>
        <SectionHeader title="Feature unlocks" subtitle="Turn on concepts as your child is ready" />
        <Card pad="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Switch checked={loansEnabled} onChange={setLoansEnabled} label="Loans" description={`You can lend ${child.name} money with a payment plan.`} />
          <Switch
            checked={creditEnabled}
            onChange={setCreditEnabled}
            label="Credit card simulation"
            description={`${child.name} can charge purchases and pay interest on any balance carried.`}
          />
        </Card>
      </div>

      <Dialog
        open={showAllowanceDialog}
        title="Edit allowance rule"
        onClose={() => setShowAllowanceDialog(false)}
        footer={
          <>
            <Button variant="secondary" fullWidth onClick={() => setShowAllowanceDialog(false)}>Cancel</Button>
            <Button fullWidth onClick={saveAllowance}>Save rule</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <MoneyInput label="Amount" value={draftAmount} onChange={setDraftAmount} presets={[2, 5, 10, 20]} />
          <Select
            label="Frequency"
            value={draftFrequency}
            options={['Weekly', 'Biweekly', 'Monthly']}
            onChange={(e) => setDraftFrequency(e.target.value as AllowanceRule['frequency'])}
          />
          <Select label="Day" value={draftDay} options={['Monday', 'Friday', 'Sunday']} onChange={(e) => setDraftDay(e.target.value)} />
        </div>
      </Dialog>

      <Dialog
        open={showInterestDialog}
        title="Edit interest rate"
        onClose={() => setShowInterestDialog(false)}
        footer={
          <>
            <Button variant="secondary" fullWidth onClick={() => setShowInterestDialog(false)}>Cancel</Button>
            <Button fullWidth onClick={saveInterest}>Save rate</Button>
          </>
        }
      >
        <Select
          label="Annual rate"
          value={draftRate}
          options={['1', '2', '3', '4', '5', '6']}
          onChange={(e) => setDraftRate(e.target.value)}
          hint="Compounds monthly"
        />
      </Dialog>
    </div>
  );
}

function LoansTab({ child }: { child: Child }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 640 }}>
      {child.loans.length > 0 ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="sm" icon="plus">New loan</Button>
          </div>
          {child.loans.map((loan) => (
            <LoanCard
              key={loan.id}
              title={loan.title}
              principalCents={loan.principalCents}
              remainingCents={loan.remainingCents}
              ratePct={loan.ratePct}
              nextPayment={loan.nextPaymentCents}
              nextDue={loan.nextDue}
              status={loan.status}
            />
          ))}
        </>
      ) : (
        <EmptyState icon="hand-coins" title="No loans yet" action={<Button size="sm" icon="plus">New loan</Button>}>
          Turn on loans in Rules to lend {child.name} money with a payment plan.
        </EmptyState>
      )}
    </div>
  );
}
