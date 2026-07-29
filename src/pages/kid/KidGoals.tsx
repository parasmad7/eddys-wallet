import { useState } from 'react';
import { AppHeader } from '../../design-system/components/navigation/AppHeader';
import { IconButton } from '../../design-system/components/core/IconButton';
import { GoalCard } from '../../design-system/components/money/GoalCard';
import { StatTile } from '../../design-system/components/money/StatTile';
import { EmptyState } from '../../design-system/components/feedback/EmptyState';
import { Button } from '../../design-system/components/core/Button';
import { Card } from '../../design-system/components/core/Card';
import { Dialog } from '../../design-system/components/feedback/Dialog';
import { Input } from '../../design-system/components/forms/Input';
import { MoneyInput } from '../../design-system/components/forms/MoneyInput';
import { useAuth } from '../../lib/auth';
import { useAccounts, useCreateGoal, useSavingsGoals } from '../../lib/hooks';
import { dollarsToCents } from '../../lib/format';

export function KidGoals() {
  const { profile } = useAuth();
  const { data: accounts } = useAccounts(profile?.id);
  const savings = accounts?.find((a) => a.type === 'savings');
  const { data: goals, isLoading } = useSavingsGoals(savings?.id);
  const createGoal = useCreateGoal();

  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('20.00');
  const [deadline, setDeadline] = useState('');

  function addGoal() {
    if (!name.trim() || !savings) return;
    createGoal.mutate(
      { accountId: savings.id, name: name.trim(), targetCents: dollarsToCents(target), targetDate: deadline.trim() || undefined },
      {
        onSuccess: () => {
          setName('');
          setTarget('20.00');
          setDeadline('');
          setShowAdd(false);
        },
      },
    );
  }

  const savedThisMonthCents = (goals ?? []).reduce((sum, g) => sum + g.current_amount, 0);

  return (
    <div style={{ maxWidth: 'var(--app-max)', margin: '0 auto', minHeight: '100%' }}>
      <AppHeader mode="kid" subtitle="Savings goals" title="Your goals" actions={<IconButton icon="plus" label="Add goal" variant="onBrand" size="sm" onClick={() => setShowAdd(true)} />} />

      <div style={{ padding: 'var(--space-5) var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <StatTile label="Saved toward goals" cents={savedThisMonthCents} icon="piggy-bank" tone="mint" style={{ flex: 1 }} />
          <StatTile label="Active goals" text={String((goals ?? []).filter((g) => g.status === 'active').length)} icon="target" tone="gold" style={{ flex: 1 }} />
        </div>

        {isLoading ? (
          <Card pad="md" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</Card>
        ) : !goals || goals.length === 0 ? (
          <EmptyState mascotSrc="/assets/eddy-mascot.svg" title="No goals yet" action={<Button icon="plus" onClick={() => setShowAdd(true)} disabled={!savings}>New goal</Button>}>
            Set something you're saving up for and watch your progress grow.
          </EmptyState>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {goals.map((g) => (
              <GoalCard
                key={g.id}
                name={g.name}
                icon="target"
                targetCents={g.target_amount}
                currentCents={g.current_amount}
                deadline={g.target_date ?? undefined}
                status={g.status}
              />
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
            <Button fullWidth onClick={addGoal} disabled={createGoal.isPending}>
              {createGoal.isPending ? 'Creating…' : 'Create goal'}
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input label="What are you saving for?" icon="target" placeholder="e.g. New skateboard" value={name} onChange={(e) => setName(e.target.value)} />
          <MoneyInput label="Target amount" value={target} onChange={setTarget} presets={[10, 20, 50, 100]} />
          <Input label="Deadline (optional)" icon="calendar" placeholder="e.g. Dec 2026" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          {createGoal.isError && <div style={{ color: 'var(--danger)', font: 'var(--type-caption)' }}>Couldn't create goal. Try again.</div>}
        </div>
      </Dialog>
    </div>
  );
}
