import React from 'react';
import { IonCard, IonCardContent, IonIcon } from '@ionic/react';

interface AdminStatCardProps {
  icon: string;
  label: string;
  value: string;
  gradient: string;
  onClick?: () => void;
}

const AdminStatCard: React.FC<AdminStatCardProps> = ({ icon, label, value, gradient, onClick }) => (
  <IonCard
    style={{ margin: 0, background: gradient, cursor: onClick ? 'pointer' : 'default' }}
    onClick={onClick}
  >
    <IonCardContent style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{
          width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <IonIcon icon={icon} style={{ fontSize: '20px', color: 'white' }} />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{label}</p>
          <h4 style={{ margin: '4px 0 0', color: 'white', fontWeight: 700, fontSize: '20px' }}>{value}</h4>
        </div>
      </div>
    </IonCardContent>
  </IonCard>
);

export default AdminStatCard;
