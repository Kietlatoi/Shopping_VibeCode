import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { ROLES } from '@/constants';

export function AdminRoute() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.roleId !== ROLES.ADMIN && user?.roleId !== ROLES.SUPER_ADMIN) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
