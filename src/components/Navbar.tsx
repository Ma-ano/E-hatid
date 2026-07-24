import React from 'react';
import { IonIcon, IonBadge } from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { logOutOutline, arrowBackOutline, sunny, moon } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { navItemsByRole } from '../config/routesByRole';
import RoleSwitcher from './RoleSwitcher';

interface NavbarProps {
  title?: string;
  showBack?: boolean;
  backHref?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title, showBack, backHref }) => {
  const history = useHistory();
  const location = useLocation();
  const { user, activeRole, logout } = useAuth();
  const { itemCount } = useCart();
  const { isDarkMode, toggleTheme } = useTheme();

  const isGuest = !user;
  const links = isGuest ? [] : (navItemsByRole[activeRole || ''] || []);
  const cartCount = itemCount;

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop header */}
      <header className="hidden md:block sticky top-0 z-50 bg-[var(--ion-card-background)] border-b border-[var(--tw-border-color)]">
        <div className="flex items-center w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-16">
          <div className="flex items-center gap-2 shrink-0">
            {showBack && (
              <button onClick={() => history.push(backHref || '/')} className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--ion-color-primary)] hover:bg-[var(--tw-border-color)]/30 transition-colors -ml-1">
                <IonIcon icon={arrowBackOutline} className="text-lg" />
              </button>
            )}
            <img
              src={isDarkMode ? '/Logo/E-hatid-dark-mode.png' : '/Logo/E-hatid-light-mode.png'}
              alt="E-Hatid"
              className="h-8 object-contain"
            />
          </div>

          {!isGuest && (
            <div className="flex items-center justify-center flex-1 gap-1">
              {links.map(link => (
                <button
                  key={link.path}
                  onClick={() => history.push(link.path)}
                  className="flex flex-1 items-center justify-center min-h-[36px]"
                >
                  <div className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive(link.path)
                      ? 'bg-[var(--ion-color-primary)] text-white'
                      : 'text-[var(--ion-text-color-secondary)] hover:bg-[var(--tw-border-color)]/30'
                  }`}>
                    <IonIcon icon={isActive(link.path) ? link.activeIcon : link.icon} className="text-base shrink-0" />
                    <span>{link.label}</span>
                    {link.badge === 'cart' && cartCount > 0 && (
                      <IonBadge className="cart-badge text-[10px] min-w-[18px] h-[18px]">{cartCount > 99 ? '99+' : cartCount}</IonBadge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--ion-text-color-secondary)] hover:bg-[var(--tw-border-color)]/30 transition-colors"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <IonIcon icon={isDarkMode ? sunny : moon} className={`text-lg transition-transform duration-200 ${isDarkMode ? 'text-[var(--ion-color-warning)]' : ''}`} />
            </button>
            <RoleSwitcher />
            {isGuest ? (
              <button onClick={() => history.push('/login')} className="h-9 px-4 rounded-lg bg-[var(--ion-color-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                Log In
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                aria-label="Logout"
              >
                <IonIcon icon={logOutOutline} className="text-lg" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      {!isGuest && links.length > 0 && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--ion-card-background)] border-t border-[var(--tw-border-color)] safe-area-bottom shadow-lg">
          <div className="flex items-center justify-around h-16 px-2">
            {links.map(link => {
              const active = isActive(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => history.push(link.path)}
                  className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] rounded-full transition-all duration-200 ${
                    active ? 'bg-[var(--ion-color-primary)] px-3 py-1.5' : ''
                  }`}
                >
                  <div className={`relative transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
                    <IonIcon
                      icon={active ? link.activeIcon : link.icon}
                      className={`text-xl ${active ? 'text-white' : 'text-[var(--ion-text-color-secondary)]'}`}
                    />
                    {link.badge === 'cart' && cartCount > 0 && (
                      <IonBadge className="cart-badge absolute -top-1.5 -right-1.5 text-[9px] min-w-[16px] h-[16px] flex items-center justify-center">
                        {cartCount > 99 ? '99+' : cartCount}
                      </IonBadge>
                    )}
                  </div>
                  <span className={`text-xs font-medium leading-tight ${
                    active ? 'text-white font-semibold' : 'text-[var(--ion-text-color-secondary)]'
                  }`}>
                    {link.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
