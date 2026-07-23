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
import { checkmarkCircle, bicycleOutline, homeOutline, restaurantOutline, storefrontOutline, cartOutline, documentTextOutline, personOutline, callOutline, locationOutline, closeCircleOutline, closeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useCart } from '../../context/CartContext';
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
  const { itemCount } = useCart();
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
    if (order.status === 'ready' && order.pickedUpAt) return 4;
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
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ color: 'var(--ion-text-color-secondary)' }}>Order not found</p>
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
      if (order.status === 'ready' && !order.pickedUpAt) return 'Waiting for rider to pick up';
      if (order.status === 'ready' && order.pickedUpAt) return 'Rider is on the way';
    }
    if (i < activeStep) return 'Completed';
    return null;
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
          <div className="page-container" style={{ flex: 1, paddingTop: '24px', paddingBottom: '40px', textAlign: 'center' }}>
            <div style={{
              width: '88px', height: '88px', borderRadius: '50%',
              background: order.status === 'cancelled' ? '#EF4444' : '#10B981',
              margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IonIcon icon={checkmarkCircle} style={{ fontSize: '48px', color: '#fff' }} />
            </div>

            <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
              {order.status === 'cancelled' ? 'Order Cancelled' : 'Order Tracking'}
            </h1>
            <p style={{ margin: '0 0 4px', fontSize: '13px', color: 'var(--ion-text-color-secondary)' }}>
              {order.id}
            </p>
            <p style={{ margin: '0 0 24px', fontSize: '14px', color: 'var(--ion-text-color-secondary)' }}>
              {order.estimatedDeliveryTime || (order.status === 'cancelled' ? '' : 'Estimated delivery in 25-35 minutes')}
            </p>

            {order.cancelledReason && (
              <div style={{ maxWidth: '360px', margin: '0 auto 16px', padding: '12px 16px', background: '#FEE2E2', borderRadius: '12px', fontSize: '14px', color: '#DC2626', textAlign: 'left' }}>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Reason:</strong>
                {order.cancelledReason}
              </div>
            )}

            {order.status === 'pending' && (
              <div style={{ maxWidth: '360px', margin: '0 auto 24px' }}>
                <IonButton
                  expand="block"
                  fill="outline"
                  style={{ '--border-color': '#EF4444', '--color': '#EF4444', '--border-radius': '8px', height: '44px', fontSize: '14px', fontWeight: 600 }}
                  onClick={() => setShowCancelAlert(true)}
                  disabled={cancelling}
                >
                  <IonIcon icon={closeCircleOutline} slot="start" />
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </IonButton>
              </div>
            )}

            {/* Order Items */}
            <div style={{ maxWidth: '360px', margin: '0 auto 32px', textAlign: 'left', background: 'var(--ion-card-background)', borderRadius: '16px', padding: '16px', border: '1px solid var(--ion-border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: 'var(--ion-text-color-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Order Items</p>
                <IonButton fill="clear" size="small" style={{ '--color': '#8B5CF6', margin: 0, minHeight: 0, height: '28px' }} onClick={() => setDetailsOrder(order)}>
                  <IonIcon icon={documentTextOutline} slot="icon-only" />
                </IonButton>
              </div>
              {order.items.map((item, i) => {
                const customization = customizationText(item);
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: i < order.items.length - 1 ? '12px' : 0 }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>{item.name.charAt(0)}</span>
                      )}
                    </div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--ion-text-color)' }}>{item.name}</p>
                      {customization && (
                        <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--ion-text-color-secondary)' }}>{customization}</p>
                      )}
                      {item.specialInstructions && (
                        <p style={{ margin: '2px 0 0', fontSize: '11px', fontStyle: 'italic', color: 'var(--ion-text-color-secondary)' }}>&quot;{item.specialInstructions}&quot;</p>
                      )}
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>x{item.quantity}</p>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ion-text-color)' }}>₱{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
              <div style={{ borderTop: '1px solid var(--ion-border-color)', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ion-text-color-secondary)' }}>Total</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ion-text-color)' }}>₱{order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Status Steps */}
            {isMobile ? (
              <div style={{ maxWidth: '360px', margin: '0 auto 32px' }}>
                {statusSteps.map((step, i) => {
                  const isActive = i <= activeStep;
                  const isLast = i === statusSteps.length - 1;
                  const cancelled = order.status === 'cancelled';
                  return (
                    <div key={step.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: isLast ? 0 : 0 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                          width: '34px', height: '34px', borderRadius: '50%',
                          background: cancelled ? (isActive ? '#EF4444' : 'var(--ion-card-background)') : (isActive ? 'var(--ion-color-primary)' : 'var(--ion-card-background)'),
                          border: isActive ? 'none' : '2px solid var(--ion-border-color)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.3s ease', flexShrink: 0,
                        }}>
                          <IonIcon icon={step.icon} style={{ fontSize: '16px', color: isActive ? '#fff' : 'var(--ion-text-color-secondary)' }} />
                        </div>
                        {!isLast && (
                          <div style={{
                            width: '2px', height: '36px',
                            background: isActive && !cancelled ? 'var(--ion-color-primary)' : 'var(--ion-border-color)',
                            transition: 'background 0.3s ease',
                          }} />
                        )}
                      </div>
                      <div style={{ paddingTop: '6px', textAlign: 'left' }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '13px', color: isActive ? 'var(--ion-text-color)' : 'var(--ion-text-color-secondary)' }}>
                          {step.label}
                        </p>
                        {isActive && !cancelled && (
                          <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--ion-color-primary)' }}>
                            {stepSubtext(i)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ maxWidth: '100%', margin: '0 auto 32px', overflowX: 'auto', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', minWidth: 'fit-content', justifyContent: 'center' }}>
                  {statusSteps.map((step, i) => {
                    const isActive = i <= activeStep;
                    const isLast = i === statusSteps.length - 1;
                    const cancelled = order.status === 'cancelled';
                    return (
                      <div key={step.label} style={{ display: 'flex', alignItems: 'center', flex: isLast ? 0 : 1, minWidth: '80px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                          <div style={{
                            width: '34px', height: '34px', borderRadius: '50%',
                            background: cancelled ? (isActive ? '#EF4444' : 'var(--ion-card-background)') : (isActive ? 'var(--ion-color-primary)' : 'var(--ion-card-background)'),
                            border: isActive ? 'none' : '2px solid var(--ion-border-color)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.3s ease', flexShrink: 0,
                          }}>
                            <IonIcon icon={step.icon} style={{ fontSize: '16px', color: isActive ? '#fff' : 'var(--ion-text-color-secondary)' }} />
                          </div>
                          <div style={{ textAlign: 'center', maxWidth: '90px' }}>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: '12px', color: isActive ? 'var(--ion-text-color)' : 'var(--ion-text-color-secondary)', whiteSpace: 'nowrap' }}>
                              {step.label}
                            </p>
                            {isActive && !cancelled && (
                              <p style={{ margin: '2px 0 0', fontSize: '10px', color: 'var(--ion-color-primary)', whiteSpace: 'nowrap' }}>
                                {stepSubtext(i)}
                              </p>
                            )}
                          </div>
                        </div>
                        {!isLast && (
                          <div style={{
                            flex: 1, height: '2px', margin: '0 8px', marginBottom: '24px',
                            background: isActive && !cancelled ? 'var(--ion-color-primary)' : 'var(--ion-border-color)',
                            transition: 'background 0.3s ease',
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Vendor Info */}
            {loading && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <IonSpinner name="crescent" />
              </div>
            )}
            {!loading && vendorUser && (
              <div style={{ maxWidth: '360px', margin: '0 auto 20px', textAlign: 'left', background: 'var(--ion-card-background)', borderRadius: '16px', padding: '16px', border: '1px solid var(--ion-border-color)' }}>
                <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 700, color: 'var(--ion-text-color-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  <IonIcon icon={restaurantOutline} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  Vendor
                </p>
                <p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600, color: 'var(--ion-text-color)' }}>{vendorUser.name}</p>
                {vendorUser.phone && (
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ion-text-color-secondary)' }}>
                    <IonIcon icon={callOutline} style={{ verticalAlign: 'middle', fontSize: '14px', marginRight: '4px' }} />
                    {vendorUser.phone}
                  </p>
                )}
              </div>
            )}

            {/* Stall Info */}
            {!loading && stall && (
              <div style={{ maxWidth: '360px', margin: '0 auto 20px', textAlign: 'left', background: 'var(--ion-card-background)', borderRadius: '16px', padding: '16px', border: '1px solid var(--ion-border-color)' }}>
                <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 700, color: 'var(--ion-text-color-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  <IonIcon icon={storefrontOutline} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  Stall
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {stall.logo && (
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: '#f0f0f0' }}>
                      <img src={stall.logo} alt={stall.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 2px', fontSize: '15px', fontWeight: 600, color: 'var(--ion-text-color)' }}>{stall.name}</p>
                    {stall.address && (
                      <p style={{ margin: '0 0 2px', fontSize: '13px', color: 'var(--ion-text-color-secondary)' }}>
                        <IonIcon icon={locationOutline} style={{ verticalAlign: 'middle', fontSize: '14px', marginRight: '4px' }} />
                        {stall.address}
                      </p>
                    )}
                    {stall.category && (
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--ion-text-color-secondary)' }}>{stall.category}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Rider Info */}
            {!loading && riderUser && activeStep >= 4 && (
              <div style={{ maxWidth: '360px', margin: '0 auto 20px', textAlign: 'left', background: 'var(--ion-card-background)', borderRadius: '16px', padding: '16px', border: '1px solid var(--ion-border-color)' }}>
                <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 700, color: 'var(--ion-text-color-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  <IonIcon icon={bicycleOutline} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  Delivering
                </p>
                <p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600, color: 'var(--ion-text-color)' }}>{riderUser.name}</p>
                {riderUser.phone && (
                  <p style={{ margin: '0 0 4px', fontSize: '13px', color: 'var(--ion-text-color-secondary)' }}>
                    <IonIcon icon={callOutline} style={{ verticalAlign: 'middle', fontSize: '14px', marginRight: '4px' }} />
                    {riderUser.phone}
                  </p>
                )}
                {riderUser.licensePlate && (
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ion-text-color-secondary)' }}>
                    <IonIcon icon={bicycleOutline} style={{ verticalAlign: 'middle', fontSize: '14px', marginRight: '4px' }} />
                    Plate: {riderUser.licensePlate}
                  </p>
                )}
              </div>
            )}

            <IonButton expand="block" size="large"
              style={{ '--background': 'var(--ion-color-primary)', '--border-radius': '8px', height: '48px', fontSize: '16px', fontWeight: 600, marginTop: '40px' }}
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
            <div style={{ padding: '16px' }}>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 700, color: 'var(--ion-text-color-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Items</p>
                {detailsOrder.items.map((item, i) => {
                  const optionsTotal = item.selectedOptions?.reduce((s, o) => s + o.choicePrice, 0) || 0;
                  const addonsTotal = item.selectedAddOns?.reduce((s, a) => s + a.price, 0) || 0;
                  const basePrice = item.price - optionsTotal - addonsTotal;
                  const qty = item.quantity;
                  return (
                    <div key={i} style={{ padding: '12px', background: 'var(--ion-card-background)', borderRadius: '10px', marginBottom: '8px', border: '1px solid var(--ion-border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ion-text-color)', flex: 1 }}>{item.name}</span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ion-text-color-secondary)', margin: '0 12px' }}>x{qty}</span>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ion-text-color)' }}>₱{basePrice.toFixed(2)}</span>
                      </div>
                      {item.selectedOptions?.map((opt, oi) => {
                        const optTotal = opt.choicePrice * qty;
                        return optTotal > 0 ? (
                          <p key={oi} style={{ margin: '2px 0 0 12px', fontSize: '12px', color: 'var(--ion-text-color-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{opt.choiceName}</span>
                            <span>₱{optTotal.toFixed(2)}</span>
                          </p>
                        ) : (
                          <p key={oi} style={{ margin: '2px 0 0 12px', fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>{opt.choiceName}</p>
                        );
                      })}
                      {item.selectedAddOns?.map((addon, ai) => {
                        const addonTotal = addon.price * qty;
                        return (
                          <p key={ai} style={{ margin: '2px 0 0 12px', fontSize: '12px', color: 'var(--ion-text-color-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>+ {addon.name}</span>
                            <span>₱{addonTotal.toFixed(2)}</span>
                          </p>
                        );
                      })}
                      <div style={{ borderTop: '1px dashed var(--ion-border-color)', marginTop: '6px', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, color: 'var(--ion-text-color)' }}>
                        <span>Item subtotal</span>
                        <span>₱{(item.price * qty).toFixed(2)}</span>
                      </div>
                      {item.specialInstructions && (
                        <p style={{ margin: '4px 0 0', fontSize: '12px', fontStyle: 'italic', color: 'var(--ion-text-color-secondary)' }}>&quot;{item.specialInstructions}&quot;</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ padding: '12px', background: 'var(--ion-card-background)', borderRadius: '10px', border: '1px solid var(--ion-border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ion-text-color)' }}>Total</span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#8B5CF6' }}>₱{detailsOrder.total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </IonContent>
      </IonModal>
    </>
  );
};

export default OrderTracking;
