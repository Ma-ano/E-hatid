// src/components/Stall/StallCard.tsx
import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonBadge, IonIcon } from '@ionic/react';
import { star, timeOutline, bicycleOutline } from 'ionicons/icons';
import { Stall } from '../../types';

interface StallCardProps {
  stall: Stall;
  onClick?: () => void;
}

const StallCard: React.FC<StallCardProps> = ({ stall, onClick }) => {
  return (
    <IonCard 
      className="rider-card stall-card" 
      onClick={onClick}
      style={{ margin: '0 0 16px 0', cursor: onClick ? 'pointer' : 'default' }}
    >
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
        <img 
          src={stall.image} 
          alt={stall.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <IonBadge 
          color="light" 
          style={{ 
            position: 'absolute', 
            top: '12px', 
            right: '12px',
            padding: '8px 12px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: 600
          }}
        >
          <IonIcon icon={star} color="warning" style={{ fontSize: '14px' }} />
          {stall.rating}
        </IonBadge>
      </div>
      
      <IonCardHeader style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <IonCardTitle style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ion-text-color)', margin: 0 }}>
            {stall.name}
          </IonCardTitle>
          <IonBadge color="light" style={{ color: '#6366F1', fontWeight: 600 }}>
            {stall.cuisine}
          </IonBadge>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', color: '#6B7280', fontSize: '14px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <IonIcon icon={timeOutline} />
            {stall.deliveryTime}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <IonIcon icon={bicycleOutline} />
            ₱{stall.deliveryFee.toFixed(2)}
          </span>
        </div>
      </IonCardHeader>
    </IonCard>
  );
};

export default StallCard;