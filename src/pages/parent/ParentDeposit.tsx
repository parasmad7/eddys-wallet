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
import { dollarsToCents } from '../../lib/format';
import { CHILDREN, getChild } from './mockData';

type Step = 'select' | 'amount' | 'confirm';

export function ParentDeposit() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('select');
  const [childId, setChildId] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState('5.00');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const child = getChild(childId);
  const cents = dollarsToCents(amount);

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
    setShowSuccess(true);
  };

  return (
    <div>
      <AppHeader mode="parent" subtitle="Parent mode" title="Deposit" onBack={handleBack} />
      <div style={{ padding: 'var(--space-6) var(--space-6) var(--space-9)', maxWidth: 520, margin: '0 auto' }}>
        {step === 'select' && (
          <div>
            <div style={{ font: 'var(--type-section)', color: 'var(--text-strong)', marginBottom: 'var(--space-4)' }}>Who is this deposit for?</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {CHILDREN.map((c) => (
                <AvatarChip
                  key={c.id}
                  name={c.name}
                  caption={`${formatCents(c.spendingCents)} spending`}
                  onClick={() => handleSelectChild(c.id)}
                  trailing={<Icon name="chevron-right" size={18} style={{ color: 'var(--text-muted)', marginLeft: 'auto' }} />}
                  style={{ width: '100%', justifyContent: 'space-between' }}
                />
              ))}
            </div>
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
            <Button fullWidth size="lg" disabled={cents <= 0} onClick={() => setStep('confirm')}>Continue</Button>
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
            <Button fullWidth size="lg" icon="check" onClick={handleConfirm}>Confirm deposit</Button>
            <Button fullWidth variant="ghost" onClick={() => setStep('amount')}>Edit amount</Button>
          </div>
        )}
      </div>

      {showSuccess && child && (
        <div style={{ position: 'fixed', bottom: 'var(--space-6)', left: '50%', transform: 'translateX(-50%)', zIndex: 90 }}>
          <Toast tone="money">Deposited {formatCents(cents)} to {child.name}'s spending</Toast>
        </div>
      )}
    </div>
  );
}
