import { AppHeader } from '../../design-system/components/navigation/AppHeader';
import { Avatar } from '../../design-system/components/navigation/AvatarChip';
import { SectionHeader } from '../../design-system/components/core/SectionHeader';
import { StatTile } from '../../design-system/components/money/StatTile';
import { AchievementBadge, type AchievementBadgeProps } from '../../design-system/components/feedback/AchievementBadge';
import { Card } from '../../design-system/components/core/Card';
import { Icon } from '../../design-system/components/core/Icon';

const BADGES: AchievementBadgeProps[] = [
  { icon: 'piggy-bank', label: 'First $100 saved', caption: 'Apr 2026', earned: true },
  { icon: 'sparkles', label: 'First interest', caption: 'Mar 2026', earned: true },
  { icon: 'flame', label: '3-month streak', caption: 'Jun 2026', earned: true },
  { icon: 'hand-coins', label: 'Loan paid off', caption: 'Pay off a loan', earned: false },
  { icon: 'target', label: 'Goal master', caption: 'Reach 3 goals', earned: false },
];

export function KidMe() {
  return (
    <div style={{ maxWidth: 'var(--app-max)', margin: '0 auto', minHeight: '100%' }}>
      <AppHeader mode="kid" subtitle="Your progress" title="Me" />

      <div style={{ padding: 'var(--space-5) var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <Avatar name="Maya" size={56} />
          <div>
            <div style={{ font: 'var(--type-title)', color: 'var(--text-strong)' }}>Maya</div>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Member since Jan 2026</div>
          </div>
        </div>

        <SectionHeader title="This year" />
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <StatTile label="Saved" cents={12480} icon="piggy-bank" tone="mint" style={{ flex: 1 }} />
          <StatTile label="Interest" cents={412} icon="sparkles" tone="gold" style={{ flex: 1 }} />
          <StatTile label="Goals reached" text="2" icon="party-popper" tone="grape" style={{ flex: 1 }} />
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
            <div style={{ font: 'var(--weight-heavy) var(--text-lg)/1.2 var(--font-money)', color: 'var(--text-strong)', letterSpacing: 'var(--tracking-wide)' }}>EDDY-7K3M</div>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Share this with family to link accounts</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
