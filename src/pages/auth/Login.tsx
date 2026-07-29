import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../design-system/components/core/Button';
import { Card } from '../../design-system/components/core/Card';
import { Input } from '../../design-system/components/forms/Input';
import { supabase } from '../../lib/supabase';

type Mode = 'sign-in' | 'sign-up';

export function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { error: authError } =
        mode === 'sign-up'
          ? await supabase.auth.signUp({ email, password })
          : await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message);
        return;
      }
      navigate('/parent');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div data-theme="parent" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-page)', padding: 'var(--space-5)' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <img src="/assets/eddy-mascot.svg" width={56} height={56} alt="" />
          <div style={{ font: 'var(--weight-bold) var(--text-xl)/1.2 var(--font-display)', color: 'var(--text-strong)', marginTop: 'var(--space-3)' }}>Eddy's Wallet</div>
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>
            {mode === 'sign-up' ? 'Create an account to manage your family' : "Sign in to manage your family's accounts"}
          </div>
        </div>
        <Card pad="lg">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input label="Email" type="email" icon="mail" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
            <Input
              label="Password"
              type="password"
              icon="lock"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
              error={error || undefined}
              required
            />
            <Button type="submit" fullWidth size="lg" disabled={submitting} style={{ marginTop: 'var(--space-2)' }}>
              {submitting ? 'Please wait…' : mode === 'sign-up' ? 'Sign up' : 'Sign in'}
            </Button>
          </form>
        </Card>
        <div style={{ textAlign: 'center', marginTop: 'var(--space-5)', font: 'var(--type-body)', color: 'var(--text-muted)' }}>
          {mode === 'sign-up' ? (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => { setMode('sign-in'); setError(''); }} style={{ color: 'var(--text-link)', fontWeight: 'var(--weight-bold)', background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>
                Sign in
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button type="button" onClick={() => { setMode('sign-up'); setError(''); }} style={{ color: 'var(--text-link)', fontWeight: 'var(--weight-bold)', background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
