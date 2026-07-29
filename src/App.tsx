import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { KidLayout } from './layouts/KidLayout';
import { ParentLayout } from './layouts/ParentLayout';
import { Landing } from './pages/marketing/Landing';
import { Login } from './pages/auth/Login';
import { KidLogin } from './pages/auth/KidLogin';
import { KidDashboard } from './pages/kid/KidDashboard';
import { KidGoals } from './pages/kid/KidGoals';
import { KidHistory } from './pages/kid/KidHistory';
import { KidMe } from './pages/kid/KidMe';
import { ParentDashboard } from './pages/parent/ParentDashboard';
import { ChildDetail } from './pages/parent/ChildDetail';
import { ParentDeposit } from './pages/parent/ParentDeposit';
import { ParentSettings } from './pages/parent/ParentSettings';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/kid-login" element={<KidLogin />} />

            <Route element={<KidLayout />}>
              <Route path="/kid" element={<KidDashboard />} />
              <Route path="/kid/goals" element={<KidGoals />} />
              <Route path="/kid/history" element={<KidHistory />} />
              <Route path="/kid/me" element={<KidMe />} />
            </Route>

            <Route element={<ParentLayout />}>
              <Route path="/parent" element={<ParentDashboard />} />
              <Route path="/parent/child/:id" element={<ChildDetail />} />
              <Route path="/parent/deposit" element={<ParentDeposit />} />
              <Route path="/parent/settings" element={<ParentSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
