import { Outlet } from 'react-router-dom';
import { RequireParent } from '../lib/auth';
import { useRealtimeSync } from '../lib/hooks';

export function ParentLayout() {
  useRealtimeSync();

  return (
    <RequireParent>
      <div data-theme="parent" style={{ minHeight: '100vh', background: 'var(--surface-page)' }}>
        <Outlet />
      </div>
    </RequireParent>
  );
}
