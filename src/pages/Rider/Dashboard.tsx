import React, { useState, useEffect } from 'react';
import {
  IonButton,
  IonIcon,
  IonToggle,
} from '@ionic/react';
import { cashOutline, checkmarkCircleOutline, navigateOutline, storefrontOutline, personOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { db } from '../../firebaseConfig';
import { useAuth } from '../../context/AuthContext';
import { subscribeAvailableOrders, subscribeRiderOrders } from '../../services/orderService';
import type { Order } from '../../types';

const RiderDashboard: React.FC = () => {
  const history = useHistory();
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(false);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [riderOrders, setRiderOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.id));
        if (snap.exists()) {
          setIsAvailable(snap.data()?.riderAvailable === true);
        }
      } catch (err) {
        console.error('Failed to load rider availability:', err);
      }
    };
    load();
  }, [user]);

  const toggleAvailability = async (checked: boolean) => {
    setIsAvailable(checked);
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.id), { riderAvailable: checked });
    } catch (err) {
      console.error('Failed to save availability:', err);
      setIsAvailable(!checked);
    }
  };

  useEffect(() => {
    const unsub = subscribeAvailableOrders(orders => {
      setAvailableOrders(orders);
    }, (err) => {
      console.error('Failed to fetch available orders:', err);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeRiderOrders(user.id, orders => {
      setRiderOrders(orders);
    }, (err) => {
      console.error('Failed to fetch rider orders:', err);
    });
    return () => unsub();
  }, [user]);

  const todayDelivered = riderOrders.filter(o => {
    if (o.status !== 'delivered') return false;
    const d = new Date(o.completedAt || o.createdAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  const todayEarnings = todayDelivered.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="px-4 pt-5 pb-2">
          <h2 className="m-0 text-[28px] font-bold text-[var(--ion-text-color)]">Dashboard</h2>
        </div>

        {/* Status Toggle */}
        <div className="px-4 pb-3">
          <div className="bg-[var(--ion-card-background)] rounded-xl border border-[var(--ion-border-color)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="m-0 text-sm font-bold text-[var(--ion-text-color)]">
                  {isAvailable ? 'Online' : 'Offline'}
                </h3>
                <p className="m-0 mt-1 text-xs text-[var(--ion-text-color-secondary)]">
                  {isAvailable ? 'Ready to accept orders' : 'Tap to go online'}
                </p>
              </div>
              <IonToggle
                checked={isAvailable}
                onIonChange={(e) => toggleAvailability(e.detail.checked)}
                style={{ '--background-checked': 'var(--ion-color-primary)' }}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="px-4 pb-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-[#FF5A1F] to-[#FF7A3D] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <IonIcon icon={cashOutline} className="text-xl text-white" />
                </div>
                <div className="min-w-0">
                  <p className="m-0 text-xs text-white/80">Today's Earnings</p>
                  <h4 className="m-0 mt-1 text-base font-bold text-white truncate">₱{todayEarnings.toFixed(2)}</h4>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <IonIcon icon={checkmarkCircleOutline} className="text-xl text-white" />
                </div>
                <div className="min-w-0">
                  <p className="m-0 text-xs text-white/80">Completed Today</p>
                  <h4 className="m-0 mt-1 text-base font-bold text-white truncate">{todayDelivered.length}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Orders */}
        {isAvailable && (
          <>
            <div className="px-4 pb-2">
              <h2 className="m-0 text-base font-bold text-[var(--ion-text-color)]">
                Available Orders
                {availableOrders.length > 0 && (
                  <span className="ml-2 text-xs font-bold text-white bg-[#FF5A1F] px-2 py-0.5 rounded-full align-middle">
                    {availableOrders.length}
                  </span>
                )}
              </h2>
            </div>

            <div className="px-4 pb-4 space-y-3">
              {availableOrders.length === 0 ? (
                <div className="text-center py-10">
                  <p className="m-0 text-sm text-[var(--ion-text-color-secondary)]">No orders available right now</p>
                </div>
              ) : (
                availableOrders.slice(0, 5).map(order => (
                  <div key={order.id} className="bg-[var(--ion-card-background)] rounded-xl border border-[var(--ion-border-color)] overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="min-w-0 flex-1 mr-2">
                          <h3 className="m-0 mb-1 text-sm font-bold text-[var(--ion-text-color)] truncate">
                            <IonIcon icon={storefrontOutline} className="mr-1 align-middle" />
                            {order.stallName || 'Stall'}
                          </h3>
                          <p className="m-0 text-xs text-[var(--ion-text-color-secondary)]">
                            <IonIcon icon={personOutline} className="mr-1 align-middle" />
                            {order.customerName || 'Customer'}
                          </p>
                        </div>
                        <span className="shrink-0 text-sm font-bold text-[var(--ion-color-primary)]">
                          ₱{order.total?.toFixed(2)}
                        </span>
                      </div>

                      {order.deliveryAddress && (
                        <div className="flex items-center gap-2 mb-3 text-xs text-[var(--ion-text-color-secondary)]">
                          <IonIcon icon={navigateOutline} className="text-sm" />
                          <span className="truncate">{order.deliveryAddress}</span>
                        </div>
                      )}

                      <IonButton
                        expand="block"
                        className="min-h-[44px]"
                        style={{ '--background': '#10B981', margin: 0 }}
                        onClick={() => history.push('/rider/orders')}
                      >
                        View & Accept
                      </IonButton>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {!isAvailable && (
          <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
            <div className="text-5xl mb-4">🔴</div>
            <p className="text-base font-bold text-[var(--ion-text-color)] m-0 mb-2">You're currently offline</p>
            <p className="text-sm text-[var(--ion-text-color-secondary)] m-0 mb-5">
              Toggle above to go online and start accepting orders
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default RiderDashboard;
