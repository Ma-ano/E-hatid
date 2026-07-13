import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonBadge, IonBackButton } from '@ionic/react';
import { cartOutline, personOutline, arrowBack, documentTextOutline, carOutline, logOutOutline } from 'ionicons/icons';
import { useOrders } from '../context/OrderContext';

interface PageHeaderProps {
  title?: string;
  showLogo?: boolean;
  showBack?: boolean;
  showBackButton?: boolean;
  backHref?: string;
  cartCount?: number;
  onCartClick?: () => void;
  onOrdersClick?: () => void;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  customClass?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title = '',
  showLogo = true,
  showBack = false,
  showBackButton = false,
  backHref = '/guest/home',
  cartCount = 0,
  onCartClick,
  onOrdersClick,
  onProfileClick,
  onLogoutClick,
  onLoginClick,
  onRegisterClick,
  customClass = ''
}) => {
  return (
    <IonHeader className={`ion-no-border ${customClass}`}>
      <IonToolbar
        style={{
          '--background': 'var(--ion-card-background)',
          '--border-color': 'transparent',
          '--min-height': '56px'
        } as any}
      >
        <div className="flex items-center w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <IonButtons slot="start" className="shrink-0">
            {(showBack || showBackButton) && (
              <IonBackButton
                defaultHref={backHref}
                icon={arrowBack}
                style={{ '--color': 'var(--ion-color-primary)', '--ionicon-stroke-width': '48px' }}
              />
            )}
          </IonButtons>

          <div className="flex-1 min-w-0 text-center sm:text-left">
            {showLogo ? (
              <span className="inline-flex items-center gap-1.5 text-lg sm:text-xl md:text-2xl font-bold text-[var(--ion-text-color)]">
                <IonIcon icon={carOutline} className="text-[var(--ion-color-primary)] shrink-0" />
                <span className="text-[var(--ion-color-primary)] truncate">E-Hatid</span>
              </span>
            ) : (
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-[var(--ion-text-color)] truncate m-0">
                {title}
              </h1>
            )}
          </div>

          <IonButtons slot="end" className="shrink-0 flex items-center gap-0.5 sm:gap-1">
            {onCartClick && (
              <IonButton onClick={onCartClick} className="min-w-[44px] min-h-[44px]">
                <div className="relative">
                  <IonIcon icon={cartOutline} className="text-xl sm:text-2xl text-[var(--ion-color-primary)]" />
                  {cartCount > 0 && (
                    <IonBadge className="cart-badge">{cartCount}</IonBadge>
                  )}
                </div>
              </IonButton>
            )}
            <OrdersBadge onOrdersClick={onOrdersClick} />
            {onLogoutClick && (
              <IonButton onClick={onLogoutClick} className="min-w-[44px] min-h-[44px]">
                <IonIcon icon={logOutOutline} className="text-xl sm:text-2xl text-[#EF4444]" />
              </IonButton>
            )}
            {!onLogoutClick && onProfileClick && (
              <IonButton onClick={onProfileClick} className="min-w-[44px] min-h-[44px]">
                <IonIcon icon={personOutline} className="text-xl sm:text-2xl text-[var(--ion-text-color)]" />
              </IonButton>
            )}
            {!onLogoutClick && !onProfileClick && onLoginClick && onRegisterClick && (
              <>
                <IonButton fill="clear" size="small" onClick={onLoginClick}
                  className="text-sm sm:text-base font-semibold min-h-[44px]"
                  style={{ '--color': 'var(--ion-color-primary)' }}
                >
                  Login
                </IonButton>
                <IonButton size="small" onClick={onRegisterClick}
                  className="hidden xs:inline-flex text-xs sm:text-sm font-semibold min-h-[44px]"
                  style={{ '--background': 'var(--ion-color-primary)', '--color': '#ffffff', '--border-radius': '6px' }}
                >
                  Register
                </IonButton>
              </>
            )}
          </IonButtons>
        </div>
      </IonToolbar>
    </IonHeader>
  );
};

const OrdersBadge: React.FC<{ onOrdersClick?: () => void }> = ({ onOrdersClick }) => {
  const { activeOrderCount } = useOrders();

  if (!onOrdersClick) return null;

  return (
    <IonButton onClick={onOrdersClick}>
      <div style={{ position: 'relative' }}>
        <IonIcon icon={documentTextOutline} style={{ fontSize: '24px', color: 'var(--ion-color-primary)' }} />
        {activeOrderCount > 0 && (
          <IonBadge className="cart-badge">{activeOrderCount}</IonBadge>
        )}
      </div>
    </IonButton>
  );
};

export default PageHeader;
