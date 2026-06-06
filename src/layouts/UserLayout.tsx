import React from 'react';
import { IonPage, IonContent } from '@ionic/react';

const UserLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <IonPage>{children}</IonPage>
);

export default UserLayout;