import React from 'react';
import { IonIcon } from '@ionic/react';
import { sunny, moon } from 'ionicons/icons';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`w-9 h-9 flex items-center justify-center rounded-lg text-[var(--ion-text-color-secondary)] hover:bg-[var(--tw-border-color)]/30 transition-colors ${className}`}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <IonIcon
        icon={isDarkMode ? sunny : moon}
        className={`text-lg transition-transform duration-200 ${isDarkMode ? 'text-[var(--ion-color-warning)]' : ''}`}
      />
    </button>
  );
};

export default ThemeToggle;
