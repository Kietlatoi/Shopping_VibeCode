import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { ROLES } from '@/constants';

export function SellerRoute() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.roleId !== ROLES.SELLER) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
