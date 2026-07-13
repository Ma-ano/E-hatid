import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const variantStyles: Record<string, string> = {
  success: 'bg-[var(--tw-success)]/10 text-[var(--tw-success)] border-[var(--tw-success)]/20',
  warning: 'bg-[var(--tw-warning)]/10 text-[var(--tw-warning)] border-[var(--tw-warning)]/20',
  error: 'bg-[var(--tw-danger)]/10 text-[var(--tw-danger)] border-[var(--tw-danger)]/20',
  info: 'bg-[var(--tw-primary)]/10 text-[var(--tw-primary)] border-[var(--tw-primary)]/20',
};

const Badge: React.FC<BadgeProps> = ({ children, variant = 'info', className = '' }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border ${variantStyles[variant]} ${className}`}
  >
    {children}
  </span>
);

export default Badge;
