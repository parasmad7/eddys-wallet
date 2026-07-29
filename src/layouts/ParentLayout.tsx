import { Outlet } from 'react-router-dom';

export function ParentLayout() {
  return (
    <div data-theme="parent" style={{ minHeight: '100vh', background: 'var(--surface-page)' }}>
      <Outlet />
    </div>
  );
}
