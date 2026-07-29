import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../design-system/components/forms/Input';
import { PinPad } from '../../design-system/components/forms/PinPad';

export function KidLogin() {
  const navigate = useNavigate();
  const [code, setCode] = useState('EDDY-7K3M');
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (pin.length === 4) {
      const timer = setTimeout(() => navigate('/kid'), 350);
      return () => clearTimeout(timer);
    }
  }, [pin, navigate]);

  return (
    <div data-theme="kid" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface-page)' }}>
      <div style={{ background: 'linear-gradient(160deg,var(--grape-500),var(--grape-700))', padding: '36px 20px 28px', textAlign: 'center', color: '#fff' }}>
        <img src="/assets/eddy-mascot.svg" width={72} height={72} alt="" />
        <div style={{ font: 'var(--type-title)', color: '#fff', marginTop: 6 }}>Kid Login</div>
        <div style={{ font: 'var(--type-caption)', color: 'rgba(255,255,255,.8)', marginTop: 2 }}>Enter your family code and PIN</div>
      </div>
      <div style={{ flex: 1, maxWidth: 420, margin: '0 auto', width: '100%', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <Input label="Family code" value={code} onChange={(e) => setCode(e.target.value)} icon="users" />
        <PinPad length={4} value={pin} onChange={setPin} label="Your PIN" />
      </div>
    </div>
  );
}
