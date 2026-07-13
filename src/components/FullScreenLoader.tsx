import React from 'react';
import { IonPage, IonContent, IonSpinner } from '@ionic/react';

const FullScreenLoader: React.FC = () => (
  <IonPage>
    <IonContent className="ion-content-center">
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
        <div className="w-16 h-16 rounded-2xl bg-[var(--ion-color-primary)]/10 flex items-center justify-center">
          <IonSpinner name="crescent" className="text-[var(--ion-color-primary)] text-2xl" />
        </div>
        <p className="text-sm text-[var(--ion-text-color-secondary)]">Loading...</p>
      </div>
    </IonContent>
  </IonPage>
);

export default FullScreenLoader;
