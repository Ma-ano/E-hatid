import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverable = false }) => (
  <div
    onClick={onClick}
    className={`rounded-2xl bg-[var(--tw-card-background)] border border-[var(--tw-card-border)] p-4 md:p-6
      ${hoverable ? 'transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer' : ''}
      ${onClick ? 'cursor-pointer' : ''}
      ${className}`}
  >
    {children}
  </div>
);

export default Card;
