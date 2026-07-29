import { useState } from 'react';
import { AppHeader } from '../../design-system/components/navigation/AppHeader';
import { IconButton } from '../../design-system/components/core/IconButton';
import { GoalCard, type GoalCardProps } from '../../design-system/components/money/GoalCard';
import { StatTile } from '../../design-system/components/money/StatTile';
import { EmptyState } from '../../design-system/components/feedback/EmptyState';
import { Button } from '../../design-system/components/core/Button';
import { Dialog } from '../../design-system/components/feedback/Dialog';
import { Input } from '../../design-system/components/forms/Input';
import { MoneyInput } from '../../design-system/components/forms/MoneyInput';
import { dollarsToCents } from '../../lib/format';

const INITIAL_GOALS: GoalCardProps[] = [
  { name: 'New bike', icon: 'bike', targetCents: 5000, currentCents: 3200, deadline: 'Dec 2026' },
  { name: 'Video game', icon: 'gamepad-2', targetCents: 6000, currentCents: 6000, status: 'reached' },
  { name: 'Skate park pass', icon: 'award', targetCents: 3500, currentCents: 900, deadline: 'Oct 2026' },
];

export function KidGoals() {
  const [goals, setGoals] = useState<GoalCardProps[]>(INITIAL_GOALS);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('20.00');
  const [deadline, setDeadline] = useState('');

  function addGoal() {
    if (!name.trim()) return;
    setGoals((prev) => [...prev, { name: name.trim(), icon: 'target', targetCents: dollarsToCents(target), currentCents: 0, deadline: deadline.trim() || undefined }]);
    setName('');
    setTarget('20.00');
    setDeadline('');
    setShowAdd(false);
  }

  return (
    <div style={{ maxWidth: 'var(--app-max)', margin: '0 auto', minHeight: '100%' }}>
      <AppHeader mode="kid" subtitle="Savings goals" title="Your goals" actions={<IconButton icon="plus" label="Add goal" variant="onBrand" size="sm" onClick={() => setShowAdd(true)} />} />

      <div style={{ padding: 'var(--space-5) var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <StatTile label="Saved this month" cents={4820} icon="piggy-bank" tone="mint" style={{ flex: 1 }} />
          <StatTile label="Streak" text="3 weeks" icon="flame" tone="gold" style={{ flex: 1 }} />
        </div>

        {goals.length === 0 ? (
          <EmptyState mascotSrc="/assets/eddy-mascot.svg" title="No goals yet" action={<Button icon="plus" onClick={() => setShowAdd(true)}>New goal</Button>}>
            Set something you're saving up for and watch your progress grow.
          </EmptyState>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {goals.map((g, i) => (
              <GoalCard key={i} {...g} />
            ))}
            <Button variant="secondary" icon="plus" fullWidth onClick={() => setShowAdd(true)}>
              New goal
            </Button>
          </div>
        )}
      </div>

      <Dialog
        open={showAdd}
        variant="sheet"
        title="New goal"
        onClose={() => setShowAdd(false)}
        footer={
          <>
            <Button variant="secondary" fullWidth onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button fullWidth onClick={addGoal}>
              Create goal
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input label="What are you saving for?" icon="target" placeholder="e.g. New skateboard" value={name} onChange={(e) => setName(e.target.value)} />
          <MoneyInput label="Target amount" value={target} onChange={setTarget} presets={[10, 20, 50, 100]} />
          <Input label="Deadline (optional)" icon="calendar" placeholder="e.g. Dec 2026" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>
      </Dialog>
    </div>
  );
}
