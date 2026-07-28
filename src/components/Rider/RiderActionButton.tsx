import React from 'react';
import { IonButton, IonIcon, IonSpinner } from '@ionic/react';

interface Props {
  variant: 'accept' | 'decline' | 'primary' | 'ghost';
  children: React.ReactNode;
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  expand?: 'block';
  onClick?: (e: React.MouseEvent) => void;
}

const variantStyles: Record<string, React.CSSProperties> = {
  accept: { '--background': '#10B981', '--border-radius': '12px' } as React.CSSProperties,
  decline: { '--background': 'transparent', '--border-color': '#EF4444', '--color': '#EF4444', '--border-radius': '12px' } as React.CSSProperties,
  primary: { '--background': 'var(--ion-color-primary)', '--border-radius': '12px' } as React.CSSProperties,
  ghost: { '--background': 'transparent', '--border-color': 'var(--ion-border-color)', '--color': 'var(--ion-text-color)', '--border-radius': '12px' } as React.CSSProperties,
};

const RiderActionButton: React.FC<Props> = ({ variant, children, icon, loading, disabled, className, expand, onClick }) => (
  <IonButton
    expand={expand}
    fill={variant === 'decline' || variant === 'ghost' ? 'outline' : 'solid'}
    disabled={disabled || loading}
    className={`min-h-[44px] text-sm font-semibold ${className || ''}`}
    style={variantStyles[variant]}
    onClick={onClick}
  >
    {loading ? (
      <IonSpinner name="crescent" />
    ) : icon ? (
      <IonIcon icon={icon} slot="start" />
    ) : null}
    {loading ? 'Loading...' : children}
  </IonButton>
);

export default RiderActionButton;
