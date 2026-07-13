// src/pages/Rider/Home.tsx
import React, { useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonToggle,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { mapOutline, cashOutline, checkmarkCircleOutline, timeOutline, navigateOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';

const RiderHome: React.FC = () => {
  const history = useHistory();
  const { logout } = useAuth();
  const [isAvailable, setIsAvailable] = useState(false);
  const [earnings, setEarnings] = useState(450.50);
  const [completedDeliveries, setCompletedDeliveries] = useState(12);
  const [rating, setRating] = useState(4.8);

  // Mock available orders
  const availableOrders = [
    {
      id: '1',
      stallName: 'Burger King',
      customerName: 'John Doe',
      distance: '2.3 km',
      fee: 45,
      pickupLocation: 'BGC, Taguig',
      deliveryLocation: 'Fort Bonifacio, Taguig',
    },
    {
      id: '2',
      stallName: 'Sushi Master',
      customerName: 'Jane Smith',
      distance: '1.8 km',
      fee: 38,
      pickupLocation: 'Makati, Manila',
      deliveryLocation: 'Paseo de Santa Rosa, Manila',
    },
    {
      id: '3',
      stallName: 'Pizza Palace',
      customerName: 'Mike Johnson',
      distance: '3.1 km',
      fee: 52,
      pickupLocation: 'Quezon City',
      deliveryLocation: 'San Juan, Metro Manila',
    },
  ];

  return (
    <>
      <PageHeader 
        showLogo={true}
        onProfileClick={() => {
          logout();
          history.push('/login');
        }}
      />

        <div className="max-w-4xl mx-auto">
          {/* Rider Navigation */}
          <div className="flex gap-2 p-3 sm:p-4 overflow-x-auto bg-[var(--ion-card-background)] rounded-b-xl">
            <IonButton
              expand="block"
              className="min-h-[44px] text-xs sm:text-sm font-semibold flex-1 min-w-[80px]"
              style={{ '--background': 'var(--ion-color-primary)', '--color': '#FFFFFF', textTransform: 'none' }}
            >
              🏠 Home
            </IonButton>
            <IonButton
              expand="block"
              className="min-h-[44px] text-xs sm:text-sm font-semibold flex-1 min-w-[80px]"
              style={{ '--background': 'transparent', '--color': 'var(--ion-text-color)', textTransform: 'none', '--border-color': 'var(--ion-border-color)' }}
              onClick={() => history.push('/rider/orders')}
            >
              📦 Orders
            </IonButton>
            <IonButton
              expand="block"
              className="min-h-[44px] text-xs sm:text-sm font-semibold flex-1 min-w-[80px]"
              style={{ '--background': 'transparent', '--color': 'var(--ion-text-color)', textTransform: 'none', '--border-color': 'var(--ion-border-color)' }}
              onClick={() => history.push('/rider/earnings')}
            >
              💰 Earnings
            </IonButton>
            <IonButton
              expand="block"
              className="min-h-[44px] text-xs sm:text-sm font-semibold flex-1 min-w-[80px]"
              style={{ '--background': 'transparent', '--color': 'var(--ion-text-color)', textTransform: 'none', '--border-color': 'var(--ion-border-color)' }}
              onClick={() => history.push('/rider/profile')}
            >
              👤 Profile
            </IonButton>
          </div>

          {/* Quick Access Menu */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 p-3 sm:p-4">
            <div onClick={() => history.push('/activities')}
              className="p-3 sm:p-4 rounded-xl cursor-pointer text-center text-white bg-gradient-to-br from-[#FF5A1F] to-[#FF7A3D] hover:opacity-90 transition-opacity"
            >
              <div className="text-lg sm:text-xl mb-1">📋</div>
              <p className="m-0 text-[10px] sm:text-xs font-semibold">Activity</p>
            </div>
            <div onClick={() => history.push('/messages')}
              className="p-3 sm:p-4 rounded-xl cursor-pointer text-center text-white bg-gradient-to-br from-[#10B981] to-[#34D399] hover:opacity-90 transition-opacity"
            >
              <div className="text-lg sm:text-xl mb-1">💬</div>
              <p className="m-0 text-[10px] sm:text-xs font-semibold">Messages</p>
            </div>
          </div>

          {/* Status Toggle */}
          <div className="px-3 sm:px-4 pb-3 sm:pb-4">
            <div className="bg-[var(--ion-card-background)] rounded-xl border border-[var(--ion-border-color)] p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="m-0 text-sm sm:text-base font-bold text-[var(--ion-text-color)]">
                    {isAvailable ? 'Online' : 'Offline'}
                  </h3>
                  <p className="m-0 mt-1 text-xs text-[var(--ion-text-color-secondary)]">
                    {isAvailable ? 'Ready to accept orders' : 'Tap to go online'}
                  </p>
                </div>
                <IonToggle
                  checked={isAvailable}
                  onIonChange={(e) => setIsAvailable(e.detail.checked)}
                  style={{ '--background-checked': 'var(--ion-color-primary)' }}
                />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="px-3 sm:px-4 pb-3 sm:pb-4">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="bg-gradient-to-br from-[#FF5A1F] to-[#FF7A3D] rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <IonIcon icon={cashOutline} className="text-lg sm:text-xl text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="m-0 text-[10px] sm:text-xs text-white/80">Today's Earnings</p>
                    <h4 className="m-0 mt-1 text-sm sm:text-base font-bold text-white truncate">₱{earnings.toFixed(2)}</h4>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <IonIcon icon={checkmarkCircleOutline} className="text-lg sm:text-xl text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="m-0 text-[10px] sm:text-xs text-white/80">Completed Today</p>
                    <h4 className="m-0 mt-1 text-sm sm:text-base font-bold text-white truncate">{completedDeliveries}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="px-3 sm:px-4 pb-3 sm:pb-4">
            <div className="bg-[var(--ion-card-background)] rounded-xl border border-[var(--ion-border-color)] p-3 sm:p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="m-0 text-xs sm:text-sm text-[var(--ion-text-color-secondary)]">Current Rating</p>
                  <h3 className="m-0 mt-1 text-sm sm:text-base font-bold text-[var(--ion-text-color)]">★ {rating}</h3>
                </div>
                <span className="text-xs sm:text-sm font-semibold bg-[var(--tw-light)] text-[var(--tw-text-secondary)] px-3 py-1.5 rounded-full">Excellent</span>
              </div>
            </div>
          </div>

          {/* Available Orders */}
          {isAvailable && (
            <>
              <div className="px-3 sm:px-4 pb-2 sm:pb-3">
                <h2 className="m-0 text-base sm:text-lg font-bold text-[var(--ion-text-color)]">
                  Available Orders
                </h2>
              </div>

              <div className="px-3 sm:px-4 pb-4 space-y-3 sm:space-y-4">
                {availableOrders.map(order => (
                  <div key={order.id} className="bg-[var(--ion-card-background)] rounded-xl border border-[var(--ion-border-color)] overflow-hidden">
                    <div className="p-3 sm:p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="m-0 mb-1 text-sm sm:text-base font-bold text-[var(--ion-text-color)] truncate">
                            {order.stallName}
                          </h3>
                          <p className="m-0 text-xs sm:text-sm text-[var(--ion-text-color-secondary)]">
                            {order.customerName}
                          </p>
                        </div>
                        <span className="shrink-0 bg-[var(--ion-color-primary)] text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full">
                          ₱{order.fee}
                        </span>
                      </div>

                      <div className="flex gap-2 sm:gap-3 mb-3 text-xs sm:text-sm text-[var(--ion-text-color-secondary)]">
                        <span className="flex items-center gap-1">
                          <IonIcon icon={mapOutline} className="text-sm" />
                          {order.distance}
                        </span>
                      </div>

                      <div className="bg-[var(--ion-background-color)] rounded-lg p-3 mb-3 text-xs sm:text-sm space-y-2">
                        <div className="flex gap-2">
                          <IonIcon icon={navigateOutline} className="text-sm text-[var(--ion-color-primary)] shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="m-0 text-[10px] sm:text-xs text-[var(--ion-text-color-secondary)]">From:</p>
                            <p className="m-0 text-xs sm:text-sm font-semibold text-[var(--ion-text-color)] truncate">{order.pickupLocation}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <IonIcon icon={navigateOutline} className="text-sm text-[#10B981] shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="m-0 text-[10px] sm:text-xs text-[var(--ion-text-color-secondary)]">To:</p>
                            <p className="m-0 text-xs sm:text-sm font-semibold text-[var(--ion-text-color)] truncate">{order.deliveryLocation}</p>
                          </div>
                        </div>
                      </div>

                      <IonButton
                        expand="block"
                        className="min-h-[44px]"
                        style={{ '--background': 'var(--ion-color-primary)', margin: 0 }}
                        onClick={() => history.push(`/rider/orders/${order.id}`)}
                      >
                        Accept Order
                      </IonButton>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!isAvailable && (
            <div className="flex flex-col items-center justify-center py-10 sm:py-16 px-5 text-center">
              <div className="text-4xl sm:text-5xl mb-4">🔴</div>
              <p className="text-sm sm:text-base font-bold text-[var(--ion-text-color)] m-0 mb-2">You're currently offline</p>
              <p className="text-xs sm:text-sm text-[var(--ion-text-color-secondary)] m-0 mb-5">
                Toggle above to go online and start accepting orders
              </p>
            </div>
          )}
        </div>
    </>
  );
};

export default RiderHome;
