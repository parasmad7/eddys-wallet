import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppHeader } from '../design-system/components/navigation/AppHeader';
import { Tabs } from '../design-system/components/navigation/Tabs';

const TABS = [
  { value: '/parent', label: 'Dashboard' },
  { value: '/parent/deposit', label: 'Deposit' },
  { value: '/parent/settings', label: 'Settings' },
];

export function ParentLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div data-theme="parent" style={{ minHeight: '100vh', background: 'var(--surface-page)' }}>
      <AppHeader mode="parent" title="Eddy's Wallet" subtitle="Parent mode" />
      <div style={{ maxWidth: 'var(--app-max, 960px)', margin: '0 auto', padding: 'var(--space-5)' }}>
        <Tabs items={TABS} value={location.pathname} onChange={(next) => navigate(next)} style={{ marginBottom: 'var(--space-5)' }} />
        <Outlet />
      </div>
    </div>
  );
}
