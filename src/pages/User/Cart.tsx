import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
} from '@ionic/react';
import {
  locationOutline, bicycleOutline, cashOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

import CartItem from '../../components/Cart/CartItem';
import PageHeader from '../../components/PageHeader';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { fetchStallById } from '../../services/stallService';
import type { Order } from '../../types';
import AppFooter from '../../components/AppFooter';

const UserCart: React.FC = () => {
  const history = useHistory();
  const { items, updateQuantity, removeFromCart, clearCart, total, itemCount } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const deliveryFee = 2.99;
  const serviceFee = 1.49;
  const finalTotal = total + deliveryFee + serviceFee;

  const handlePayment = async () => {
    setLoading(true);
    try {
      const stallId = items[0]?.stallId || '';
      const stall = stallId ? await fetchStallById(stallId) : null;
      const orderData: Omit<Order, 'id'> = {
        userId: user?.id || '',
        stallId,
        vendorId: stall?.vendorId || '',
        stallName: stall?.name || '',
        customerName: user?.name || user?.email?.split('@')[0] || 'Customer',
        customerPhone: user?.phone || '',
        items: items.map(item => ({
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          selectedOptions: item.selectedOptions,
          selectedAddOns: item.selectedAddOns,
          specialInstructions: item.specialInstructions,
        })),
        total: finalTotal,
        status: 'pending',
        createdAt: new Date(),
        deliveryAddress: user?.address || 'Current Location',
      };
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      const order: Order = { id: docRef.id, ...orderData };
      addOrder(order);
      clearCart();
      history.push('/user/order-tracking', { order });
    } catch (err) {
      console.error('Failed to place order:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <PageHeader
        showLogo={true}
        showBackButton={true}
        backHref="/user/home"
        cartCount={itemCount}
        onCartClick={() => history.push('/user/cart')}
        onOrdersClick={() => history.push('/user/orders')}
        onProfileClick={() => history.push('/user/profile')}
      />

      <IonContent style={{ '--background': 'var(--ion-background-color)' } as any}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        <div className="page-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: '40px' }}>
          <div style={{ padding: '20px 0 16px 0' }}>
            <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
              Your Cart
            </h2>
          </div>

          {items.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', flex: 1, padding: '24px', textAlign: 'center',
            }}>
              <div style={{
                width: '120px', height: '120px', background: 'var(--ion-card-background)',
                border: '2px solid var(--ion-border-color)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px',
              }}>
                <IonIcon icon={bicycleOutline} style={{ fontSize: '48px', color: '#6366F1' }} />
              </div>
              <h2 style={{ margin: '0 0 8px', fontWeight: 700, color: 'var(--ion-text-color)' }}>Your cart is empty</h2>
              <p style={{ margin: 0, color: 'var(--ion-text-color-secondary)' }}>Add some delicious food to get started!</p>
              <IonButton
                style={{ marginTop: '24px', '--background': '#6366F1', '--border-radius': '8px' }}
                onClick={() => history.push('/user/home')}
              >
                Browse Stalls
              </IonButton>
            </div>
          ) : (
            <>
              <div style={{
                background: 'var(--ion-card-background)', margin: '0 0 16px 0', padding: '16px',
                borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px',
                border: '1px solid var(--ion-border-color)',
              }}>
                <div style={{
                  width: '40px', height: '40px', background: 'var(--ion-background-color)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid var(--ion-border-color)',
                }}>
                  <IonIcon icon={locationOutline} style={{ color: '#6366F1', fontSize: '20px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px', fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>Deliver to</p>
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--ion-text-color)' }}>Current Location</p>
                </div>
                <IonButton fill="clear" style={{ '--color': '#6366F1' }} onClick={() => history.push('/user/location')}>Change</IonButton>
              </div>

              <div>
                {items.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                    onRemove={() => removeFromCart(item.id)}
                  />
                ))}
              </div>

              <div style={{
                background: 'var(--ion-card-background)', margin: '0 0 16px 0', padding: '16px',
                borderRadius: '12px', border: '1px solid var(--ion-border-color)',
              }}>
                <h3 style={{ margin: '0 0 16px', fontWeight: 700, fontSize: '16px', color: 'var(--ion-text-color)' }}>Bill Details</h3>
                <IonItem lines="none" style={{ '--padding-start': 0, '--inner-padding-end': 0, '--background': 'transparent' } as any}>
                  <IonLabel style={{ color: 'var(--ion-text-color)' }}>Subtotal</IonLabel>
                  <span slot="end" style={{ color: 'var(--ion-text-color)' }}>₱{total.toFixed(2)}</span>
                </IonItem>
                <IonItem lines="none" style={{ '--padding-start': 0, '--inner-padding-end': 0, '--background': 'transparent' } as any}>
                  <IonLabel style={{ color: 'var(--ion-text-color)' }}>Delivery Fee</IonLabel>
                  <span slot="end" style={{ color: 'var(--ion-text-color)' }}>₱{deliveryFee.toFixed(2)}</span>
                </IonItem>
                <IonItem lines="none" style={{ '--padding-start': 0, '--inner-padding-end': 0, '--background': 'transparent' } as any}>
                  <IonLabel style={{ color: 'var(--ion-text-color)' }}>Service Fee</IonLabel>
                  <span slot="end" style={{ color: 'var(--ion-text-color)' }}>₱{serviceFee.toFixed(2)}</span>
                </IonItem>
                <div style={{
                  borderTop: '1px solid var(--ion-border-color)', marginTop: '12px', paddingTop: '12px',
                  display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '18px', color: 'var(--ion-text-color)',
                }}>
                  <span>Total</span>
                  <span style={{ color: '#6366F1' }}>₱{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Cash on Delivery */}
              <div style={{
                background: 'var(--ion-card-background)', padding: '20px', borderRadius: '12px',
                border: '1px solid var(--ion-border-color)', textAlign: 'center',
              }}>
                <IonIcon icon={cashOutline} style={{ fontSize: '40px', color: '#10B981', marginBottom: '12px' }} />
                <p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600, color: 'var(--ion-text-color)' }}>
                  Pay with cash on delivery
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ion-text-color-secondary)' }}>
                  No online payment needed. Pay when your order arrives.
                </p>
              </div>

              {items.length > 0 && (
                <IonButton
                  expand="block" size="large"
                  style={{
                    '--background': '#6366F1', '--border-radius': '8px',
                    height: '56px', fontSize: '16px', fontWeight: 700, marginTop: '24px',
                  }}
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Pay ₱${finalTotal.toFixed(2)}`}
                </IonButton>
              )}
            </>
          )}
        </div>
        <AppFooter />
      </div>
      </IonContent>
    </IonPage>
  );
};

export default UserCart;
