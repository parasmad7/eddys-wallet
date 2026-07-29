import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { CHILDREN, FAMILY, TRANSACTIONS, getFamilyTotals } from './mockData';

export function ParentDashboard() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const totals = getFamilyTotals();

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(FAMILY.code).catch(() => {});
    setCopied(true);
  };

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
              <div style={{ font: 'var(--weight-bold) 20px/1 var(--font-mono)', color: 'var(--text-strong)', letterSpacing: '.04em' }}>{FAMILY.code}</div>
            </div>
          </div>
          <Button variant="secondary" size="sm" icon="copy" onClick={handleCopyCode}>
            Copy
          </Button>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <StatTile label="Total balance" cents={totals.totalBalanceCents} icon="wallet" tone="grape" />
          <StatTile label="Allowance this month" cents={totals.allowanceThisMonthCents} icon="calendar-check" tone="gold" />
          <StatTile label="Interest earned" cents={totals.interestEarnedCents} icon="sparkles" tone="mint" />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-7)' }}>
          <Button icon="plus" onClick={() => navigate('/parent/deposit')}>
            Deposit
          </Button>
          <Button
            variant="secondary"
            icon="sliders-horizontal"
            onClick={() => navigate(CHILDREN[0] ? `/parent/child/${CHILDREN[0].id}?tab=Rules` : '/parent')}
          >
            Set rules
          </Button>
        </div>

        <SectionHeader title="Children" action="Add child" actionIcon="plus" onAction={() => navigate('/parent/settings')} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-7)' }}>
          {CHILDREN.map((child) => (
            <Card key={child.id} interactive pad="md" onClick={() => navigate(`/parent/child/${child.id}`)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <Avatar name={child.name} size={44} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ font: 'var(--type-section)', color: 'var(--text-strong)' }}>{child.name}</div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
                    Age {child.age} · {child.goalsCount} active goal{child.goalsCount !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-5)' }}>
                <div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Spending</div>
                  <MoneyAmount cents={child.spendingCents} size="md" tone="plain" />
                </div>
                <div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Savings</div>
                  <MoneyAmount cents={child.savingsCents} size="md" tone="plain" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <SectionHeader title="Recent activity across the family" />
        <Card pad="sm">
          {TRANSACTIONS.slice(0, 5).map((t, i) => (
            <TransactionRow
              key={t.id}
              type={t.type}
              description={`${t.description} - ${CHILDREN.find((c) => c.id === t.childId)?.name}`}
              date={`${t.dateGroup}, ${t.time}`}
              cents={t.cents}
              balanceAfter={t.balanceAfter}
              divider={i < 4}
            />
          ))}
        </Card>
      </div>

      {copied && (
        <div style={{ position: 'fixed', bottom: 'var(--space-6)', left: '50%', transform: 'translateX(-50%)', zIndex: 90 }}>
          <Toast tone="success">Family code copied</Toast>
        </div>
      )}
    </div>
  );
}
