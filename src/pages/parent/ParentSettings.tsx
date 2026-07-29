import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../../design-system/components/navigation/AppHeader';
import { IconButton } from '../../design-system/components/core/IconButton';
import { Icon } from '../../design-system/components/core/Icon';
import { Card } from '../../design-system/components/core/Card';
import { Button } from '../../design-system/components/core/Button';
import { SectionHeader } from '../../design-system/components/core/SectionHeader';
import { Input } from '../../design-system/components/forms/Input';
import { PinPad } from '../../design-system/components/forms/PinPad';
import { Avatar } from '../../design-system/components/navigation/AvatarChip';
import { Dialog } from '../../design-system/components/feedback/Dialog';
import { Toast } from '../../design-system/components/feedback/Toast';
import { EmptyState } from '../../design-system/components/feedback/EmptyState';
import { useAuth } from '../../lib/auth';
import { useCreateChildProfile, useFamily, useProfiles } from '../../lib/hooks';

const ACCOUNT_LINKS = [
  { icon: 'download', label: 'Export account data' },
  { icon: 'bell', label: 'Notification preferences' },
  { icon: 'shield', label: 'Privacy & security' },
];

export function ParentSettings() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { data: family } = useFamily();
  const { data: profiles, isLoading } = useProfiles(family?.id);
  const children = (profiles ?? []).filter((p) => p.role === 'child');
  const createChild = useCreateChildProfile();

  const [copied, setCopied] = useState(false);

  const [showAddChild, setShowAddChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildPin, setNewChildPin] = useState('');

  const handleCopyCode = () => {
    if (!family) return;
    navigator.clipboard?.writeText(family.family_code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addChild = () => {
    if (!newChildName.trim() || newChildPin.length < 4 || !family) return;
    createChild.mutate(
      { familyId: family.id, name: newChildName.trim(), pin: newChildPin },
      {
        onSuccess: () => {
          setNewChildName('');
          setNewChildPin('');
          setShowAddChild(false);
        },
      },
    );
  };

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  return (
    <div>
      <AppHeader mode="parent" subtitle="Parent mode" title="Settings" onBack={() => navigate('/parent')} />
      <div
        style={{
          padding: 'var(--space-6) var(--space-6) var(--space-9)',
          maxWidth: 640,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-7)',
        }}
      >
        <div>
          <SectionHeader title="Family" />
          <Card pad="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
              <div>
                <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Family name</div>
                <div style={{ font: 'var(--type-section)', color: 'var(--text-strong)' }}>{family?.name ?? '···'}</div>
              </div>
            </div>
            <div
              style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: 'var(--space-4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--space-3)',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon name="key-round" size={18} style={{ color: 'var(--brand-strong)' }} />
                <div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Family code - share this with your kids</div>
                  <div style={{ font: 'var(--weight-bold) 20px/1 var(--font-mono)', color: 'var(--text-strong)', letterSpacing: '.04em' }}>{family?.family_code ?? '···'}</div>
                </div>
              </div>
              <Button variant="secondary" size="sm" icon="copy" onClick={handleCopyCode} disabled={!family}>Copy</Button>
            </div>
          </Card>
        </div>

        <div>
          <SectionHeader title="Children" action="Add child" actionIcon="plus" onAction={() => setShowAddChild(true)} />
          {isLoading ? (
            <Card pad="md" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</Card>
          ) : children.length === 0 ? (
            <EmptyState icon="users" title="No children yet" action={<Button icon="plus" onClick={() => setShowAddChild(true)}>Add child</Button>}>
              Add your first child profile to get started.
            </EmptyState>
          ) : (
            <Card pad="sm">
              {children.map((c, i) => (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3) 0',
                    borderBottom: i < children.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  }}
                >
                  <Avatar name={c.name} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: 'var(--type-body-strong)', color: 'var(--text-strong)' }}>{c.name}</div>
                  </div>
                  <IconButton icon="pencil" label={`Edit ${c.name}`} variant="ghost" size="sm" onClick={() => navigate(`/parent/child/${c.id}`)} />
                </div>
              ))}
            </Card>
          )}
        </div>

        <div>
          <SectionHeader title="Account" />
          <Card pad="sm">
            {ACCOUNT_LINKS.map((link, i) => (
              <button
                key={link.label}
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  width: '100%',
                  padding: 'var(--space-3) 0',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: i < ACCOUNT_LINKS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}
              >
                <Icon name={link.icon} size={18} style={{ color: 'var(--text-muted)' }} />
                <span style={{ flex: 1, font: 'var(--type-body-strong)', color: 'var(--text-strong)' }}>{link.label}</span>
                <Icon name="chevron-right" size={16} style={{ color: 'var(--text-faint)' }} />
              </button>
            ))}
          </Card>
        </div>

        <Button variant="danger" fullWidth icon="log-out" onClick={handleSignOut}>Sign out</Button>
      </div>

      <Dialog
        open={showAddChild}
        title="Add a child"
        onClose={() => setShowAddChild(false)}
        footer={
          <>
            <Button variant="secondary" fullWidth onClick={() => setShowAddChild(false)}>Cancel</Button>
            <Button fullWidth disabled={!newChildName.trim() || newChildPin.length < 4 || createChild.isPending} onClick={addChild}>
              {createChild.isPending ? 'Adding…' : 'Add child'}
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <Input label="Child's name" placeholder="e.g. Maya" value={newChildName} onChange={(e) => setNewChildName(e.target.value)} />
          <PinPad label="Set a 4-digit PIN for login" length={4} value={newChildPin} onChange={setNewChildPin} />
          {createChild.isError && <div style={{ textAlign: 'center', color: 'var(--danger)', font: 'var(--type-caption)' }}>Couldn't add child. Try again.</div>}
        </div>
      </Dialog>

      {copied && (
        <div style={{ position: 'fixed', bottom: 'var(--space-6)', left: '50%', transform: 'translateX(-50%)', zIndex: 90 }}>
          <Toast tone="success">Family code copied</Toast>
        </div>
      )}
    </div>
  );
}
