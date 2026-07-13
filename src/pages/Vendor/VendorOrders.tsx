import React, { useState, useEffect } from 'react';
import {
  IonContent, IonCard, IonCardContent, IonButton, IonIcon, IonBadge, IonSpinner,
  IonModal, IonHeader, IonToolbar, IonButtons, IonTitle, IonTextarea, IonToast,
} from '@ionic/react';
import { checkmarkOutline, closeOutline, personOutline, callOutline, timeOutline, documentTextOutline, locationOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { updateOrderStatus, subscribeVendorOrders } from '../../services/orderService';
import { useOrders } from '../../context/OrderContext';
import { Order } from '../../types';

type FilterTab = 'all' | 'pending' | 'in_progress' | 'completed' | 'cancelled';

const TIMEOUT_MS = 30 * 60 * 1000;

const VendorOrders: React.FC = () => {
  const history = useHistory();
  const { logout, user } = useAuth();
  const { updateOrderStatus: localUpdateStatus } = useOrders();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineOrderId, setDeclineOrderId] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const [processingOrders, setProcessingOrders] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeVendorOrders(user.id, (data) => {
      const now = Date.now();
      const updated = data.map(o => {
        if (o.status === 'pending' && now - new Date(o.createdAt).getTime() > TIMEOUT_MS) {
          updateOrderStatus(o.id, { status: 'cancelled', cancelledReason: 'Auto-cancelled (30 min timeout)' });
          return { ...o, status: 'cancelled' as const, cancelledReason: 'Auto-cancelled (30 min timeout)' };
        }
        return o;
      });
      setOrders(updated);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const handleAccept = async (order: Order) => {
    setProcessingOrders(prev => new Set(prev).add(order.id));
    try {
      await updateOrderStatus(order.id, { status: 'accepted' });
      localUpdateStatus(order.id, 'accepted');
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'accepted' } : o));
    } catch {
      setToastMessage('Failed to accept order');
      setShowToast(true);
    } finally {
      setProcessingOrders(prev => { const s = new Set(prev); s.delete(order.id); return s; });
    }
  };

  const openDeclineModal = (orderId: string) => {
    setDeclineOrderId(orderId);
    setDeclineReason('');
    setDeclineModalOpen(true);
  };

  const confirmDecline = async () => {
    if (!declineOrderId) return;
    setProcessingOrders(prev => new Set(prev).add(declineOrderId));
    try {
      const reason = declineReason.trim() || 'Order cancelled by vendor';
      await updateOrderStatus(declineOrderId, { status: 'cancelled', cancelledReason: reason });
      localUpdateStatus(declineOrderId, 'cancelled');
      setOrders(prev => prev.map(o => o.id === declineOrderId ? { ...o, status: 'cancelled', cancelledReason: reason } : o));
    } catch {
      setToastMessage('Failed to decline order');
      setShowToast(true);
    } finally {
      setProcessingOrders(prev => { const s = new Set(prev); s.delete(declineOrderId); return s; });
      setDeclineModalOpen(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (filter === 'all') return true;
    if (filter === 'pending') return o.status === 'pending';
    if (filter === 'in_progress') return ['accepted', 'preparing', 'ready'].includes(o.status);
    if (filter === 'completed') return o.status === 'delivered';
    if (filter === 'cancelled') return o.status === 'cancelled';
    return true;
  });

  const isProcessing = (id: string) => processingOrders.has(id);

  const formatTime = (iso: string | Date | any) => {
    if (!iso) return '';
    if (typeof iso?.toDate === 'function') iso = iso.toDate();
    const d = typeof iso === 'string' ? new Date(iso) : iso;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <PageHeader
        showLogo={true}
        showBack={true}
        backHref="/vendor/dashboard"
        onLogoutClick={() => { logout(); history.push('/vendor/login'); }}
      />

        <div className="p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[var(--tw-text-color)]">Orders</h1>
            <p className="text-sm text-[var(--tw-text-secondary)] mt-1">View and manage incoming orders</p>
          </div>

          <div className="flex gap-3 mb-6 overflow-x-auto">
            {(['all', 'pending', 'in_progress', 'completed', 'cancelled'] as FilterTab[]).map(tab => (
              <IonButton
                key={tab}
                style={filter === tab ? { '--background': '#8B5CF6', flexShrink: 0 } : { '--border-color': '#8B5CF6', '--color': '#8B5CF6', flexShrink: 0 }}
                fill={filter === tab ? 'solid' : 'outline'}
                onClick={() => setFilter(tab)}
              >
                {tab === 'in_progress' ? 'In Progress' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </IonButton>
            ))}
          </div>

          {loading ? (
            <div className="text-center p-12"><IonSpinner name="crescent" /></div>
          ) : filteredOrders.length === 0 ? (
            <IonCard className="rounded-xl shadow"><IonCardContent><p className="text-center text-[var(--tw-text-secondary)] m-0">No orders yet</p></IonCardContent></IonCard>
          ) : (
            <div className="grid gap-4">
              {filteredOrders.map(order => (
                <IonCard key={order.id} className={`rounded-xl shadow ${order.status === 'cancelled' ? 'opacity-60' : ''}`}>
                  <IonCardContent>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
                          #{order.id.slice(-5)}
                          <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--ion-text-color-secondary)', marginLeft: '8px' }}>
                            <IonIcon icon={timeOutline} style={{ verticalAlign: 'middle', marginRight: '2px' }} />
                            {formatTime(order.createdAt)}
                          </span>
                        </h3>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--ion-text-color-secondary)' }}>
                          {order.customerName || 'Unknown'}
                          {order.customerPhone && ` · ${order.customerPhone}`}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IonBadge color={
                          order.status === 'pending' ? 'warning' :
                          order.status === 'accepted' ? 'primary' :
                          order.status === 'preparing' ? 'primary' :
                          order.status === 'ready' ? 'success' :
                          order.status === 'delivered' ? 'success' :
                          order.status === 'cancelled' ? 'danger' : 'medium'
                        }>
                          {order.status}
                        </IonBadge>
                        <IonButton fill="clear" size="small" style={{ '--color': '#8B5CF6', margin: 0, minHeight: 0, height: '28px' }} onClick={() => setDetailsOrder(order)}>
                          <IonIcon icon={documentTextOutline} slot="icon-only" />
                        </IonButton>
                      </div>
                    </div>

                    <div style={{ padding: '12px', background: 'var(--ion-background-color)', borderRadius: '8px', marginBottom: '12px' }}>
                      {order.items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', marginBottom: i < order.items.length - 1 ? '8px' : 0 }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>{item.name.charAt(0)}</span>
                          </div>
                          <span style={{ color: 'var(--ion-text-color)', flex: 1 }}>{item.name}</span>
                          <span style={{ color: 'var(--ion-text-color-secondary)' }}>x{item.quantity}</span>
                        </div>
                      ))}
                      <div style={{ borderTop: '1px solid var(--ion-border-color)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600, color: 'var(--ion-text-color)' }}>Total</span>
                        <span style={{ fontWeight: 700, color: '#8B5CF6' }}>₱{order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {order.cancelledReason && (
                      <div style={{ padding: '8px 12px', background: '#FEE2E2', borderRadius: '8px', marginBottom: '12px', fontSize: '13px', color: '#DC2626' }}>
                        <strong>Reason:</strong> {order.cancelledReason}
                      </div>
                    )}

                    {order.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <IonButton
                          style={{ flex: 1, '--background': '#10B981' }}
                          disabled={isProcessing(order.id)}
                          onClick={() => handleAccept(order)}
                        >
                          {isProcessing(order.id) ? <IonSpinner name="crescent" /> : <IonIcon icon={checkmarkOutline} slot="start" />}
                          Accept
                        </IonButton>
                        <IonButton
                          style={{ flex: 1, '--background': '#EF4444' }}
                          disabled={isProcessing(order.id)}
                          onClick={() => openDeclineModal(order.id)}
                        >
                          {isProcessing(order.id) ? <IonSpinner name="crescent" /> : <IonIcon icon={closeOutline} slot="start" />}
                          Decline
                        </IonButton>
                      </div>
                    )}
                    {(order.status === 'accepted' || order.status === 'preparing') && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <IonButton
                          expand="block"
                          style={{ '--background': 'var(--ion-color-primary)' }}
                          disabled={isProcessing(order.id)}
                          onClick={async () => {
                            setProcessingOrders(prev => new Set(prev).add(order.id));
                            try {
                              await updateOrderStatus(order.id, { status: 'ready' });
                              localUpdateStatus(order.id, 'ready');
                              setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'ready' } : o));
                            } catch {
                              setToastMessage('Failed to mark order as ready');
                              setShowToast(true);
                            } finally {
                              setProcessingOrders(prev => { const s = new Set(prev); s.delete(order.id); return s; });
                            }
                          }}
                        >
                          {isProcessing(order.id) ? <IonSpinner name="crescent" /> : <IonIcon icon={checkmarkOutline} slot="start" />}
                          Mark as Ready
                        </IonButton>
                      </div>
                    )}
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          )}
        </div>


      <IonModal isOpen={declineModalOpen} onDidDismiss={() => setDeclineModalOpen(false)}>
        <IonHeader className="ion-no-border">
          <IonToolbar style={{ '--background': 'var(--ion-card-background)' }}>
            <IonButtons slot="start">
              <IonButton onClick={() => setDeclineModalOpen(false)}>Cancel</IonButton>
            </IonButtons>
            <IonTitle>Decline Order</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={confirmDecline} style={{ '--color': '#EF4444', fontWeight: 700 }}>Confirm</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent style={{ '--background': 'var(--ion-background-color)' }}>
          <div style={{ padding: '24px' }}>
            <p style={{ margin: '0 0 16px', fontSize: '14px', color: 'var(--ion-text-color-secondary)' }}>
              Why are you declining this order? The reason will be shown to the customer.
            </p>
            <IonTextarea
              value={declineReason}
              onIonChange={e => setDeclineReason(e.detail.value!)}
              placeholder="e.g. User doesn't have proper details of their account"
              rows={4}
              style={{ '--background': 'var(--ion-item-background)', borderRadius: '8px', padding: '8px' } as any}
            />
          </div>
        </IonContent>
      </IonModal>

      <IonModal isOpen={!!detailsOrder} onDidDismiss={() => setDetailsOrder(null)}>
        <IonHeader className="ion-no-border">
          <IonToolbar style={{ '--background': 'var(--ion-card-background)' }}>
            <IonButtons slot="start">
              <IonButton onClick={() => setDetailsOrder(null)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
            <IonTitle>Order Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent style={{ '--background': 'var(--ion-background-color)' }}>
          {detailsOrder && (
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--ion-border-color)' }}>
                <div>
                  <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 700, color: 'var(--ion-text-color)' }}>#{detailsOrder.id.slice(-5)}</h2>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>{new Date(detailsOrder.createdAt).toLocaleString()}</p>
                </div>
                <IonBadge color={
                  detailsOrder.status === 'pending' ? 'warning' :
                  detailsOrder.status === 'accepted' ? 'primary' :
                  detailsOrder.status === 'preparing' ? 'primary' :
                  detailsOrder.status === 'ready' ? 'success' :
                  detailsOrder.status === 'delivered' ? 'success' : 'medium'
                }>{detailsOrder.status}</IonBadge>
              </div>

              {(detailsOrder.customerName || detailsOrder.customerPhone || detailsOrder.deliveryAddress) && (
                <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--ion-border-color)' }}>
                  <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 700, color: 'var(--ion-text-color-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                    <IonIcon icon={personOutline} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                    Customer
                  </p>
                  <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 600, color: 'var(--ion-text-color)' }}>{detailsOrder.customerName}</p>
                  {detailsOrder.customerPhone && (
                    <p style={{ margin: '0 0 2px', fontSize: '13px', color: 'var(--ion-text-color-secondary)' }}>
                      <IonIcon icon={callOutline} style={{ verticalAlign: 'middle', marginRight: '4px', fontSize: '13px' }} />
                      {detailsOrder.customerPhone}
                    </p>
                  )}
                  {detailsOrder.deliveryAddress && (
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--ion-text-color-secondary)' }}>
                      <IonIcon icon={locationOutline} style={{ verticalAlign: 'middle', marginRight: '4px', fontSize: '13px' }} />
                      {detailsOrder.deliveryAddress}
                    </p>
                  )}
                </div>
              )}

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

              <div style={{ padding: '12px', background: 'var(--ion-card-background)', borderRadius: '10px', marginBottom: '16px', border: '1px solid var(--ion-border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ion-text-color)' }}>Total</span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#8B5CF6' }}>₱{detailsOrder.total.toFixed(2)}</span>
              </div>

              {detailsOrder.cancelledReason && (
                <div style={{ padding: '10px 12px', background: '#FEE2E2', borderRadius: '8px', fontSize: '13px', color: '#DC2626' }}>
                  <strong style={{ display: 'block', marginBottom: '2px' }}>Cancellation Reason:</strong>
                  {detailsOrder.cancelledReason}
                </div>
              )}
            </div>
          )}
        </IonContent>
      </IonModal>

      <IonToast
        isOpen={showToast}
        message={toastMessage}
        duration={3000}
        onDidDismiss={() => setShowToast(false)}
        position="bottom"
        color="danger"
      />
    </>
  );
};

export default VendorOrders;
