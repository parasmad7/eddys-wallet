import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../design-system/components/core/Button';
import { Card } from '../../design-system/components/core/Card';
import { Input } from '../../design-system/components/forms/Input';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    navigate('/parent');
  }

  return (
    <div data-theme="parent" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-page)', padding: 'var(--space-5)' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <img src="/assets/eddy-mascot.svg" width={56} height={56} alt="" />
          <div style={{ font: 'var(--weight-bold) var(--text-xl)/1.2 var(--font-display)', color: 'var(--text-strong)', marginTop: 'var(--space-3)' }}>Eddy's Wallet</div>
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>Sign in to manage your family's accounts</div>
        </div>
        <Card pad="lg">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input label="Email" type="email" icon="mail" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
            <Input label="Password" type="password" icon="lock" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
            <Button type="submit" fullWidth size="lg" style={{ marginTop: 'var(--space-2)' }}>
              Sign in
            </Button>
          </form>
        </Card>
        <div style={{ textAlign: 'center', marginTop: 'var(--space-5)', font: 'var(--type-body)', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--text-link)', fontWeight: 'var(--weight-bold)' }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}
