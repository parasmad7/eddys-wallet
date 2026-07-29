import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
import { dollarsToCents, formatShortDate, formatTime } from '../../lib/format';
import { supabase } from '../../lib/supabase';
import {
  useAccounts,
  useAllowanceRules,
  useCreateAllowanceRule,
  useInterestConfigs,
  useProfiles,
  useUpdateAllowanceRule,
  useUpdateInterestConfig,
  useWithdraw,
} from '../../lib/hooks';
import { useAuth } from '../../lib/auth';
import type { Account, AllowanceFrequency, Profile, Transaction, TransactionType } from '../../lib/types';

const TABS = ['Accounts', 'Activity', 'Rules', 'Loans'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function computeNextRunAt(frequency: AllowanceFrequency, dayName: string): string {
  const now = new Date();
  if (frequency === 'monthly') {
    return new Date(now.getFullYear(), now.getMonth() + 1, 1, 12, 0, 0).toISOString();
  }
  const targetDay = DAY_NAMES.indexOf(dayName);
  const next = new Date(now);
  next.setHours(12, 0, 0, 0);
  let diff = (targetDay - now.getDay() + 7) % 7;
  if (diff === 0) diff = 7;
  next.setDate(now.getDate() + diff);
  return next.toISOString();
}

export function ChildDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { family } = useAuth();
  const { data: profiles } = useProfiles(family?.id);
  const child = profiles?.find((p) => p.id === id);
  const { data: accounts, isLoading: accountsLoading } = useAccounts(id);
  const spending = accounts?.find((a) => a.type === 'spending');
  const savings = accounts?.find((a) => a.type === 'savings');

  const initialTab = searchParams.get('tab');
  const [tab, setTab] = useState(initialTab && TABS.includes(initialTab) ? initialTab : 'Accounts');

  if (!profiles || accountsLoading) {
    return (
      <div>
        <AppHeader mode="parent" subtitle="Parent mode" title="Loading…" onBack={() => navigate('/parent')} />
      </div>
    );
  }

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
        {tab === 'Accounts' && <AccountsTab child={child} spending={spending} savings={savings} onDeposit={() => navigate('/parent/deposit')} />}
        {tab === 'Activity' && <ActivityTab spending={spending} savings={savings} />}
        {tab === 'Rules' && <RulesTab child={child} spending={spending} savings={savings} />}
        {tab === 'Loans' && <LoansTab child={child} />}
      </div>
    </div>
  );
}

function AccountsTab({ child, spending, savings, onDeposit }: { child: Profile; spending?: Account; savings?: Account; onDeposit: () => void }) {
  const { data: rules } = useAllowanceRules(child.family_id);
  const { data: interestConfigs } = useInterestConfigs(savings?.id);
  const rule = rules?.find((r) => r.account_id === spending?.id && r.is_active);
  const interestConfig = interestConfigs?.[0];
  const withdraw = useWithdraw();

  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState('1.00');

  function handleWithdraw() {
    if (!spending) return;
    withdraw.mutate(
      { accountId: spending.id, amountCents: dollarsToCents(amount), description: 'Parent withdrawal' },
      { onSuccess: () => setShowWithdraw(false) },
    );
  }

  const ratePct = interestConfig ? interestConfig.annual_rate_bps / 100 : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 'var(--space-4)' }}>
        <BalanceCard
          kind="spending"
          cents={spending?.balance ?? 0}
          note={rule ? `+${formatCents(rule.amount)} next ${formatShortDate(rule.next_run_at)}` : undefined}
          noteIcon="calendar-check"
        />
        <BalanceCard
          kind="savings"
          cents={savings?.balance ?? 0}
          note={interestConfig ? `${ratePct.toFixed(1)}% annual, compounds ${interestConfig.compound_frequency}` : undefined}
          noteIcon="sparkles"
        />
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <Button icon="plus" onClick={onDeposit}>Deposit</Button>
        <Button variant="secondary" icon="minus" onClick={() => setShowWithdraw(true)} disabled={!spending}>Withdraw</Button>
        <Button variant="ghost" icon="download">Export CSV</Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 'var(--space-4)' }}>
        <StatTile label="Interest rate" text={`${ratePct.toFixed(1)}%`} icon="percent" tone="mint" delta={interestConfig ? `Compounds ${interestConfig.compound_frequency}` : 'Not configured'} />
        <StatTile label="Spending balance" cents={spending?.balance ?? 0} icon="wallet" tone="gold" />
      </div>

      <Dialog
        open={showWithdraw}
        title={`Withdraw from ${child.name}'s spending`}
        onClose={() => setShowWithdraw(false)}
        footer={
          <>
            <Button variant="secondary" fullWidth onClick={() => setShowWithdraw(false)}>Cancel</Button>
            <Button fullWidth onClick={handleWithdraw} disabled={withdraw.isPending}>{withdraw.isPending ? 'Withdrawing…' : 'Withdraw'}</Button>
          </>
        }
      >
        <MoneyInput value={amount} onChange={setAmount} presets={[1, 5, 10, 20]} />
        {withdraw.isError && <div style={{ marginTop: 'var(--space-3)', color: 'var(--danger)', font: 'var(--type-caption)' }}>Something went wrong. Try again.</div>}
      </Dialog>
    </div>
  );
}

function ActivityTab({ spending, savings }: { spending?: Account; savings?: Account }) {
  const [filter, setFilter] = useState<'all' | TransactionType>('all');
  const accountIds = [spending?.id, savings?.id].filter((v): v is string => Boolean(v));

  const { data: txns, isLoading } = useQuery({
    queryKey: ['transactions', 'child', accountIds, filter],
    queryFn: async () => {
      let query = supabase.from('transactions').select('*').in('account_id', accountIds).order('created_at', { ascending: false });
      if (filter !== 'all') query = query.eq('type', filter);
      const { data, error } = await query;
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: accountIds.length > 0,
  });

  const filterOptions = [
    { value: 'all', label: 'All types' },
    { value: 'deposit', label: 'Deposits' },
    { value: 'withdrawal', label: 'Withdrawals' },
    { value: 'allowance', label: 'Allowance' },
    { value: 'interest', label: 'Interest' },
    { value: 'loan_payment', label: 'Loan payments' },
  ];

  const groups = useMemo(() => {
    const list: { label: string; items: Transaction[] }[] = [];
    for (const t of txns ?? []) {
      const label = formatShortDate(t.created_at);
      const last = list[list.length - 1];
      if (last && last.label === label) last.items.push(t);
      else list.push({ label, items: [t] });
    }
    return list;
  }, [txns]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <Select
        label="Filter by type"
        value={filter}
        options={filterOptions}
        onChange={(e) => setFilter(e.target.value as 'all' | TransactionType)}
        style={{ maxWidth: 240 }}
      />
      {isLoading ? (
        <Card pad="md" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</Card>
      ) : groups.length === 0 ? (
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
                  description={t.description ?? undefined}
                  date={formatTime(t.created_at)}
                  cents={t.amount}
                  balanceAfter={t.balance_after}
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

function RulesTab({ child, spending, savings }: { child: Profile; spending?: Account; savings?: Account }) {
  const { data: rules } = useAllowanceRules(child.family_id);
  const rule = rules?.find((r) => r.account_id === spending?.id);
  const { data: interestConfigs } = useInterestConfigs(savings?.id);
  const interestConfig = interestConfigs?.[0];

  const createAllowance = useCreateAllowanceRule();
  const updateAllowance = useUpdateAllowanceRule();
  const updateInterest = useUpdateInterestConfig();

  const [loansEnabled, setLoansEnabled] = useState(false);
  const [creditEnabled, setCreditEnabled] = useState(false);

  const [showAllowanceDialog, setShowAllowanceDialog] = useState(false);
  const [draftAmount, setDraftAmount] = useState('5.00');
  const [draftFrequency, setDraftFrequency] = useState<AllowanceFrequency>('weekly');
  const [draftDay, setDraftDay] = useState('Friday');

  const [showInterestDialog, setShowInterestDialog] = useState(false);
  const [draftRate, setDraftRate] = useState('5');

  const openAllowanceDialog = () => {
    if (rule) {
      setDraftAmount((rule.amount / 100).toFixed(2));
      setDraftFrequency(rule.frequency);
      setDraftDay(rule.day_of_week != null ? DAY_NAMES[rule.day_of_week] : 'Friday');
    }
    setShowAllowanceDialog(true);
  };

  const saveAllowance = () => {
    if (!spending) return;
    const amountCents = dollarsToCents(draftAmount);
    const dayOfWeek = draftFrequency !== 'monthly' ? DAY_NAMES.indexOf(draftDay) : undefined;
    const nextRunAt = computeNextRunAt(draftFrequency, draftDay);
    if (rule) {
      updateAllowance.mutate(
        { id: rule.id, familyId: child.family_id, amountCents, frequency: draftFrequency, dayOfWeek, isActive: true },
        { onSuccess: () => setShowAllowanceDialog(false) },
      );
    } else {
      createAllowance.mutate(
        { familyId: child.family_id, accountId: spending.id, amountCents, frequency: draftFrequency, dayOfWeek, nextRunAt },
        { onSuccess: () => setShowAllowanceDialog(false) },
      );
    }
  };

  const openInterestDialog = () => {
    setDraftRate(interestConfig ? String(interestConfig.annual_rate_bps / 100) : '5');
    setShowInterestDialog(true);
  };

  const saveInterest = () => {
    if (!savings) return;
    const n = Number.parseFloat(draftRate);
    updateInterest.mutate(
      { accountId: savings.id, annualRateBps: Math.round((Number.isFinite(n) ? n : 5) * 100) },
      { onSuccess: () => setShowInterestDialog(false) },
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 520 }}>
      <div>
        <SectionHeader title="Recurring allowance" />
        <Card pad="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {rule ? (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <MoneyAmount cents={rule.amount} size="lg" tone="plain" />
                <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
                  every {rule.frequency} {rule.day_of_week != null ? `on ${DAY_NAMES[rule.day_of_week]}` : ''}
                </span>
              </div>
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Next payment {formatShortDate(rule.next_run_at)}</div>
            </>
          ) : (
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>No allowance rule set yet.</div>
          )}
          <div>
            <Button size="sm" variant="secondary" icon="pencil" onClick={openAllowanceDialog} disabled={!spending}>
              {rule ? 'Edit rule' : 'Set up rule'}
            </Button>
          </div>
        </Card>
      </div>

      <div>
        <SectionHeader title="Savings interest" subtitle={`Configure how ${child.name}'s savings grow`} />
        <Card pad="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <StatTile
            label="Annual rate"
            text={interestConfig ? `${(interestConfig.annual_rate_bps / 100).toFixed(1)}%` : 'Not set'}
            icon="percent"
            tone="mint"
            delta={interestConfig ? `Compounds ${interestConfig.compound_frequency}` : undefined}
          />
          <div>
            <Button size="sm" variant="secondary" icon="pencil" onClick={openInterestDialog} disabled={!savings}>Edit rate</Button>
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
        title={rule ? 'Edit allowance rule' : 'Set up allowance rule'}
        onClose={() => setShowAllowanceDialog(false)}
        footer={
          <>
            <Button variant="secondary" fullWidth onClick={() => setShowAllowanceDialog(false)}>Cancel</Button>
            <Button fullWidth onClick={saveAllowance} disabled={createAllowance.isPending || updateAllowance.isPending}>
              {createAllowance.isPending || updateAllowance.isPending ? 'Saving…' : 'Save rule'}
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <MoneyInput label="Amount" value={draftAmount} onChange={setDraftAmount} presets={[2, 5, 10, 20]} />
          <Select
            label="Frequency"
            value={draftFrequency}
            options={['daily', 'weekly', 'biweekly', 'monthly']}
            onChange={(e) => setDraftFrequency(e.target.value as AllowanceFrequency)}
          />
          {draftFrequency !== 'monthly' && (
            <Select label="Day" value={draftDay} options={['Monday', 'Friday', 'Sunday']} onChange={(e) => setDraftDay(e.target.value)} />
          )}
        </div>
      </Dialog>

      <Dialog
        open={showInterestDialog}
        title="Edit interest rate"
        onClose={() => setShowInterestDialog(false)}
        footer={
          <>
            <Button variant="secondary" fullWidth onClick={() => setShowInterestDialog(false)}>Cancel</Button>
            <Button fullWidth onClick={saveInterest} disabled={updateInterest.isPending}>{updateInterest.isPending ? 'Saving…' : 'Save rate'}</Button>
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

interface Loan {
  id: string;
  borrower_profile_id: string;
  principal: number;
  balance_remaining: number;
  annual_rate_bps: number;
  min_payment: number | null;
  status: 'active' | 'paid_off' | 'forgiven';
}

function LoansTab({ child }: { child: Profile }) {
  const { data: loans, isLoading } = useQuery({
    queryKey: ['loans', child.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('loans').select('*').eq('borrower_profile_id', child.id);
      if (error) throw error;
      return data as Loan[];
    },
  });

  if (isLoading) {
    return <Card pad="md" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</Card>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 640 }}>
      {loans && loans.length > 0 ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="sm" icon="plus" disabled>New loan</Button>
          </div>
          {loans.map((loan) => (
            <LoanCard
              key={loan.id}
              title="Loan"
              principalCents={loan.principal}
              remainingCents={loan.balance_remaining}
              ratePct={loan.annual_rate_bps / 100}
              nextPayment={loan.min_payment ?? 0}
              nextDue=""
              status={loan.status}
            />
          ))}
        </>
      ) : (
        <EmptyState icon="hand-coins" title="No loans yet" action={<Button size="sm" icon="plus" disabled>New loan</Button>}>
          Turn on loans in Rules to lend {child.name} money with a payment plan.
        </EmptyState>
      )}
    </div>
  );
}
