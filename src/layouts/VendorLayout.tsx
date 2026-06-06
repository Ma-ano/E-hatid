import React from 'react';
import { IonPage, IonContent } from '@ionic/react';

const VendorLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <IonPage>
    <IonContent>{children}</IonContent>
  </IonPage>
);

export default VendorLayout;
