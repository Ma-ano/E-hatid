import React from 'react';
import { IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { menuOutline } from 'ionicons/icons';

const RiderNavBar: React.FC = () => (
  <IonToolbar style={{ '--background': 'var(--ion-card-background)' } as any}>
    <div className="flex items-center w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <IonButtons slot="start" className="lg:hidden">
        <IonButton className="min-w-[44px] min-h-[44px]">
          <IonIcon icon={menuOutline} className="text-xl text-[var(--ion-text-color)]" />
        </IonButton>
      </IonButtons>
      <IonTitle className="text-base sm:text-lg font-bold text-center lg:text-left">Rider</IonTitle>
    </div>
  </IonToolbar>
);

export default RiderNavBar;