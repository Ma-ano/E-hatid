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
    <IonHeader className={`ion-no-border page-header-constrained ${customClass}`}>
      <IonToolbar
        style={{
          '--background': 'var(--ion-card-background)',
          '--border-color': 'transparent'
        } as any}
      >
        <IonButtons slot="start">
          {(showBack || showBackButton) && (
            <IonBackButton 
              defaultHref={backHref} 
              icon={arrowBack}
              style={{ '--color': '#6366F1' }}
            />
          )}
        </IonButtons>

        <IonTitle
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--ion-text-color)'
          }}
        >
          {showLogo ? (
            <span>
              <IonIcon icon={carOutline} style={{ verticalAlign: 'middle', marginRight: '6px', color: '#6366F1' }} />
              <span style={{ color: '#6366F1' }}>E-Hatid</span>
            </span>
          ) : (
            title
          )}
        </IonTitle>

        <IonButtons slot="end">
          {onCartClick && (
            <IonButton onClick={onCartClick}>
              <div style={{ position: 'relative' }}>
                <IonIcon icon={cartOutline} style={{ fontSize: '24px', color: '#6366F1' }} />
                {cartCount > 0 && (
                  <IonBadge className="cart-badge">{cartCount}</IonBadge>
                )}
              </div>
            </IonButton>
          )}
          <OrdersBadge onOrdersClick={onOrdersClick} />
          {onLogoutClick && (
            <IonButton onClick={onLogoutClick}>
              <IonIcon icon={logOutOutline} style={{ fontSize: '24px', color: '#EF4444' }} />
            </IonButton>
          )}
          {!onLogoutClick && onProfileClick && (
            <IonButton onClick={onProfileClick}>
              <IonIcon icon={personOutline} style={{ fontSize: '24px', color: 'var(--ion-text-color)' }} />
            </IonButton>
          )}
          {!onLogoutClick && !onProfileClick && onLoginClick && onRegisterClick && (
            <>
              <IonButton fill="clear" size="small" onClick={onLoginClick} style={{ '--color': '#6366F1', fontWeight: 600 }}>
                Login
              </IonButton>
              <IonButton size="small" onClick={onRegisterClick} style={{ '--background': '#6366F1', '--color': '#ffffff', '--border-radius': '6px', fontWeight: 600 }}>
                Register
              </IonButton>
            </>
          )}
        </IonButtons>
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
        <IonIcon icon={documentTextOutline} style={{ fontSize: '24px', color: '#6366F1' }} />
        {activeOrderCount > 0 && (
          <IonBadge className="cart-badge">{activeOrderCount}</IonBadge>
        )}
      </div>
    </IonButton>
  );
};

export default PageHeader;
