// src/pages/Rider/Orders.tsx
import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
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
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';
import AppFooter from '../../components/AppFooter';

const RiderOrders: React.FC = () => {
  const history = useHistory();
  const { logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState('active');

  const activeOrders = [
    {
      id: '1',
      stallName: 'Burger King',
      customerName: 'John Doe',
      status: 'picking_up',
      distance: '2.3 km',
      fee: 45,
      estimatedTime: '12 min',
      deliveryAddress: 'Fort Bonifacio, Taguig',
    },
    {
      id: '2',
      stallName: 'Sushi Master',
      customerName: 'Jane Smith',
      status: 'delivering',
      distance: '1.8 km',
      fee: 38,
      estimatedTime: '8 min',
      deliveryAddress: 'Paseo de Santa Rosa, Manila',
    },
  ];

  const completedOrders = [
    {
      id: '3',
      stallName: 'Pizza Palace',
      customerName: 'Mike Johnson',
      status: 'delivered',
      fee: 52,
      completedAt: '2:30 PM',
      rating: 5,
    },
    {
      id: '4',
      stallName: 'Chicken Fried Shop',
      customerName: 'Sarah Lee',
      status: 'delivered',
      fee: 40,
      completedAt: '1:15 PM',
      rating: 4.5,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'picking_up': return '#F59E0B';
      case 'delivering': return '#6366F1';
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
              '--background': 'transparent',
              '--color': 'var(--ion-text-color)',
              border: '1px solid #6366F1',
              height: '40px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'none',
              flex: '1',
              minWidth: '80px'
            }}
            onClick={() => history.push('/rider/home')}
          >
            🏠 Home
          </IonButton>
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
                <p style={{ color: 'var(--ion-text-color-secondary)' }}>No active orders</p>
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
                        style={{ '--border-color': '#6366F1', '--color': '#6366F1', margin: 0 }}
                      >
                        Call
                      </IonButton>
                      <IonButton 
                        expand="block"
                        style={{ '--background': '#6366F1', margin: 0 }}
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
                      <p style={{ margin: '4px 0 0', fontSize: '16px', color: '#6366F1', fontWeight: 700 }}>
                        ₱{order.fee}
                      </p>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}
      <AppFooter />
      </IonContent>
    </IonPage>
  );
};

export default RiderOrders;
