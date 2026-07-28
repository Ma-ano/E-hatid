import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useTheme } from '../context/ThemeContext';

const DeliveryLoader: React.FC<{ message?: string }> = ({ message }) => {
  const { isDarkMode } = useTheme();

  return (
    <IonPage>
      <IonContent className="ion-content-center">
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
          <div className="delivery-bike-icon">
            <svg viewBox="0 0 64 64" className="w-20 h-20" fill="none">
              <circle cx="20" cy="44" r="8" stroke="var(--ion-color-primary)" strokeWidth="3" />
              <circle cx="20" cy="44" r="2" fill="var(--ion-color-primary)" />
              <circle cx="44" cy="44" r="8" stroke="var(--ion-color-primary)" strokeWidth="3" />
              <circle cx="44" cy="44" r="2" fill="var(--ion-color-primary)" />
              <line x1="28" y1="44" x2="36" y2="44" stroke="var(--ion-color-primary)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="20" y1="44" x2="32" y2="28" stroke="var(--ion-color-primary)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="44" y1="44" x2="32" y2="28" stroke="var(--ion-color-primary)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="32" y1="28" x2="44" y2="28" stroke="var(--ion-color-primary)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="32" y1="28" x2="32" y2="20" stroke="var(--ion-color-primary)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="28" y1="20" x2="36" y2="20" stroke="var(--ion-color-primary)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <img
            src={isDarkMode ? '/Logo/Logo-dark-mode.png' : '/Logo/Logo-light-mode.png'}
            alt="E-Hatid"
            className="h-10 sm:h-12 object-contain opacity-80"
          />

          <div className="flex items-center gap-1 mt-2">
            <span className="text-sm text-[var(--ion-text-color-secondary)]">
              {message || 'Getting things moving'}
            </span>
            <span className="loading-dots text-sm text-[var(--ion-text-color-secondary)]">...</span>
          </div>

          <div className="w-48 h-1 rounded-full bg-[var(--ion-border-color)] overflow-hidden mt-2">
            <div className="h-full rounded-full bg-[var(--ion-color-primary)] delivery-progress-bar" />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DeliveryLoader;
