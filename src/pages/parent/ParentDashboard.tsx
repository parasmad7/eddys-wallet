import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AppHeader } from '../../design-system/components/navigation/AppHeader';
import { Avatar } from '../../design-system/components/navigation/AvatarChip';
import { IconButton } from '../../design-system/components/core/IconButton';
import { Icon } from '../../design-system/components/core/Icon';
import { Card } from '../../design-system/components/core/Card';
import { Button } from '../../design-system/components/core/Button';
import { SectionHeader } from '../../design-system/components/core/SectionHeader';
import { StatTile } from '../../design-system/components/money/StatTile';
import { MoneyAmount } from '../../design-system/components/money/MoneyAmount';
import { TransactionRow } from '../../design-system/components/money/TransactionRow';
import { Toast } from '../../design-system/components/feedback/Toast';
import { EmptyState } from '../../design-system/components/feedback/EmptyState';
import { supabase } from '../../lib/supabase';
import { useAccounts, useAllowanceRules, useFamily, useFamilyAccounts, useProfiles, useSavingsGoals } from '../../lib/hooks';
import { formatShortDate, formatTime } from '../../lib/format';
import type { Account, Profile, Transaction } from '../../lib/types';

const MONTHLY_MULTIPLIER = { daily: 30, weekly: 4, biweekly: 2, monthly: 1 } as const;

export function ParentDashboard() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const { data: family } = useFamily();
  const { data: profiles, isLoading: profilesLoading } = useProfiles(family?.id);
  const children = useMemo(() => (profiles ?? []).filter((p) => p.role === 'child'), [profiles]);
  const { data: familyAccounts } = useFamilyAccounts(family?.id);
  const { data: allowanceRules } = useAllowanceRules(family?.id);

  const accountIds = useMemo(() => (familyAccounts ?? []).map((a) => a.id), [familyAccounts]);
  const { data: recentTxns } = useQuery({
    queryKey: ['transactions', 'family', family?.id, accountIds],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .in('account_id', accountIds)
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: accountIds.length > 0,
  });

  const { data: interestTxns } = useQuery({
    queryKey: ['transactions', 'family-interest', family?.id, accountIds],
    queryFn: async () => {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .in('account_id', accountIds)
        .eq('type', 'interest')
        .gte('created_at', startOfMonth);
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: accountIds.length > 0,
  });

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopyCode = () => {
    if (!family) return;
    navigator.clipboard?.writeText(family.family_code).catch(() => {});
    setCopied(true);
  };

  const totalBalanceCents = (familyAccounts ?? []).reduce((sum, a) => sum + a.balance, 0);
  const allowanceThisMonthCents = (allowanceRules ?? [])
    .filter((r) => r.is_active)
    .reduce((sum, r) => sum + r.amount * (MONTHLY_MULTIPLIER[r.frequency] ?? 1), 0);
  const interestEarnedCents = (interestTxns ?? []).reduce((sum, t) => sum + t.amount, 0);

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  return (
    <div>
      <AppHeader
        mode="parent"
        subtitle="Parent mode"
        title="Family"
        actions={<IconButton icon="settings" label="Settings" variant="onBrand" size="sm" onClick={() => navigate('/parent/settings')} />}
      />
      <div style={{ padding: 'var(--space-6) var(--space-6) var(--space-9)', maxWidth: 960, margin: '0 auto' }}>
        <Card tone="tint" pad="md" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <Icon name="key-round" size={18} style={{ color: 'var(--brand-strong)' }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Family code - share this with your kids</div>
              <div style={{ font: 'var(--weight-bold) 20px/1 var(--font-mono)', color: 'var(--text-strong)', letterSpacing: '.04em' }}>{family?.family_code ?? '···'}</div>
            </div>
          </div>
          <Button variant="secondary" size="sm" icon="copy" onClick={handleCopyCode} disabled={!family}>
            Copy
          </Button>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <StatTile label="Total balance" cents={totalBalanceCents} icon="wallet" tone="grape" />
          <StatTile label="Allowance this month" cents={allowanceThisMonthCents} icon="calendar-check" tone="gold" />
          <StatTile label="Interest earned" cents={interestEarnedCents} icon="sparkles" tone="mint" />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-7)' }}>
          <Button icon="plus" onClick={() => navigate('/parent/deposit')}>
            Deposit
          </Button>
          <Button
            variant="secondary"
            icon="sliders-horizontal"
            onClick={() => navigate(children[0] ? `/parent/child/${children[0].id}?tab=Rules` : '/parent')}
          >
            Set rules
          </Button>
        </div>

        <SectionHeader title="Children" action="Add child" actionIcon="plus" onAction={() => navigate('/parent/settings')} />
        {profilesLoading ? (
          <Card pad="md" style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 'var(--space-7)' }}>Loading…</Card>
        ) : children.length === 0 ? (
          <div style={{ marginBottom: 'var(--space-7)' }}>
            <EmptyState icon="users" title="No children yet" action={<Button icon="plus" onClick={() => navigate('/parent/settings')}>Add child</Button>}>
              Add a child profile to start managing their wallet.
            </EmptyState>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-7)' }}>
            {children.map((child) => (
              <ChildCard key={child.id} child={child} onClick={() => navigate(`/parent/child/${child.id}`)} />
            ))}
          </div>
        )}

        <SectionHeader title="Recent activity across the family" />
        {!recentTxns || recentTxns.length === 0 ? (
          <EmptyState icon="receipt" title="No activity yet">Deposits and allowance payments will show up here.</EmptyState>
        ) : (
          <Card pad="sm">
            {recentTxns.map((t, i) => (
              <TransactionRow
                key={t.id}
                type={t.type}
                description={`${t.description ?? t.type} - ${profileById.get(familyAccounts?.find((a) => a.id === t.account_id)?.profile_id ?? '')?.name ?? ''}`}
                date={`${formatShortDate(t.created_at)}, ${formatTime(t.created_at)}`}
                cents={t.amount}
                balanceAfter={t.balance_after}
                divider={i < recentTxns.length - 1}
              />
            ))}
          </Card>
        )}
      </div>

      {copied && (
        <div style={{ position: 'fixed', bottom: 'var(--space-6)', left: '50%', transform: 'translateX(-50%)', zIndex: 90 }}>
          <Toast tone="success">Family code copied</Toast>
        </div>
      )}
    </div>
  );
}

function ChildCard({ child, onClick }: { child: Profile; onClick: () => void }) {
  const { data: accounts } = useAccounts(child.id);
  const spending = accounts?.find((a: Account) => a.type === 'spending');
  const savings = accounts?.find((a: Account) => a.type === 'savings');
  const { data: goals } = useSavingsGoals(savings?.id);
  const activeGoals = (goals ?? []).filter((g) => g.status === 'active').length;

  return (
    <Card interactive pad="md" onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <Avatar name={child.name} size={44} />
        <div style={{ minWidth: 0 }}>
          <div style={{ font: 'var(--type-section)', color: 'var(--text-strong)' }}>{child.name}</div>
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            {activeGoals} active goal{activeGoals !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-5)' }}>
        <div>
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Spending</div>
          <MoneyAmount cents={spending?.balance ?? 0} size="md" tone="plain" />
        </div>
        <div>
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Savings</div>
          <MoneyAmount cents={savings?.balance ?? 0} size="md" tone="plain" />
        </div>
      </div>
    </Card>
  );
}
