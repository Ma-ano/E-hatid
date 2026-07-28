import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-[var(--ion-color-primary)] text-white hover:bg-[var(--ion-color-primary-tint)] active:bg-[var(--ion-color-primary)]',
  secondary:
    'bg-[var(--ion-color-light)] text-[var(--ion-text-color)] hover:bg-[var(--ion-border-color)] active:bg-[var(--ion-color-light)]',
  ghost:
    'bg-transparent text-[var(--ion-color-primary)] hover:bg-[var(--ion-color-primary)]/10 active:bg-transparent',
  danger:
    'bg-[var(--ion-color-danger)] text-white hover:opacity-90 active:opacity-100',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false,
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl min-h-[44px]
      transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
      ${variantStyles[variant]} ${sizeStyles[size]}
      ${fullWidth ? 'w-full' : ''}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      ${className}`}
  >
    {children}
  </button>
);

export default Button;
