import React from 'react';
import { IonPage, IonContent } from '@ionic/react';

const RiderLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <IonPage>
    <IonContent>
      <div className="min-h-full flex flex-col">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </IonContent>
  </IonPage>
);

export default RiderLayout;
