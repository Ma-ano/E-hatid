// src/components/LogoHeader.tsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface LogoHeaderProps {
  onClick?: () => void;
}

const LogoHeader: React.FC<LogoHeaderProps> = ({ onClick }) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className="flex items-center justify-center px-3 sm:px-4 py-4 sm:py-6 md:py-8 cursor-pointer transition-opacity hover:opacity-80"
      onClick={onClick}
    >
      <img
        src={isDarkMode ? '/Logo/E-hatid-dark-mode.png' : '/Logo/E-hatid-light-mode.png'}
        alt="E-Hatid"
        className="h-10 sm:h-12 object-contain"
      />
    </div>
  );
};

export default LogoHeader;