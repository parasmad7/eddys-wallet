import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { TabBar } from '../design-system/components/navigation/TabBar';

const TABS = [
  { value: '/kid', label: 'Wallet', icon: 'home' },
  { value: '/kid/goals', label: 'Goals', icon: 'target' },
  { value: '/kid/history', label: 'History', icon: 'clock' },
  { value: '/kid/me', label: 'Me', icon: 'user' },
];

export function KidLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div data-theme="kid" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface-page)' }}>
      <div style={{ flex: 1, paddingBottom: 'var(--tabbar-height)' }}>
        <Outlet />
      </div>
      <TabBar items={TABS} value={location.pathname} onChange={(next) => navigate(next)} style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} />
    </div>
  );
}
