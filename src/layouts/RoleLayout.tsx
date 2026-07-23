import React from 'react';
import { IonContent } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AppFooter from '../components/AppFooter';

const noNavbarPaths = ['/login', '/register', '/role-selection', '/select-role', '/stall/', '/apply/vendor', '/apply/rider', '/admin/register'];

const showFooterForRoles = ['customer'];

const RoleLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const path = location.pathname;
  const showNavbar = !noNavbarPaths.some(p => path.startsWith(p));
  const showFooter = showFooterForRoles.some(r => path.startsWith(`/${r}/`));

  return (
    <>
      {showNavbar && <Navbar />}

      <IonContent>
        <div className="min-h-full flex flex-col">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex-1">
            {children}
          </div>
          {showFooter && <AppFooter />}
        </div>
      </IonContent>
    </>
  );
};

export default RoleLayout;