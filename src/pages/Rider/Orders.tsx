import React, { useState, useEffect } from 'react';
import {
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonButton,
  IonSpinner,
  IonToast,
} from '@ionic/react';
import { timeOutline, navigateOutline, checkmarkCircleOutline, cashOutline, personOutline, storefrontOutline } from 'ionicons/icons';
import { useAuth } from '../../context/AuthContext';
import { subscribeAvailableOrders, subscribeRiderOrders, updateOrderStatus } from '../../services/orderService';
import type { Order } from '../../types';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  ready: { label: 'Ready', color: '#F59E0B' },
  delivering: { label: 'Delivering', color: 'var(--ion-color-primary)' },
  delivered: { label: 'Delivered', color: '#10B981' },
};

const RiderOrders: React.FC = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('available');
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [riderOrders, setRiderOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [deliveringId, setDeliveringId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const unsubAvailable = subscribeAvailableOrders(orders => {
      setAvailableOrders(orders);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error('Failed to fetch available orders:', err);
      setError('Could not load available orders. Check permissions.');
      setLoading(false);
    });
    return () => unsubAvailable();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubRider = subscribeRiderOrders(user.id, orders => {
      setRiderOrders(orders);
    });
    return () => unsubRider();
  }, [user]);

  const activeOrders = riderOrders.filter(o => o.status === 'delivering');
  const completedOrders = riderOrders.filter(o => o.status === 'delivered');

  const handleAccept = async (order: Order) => {
    if (!user) return;
    setClaimingId(order.id);
    try {
      await updateOrderStatus(order.id, { status: 'delivering', riderId: user.id });
      setToastMessage('Order accepted');
      setShowToast(true);
    } catch (err) {
      console.error('Failed to accept order:', err);
      setToastMessage('Failed to accept order');
      setShowToast(true);
    } finally {
      setClaimingId(null);
    }
  };

  const handleDelivered = async (order: Order) => {
    setDeliveringId(order.id);
    try {
      await updateOrderStatus(order.id, { status: 'delivered', completedAt: new Date() });
      setToastMessage('Order marked as delivered');
      setShowToast(true);
    } catch (err) {
      console.error('Failed to mark delivered:', err);
      setToastMessage('Failed to mark delivered');
      setShowToast(true);
    } finally {
      setDeliveringId(null);
    }
  };

  const renderOrderCard = (order: Order, actions?: React.ReactNode) => {
    const config = STATUS_CONFIG[order.status] || { label: order.status, color: '#9CA3AF' };
    return (
      <IonCard key={order.id} style={{ margin: '0 0 12px', background: 'var(--ion-card-background)', borderRadius: '12px' }}>
        <IonCardContent style={{ padding: '14px' }}>
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0 mr-3">
              <h3 className="m-0 mb-0.5 text-base font-bold text-[var(--ion-text-color)] truncate">
                <IonIcon icon={storefrontOutline} className="mr-1.5 align-middle" />
                {order.stallName || 'Stall'}
              </h3>
              <p className="m-0 text-sm text-[var(--ion-text-color-secondary)]">
                <IonIcon icon={personOutline} className="mr-1 align-middle" />
                {order.customerName || 'Customer'}
              </p>
            </div>
            <IonBadge style={{ '--background': config.color, color: 'white', fontSize: '11px', padding: '4px 10px', borderRadius: '20px' }}>
              {config.label}
            </IonBadge>
          </div>

          <div className="p-3 rounded-lg bg-[var(--ion-background-color)] mb-3 text-xs">
            <div className="flex items-center gap-2 mb-1.5 text-[var(--ion-text-color-secondary)]">
              <IonIcon icon={timeOutline} className="text-sm" />
              <span>{order.items?.length || 0} item(s)</span>
              <span className="font-bold text-[var(--ion-color-primary)]">₱{order.total?.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--ion-text-color-secondary)]">
              <IonIcon icon={navigateOutline} className="text-sm" />
              <span className="truncate">{order.deliveryAddress || 'No address'}</span>
            </div>
          </div>

          {actions}
        </IonCardContent>
      </IonCard>
    );
  };

  const renderTabButtons = () => (
    <div className="px-4 pb-1">
      <IonSegment
        value={selectedTab}
        onIonChange={e => setSelectedTab(e.detail.value as string)}
        style={{ '--background': 'transparent' }}
      >
        <IonSegmentButton value="available" style={{ '--color-checked': '#FFFFFF', '--border-radius': '8px', '--indicator-color': 'transparent' }}>
          <IonLabel>Available</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="active" style={{ '--color-checked': '#FFFFFF', '--border-radius': '8px', '--indicator-color': 'transparent' }}>
          <IonLabel>Active</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="completed" style={{ '--color-checked': '#FFFFFF', '--border-radius': '8px', '--indicator-color': 'transparent' }}>
          <IonLabel>Completed</IonLabel>
        </IonSegmentButton>
      </IonSegment>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <IonSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="text-5xl mb-4 opacity-60">⚠️</div>
        <p className="m-0 mb-1 text-base font-bold text-[var(--ion-text-color)]">{error}</p>
        <p className="m-0 text-sm text-[var(--ion-text-color-secondary)]">Check the console for details</p>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 pt-5 pb-2">
        <h2 className="m-0 text-[28px] font-bold text-[var(--ion-text-color)]">Orders</h2>
      </div>

      {renderTabButtons()}

      {/* Available */}
      {selectedTab === 'available' && (
        <div className="px-4 pb-4">
          {availableOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4 opacity-60">📦</div>
              <p className="m-0 mb-1 text-base font-bold text-[var(--ion-text-color)]">No available orders</p>
              <p className="m-0 text-sm text-[var(--ion-text-color-secondary)]">Waiting for vendors to mark orders as ready</p>
            </div>
          ) : (
            availableOrders.map(order => renderOrderCard(
              order,
              <IonButton
                expand="block"
                style={{ '--background': '#10B981', '--border-radius': '8px', margin: 0 }}
                onClick={() => handleAccept(order)}
                disabled={claimingId === order.id}
              >
                {claimingId === order.id ? <IonSpinner name="crescent" /> : <IonIcon icon={checkmarkCircleOutline} slot="start" />}
                {claimingId === order.id ? 'Accepting...' : 'Accept'}
              </IonButton>
            ))
          )}
        </div>
      )}

      {/* Active */}
      {selectedTab === 'active' && (
        <div className="px-4 pb-4">
          {activeOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4 opacity-60">🛵</div>
              <p className="m-0 mb-1 text-base font-bold text-[var(--ion-text-color)]">No active deliveries</p>
              <p className="m-0 text-sm text-[var(--ion-text-color-secondary)]">Accept an available order to start delivering</p>
            </div>
          ) : (
            activeOrders.map(order => renderOrderCard(
              order,
              <IonButton
                expand="block"
                style={{ '--background': 'var(--ion-color-primary)', '--border-radius': '8px', margin: 0 }}
                onClick={() => handleDelivered(order)}
                disabled={deliveringId === order.id}
              >
                {deliveringId === order.id ? <IonSpinner name="crescent" /> : <IonIcon icon={checkmarkCircleOutline} slot="start" />}
                {deliveringId === order.id ? 'Marking...' : 'Mark Delivered'}
              </IonButton>
            ))
          )}
        </div>
      )}

      {/* Completed */}
      {selectedTab === 'completed' && (
        <div className="px-4 pb-4">
          {completedOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4 opacity-60">🏁</div>
              <p className="m-0 mb-1 text-base font-bold text-[var(--ion-text-color)]">No completed deliveries</p>
              <p className="m-0 text-sm text-[var(--ion-text-color-secondary)]">Your delivery history will appear here</p>
            </div>
          ) : (
            completedOrders.map(order => renderOrderCard(
              order,
              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--ion-background-color)]">
                <span className="text-xs text-[var(--ion-text-color-secondary)]">
                  Delivered at {order.completedAt ? new Date(order.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                </span>
                <span className="text-sm font-bold text-[var(--ion-color-primary)]">
                  <IonIcon icon={cashOutline} className="mr-1 align-middle" />
                  ₱{order.total?.toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      <IonToast
        isOpen={showToast}
        message={toastMessage}
        duration={2000}
        onDidDismiss={() => setShowToast(false)}
        position="bottom"
      />
    </>
  );
};

export default RiderOrders;
