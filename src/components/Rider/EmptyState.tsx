import React from 'react';
import { IonIcon } from '@ionic/react';

interface Props {
  icon: string;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<Props> = ({ icon, title, subtitle, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
    <IonIcon icon={icon} className="text-5xl mb-4 opacity-60" style={{ color: 'var(--ion-text-color-secondary)' }} />
    <p className="text-base font-bold text-[var(--ion-text-color)] m-0 mb-2">{title}</p>
    <p className="text-sm text-[var(--ion-text-color-secondary)] m-0 mb-5">{subtitle}</p>
    {action}
  </div>
);

export default EmptyState;
