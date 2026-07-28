import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const variantStyles: Record<string, string> = {
  success: 'bg-[var(--ion-color-success)]/10 text-[var(--ion-color-success)] border-[var(--ion-color-success)]/20',
  warning: 'bg-[var(--ion-color-warning)]/10 text-[var(--ion-color-warning)] border-[var(--ion-color-warning)]/20',
  error: 'bg-[var(--ion-color-danger)]/10 text-[var(--ion-color-danger)] border-[var(--ion-color-danger)]/20',
  info: 'bg-[var(--ion-color-primary)]/10 text-[var(--ion-color-primary)] border-[var(--ion-color-primary)]/20',
};

const Badge: React.FC<BadgeProps> = ({ children, variant = 'info', className = '' }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border ${variantStyles[variant]} ${className}`}
  >
    {children}
  </span>
);

export default Badge;
