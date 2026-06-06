// src/components/ProtectedRoute.tsx
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  path: string;
  exact?: boolean;
  component: React.ComponentType<any>;
  requireAuth?: boolean;
  requiredRole?: string;
}

const roleLoginPaths: Record<string, string> = {
  vendor: '/vendor/login',
  admin: '/admin/login',
  rider: '/rider/login',
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  path, 
  exact = false, 
  component: Component, 
  requireAuth = true,
  requiredRole,
}) => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <IonPage>
        <IonContent className="ion-padding" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IonSpinner name="crescent" />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <Route exact={exact} path={path}>
      {requireAuth && !user ? (
        <Redirect to={roleLoginPaths[requiredRole || ''] || '/user/login'} />
      ) : requiredRole && user?.role !== requiredRole ? (
        <Redirect to="/" />
      ) : !requireAuth && user ? (
        <Redirect to="/user/home" />
      ) : (
        <Component />
      )}
    </Route>
  );
};

export default ProtectedRoute;
