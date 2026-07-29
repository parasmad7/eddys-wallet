import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../design-system/components/forms/Input';
import { PinPad } from '../../design-system/components/forms/PinPad';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import type { Family, Profile } from '../../lib/types';

interface ChildLoginResponse {
  token: string;
  profile: Profile;
  family: Family;
}

export function KidLogin() {
  const navigate = useNavigate();
  const { loginChild } = useAuth();
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(currentPin: string) {
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke<ChildLoginResponse>('child-login', {
        body: { family_code: code.trim(), pin: currentPin },
      });
      if (fnError) {
        const status = (fnError as { context?: { status?: number } }).context?.status;
        if (status === 429) {
          setError('Too many tries. Wait a bit before trying again.');
        } else {
          setError('Wrong family code or PIN. Try again.');
        }
        setPin('');
        return;
      }
      if (!data) {
        setError('Something went wrong. Try again.');
        setPin('');
        return;
      }
      loginChild(data.token, data.profile, data.family);
      navigate('/kid');
    } finally {
      setSubmitting(false);
    }
  }

  function handlePinChange(next: string) {
    setPin(next);
    if (next.length === 4) submit(next);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <div data-theme="kid" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface-page)' }}>
      <div style={{ background: 'linear-gradient(160deg,var(--grape-500),var(--grape-700))', padding: '36px 20px 28px', textAlign: 'center', color: '#fff' }}>
        <img src="/assets/eddy-mascot.svg" width={72} height={72} alt="" />
        <div style={{ font: 'var(--type-title)', color: '#fff', marginTop: 6 }}>Kid Login</div>
        <div style={{ font: 'var(--type-caption)', color: 'rgba(255,255,255,.8)', marginTop: 2 }}>Enter your family code and PIN</div>
      </div>
      <form onSubmit={handleSubmit} style={{ flex: 1, maxWidth: 420, margin: '0 auto', width: '100%', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <Input label="Family code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} icon="users" placeholder="EDDY-1234" disabled={submitting} />
        <PinPad length={4} value={pin} onChange={handlePinChange} label="Your PIN" error={error || undefined} />
      </form>
    </div>
  );
}
