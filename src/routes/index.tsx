import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import { AuthLayout } from '@/layouts/auth-layout';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { Dashboard } from '@/pages/dashboard';
import { Login } from '@/pages/login';
import { Register } from '@/pages/register';

function AppRouter() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/" />}
          />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route
            path="/"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export { AppRouter as Router };