// src/pages/Rider/Home.tsx
import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonToggle,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { mapOutline, cashOutline, checkmarkCircleOutline, timeOutline, navigateOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';
import AppFooter from '../../components/AppFooter';

const RiderHome: React.FC = () => {
  const history = useHistory();
  const { logout } = useAuth();
  const [isAvailable, setIsAvailable] = useState(false);
  const [earnings, setEarnings] = useState(450.50);
  const [completedDeliveries, setCompletedDeliveries] = useState(12);
  const [rating, setRating] = useState(4.8);

  // Mock available orders
  const availableOrders = [
    {
      id: '1',
      stallName: 'Burger King',
      customerName: 'John Doe',
      distance: '2.3 km',
      fee: 45,
      pickupLocation: 'BGC, Taguig',
      deliveryLocation: 'Fort Bonifacio, Taguig',
    },
    {
      id: '2',
      stallName: 'Sushi Master',
      customerName: 'Jane Smith',
      distance: '1.8 km',
      fee: 38,
      pickupLocation: 'Makati, Manila',
      deliveryLocation: 'Paseo de Santa Rosa, Manila',
    },
    {
      id: '3',
      stallName: 'Pizza Palace',
      customerName: 'Mike Johnson',
      distance: '3.1 km',
      fee: 52,
      pickupLocation: 'Quezon City',
      deliveryLocation: 'San Juan, Metro Manila',
    },
  ];

  return (
    <IonPage>
      <PageHeader 
        showLogo={true}
        onProfileClick={() => {
          logout();
          history.push('/user/login');
        }}
      />

      <IonContent style={{ '--background': 'var(--ion-background-color)' } as any}>
        {/* Rider Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '8px',
          padding: '16px',
          overflowX: 'auto',
          background: 'var(--ion-card-background)',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px'
        }}>
          <IonButton
            expand="block"
            style={{
              '--background': '#6366F1',
              '--color': '#FFFFFF',
              height: '40px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'none',
              flex: '1',
              minWidth: '80px'
            }}
          >
            🏠 Home
          </IonButton>
          <IonButton
            expand="block"
            style={{
              '--background': 'transparent',
              '--color': 'var(--ion-text-color)',
              height: '40px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'none',
              flex: '1',
              minWidth: '80px'
            }}
            onClick={() => history.push('/rider/orders')}
          >
            📦 Orders
          </IonButton>
          <IonButton
            expand="block"
            style={{
              '--background': 'transparent',
              '--color': 'var(--ion-text-color)',
              height: '40px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'none',
              flex: '1',
              minWidth: '80px'
            }}
            onClick={() => history.push('/rider/earnings')}
          >
            💰 Earnings
          </IonButton>
          <IonButton
            expand="block"
            style={{
              '--background': 'transparent',
              '--color': 'var(--ion-text-color)',
              height: '40px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'none',
              flex: '1',
              minWidth: '80px'
            }}
            onClick={() => history.push('/rider/profile')}
          >
            👤 Profile
          </IonButton>
        </div>

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
              background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
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

        {/* Status Toggle */}
        <div style={{ padding: '16px' }}>
          <IonCard style={{ margin: 0, background: 'var(--ion-card-background)' }}>
            <IonCardContent>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--ion-text-color)', fontWeight: 700 }}>
                    {isAvailable ? 'Online' : 'Offline'}
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>
                    {isAvailable ? 'Ready to accept orders' : 'Tap to go online'}
                  </p>
                </div>
                <IonToggle 
                  checked={isAvailable} 
                  onIonChange={(e) => setIsAvailable(e.detail.checked)}
                  style={{ '--background-checked': '#6366F1' }}
                />
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Quick Stats */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Today's Earnings */}
            <IonCard style={{ margin: 0, background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)' }}>
              <IonCardContent style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'rgba(255,255,255,0.2)', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IonIcon icon={cashOutline} style={{ fontSize: '20px', color: 'white' }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>Today's Earnings</p>
                    <h4 style={{ margin: '4px 0 0', color: 'white', fontWeight: 700 }}>₱{earnings.toFixed(2)}</h4>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            {/* Completed Deliveries */}
            <IonCard style={{ margin: 0, background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)' }}>
              <IonCardContent style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'rgba(255,255,255,0.2)', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '20px', color: 'white' }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>Completed Today</p>
                    <h4 style={{ margin: '4px 0 0', color: 'white', fontWeight: 700 }}>{completedDeliveries}</h4>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        </div>

        {/* Rating */}
        <div style={{ padding: '0 16px 16px' }}>
          <IonCard style={{ margin: 0, background: 'var(--ion-card-background)' }}>
            <IonCardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--ion-text-color-secondary)' }}>Current Rating</p>
                  <h3 style={{ margin: '4px 0 0', color: 'var(--ion-text-color)', fontWeight: 700 }}>★ {rating}</h3>
                </div>
                <IonBadge color="light" style={{ fontSize: '14px', padding: '8px 12px' }}>Excellent</IonBadge>
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Available Orders */}
        {isAvailable && (
          <>
            <div style={{ padding: '16px 16px 8px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
                Available Orders
              </h2>
            </div>

            <div style={{ padding: '0 16px 16px' }}>
              {availableOrders.map(order => (
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
                      <IonBadge color="light" style={{ '--background': '#6366F1', color: 'white', fontWeight: 700 }}>
                        ₱{order.fee}
                      </IonBadge>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', fontSize: '14px', color: 'var(--ion-text-color-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <IonIcon icon={mapOutline} style={{ fontSize: '16px' }} />
                        {order.distance}
                      </span>
                    </div>

                    <div style={{ padding: '12px', background: 'var(--ion-background-color)', borderRadius: '8px', marginBottom: '12px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <IonIcon icon={navigateOutline} style={{ fontSize: '14px', color: '#6366F1' }} />
                        <div>
                          <p style={{ margin: 0, color: 'var(--ion-text-color-secondary)' }}>From:</p>
                          <p style={{ margin: 0, color: 'var(--ion-text-color)', fontWeight: 600 }}>{order.pickupLocation}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <IonIcon icon={navigateOutline} style={{ fontSize: '14px', color: '#10B981' }} />
                        <div>
                          <p style={{ margin: 0, color: 'var(--ion-text-color-secondary)' }}>To:</p>
                          <p style={{ margin: 0, color: 'var(--ion-text-color)', fontWeight: 600 }}>{order.deliveryLocation}</p>
                        </div>
                      </div>
                    </div>

                    <IonButton 
                      expand="block"
                      style={{ '--background': '#6366F1', margin: 0 }}
                      onClick={() => history.push(`/rider/orders/${order.id}`)}
                    >
                      Accept Order
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          </>
        )}

        {!isAvailable && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '40px 20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔴</div>
            <p style={{ color: 'var(--ion-text-color)', fontWeight: 700, fontSize: '16px' }}>You're currently offline</p>
            <p style={{ color: 'var(--ion-text-color-secondary)', fontSize: '14px', marginBottom: '20px' }}>
              Toggle above to go online and start accepting orders
            </p>
          </div>
        )}
      <AppFooter />
      </IonContent>
    </IonPage>
  );
};

export default RiderHome;
