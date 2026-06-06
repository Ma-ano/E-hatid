import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IonPage, IonContent, IonCard, IonCardContent, IonIcon, IonButton, IonSpinner, IonModal, IonHeader, IonToolbar, IonButtons, IonTitle, IonTextarea, IonToast } from '@ionic/react';
import { trendingUpOutline, cartOutline, starOutline, peopleOutline, storefrontOutline, cashOutline, settingsOutline, clipboardOutline, checkmarkOutline, closeOutline, documentTextOutline, locationOutline, personOutline, callOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { getEarningsStats, updateOrderStatus, subscribeVendorOrders } from '../../services/orderService';
import { getReviewStats } from '../../services/reviewService';
import { useOrders } from '../../context/OrderContext';
import { Order } from '../../types';
import './VendorDashboard.css';
import AppFooter from '../../components/AppFooter';

const VendorDashboard: React.FC = () => {
  const history = useHistory();
  const { logout, user } = useAuth();
  const { updateOrderStatus: localUpdateStatus } = useOrders();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { icon: trendingUpOutline, label: 'Total Sales', value: '₱0', color: '#8B5CF6' },
    { icon: cartOutline, label: 'Orders Today', value: '0', color: '#10B981' },
    { icon: starOutline, label: 'Average Rating', value: '0.0', color: '#F59E0B' },
    { icon: peopleOutline, label: 'Total Customers', value: '0', color: '#6366F1' },
  ]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineOrderId, setDeclineOrderId] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const [processingOrders, setProcessingOrders] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null);

  const quickLinks = [
    { label: 'Products', icon: storefrontOutline, route: '/vendor/products', color: '#8B5CF6' },
    { label: 'Orders', icon: clipboardOutline, route: '/vendor/orders', color: '#10B981' },
    { label: 'Earnings', icon: cashOutline, route: '/vendor/earnings', color: '#F59E0B' },
    { label: 'Reviews', icon: starOutline, route: '/vendor/reviews', color: '#EC4899' },
    { label: 'Settings', icon: settingsOutline, route: '/vendor/settings', color: '#14B8A6' },
  ];

  const loadStats = useCallback(async () => {
    if (!user) return;
    try {
      const [earnings, reviews] = await Promise.all([
        getEarningsStats(user.id),
        getReviewStats(user.id),
      ]);
      setStats(prev => [
        { ...prev[0], value: `₱${earnings.totalRevenue.toLocaleString()}` },
        prev[1],
        { ...prev[2], value: String(reviews.average) },
        { ...prev[3], value: String(earnings.totalCustomers) },
      ]);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    }
  }, [user]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeVendorOrders(user.id, (orders) => {
      setRecentOrders(orders.slice(0, 3));

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const ordersToday = orders.filter(o => {
        const d = new Date(o.createdAt);
        return d >= today;
      }).length;

      setStats(prev => {
        const next = [...prev];
        next[1] = { ...next[1], value: String(ordersToday) };
        return next;
      });

      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const handleAccept = async (order: Order) => {
    setProcessingOrders(prev => new Set(prev).add(order.id));
    try {
      await updateOrderStatus(order.id, { status: 'accepted' });
      localUpdateStatus(order.id, 'accepted');
      setRecentOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'accepted' } : o));
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
      setRecentOrders(prev => prev.map(o => o.id === declineOrderId ? { ...o, status: 'cancelled', cancelledReason: reason } : o));
    } catch {
      setToastMessage('Failed to decline order');
      setShowToast(true);
    } finally {
      setProcessingOrders(prev => { const s = new Set(prev); s.delete(declineOrderId); return s; });
      setDeclineModalOpen(false);
    }
  };

  const isProcessing = (id: string) => processingOrders.has(id);

  return (
    <IonPage>
      <PageHeader
        showLogo={true}
        onLogoutClick={() => { logout(); history.push('/vendor/login'); }}
      />

      <IonContent className="vendor-content-fix" style={{ '--background': 'var(--ion-background-color)' } as any}>
        <div className="vendor-dashboard">
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Dashboard Overview</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {stats.map((stat, i) => (
                <IonCard key={i} className="stat-card" style={{ borderTop: `4px solid ${stat.color}` }}>
                  <IonCardContent>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                        <IonIcon icon={stat.icon} />
                      </div>
                      <div>
                        <p className="stat-label">{stat.label}</p>
                        <h3 className="stat-value">{loading ? '...' : stat.value}</h3>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Quick Links</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
              {quickLinks.map((link, i) => (
                <IonCard key={i} button onClick={() => history.push(link.route)}
                  style={{ margin: 0, borderRadius: '12px', borderTop: `3px solid ${link.color}` }}>
                  <IonCardContent style={{ textAlign: 'center', padding: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${link.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                      <IonIcon icon={link.icon} style={{ fontSize: '20px', color: link.color }} />
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--ion-text-color)' }}>{link.label}</p>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Recent Orders</h2>
              <IonButton fill="clear" onClick={() => history.push('/vendor/orders')} style={{ '--color': '#8B5CF6' }}>
                View All
              </IonButton>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '32px' }}><IonSpinner name="crescent" /></div>
            ) : recentOrders.length === 0 ? (
              <IonCard className="orders-card"><IonCardContent><p style={{ textAlign: 'center', color: 'var(--ion-text-color-secondary)', margin: 0 }}>No orders yet</p></IonCardContent></IonCard>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {recentOrders.map(order => (
                  <IonCard key={order.id} className="orders-card">
                    <IonCardContent>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <h3 style={{ margin: '0 0 4px', fontWeight: 700, color: 'var(--ion-text-color)' }}>#{order.id.slice(-5)}</h3>
                          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ion-text-color-secondary)' }}>{order.customerName || 'Unknown'}{order.customerPhone ? ` · ${order.customerPhone}` : ''}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={`status-badge status-${order.status}`}>{order.status}</span>
                          <IonButton fill="clear" size="small" style={{ '--color': '#8B5CF6', margin: 0, minHeight: 0, height: '28px' }} onClick={() => setDetailsOrder(order)}>
                            <IonIcon icon={documentTextOutline} slot="icon-only" />
                          </IonButton>
                        </div>
                      </div>

                      <div style={{ padding: '12px', background: 'var(--ion-background-color)', borderRadius: '8px', marginBottom: '12px' }}>
                        {order.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', marginBottom: i < order.items.length - 1 ? '8px' : 0 }}>
                            <span style={{ color: 'var(--ion-text-color)', flex: 1 }}>{item.name}</span>
                            <span style={{ color: 'var(--ion-text-color-secondary)' }}>x{item.quantity}</span>
                          </div>
                        ))}
                        <div style={{ borderTop: '1px solid var(--ion-border-color)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 600, color: 'var(--ion-text-color)' }}>Total</span>
                          <span style={{ fontWeight: 700, color: '#8B5CF6' }}>₱{order.total.toFixed(2)}</span>
                        </div>
                      </div>

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
                            style={{ '--background': '#6366F1' }}
                            disabled={isProcessing(order.id)}
                            onClick={async () => {
                              setProcessingOrders(prev => new Set(prev).add(order.id));
                              try {
                                await updateOrderStatus(order.id, { status: 'ready' });
                                localUpdateStatus(order.id, 'ready');
                                setRecentOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'ready' } : o));
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
        </div>
        <AppFooter />
      </IonContent>

      <IonModal isOpen={declineModalOpen} onDidDismiss={() => setDeclineModalOpen(false)} className="decline-modal">
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
                <span className={`status-badge status-${detailsOrder.status}`}>{detailsOrder.status}</span>
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
    </IonPage>
  );
};

export default VendorDashboard;
