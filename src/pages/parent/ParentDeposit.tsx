import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../design-system/components/navigation/AppHeader';
import { AvatarChip, Avatar } from '../../design-system/components/navigation/AvatarChip';
import { Card } from '../../design-system/components/core/Card';
import { Button } from '../../design-system/components/core/Button';
import { Icon } from '../../design-system/components/core/Icon';
import { MoneyInput } from '../../design-system/components/forms/MoneyInput';
import { Input } from '../../design-system/components/forms/Input';
import { Toast } from '../../design-system/components/feedback/Toast';
import { MoneyAmount, formatCents } from '../../design-system/components/money/MoneyAmount';
import { EmptyState } from '../../design-system/components/feedback/EmptyState';
import { dollarsToCents } from '../../lib/format';
import { useAccounts, useDeposit, useFamily, useProfiles } from '../../lib/hooks';
import type { Profile } from '../../lib/types';

type Step = 'select' | 'amount' | 'confirm';

export function ParentDeposit() {
  const navigate = useNavigate();
  const { data: family } = useFamily();
  const { data: profiles, isLoading } = useProfiles(family?.id);
  const children = (profiles ?? []).filter((p) => p.role === 'child');

  const [step, setStep] = useState<Step>('select');
  const [childId, setChildId] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState('5.00');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [finalBalance, setFinalBalance] = useState<number | null>(null);

  const child = children.find((c) => c.id === childId);
  const { data: accounts } = useAccounts(childId);
  const spending = accounts?.find((a) => a.type === 'spending');
  const cents = dollarsToCents(amount);
  const deposit = useDeposit();

  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => navigate('/parent'), 1600);
    return () => clearTimeout(timer);
  }, [showSuccess, navigate]);

  const handleBack = () => {
    if (step === 'amount') setStep('select');
    else if (step === 'confirm') setStep('amount');
    else navigate('/parent');
  };

  const handleSelectChild = (id: string) => {
    setChildId(id);
    setStep('amount');
  };

  const handleConfirm = () => {
    if (!spending) return;
    deposit.mutate(
      { accountId: spending.id, amountCents: cents, description: description.trim() || undefined },
      {
        onSuccess: (data) => {
          const newBalance = (data as { balance?: number } | null)?.balance;
          setFinalBalance(typeof newBalance === 'number' ? newBalance : spending.balance + cents);
          setShowSuccess(true);
        },
      },
    );
  };

  return (
    <div>
      <AppHeader mode="parent" subtitle="Parent mode" title="Deposit" onBack={handleBack} />
      <div style={{ padding: 'var(--space-6) var(--space-6) var(--space-9)', maxWidth: 520, margin: '0 auto' }}>
        {step === 'select' && (
          <div>
            <div style={{ font: 'var(--type-section)', color: 'var(--text-strong)', marginBottom: 'var(--space-4)' }}>Who is this deposit for?</div>
            {isLoading ? (
              <Card pad="md" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</Card>
            ) : children.length === 0 ? (
              <EmptyState icon="users" title="No children yet">Add a child profile in Settings first.</EmptyState>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {children.map((c) => (
                  <ChildOption key={c.id} child={c} onClick={() => handleSelectChild(c.id)} />
                ))}
              </div>
            )}
          </div>
        )}

        {step === 'amount' && child && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Avatar name={child.name} size={36} />
              <div style={{ font: 'var(--type-body-strong)', color: 'var(--text-strong)' }}>Deposit to {child.name}'s spending</div>
            </div>
            <MoneyInput value={amount} onChange={setAmount} presets={[1, 5, 10, 20]} />
            <Input label="Note (optional)" placeholder="e.g. Birthday money" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Button fullWidth size="lg" disabled={cents <= 0 || !spending} onClick={() => setStep('confirm')}>Continue</Button>
          </div>
        )}

        {step === 'confirm' && child && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <Card tone="tint" pad="lg" style={{ textAlign: 'center' }}>
              <Avatar name={child.name} size={56} style={{ margin: '0 auto var(--space-3)' }} />
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginBottom: 4 }}>Deposit to {child.name}'s spending</div>
              <MoneyAmount cents={cents} size="hero" tone="plain" />
              {description && <div style={{ marginTop: 'var(--space-3)', font: 'var(--type-body)', color: 'var(--text-body)' }}>{description}</div>}
            </Card>
            <Button fullWidth size="lg" icon="check" onClick={handleConfirm} disabled={deposit.isPending}>
              {deposit.isPending ? 'Depositing…' : 'Confirm deposit'}
            </Button>
            <Button fullWidth variant="ghost" onClick={() => setStep('amount')}>Edit amount</Button>
            {deposit.isError && <div style={{ textAlign: 'center', color: 'var(--danger)', font: 'var(--type-caption)' }}>Something went wrong. Try again.</div>}
          </div>
        )}
      </div>

      {showSuccess && child && (
        <div style={{ position: 'fixed', bottom: 'var(--space-6)', left: '50%', transform: 'translateX(-50%)', zIndex: 90 }}>
          <Toast tone="money">
            Deposited {formatCents(cents)} to {child.name}'s spending{finalBalance != null ? ` - now ${formatCents(finalBalance)}` : ''}
          </Toast>
        </div>
      )}
    </div>
  );
}

function ChildOption({ child, onClick }: { child: Profile; onClick: () => void }) {
  const { data: accounts } = useAccounts(child.id);
  const spending = accounts?.find((a) => a.type === 'spending');
  return (
    <AvatarChip
      name={child.name}
      caption={`${formatCents(spending?.balance ?? 0)} spending`}
      onClick={onClick}
      trailing={<Icon name="chevron-right" size={18} style={{ color: 'var(--text-muted)', marginLeft: 'auto' }} />}
      style={{ width: '100%', justifyContent: 'space-between' }}
    />
  );
}
