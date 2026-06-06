import React from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { receiptOutline, bicycleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { useOrders } from '../../context/OrderContext';
import AppFooter from '../../components/AppFooter';

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: '#F59E0B' },
  accepted: { label: 'Accepted', color: '#6366F1' },
  preparing: { label: 'Preparing', color: '#3B82F6' },
  ready: { label: 'Ready', color: '#10B981' },
  delivered: { label: 'Delivered', color: '#6B7280' },
  cancelled: { label: 'Cancelled', color: '#EF4444' },
};

const UserOrders: React.FC = () => {
  const history = useHistory();
  const { orders } = useOrders();

  return (
    <IonPage>
      <PageHeader
        showLogo={true}
        showBackButton={true}
        backHref="/user/home"
        onProfileClick={() => history.push('/user/profile')}
      />

      <IonContent style={{ '--background': 'var(--ion-background-color)' } as any}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        <div className="page-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: '40px' }}>
          <div style={{ padding: '20px 0 16px 0' }}>
            <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
              My Orders
            </h2>
          </div>

          {orders.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', flex: 1, padding: '24px', textAlign: 'center',
            }}>
              <div style={{
                width: '120px', height: '120px', background: 'var(--ion-card-background)',
                border: '2px solid var(--ion-border-color)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px',
              }}>
                <IonIcon icon={receiptOutline} style={{ fontSize: '48px', color: '#6366F1' }} />
              </div>
              <h2 style={{ margin: '0 0 8px', fontWeight: 700, color: 'var(--ion-text-color)' }}>No orders yet</h2>
              <p style={{ margin: 0, color: 'var(--ion-text-color-secondary)' }}>Place an order to see it here!</p>
              <IonButton
                style={{ marginTop: '24px', '--background': '#6366F1', '--border-radius': '8px' }}
                onClick={() => history.push('/user/home')}
              >
                Browse Stalls
              </IonButton>
            </div>
          ) : (
            <div>
              {orders.map(order => {
                const status = statusConfig[order.status] || { label: order.status, color: '#6B7280' };
                return (
                  <div
                    key={order.id}
                    onClick={() => history.push('/user/order-tracking', { order })}
                    style={{
                      background: 'var(--ion-card-background)', padding: '16px',
                      borderRadius: '12px', border: '1px solid var(--ion-border-color)',
                      marginBottom: '12px', cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ion-text-color)' }}>
                        {order.id}
                      </span>
                      <span style={{
                        fontSize: '12px', fontWeight: 600, padding: '4px 10px',
                        borderRadius: '20px', background: `${status.color}20`, color: status.color,
                      }}>
                        {status.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: '0 0 2px', fontSize: '13px', color: 'var(--ion-text-color-secondary)' }}>
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          {order.stallName ? ` from ${order.stallName}` : ''}
                        </p>
                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--ion-text-color-secondary)' }}>
                          {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#6366F1' }}>
                        ₱{order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <AppFooter />
      </div>
      </IonContent>
    </IonPage>
  );
};

export default UserOrders;
