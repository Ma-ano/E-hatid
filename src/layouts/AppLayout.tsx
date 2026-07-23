import React from 'react';
import { IonPage } from '@ionic/react';

const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <IonPage>
    {children}
  </IonPage>
);

export default AppLayout;
