import { AppHeader } from '../../design-system/components/navigation/AppHeader';
import { Avatar } from '../../design-system/components/navigation/AvatarChip';
import { SectionHeader } from '../../design-system/components/core/SectionHeader';
import { StatTile } from '../../design-system/components/money/StatTile';
import { AchievementBadge, type AchievementBadgeProps } from '../../design-system/components/feedback/AchievementBadge';
import { Card } from '../../design-system/components/core/Card';
import { Icon } from '../../design-system/components/core/Icon';
import { useAuth } from '../../lib/auth';
import { useAccounts, useSavingsGoals, useTransactions } from '../../lib/hooks';

const BADGES: AchievementBadgeProps[] = [
  { icon: 'piggy-bank', label: 'First $100 saved', caption: 'Milestone', earned: true },
  { icon: 'sparkles', label: 'First interest', caption: 'Milestone', earned: true },
  { icon: 'flame', label: '3-month streak', caption: 'Milestone', earned: true },
  { icon: 'hand-coins', label: 'Loan paid off', caption: 'Pay off a loan', earned: false },
  { icon: 'target', label: 'Goal master', caption: 'Reach 3 goals', earned: false },
];

export function KidMe() {
  const { profile, family } = useAuth();
  const { data: accounts } = useAccounts(profile?.id);
  const savings = accounts?.find((a) => a.type === 'savings');
  const { data: interestTxns } = useTransactions(savings?.id, { type: 'interest' });
  const { data: goals } = useSavingsGoals(savings?.id);

  const currentYear = new Date().getFullYear();
  const interestThisYearCents = (interestTxns ?? [])
    .filter((t) => new Date(t.created_at).getFullYear() === currentYear)
    .reduce((sum, t) => sum + t.amount, 0);
  const goalsReached = (goals ?? []).filter((g) => g.status === 'reached').length;
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '';

  return (
    <div style={{ maxWidth: 'var(--app-max)', margin: '0 auto', minHeight: '100%' }}>
      <AppHeader mode="kid" subtitle="Your progress" title="Me" />

      <div style={{ padding: 'var(--space-5) var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <Avatar name={profile?.name ?? '?'} size={56} />
          <div>
            <div style={{ font: 'var(--type-title)', color: 'var(--text-strong)' }}>{profile?.name}</div>
            {memberSince && <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Member since {memberSince}</div>}
          </div>
        </div>

        <SectionHeader title="This year" />
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <StatTile label="Saved" cents={savings?.balance ?? 0} icon="piggy-bank" tone="mint" style={{ flex: 1 }} />
          <StatTile label="Interest" cents={interestThisYearCents} icon="sparkles" tone="gold" style={{ flex: 1 }} />
          <StatTile label="Goals reached" text={String(goalsReached)} icon="party-popper" tone="grape" style={{ flex: 1 }} />
        </div>

        <SectionHeader title="Badges" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
          {BADGES.map((b, i) => (
            <AchievementBadge key={i} {...b} />
          ))}
        </div>

        <SectionHeader title="Family code" />
        <Card pad="md" tone="tint" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ width: 40, height: 40, flex: 'none', borderRadius: 'var(--radius-circle)', background: 'var(--brand-soft)', color: 'var(--brand-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="users" size={19} />
          </span>
          <div>
            <div style={{ font: 'var(--weight-heavy) var(--text-lg)/1.2 var(--font-money)', color: 'var(--text-strong)', letterSpacing: 'var(--tracking-wide)' }}>{family?.family_code}</div>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Share this with family to link accounts</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
