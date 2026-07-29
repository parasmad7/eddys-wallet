import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppHeader } from '../design-system/components/navigation/AppHeader';
import { TabBar } from '../design-system/components/navigation/TabBar';

const TABS = [
  { value: '/kid', label: 'Home', icon: 'home' },
  { value: '/kid/goals', label: 'Goals', icon: 'target' },
  { value: '/kid/history', label: 'History', icon: 'receipt' },
  { value: '/kid/me', label: 'Me', icon: 'user' },
];

export function KidLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div data-theme="kid" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface-page)' }}>
      <AppHeader mode="kid" title="Eddy's Wallet" subtitle="Kid mode" />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <TabBar items={TABS} value={location.pathname} onChange={(next) => navigate(next)} />
    </div>
  );
}
