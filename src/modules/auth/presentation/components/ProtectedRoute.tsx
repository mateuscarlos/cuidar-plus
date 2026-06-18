import { Navigate, Outlet } from 'react-router-dom';
import { AuthService } from '../../data/auth.service';
import { ROUTES } from '@/core/constants/routes';

export function ProtectedRoute() {
  if (!AuthService.isAuthenticated()) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }
  return <Outlet />;
}
