// src/pages/Rider/Orders.tsx
import React, { useState } from 'react';
import {
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonButton,
} from '@ionic/react';
import { timeOutline, checkmarkCircleOutline, navigateOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

const RiderOrders: React.FC = () => {
  const history = useHistory();
  const { logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState('active');

  const activeOrders: any[] = [];
  const completedOrders: any[] = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'picking_up': return '#F59E0B';
      case 'delivering': return 'var(--ion-color-primary)';
      case 'delivered': return '#10B981';
      default: return '#9CA3AF';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'picking_up': return 'Picking Up';
      case 'delivering': return 'On Delivery';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  return (
    <>

        {/* Quick Access Menu */}
        <div style={{
          padding: '0 16px 16px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px'
        }}>
          <div 
            onClick={() => history.push('/activities')}
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #FF5A1F 0%, #FF7A3D 100%)',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'center',
              color: 'white'
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>📋</div>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: 600 }}>Activity</p>
          </div>
          <div 
            onClick={() => history.push('/messages')}
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'center',
              color: 'white'
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>💬</div>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: 600 }}>Messages</p>
          </div>
        </div>

        {/* Tab Segment */}
        <div style={{ padding: '16px' }}>
          <IonSegment 
            value={selectedTab} 
            onIonChange={e => setSelectedTab(e.detail.value as string)}
            style={{ '--background': 'transparent' }}
          >
            <IonSegmentButton 
              value="active"
              style={{ 
                '--color-checked': '#FFFFFF',
                '--border-radius': '8px',
                '--indicator-color': 'transparent'
              }}
            >
              <IonLabel>Active</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton 
              value="completed"
              style={{ 
                '--color-checked': '#FFFFFF',
                '--border-radius': '8px',
                '--indicator-color': 'transparent'
              }}
            >
              <IonLabel>Completed</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        {/* Active Orders */}
        {selectedTab === 'active' && (
          <div style={{ padding: '0 16px 16px' }}>
            {activeOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div className="text-4xl mb-3">📦</div>
                <p style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700, color: 'var(--ion-text-color)' }}>You don't have any active deliveries</p>
                <p style={{ margin: 0, color: 'var(--ion-text-color-secondary)', fontSize: '14px' }}>New orders will appear here</p>
              </div>
            ) : (
              activeOrders.map(order => (
                <IonCard key={order.id} style={{ margin: '0 0 12px', background: 'var(--ion-card-background)' }}>
                  <IonCardContent>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
                          {order.stallName}
                        </h3>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--ion-text-color-secondary)' }}>
                          {order.customerName}
                        </p>
                      </div>
                      <IonBadge style={{ '--background': getStatusColor(order.status), color: 'white' }}>
                        {getStatusLabel(order.status)}
                      </IonBadge>
                    </div>

                    <div style={{ padding: '12px', background: 'var(--ion-background-color)', borderRadius: '8px', marginBottom: '12px', fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--ion-text-color-secondary)' }}>
                        <IonIcon icon={timeOutline} style={{ fontSize: '16px' }} />
                        Estimated: {order.estimatedTime}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ion-text-color-secondary)' }}>
                        <IonIcon icon={navigateOutline} style={{ fontSize: '16px' }} />
                        {order.deliveryAddress}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <IonButton 
                        expand="block"
                        fill="outline"
                        style={{ '--border-color': 'var(--ion-color-primary)', '--color': 'var(--ion-color-primary)', margin: 0 }}
                      >
                        Call
                      </IonButton>
                      <IonButton 
                        expand="block"
                        style={{ '--background': 'var(--ion-color-primary)', margin: 0 }}
                        onClick={() => history.push(`/rider/tracking/${order.id}`)}
                      >
                        Track
                      </IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))
            )}
          </div>
        )}

        {/* Completed Orders */}
        {selectedTab === 'completed' && (
          <div style={{ padding: '0 16px 16px' }}>
            {completedOrders.map(order => (
              <IonCard key={order.id} style={{ margin: '0 0 12px', background: 'var(--ion-card-background)' }}>
                <IonCardContent>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
                        {order.stallName}
                      </h3>
                      <p style={{ margin: 0, fontSize: '14px', color: 'var(--ion-text-color-secondary)' }}>
                        {order.customerName}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <IonBadge style={{ '--background': '#10B981', color: 'white', marginRight: '8px' }}>
                        ✓ Delivered
                      </IonBadge>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>
                        {order.completedAt}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--ion-background-color)', borderRadius: '8px' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>Customer Rating</p>
                      <p style={{ margin: '4px 0 0', fontSize: '16px', color: 'var(--ion-text-color)', fontWeight: 700 }}>
                        ★ {order.rating}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>Earned</p>
                      <p style={{ margin: '4px 0 0', fontSize: '16px', color: 'var(--ion-color-primary)', fontWeight: 700 }}>
                        ₱{order.fee}
                      </p>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}
    </>
  );
};

export default RiderOrders;
