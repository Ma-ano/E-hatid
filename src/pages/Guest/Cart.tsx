// src/pages/Guest/Cart.tsx
import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
} from '@ionic/react';
import { locationOutline, bicycleOutline, cardOutline, logInOutline, personAddOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import CartItem from '../../components/Cart/CartItem';
import PageHeader from '../../components/PageHeader';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import AppFooter from '../../components/AppFooter';

const GuestCart: React.FC = () => {
  const history = useHistory();
  const { items, updateQuantity, removeFromCart, total, itemCount } = useCart();
  const { isGuest, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const deliveryFee = 2.99;
  const serviceFee = 1.49;
  const finalTotal = total + deliveryFee + serviceFee;

  const handleCheckout = () => {
    if (isGuest) {
      setShowAuthModal(true);
    } else {
      history.push('/user/login');
    }
  };

  return (
    <IonPage>
      <PageHeader 
        showLogo={true}
        showBackButton={true}
        backHref="/guest/home"
        cartCount={itemCount}
        onCartClick={() => history.push('/guest/cart')}
        onOrdersClick={() => history.push('/user/orders')}
        onProfileClick={() => {
          if (isGuest) {
            history.push('/user/login');
          } else {
            logout();
            history.push('/user/login');
          }
        }}
      />

      <IonContent style={{ '--background': 'var(--ion-background-color)' } as any}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        <div className="page-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: '40px' }}>
          {/* Page Title */}
          <div style={{ padding: '20px 0 16px 0' }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: '28px', 
              fontWeight: 700, 
              color: 'var(--ion-text-color)' 
            }}>
              Your Cart
            </h2>
          </div>
          {items.length === 0 ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              flex: 1,
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                background: 'var(--ion-card-background)',
                border: '2px solid var(--ion-border-color)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <IonIcon icon={bicycleOutline} style={{ fontSize: '48px', color: '#6366F1' }} />
              </div>
              <h2 style={{ margin: '0 0 8px', fontWeight: 700, color: 'var(--ion-text-color)' }}>Your cart is empty</h2>
              <p style={{ margin: 0, color: 'var(--ion-text-color-secondary)' }}>Add some delicious food to get started!</p>
              <IonButton
                style={{ 
                  marginTop: '24px',
                  '--background': '#6366F1',
                  '--border-radius': '8px'
                }}
                onClick={() => history.push('/guest/home')}
              >
                Browse Stalls
              </IonButton>
            </div>
          ) : (
            <>
              {/* Delivery Address */}
              <div style={{ 
                background: 'var(--ion-card-background)', 
                margin: '0 0 16px 0', 
                padding: '16px', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: '1px solid var(--ion-border-color)'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'var(--ion-background-color)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--ion-border-color)'
                }}>
                  <IonIcon icon={locationOutline} style={{ color: '#6366F1', fontSize: '20px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px', fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>Deliver to</p>
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--ion-text-color)' }}>Current Location</p>
                </div>
                <IonButton fill="clear" style={{ '--color': '#6366F1' }} onClick={() => history.push('/guest/location')}>Change</IonButton>
              </div>

              {/* Cart Items */}
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

              {/* Bill Details */}
              <div style={{ 
                background: 'var(--ion-card-background)', 
                margin: '0', 
                padding: '16px', 
                borderRadius: '12px',
                border: '1px solid var(--ion-border-color)'
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
                  borderTop: '1px solid var(--ion-border-color)', 
                  marginTop: '12px', 
                  paddingTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '18px',
                  color: 'var(--ion-text-color)'
                }}>
                  <span>Total</span>
                  <span style={{ color: '#6366F1' }}>₱{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {items.length > 0 && (
                <IonButton
                  expand="block" size="large"
                  style={{
                    '--background': '#6366F1', '--border-radius': '8px',
                    height: '56px', fontSize: '16px', fontWeight: 700, marginTop: '24px',
                  }}
                  onClick={handleCheckout}
                >
                  <IonIcon slot="start" icon={cardOutline} />
                  Proceed to Checkout • ₱{finalTotal.toFixed(2)}
                </IonButton>
              )}
            </>
          )}
        </div>
        <AppFooter />
      </div>
      </IonContent>

      <IonModal isOpen={showAuthModal} onDidDismiss={() => setShowAuthModal(false)}>
        <div style={{
          padding: '32px 24px', textAlign: 'center',
          background: 'var(--ion-card-background)', minHeight: '300px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px',
        }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'var(--ion-color-primary)', margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IonIcon icon={personAddOutline} style={{ fontSize: '36px', color: '#fff' }} />
          </div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
            Sign in to continue
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ion-text-color-secondary)', lineHeight: 1.5 }}>
            Create an account or sign in to proceed with your order
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            <IonButton expand="block" size="large"
              style={{ '--background': '#6366F1', '--border-radius': '8px', height: '48px', fontSize: '15px', fontWeight: 600 }}
              onClick={() => { setShowAuthModal(false); history.push('/user/login'); }}
            >
              <IonIcon slot="start" icon={logInOutline} />
              Log In
            </IonButton>
            <IonButton expand="block" size="large" fill="outline"
              style={{ '--border-color': '#6366F1', '--color': '#6366F1', '--border-radius': '8px', height: '48px', fontSize: '15px', fontWeight: 600 }}
              onClick={() => { setShowAuthModal(false); history.push('/user/register'); }}
            >
              <IonIcon slot="start" icon={personAddOutline} />
              Sign Up
            </IonButton>
          </div>
          <IonButton fill="clear" style={{ marginTop: '8px', '--color': 'var(--ion-text-color-secondary)' }}
            onClick={() => setShowAuthModal(false)}
          >
            Continue as Guest
          </IonButton>
        </div>
      </IonModal>
    </IonPage>
  );
};

export default GuestCart;