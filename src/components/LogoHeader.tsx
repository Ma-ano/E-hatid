// src/components/LogoHeader.tsx
import React from 'react';

interface LogoHeaderProps {
  onClick?: () => void;
}

const LogoHeader: React.FC<LogoHeaderProps> = ({ onClick }) => {
  return (
    <div
      className="flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-4 sm:py-6 md:py-8 cursor-pointer transition-opacity hover:opacity-80"
      onClick={onClick}
    >
      <span className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-[var(--ion-color-primary)]">
        Logo
      </span>
      <span className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-[var(--ion-text-color)]">
        Tag
      </span>
    </div>
  );
};

export default LogoHeader;