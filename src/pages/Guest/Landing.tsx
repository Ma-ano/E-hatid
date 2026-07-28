import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { bicycleOutline, restaurantOutline, storefrontOutline, chevronForwardOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Landing: React.FC = () => {
  const history = useHistory();
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();

  if (isAuthenticated) {
    history.replace('/customer/home');
    return null;
  }

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-lg mx-auto w-full text-center">
        {/* Logo */}
        <img
          src={isDarkMode ? '/Logo/Logo-dark-mode.png' : '/Logo/Logo-light-mode.png'}
          alt="E-Hatid"
          className="h-16 sm:h-24 object-contain mb-6"
        />

        <p className="text-base sm:text-lg text-[var(--ion-text-color-secondary)] mb-8 max-w-sm">
          Your favorite food, delivered fast. Order from the best local restaurants near you.
        </p>

        {/* CTA Buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={() => history.push('/login')}
            className="w-full h-12 bg-[var(--ion-color-primary)] text-white font-semibold rounded-xl
                       transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex items-center justify-center gap-2">
              Sign In
              <IonIcon icon={chevronForwardOutline} className="text-lg" />
            </span>
          </button>

          <button
            onClick={() => history.push('/register')}
            className="w-full h-12 border-2 border-[var(--ion-border-color)] text-[var(--ion-text-color)] font-semibold rounded-xl
                       transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Create Account
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--ion-border-color)]" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-[var(--ion-text-color-secondary)] bg-[var(--ion-background-color)]">
                or
              </span>
            </div>
          </div>

          <button
            onClick={() => history.push('/guest/home')}
            className="w-full h-12 text-[var(--ion-color-primary)] font-semibold rounded-xl
                       transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Browse as Guest
          </button>
        </div>

        {/* Role icons row */}
        <div className="flex items-center gap-6 mt-12 text-[var(--ion-text-color-secondary)]">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-full bg-[var(--ion-color-light)] dark:bg-[#1E293B] flex items-center justify-center">
              <IonIcon icon={restaurantOutline} className="text-lg" />
            </div>
            <span className="text-xs">Eat</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-full bg-[var(--ion-color-light)] dark:bg-[#1E293B] flex items-center justify-center">
              <IonIcon icon={storefrontOutline} className="text-lg" />
            </div>
            <span className="text-xs">Sell</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-full bg-[var(--ion-color-light)] dark:bg-[#1E293B] flex items-center justify-center">
              <IonIcon icon={bicycleOutline} className="text-lg" />
            </div>
            <span className="text-xs">Deliver</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
