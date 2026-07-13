import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FullScreenLoader from './FullScreenLoader';

interface ProtectedRouteProps {
  path: string;
  exact?: boolean;
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: string;
}

const roleLoginPaths: Record<string, string> = {
  vendor: '/vendor/login',
  admin: '/admin/login',
  rider: '/rider/login',
  customer: '/login',
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  path,
  exact = false,
  children,
  requireAuth = true,
  requiredRole,
}) => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Route exact={exact} path={path}>
      {requireAuth && !user ? (
        <Redirect to={roleLoginPaths[requiredRole || ''] || '/login'} />
      ) : requiredRole && user?.role !== requiredRole ? (
        <Redirect to="/" />
      ) : !requireAuth && user ? (
        <Redirect to="/customer/home" />
      ) : (
        children
      )}
    </Route>
  );
};

export default ProtectedRoute;
