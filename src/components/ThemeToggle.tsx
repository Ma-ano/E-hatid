import React from 'react';
import { IonIcon } from '@ionic/react';
import { sunny, moon } from 'ionicons/icons';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--tw-card-background)] hover:bg-[var(--tw-light)] shadow-lg border border-[var(--tw-border-color)] transition-all duration-300 flex items-center justify-center group"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <IonIcon
        icon={isDarkMode ? sunny : moon}
        className={`text-lg sm:text-xl transition-transform duration-300 group-hover:scale-110 ${isDarkMode ? 'text-[var(--ion-color-warning)]' : 'text-[var(--ion-color-primary)]'}`}
      />
    </button>
  );
};

export default ThemeToggle;
