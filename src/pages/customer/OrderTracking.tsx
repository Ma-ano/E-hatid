import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonSpinner,
  IonAlert,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
} from '@ionic/react';
import { checkmarkCircle, bicycleOutline, homeOutline, restaurantOutline, storefrontOutline, documentTextOutline, callOutline, locationOutline, closeCircleOutline, closeOutline, star } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useOrders } from '../../context/OrderContext';
import { getUserDocument } from '../../services/userService';
import { fetchStallById } from '../../services/stallService';
import { updateOrderStatus } from '../../services/orderService';
import type { Order, User, Stall } from '../../types';


const statusSteps: { label: string; icon: string; statuses: Order['status'][] }[] = [
  { label: 'Order Placed', icon: checkmarkCircle, statuses: ['pending'] },
  { label: 'Vendor Accepted', icon: restaurantOutline, statuses: ['accepted'] },
  { label: 'Preparing', icon: restaurantOutline, statuses: ['preparing'] },
  { label: 'Ready for Pickup', icon: bicycleOutline, statuses: ['ready'] },
  { label: 'Delivering', icon: bicycleOutline, statuses: ['ready'] },
  { label: 'Delivered', icon: homeOutline, statuses: ['delivered'] },
];

const OrderTracking: React.FC = () => {
  const history = useHistory<{ order?: Order }>();
  const initialOrder = history.location.state?.order;
  const [order, setOrder] = useState<Order | null>(initialOrder || null);
  const [vendorUser, setVendorUser] = useState<User | null>(null);
  const [riderUser, setRiderUser] = useState<User | null>(null);
  const [stall, setStall] = useState<Stall | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null);
  const { updateOrderStatus: localUpdateStatus } = useOrders();
  const mountedRef = useRef(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    if (!initialOrder?.id) {
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(doc(db, 'orders', initialOrder.id), (snap) => {
      if (!mountedRef.current) return;
      if (snap.exists()) {
        setOrder({ ...snap.data(), id: snap.id } as Order);
      }
      setLoading(false);
    }, () => {
      setLoading(false);
    });
    return () => { mountedRef.current = false; unsub(); };
  }, [initialOrder?.id]);

  const activeStep = order ? (() => {
    if (order.status === 'delivered') return 5;
    if (order.status === 'delivering') return 4;
    if (order.status === 'ready') return 3;
    if (order.status === 'preparing') return 2;
    if (order.status === 'accepted') return 1;
    if (order.status === 'pending') return 0;
    return -1;
  })() : -1;

  useEffect(() => {
    if (!order) return;
    const tasks: Promise<void>[] = [];
    if (order.vendorId) {
      tasks.push(
        getUserDocument(order.vendorId).then(v => {
          if (mountedRef.current) setVendorUser(v);
        })
      );
    }
    if (order.riderId) {
      tasks.push(
        getUserDocument(order.riderId).then(r => {
          if (mountedRef.current) setRiderUser(r);
        })
      );
    }
    if (order.stallId) {
      tasks.push(
        fetchStallById(order.stallId).then(s => {
          if (mountedRef.current) setStall(s);
        })
      );
    }
    Promise.all(tasks).catch(() => {});
  }, [order?.vendorId, order?.riderId]);

  const handleCancelOrder = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      await updateOrderStatus(order.id, { status: 'cancelled', cancelledReason: 'Cancelled by customer' });
      localUpdateStatus(order.id, 'cancelled');
    } catch (err) {
      console.error('Failed to cancel order:', err);
    } finally {
      setCancelling(false);
      setShowCancelAlert(false);
    }
  };

  if (!order) {
    return (
      <>
        <div className="text-center p-12">
          <p className="text-[var(--ion-text-color-secondary)]">Order not found</p>
          <IonButton style={{ '--background': 'var(--ion-color-primary)' }} onClick={() => history.push('/customer/home')}>
            Back to Home
          </IonButton>
        </div>
      </>
    );
  }

  const customizationText = (item: Order['items'][0]): string | null => {
    const parts: string[] = [];
    if (item.selectedOptions?.length) {
      item.selectedOptions.forEach(opt => parts.push(opt.choiceName));
    }
    if (item.selectedAddOns?.length) {
      item.selectedAddOns.forEach(addon => parts.push(`+${addon.name}`));
    }
    return parts.length ? parts.join(', ') : null;
  };

  const stepSubtext = (i: number): string | null => {
    if (activeStep === statusSteps.length - 1 && i === activeStep) return 'Enjoy your meal!';
    if (i === activeStep) {
      if (order.status === 'pending') return 'Waiting for vendor to accept';
      if (order.status === 'accepted') return 'Vendor is preparing your order';
      if (order.status === 'preparing') return 'Your food is being cooked';
      if (order.status === 'ready') return 'Waiting for rider to pick up';
      if (order.status === 'delivering') return 'Rider is on the way';
    }
    if (i < activeStep) return 'Completed';
    return null;
  };

  return (
    <>
      <div className="flex flex-col min-h-full">
        <div className="page-container flex-1 pt-6 pb-10 text-center">
            <div className="w-[88px] h-[88px] rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: order.status === 'cancelled' ? '#EF4444' : '#10B981' }}>
              <IonIcon icon={checkmarkCircle} className="text-5xl text-white" />
            </div>

            <h1 className="m-0 mb-1 text-2xl font-bold text-[var(--ion-text-color)]">
              {order.status === 'cancelled' ? 'Order Cancelled' : 'Order Tracking'}
            </h1>
            <p className="m-0 mb-1 text-sm text-[var(--ion-text-color-secondary)]">
              {order.id}
            </p>
            <p className="m-0 mb-6 text-sm text-[var(--ion-text-color-secondary)]">
              {order.estimatedDeliveryTime || (order.status === 'cancelled' ? '' : 'Estimated delivery in 25-35 minutes')}
            </p>

            {order.cancelledReason && (
              <div className="max-w-[360px] mx-auto mb-4 p-3 bg-red-100 rounded-xl text-sm text-red-600 text-left">
                <strong className="block mb-1">Reason:</strong>
                {order.cancelledReason}
              </div>
            )}

            {order.status === 'pending' && (
              <div className="max-w-[360px] mx-auto mb-6">
                <IonButton
                  expand="block"
                  fill="outline"
                  style={{ '--border-color': '#EF4444', '--color': '#EF4444', '--border-radius': '8px' }}
                  className="h-11 text-sm font-semibold"
                  onClick={() => setShowCancelAlert(true)}
                  disabled={cancelling}
                >
                  <IonIcon icon={closeCircleOutline} slot="start" />
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </IonButton>
              </div>
            )}

            {order.status === 'ready' && (
              <div className="max-w-[360px] mx-auto mb-6 text-center py-3 px-4 bg-[var(--ion-card-background)] rounded-2xl border border-[var(--ion-border-color)]">
                <p className="m-0 text-sm text-[var(--ion-text-color-secondary)]">
                  Order is ready for pickup. Waiting for a rider to accept.
                </p>
              </div>
            )}

            {order.status === 'delivering' && (
              <div className="max-w-[360px] mx-auto mb-6 text-center py-3 px-4 bg-[var(--ion-card-background)] rounded-2xl border border-[var(--ion-border-color)]">
                <p className="m-0 text-sm text-[var(--ion-text-color-secondary)]">
                  Your rider is on the way!
                </p>
              </div>
            )}

            {order.status === 'delivered' && (
              <div className="max-w-[360px] mx-auto mb-6">
                <IonButton
                  expand="block"
                  style={{ '--background': '#8B5CF6', '--border-radius': '8px' }}
                  className="h-11 text-sm font-semibold"
                  onClick={() => history.push(`/customer/review/${order.id}`, { order })}
                >
                  <IonIcon icon={star} slot="start" />
                  Leave a Review
                </IonButton>
              </div>
            )}

            {/* Order Items */}
            <div className="max-w-[360px] mx-auto mb-8 text-left bg-[var(--ion-card-background)] rounded-2xl p-4 border border-[var(--ion-border-color)]">
              <div className="flex justify-between items-center mb-3">
                <p className="m-0 text-sm font-bold text-[var(--ion-text-color-secondary)] uppercase tracking-[0.3px]">Order Items</p>
                <IonButton fill="clear" size="small" style={{ '--color': '#8B5CF6' }} className="m-0 min-h-0 h-7" onClick={() => setDetailsOrder(order)}>
                  <IonIcon icon={documentTextOutline} slot="icon-only" />
                </IonButton>
              </div>
              {order.items.map((item, i) => {
                const customization = customizationText(item);
                return (
                  <div key={i} className="flex items-center gap-3" style={{ marginBottom: i < order.items.length - 1 ? '12px' : 0 }}>
                    <div className="w-11 h-11 rounded-[10px] overflow-hidden shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' }}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-base text-white/60 font-bold">{item.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="m-0 text-sm font-semibold text-[var(--ion-text-color)]">{item.name}</p>
                      {customization && (
                        <p className="mt-0.5 text-xs text-[var(--ion-text-color-secondary)]">{customization}</p>
                      )}
                      {item.specialInstructions && (
                        <p className="mt-0.5 text-xs italic text-[var(--ion-text-color-secondary)]">&quot;{item.specialInstructions}&quot;</p>
                      )}
                      <p className="mt-0.5 text-xs text-[var(--ion-text-color-secondary)]">x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-[var(--ion-text-color)]">₱{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
              <div className="border-t border-[var(--ion-border-color)] mt-3 pt-3 flex justify-between">
                <span className="text-sm font-semibold text-[var(--ion-text-color-secondary)]">Total</span>
                <span className="text-base font-bold text-[var(--ion-text-color)]">₱{order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Status Steps */}
            {isMobile ? (
              <div className="max-w-[360px] mx-auto mb-8">
                {statusSteps.map((step, i) => {
                  const isActive = i <= activeStep;
                  const isLast = i === statusSteps.length - 1;
                  const cancelled = order.status === 'cancelled';
                  return (
                    <div key={step.label} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 transition-all duration-300" style={{
                          background: cancelled ? (isActive ? '#EF4444' : 'var(--ion-card-background)') : (isActive ? 'var(--ion-color-primary)' : 'var(--ion-card-background)'),
                          border: isActive ? 'none' : '2px solid var(--ion-border-color)',
                        }}>
                          <IonIcon icon={step.icon} className="text-base" style={{ color: isActive ? '#fff' : 'var(--ion-text-color-secondary)' }} />
                        </div>
                        {!isLast && (
                          <div className="w-0.5 h-9 transition-[background] duration-300" style={{ background: isActive && !cancelled ? 'var(--ion-color-primary)' : 'var(--ion-border-color)' }} />
                        )}
                      </div>
                      <div className="pt-1.5 text-left">
                        <p className="m-0 font-semibold text-sm" style={{ color: isActive ? 'var(--ion-text-color)' : 'var(--ion-text-color-secondary)' }}>
                          {step.label}
                        </p>
                        {isActive && !cancelled && (
                          <p className="mt-0.5 text-xs text-[var(--ion-color-primary)]">
                            {stepSubtext(i)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="max-w-full mx-auto mb-8 overflow-x-auto pb-2">
                <div className="flex items-start min-w-fit justify-center">
                  {statusSteps.map((step, i) => {
                    const isActive = i <= activeStep;
                    const isLast = i === statusSteps.length - 1;
                    const cancelled = order.status === 'cancelled';
                    return (
                      <div key={step.label} className="flex items-center" style={{ flex: isLast ? 0 : 1, minWidth: '80px' }}>
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 transition-all duration-300" style={{
                            background: cancelled ? (isActive ? '#EF4444' : 'var(--ion-card-background)') : (isActive ? 'var(--ion-color-primary)' : 'var(--ion-card-background)'),
                            border: isActive ? 'none' : '2px solid var(--ion-border-color)',
                          }}>
                            <IonIcon icon={step.icon} className="text-base" style={{ color: isActive ? '#fff' : 'var(--ion-text-color-secondary)' }} />
                          </div>
                          <div className="text-center max-w-[90px]">
                            <p className="m-0 font-semibold text-xs whitespace-nowrap" style={{ color: isActive ? 'var(--ion-text-color)' : 'var(--ion-text-color-secondary)' }}>
                              {step.label}
                            </p>
                            {isActive && !cancelled && (
                              <p className="mt-0.5 text-[10px] text-[var(--ion-color-primary)] whitespace-nowrap">
                                {stepSubtext(i)}
                              </p>
                            )}
                          </div>
                        </div>
                        {!isLast && (
                          <div className="flex-1 h-0.5 mx-2 mb-6 transition-[background] duration-300" style={{ background: isActive && !cancelled ? 'var(--ion-color-primary)' : 'var(--ion-border-color)' }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Vendor Info */}
            {loading && (
              <div className="text-center py-5">
                <IonSpinner name="crescent" />
              </div>
            )}
            {!loading && vendorUser && (
              <div className="max-w-[360px] mx-auto mb-5 text-left bg-[var(--ion-card-background)] rounded-2xl p-4 border border-[var(--ion-border-color)]">
                <p className="m-0 mb-3 text-sm font-bold text-[var(--ion-text-color-secondary)] uppercase tracking-[0.3px]">
                  <IonIcon icon={restaurantOutline} className="align-middle mr-1.5" />
                  Vendor
                </p>
                <p className="m-0 mb-1 text-base font-semibold text-[var(--ion-text-color)]">{vendorUser.name}</p>
                {vendorUser.phone && (
                  <p className="m-0 text-sm text-[var(--ion-text-color-secondary)]">
                    <IonIcon icon={callOutline} className="align-middle text-sm mr-1" />
                    {vendorUser.phone}
                  </p>
                )}
              </div>
            )}

            {/* Stall Info */}
            {!loading && stall && (
              <div className="max-w-[360px] mx-auto mb-5 text-left bg-[var(--ion-card-background)] rounded-2xl p-4 border border-[var(--ion-border-color)]">
                <p className="m-0 mb-3 text-sm font-bold text-[var(--ion-text-color-secondary)] uppercase tracking-[0.3px]">
                  <IonIcon icon={storefrontOutline} className="align-middle mr-1.5" />
                  Stall
                </p>
                <div className="flex items-center gap-3">
                  {stall.logo && (
                    <div className="w-11 h-11 rounded-[10px] overflow-hidden shrink-0 bg-gray-100">
                      <img src={stall.logo} alt={stall.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="m-0 mb-0.5 text-base font-semibold text-[var(--ion-text-color)]">{stall.name}</p>
                    {stall.address && (
                      <p className="m-0 mb-0.5 text-sm text-[var(--ion-text-color-secondary)]">
                        <IonIcon icon={locationOutline} className="align-middle text-sm mr-1" />
                        {stall.address}
                      </p>
                    )}
                    {stall.category && (
                      <p className="m-0 text-sm text-[var(--ion-text-color-secondary)]">{stall.category}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Rider Info */}
            {!loading && riderUser && activeStep >= 4 && (
              <div className="max-w-[360px] mx-auto mb-5 text-left bg-[var(--ion-card-background)] rounded-2xl p-4 border border-[var(--ion-border-color)]">
                <p className="m-0 mb-3 text-sm font-bold text-[var(--ion-text-color-secondary)] uppercase tracking-[0.3px]">
                  <IonIcon icon={bicycleOutline} className="align-middle mr-1.5" />
                  Delivering
                </p>
                <p className="m-0 mb-1 text-base font-semibold text-[var(--ion-text-color)]">{riderUser.name}</p>
                {riderUser.phone && (
                  <p className="m-0 mb-1 text-sm text-[var(--ion-text-color-secondary)]">
                    <IonIcon icon={callOutline} className="align-middle text-sm mr-1" />
                    {riderUser.phone}
                  </p>
                )}
                {riderUser.licensePlate && (
                  <p className="m-0 text-sm text-[var(--ion-text-color-secondary)]">
                    <IonIcon icon={bicycleOutline} className="align-middle text-sm mr-1" />
                    Plate: {riderUser.licensePlate}
                  </p>
                )}
              </div>
            )}

            <IonButton expand="block" size="large"
              className="h-12 text-base font-semibold mt-10"
              style={{ '--background': 'var(--ion-color-primary)', '--border-radius': '8px' }}
              onClick={() => history.push('/customer/home')}
            >
              Back to Home
            </IonButton>
          </div>
        </div>

      <IonAlert
        isOpen={showCancelAlert}
        onDidDismiss={() => setShowCancelAlert(false)}
        header="Cancel Order?"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        buttons={[
          { text: 'No, keep it', role: 'cancel' },
          { text: 'Yes, cancel', role: 'destructive', handler: handleCancelOrder },
        ]}
      />

      <IonModal isOpen={!!detailsOrder} onDidDismiss={() => setDetailsOrder(null)}>
        <IonHeader className="ion-no-border">
          <IonToolbar style={{ '--background': 'var(--ion-card-background)' }}>
            <IonButtons slot="start">
              <IonButton onClick={() => setDetailsOrder(null)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
            <IonTitle>Item Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent style={{ '--background': 'var(--ion-background-color)' }}>
          {detailsOrder && (
            <div className="p-4">
              <div className="mb-4">
                <p className="m-0 mb-2 text-xs font-bold text-[var(--ion-text-color-secondary)] uppercase tracking-[0.3px]">Items</p>
                {detailsOrder.items.map((item, i) => {
                  const optionsTotal = item.selectedOptions?.reduce((s, o) => s + o.choicePrice, 0) || 0;
                  const addonsTotal = item.selectedAddOns?.reduce((s, a) => s + a.price, 0) || 0;
                  const basePrice = item.price - optionsTotal - addonsTotal;
                  const qty = item.quantity;
                  return (
                    <div key={i} className="p-3 bg-[var(--ion-card-background)] rounded-[10px] mb-2 border border-[var(--ion-border-color)]">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-semibold text-[var(--ion-text-color)] flex-1">{item.name}</span>
                        <span className="text-sm font-semibold text-[var(--ion-text-color-secondary)] mx-3">x{qty}</span>
                        <span className="text-sm font-bold text-[var(--ion-text-color)]">₱{basePrice.toFixed(2)}</span>
                      </div>
                      {item.selectedOptions?.map((opt, oi) => {
                        const optTotal = opt.choicePrice * qty;
                        return optTotal > 0 ? (
                          <p key={oi} className="mt-0.5 ml-3 text-xs text-[var(--ion-text-color-secondary)] flex justify-between">
                            <span>{opt.choiceName}</span>
                            <span>₱{optTotal.toFixed(2)}</span>
                          </p>
                        ) : (
                          <p key={oi} className="mt-0.5 ml-3 text-xs text-[var(--ion-text-color-secondary)]">{opt.choiceName}</p>
                        );
                      })}
                      {item.selectedAddOns?.map((addon, ai) => {
                        const addonTotal = addon.price * qty;
                        return (
                          <p key={ai} className="mt-0.5 ml-3 text-xs text-[var(--ion-text-color-secondary)] flex justify-between">
                            <span>+ {addon.name}</span>
                            <span>₱{addonTotal.toFixed(2)}</span>
                          </p>
                        );
                      })}
                      <div className="border-t border-dashed border-[var(--ion-border-color)] mt-1.5 pt-1.5 flex justify-between text-sm font-semibold text-[var(--ion-text-color)]">
                        <span>Item subtotal</span>
                        <span>₱{(item.price * qty).toFixed(2)}</span>
                      </div>
                      {item.specialInstructions && (
                        <p className="mt-1 text-xs italic text-[var(--ion-text-color-secondary)]">&quot;{item.specialInstructions}&quot;</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-[var(--ion-card-background)] rounded-[10px] border border-[var(--ion-border-color)] flex justify-between items-center">
                <span className="text-base font-bold text-[var(--ion-text-color)]">Total</span>
                <span className="text-lg font-bold text-[#8B5CF6]">₱{detailsOrder.total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </IonContent>
      </IonModal>
    </>
  );
};

export default OrderTracking;
