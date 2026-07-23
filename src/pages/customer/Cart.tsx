import React, { useState } from 'react';
import {
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

import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { fetchStallById } from '../../services/stallService';
import type { Order } from '../../types';

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
      history.push('/customer/order-tracking', { order });
    } catch (err) {
      console.error('Failed to place order:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>


        <div className="flex flex-col min-h-full">
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-3 sm:px-4 md:px-6 pb-10 sm:pb-16">
          <div className="py-4 sm:py-5 md:py-6">
            <h2 className="m-0 text-2xl xs:text-3xl sm:text-4xl font-bold text-[var(--ion-text-color)]">
              Your Cart
            </h2>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">
              <div className="w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 rounded-full bg-[var(--ion-card-background)] border-2 border-[var(--ion-border-color)] flex items-center justify-center mb-6">
                <IonIcon icon={bicycleOutline} className="text-4xl sm:text-5xl text-[var(--ion-color-primary)]" />
              </div>
              <h2 className="m-0 mb-2 font-bold text-base sm:text-lg text-[var(--ion-text-color)]">Your cart is empty</h2>
              <p className="m-0 text-sm text-[var(--ion-text-color-secondary)]">Add some delicious food to get started!</p>
              <IonButton
                className="mt-6 min-h-[44px]"
                style={{ '--background': 'var(--ion-color-primary)', '--border-radius': '8px' }}
                onClick={() => history.push('/customer/home')}
              >
                Browse Stalls
              </IonButton>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 bg-[var(--ion-card-background)] mb-4 p-4 md:p-6 rounded-2xl border border-[var(--ion-border-color)]">
                <div className="w-10 h-10 rounded-full bg-[var(--ion-background-color)] border border-[var(--ion-border-color)] flex items-center justify-center shrink-0">
                  <IonIcon icon={locationOutline} className="text-[var(--ion-color-primary)] text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="m-0 mb-0.5 text-xs text-[var(--ion-text-color-secondary)]">Deliver to</p>
                  <p className="m-0 font-semibold text-sm sm:text-base text-[var(--ion-text-color)] truncate">Current Location</p>
                </div>
                <IonButton fill="clear" className="shrink-0 min-h-[44px] text-sm" style={{ '--color': 'var(--ion-color-primary)' }} onClick={() => history.push('/customer/location')}>Change</IonButton>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {items.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                    onRemove={() => removeFromCart(item.id)}
                  />
                ))}
              </div>

              <div className="bg-[var(--ion-card-background)] mt-4 p-4 md:p-6 rounded-2xl border border-[var(--ion-border-color)]">
                <h3 className="m-0 mb-4 font-bold text-sm sm:text-base text-[var(--ion-text-color)]">Bill Details</h3>
                <div className="flex justify-between items-center py-2 text-xs sm:text-sm text-[var(--ion-text-color)]">
                  <span>Subtotal</span>
                  <span>₱{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 text-xs sm:text-sm text-[var(--ion-text-color)]">
                  <span>Delivery Fee</span>
                  <span>₱{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 text-xs sm:text-sm text-[var(--ion-text-color)]">
                  <span>Service Fee</span>
                  <span>₱{serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 mt-2 border-t border-[var(--ion-border-color)] font-bold text-base sm:text-lg text-[var(--ion-text-color)]">
                  <span>Total</span>
                  <span className="text-[var(--ion-color-primary)]">₱{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Cash on Delivery */}
              <div className="bg-[var(--ion-card-background)] mt-4 p-4 md:p-6 rounded-2xl border border-[var(--ion-border-color)] text-center">
                <IonIcon icon={cashOutline} className="text-3xl sm:text-4xl text-[#10B981] mb-3" />
                <p className="m-0 mb-1 text-sm sm:text-base font-semibold text-[var(--ion-text-color)]">
                  Pay with cash on delivery
                </p>
                <p className="m-0 text-xs sm:text-sm text-[var(--ion-text-color-secondary)]">
                  No online payment needed. Pay when your order arrives.
                </p>
              </div>

              {items.length > 0 && (
                <div className="mt-6 space-y-3">
                  {user?.emailVerified !== true && (
                    <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg p-3 text-center">
                      <p className="m-0 text-xs sm:text-sm text-amber-700 dark:text-amber-300 font-medium">
                        Verify your email to place orders
                      </p>
                      <IonButton
                        size="small"
                        fill="outline"
                        className="mt-2 min-h-[36px]"
                        style={{ '--border-color': 'var(--ion-color-primary)', '--color': 'var(--ion-color-primary)' }}
                        onClick={() => history.push('/verify-otp')}
                      >
                        Go to Verification
                      </IonButton>
                    </div>
                  )}
                  <IonButton
                    expand="block" size="large"
                    className="min-h-[48px] sm:min-h-[56px]"
                    style={{
                      '--background': user?.emailVerified === true ? 'var(--ion-color-primary)' : '#9CA3AF',
                      '--border-radius': '8px',
                      fontSize: '15px', fontWeight: 700,
                    }}
                    onClick={handlePayment}
                    disabled={loading || user?.emailVerified !== true}
                  >
                    {loading ? 'Processing...' : user?.emailVerified === true ? `Pay ₱${finalTotal.toFixed(2)}` : 'Verify email to order'}
                  </IonButton>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserCart;
