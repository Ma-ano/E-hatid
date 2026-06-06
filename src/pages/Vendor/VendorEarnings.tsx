import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonCard, IonCardContent, IonIcon, IonSpinner } from '@ionic/react';
import { trendingUpOutline, cashOutline, cardOutline, walletOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { fetchOrdersByVendor, getEarningsStats } from '../../services/orderService';
import { Order } from '../../types';
import './VendorEarnings.css';
import AppFooter from '../../components/AppFooter';

const VendorEarnings: React.FC = () => {
  const history = useHistory();
  const { logout, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [financeCards, setFinanceCards] = useState([
    { icon: trendingUpOutline, label: 'Total Revenue', value: '₱0', change: '', color: '#8B5CF6' },
    { icon: cashOutline, label: 'This Month', value: '₱0', change: '', color: '#10B981' },
    { icon: cardOutline, label: 'Pending Payout', value: '₱0', change: '', color: '#F59E0B' },
    { icon: walletOutline, label: 'Available Balance', value: '₱0', change: '', color: '#6366F1' },
  ]);
  const [transactions, setTransactions] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      try {
        const stats = await getEarningsStats(user.id);
        setFinanceCards([
          { icon: trendingUpOutline, label: 'Total Revenue', value: `₱${stats.totalRevenue.toLocaleString()}`, change: '', color: '#8B5CF6' },
          { icon: cashOutline, label: 'This Month', value: `₱${stats.thisMonthRevenue.toLocaleString()}`, change: '', color: '#10B981' },
          { icon: cardOutline, label: 'Pending Payout', value: `₱${stats.pendingPayout.toLocaleString()}`, change: '', color: '#F59E0B' },
          { icon: walletOutline, label: 'Available Balance', value: `₱${stats.pendingPayout.toLocaleString()}`, change: '', color: '#6366F1' },
        ]);
        const orders = await fetchOrdersByVendor(user.id);
        setTransactions(orders.filter(o => o.status === 'delivered'));
      } catch (err) {
        console.error('Error loading earnings:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  return (
    <IonPage>
      <PageHeader
        showLogo={true}
        showBack={true}
        backHref="/vendor/dashboard"
        onLogoutClick={() => { logout(); history.push('/vendor/login'); }}
      />

      <IonContent className="vendor-content-fix" style={{ '--background': 'var(--ion-background-color)' } as any}>
        <div className="earnings-page">
          <div className="page-header">
            <h1>Earnings</h1>
            <p className="page-subtitle">Track your revenue and payouts</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px' }}><IonSpinner name="crescent" /></div>
          ) : (
            <>
              <div className="finance-cards-grid">
                {financeCards.map((card, i) => (
                  <IonCard key={i} className="finance-card">
                    <IonCardContent>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${card.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IonIcon icon={card.icon} style={{ fontSize: '24px', color: card.color }} />
                        </div>
                        <div>
                          <p style={{ margin: '0 0 4px', fontSize: '13px', color: 'var(--ion-text-color-secondary)', fontWeight: 500 }}>{card.label}</p>
                          <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: 'var(--ion-text-color)' }}>{card.value}</h3>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                ))}
              </div>

              <div style={{ marginTop: '32px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 700, color: 'var(--ion-text-color)' }}>Transaction History</h3>
                {transactions.length === 0 ? (
                  <IonCard className="orders-card"><IonCardContent><p style={{ textAlign: 'center', color: 'var(--ion-text-color-secondary)', margin: 0 }}>No transactions yet</p></IonCardContent></IonCard>
                ) : (
                  <IonCard className="orders-card">
                    <div className="orders-table">
                      <div className="table-header">
                        <span>Order</span>
                        <span>Customer</span>
                        <span>Amount</span>
                        <span>Status</span>
                      </div>
                      {transactions.map((txn, i) => (
                        <div key={i} className="table-row">
                          <span style={{ fontWeight: 600, color: '#8B5CF6' }}>#{txn.id.slice(-5)}</span>
                          <span>{txn.customerName || 'Unknown'}</span>
                          <span style={{ fontWeight: 600 }}>₱{txn.total}</span>
                          <span className={`status-badge status-${txn.status}`}>{txn.status}</span>
                        </div>
                      ))}
                    </div>
                  </IonCard>
                )}
              </div>
            </>
          )}
        </div>
      <AppFooter />
      </IonContent>
    </IonPage>
  );
};

export default VendorEarnings;
