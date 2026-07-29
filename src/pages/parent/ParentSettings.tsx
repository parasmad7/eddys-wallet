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
import { supabase } from '../../lib/supabase';
import { FAMILY, CHILDREN as INITIAL_CHILDREN, type Child } from './mockData';

const ACCOUNT_LINKS = [
  { icon: 'download', label: 'Export account data' },
  { icon: 'bell', label: 'Notification preferences' },
  { icon: 'shield', label: 'Privacy & security' },
];

export function ParentSettings() {
  const navigate = useNavigate();
  const [familyName, setFamilyName] = useState(FAMILY.name);
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(familyName);
  const [copied, setCopied] = useState(false);

  const [children, setChildren] = useState<Pick<Child, 'id' | 'name' | 'age'>[]>(
    INITIAL_CHILDREN.map((c) => ({ id: c.id, name: c.name, age: c.age })),
  );
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildPin, setNewChildPin] = useState('');

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(FAMILY.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveName = () => {
    if (draftName.trim()) setFamilyName(draftName.trim());
    setEditingName(false);
  };

  const addChild = () => {
    if (!newChildName.trim() || newChildPin.length < 4) return;
    setChildren((prev) => [...prev, { id: newChildName.trim().toLowerCase().replace(/\s+/g, '-'), name: newChildName.trim(), age: 0 }]);
    setNewChildName('');
    setNewChildPin('');
    setShowAddChild(false);
  };

  const handleSignOut = () => {
    supabase.auth.signOut();
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
            {editingName ? (
              <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <Input label="Family name" value={draftName} onChange={(e) => setDraftName(e.target.value)} style={{ flex: 1, minWidth: 160 }} />
                <Button size="md" onClick={saveName}>Save</Button>
                <Button
                  size="md"
                  variant="ghost"
                  onClick={() => {
                    setDraftName(familyName);
                    setEditingName(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                <div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Family name</div>
                  <div style={{ font: 'var(--type-section)', color: 'var(--text-strong)' }}>{familyName}</div>
                </div>
                <IconButton
                  icon="pencil"
                  label="Edit family name"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDraftName(familyName);
                    setEditingName(true);
                  }}
                />
              </div>
            )}
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
                  <div style={{ font: 'var(--weight-bold) 20px/1 var(--font-mono)', color: 'var(--text-strong)', letterSpacing: '.04em' }}>{FAMILY.code}</div>
                </div>
              </div>
              <Button variant="secondary" size="sm" icon="copy" onClick={handleCopyCode}>Copy</Button>
            </div>
          </Card>
        </div>

        <div>
          <SectionHeader title="Children" action="Add child" actionIcon="plus" onAction={() => setShowAddChild(true)} />
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
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{c.age > 0 ? `Age ${c.age}` : 'Recently added'}</div>
                </div>
                <IconButton icon="pencil" label={`Edit ${c.name}`} variant="ghost" size="sm" />
              </div>
            ))}
          </Card>
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
            <Button fullWidth disabled={!newChildName.trim() || newChildPin.length < 4} onClick={addChild}>Add child</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <Input label="Child's name" placeholder="e.g. Maya" value={newChildName} onChange={(e) => setNewChildName(e.target.value)} />
          <PinPad label="Set a 4-digit PIN for login" length={4} value={newChildPin} onChange={setNewChildPin} />
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
