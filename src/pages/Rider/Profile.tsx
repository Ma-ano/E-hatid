// src/pages/Rider/Profile.tsx
import React, { useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonBadge,
} from '@ionic/react';
import { personOutline, callOutline, mailOutline, carOutline, starOutline, saveOutline, logOutOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';

const RiderProfile: React.FC = () => {
  const history = useHistory();
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [profile, setProfile] = useState({
    name: 'Juan Dela Cruz',
    email: 'juan@example.com',
    phone: '+63 912 345 6789',
    vehicle: 'Honda CB500F',
    licensePlate: 'XYZ-1234',
    licenseNumber: '123456789',
    rating: 4.8,
    totalDeliveries: 245,
    bankAccount: '1234567890',
    bankName: 'Philippine National Bank',
  });

  const handleInputChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  return (
    <>
      <PageHeader 
        showLogo={true}
        onProfileClick={handleLogout}
      />

        {/* Rider Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '8px',
          padding: '16px',
          overflowX: 'auto',
          background: 'var(--ion-card-background)',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px'
        }}>
          <IonButton
            expand="block"
            style={{
              '--background': 'transparent',
              '--color': 'var(--ion-text-color)',
              height: '40px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'none',
              flex: '1',
              minWidth: '80px'
            }}
            onClick={() => history.push('/rider/home')}
          >
            🏠 Home
          </IonButton>
          <IonButton
            expand="block"
            style={{
              '--background': 'transparent',
              '--color': 'var(--ion-text-color)',
              height: '40px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'none',
              flex: '1',
              minWidth: '80px'
            }}
            onClick={() => history.push('/rider/orders')}
          >
            📦 Orders
          </IonButton>
          <IonButton
            expand="block"
            style={{
              '--background': 'transparent',
              '--color': 'var(--ion-text-color)',
              height: '40px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'none',
              flex: '1',
              minWidth: '80px'
            }}
            onClick={() => history.push('/rider/earnings')}
          >
            💰 Earnings
          </IonButton>
          <IonButton
            expand="block"
            style={{
              '--background': 'var(--ion-color-primary)',
              '--color': '#FFFFFF',
              height: '40px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'none',
              flex: '1',
              minWidth: '80px'
            }}
          >
            👤 Profile
          </IonButton>
        </div>

        {/* Quick Access Menu */}
        <div style={{
          padding: '0 16px 16px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '10px'
        }}>
          <div 
            onClick={() => history.push('/activities')}
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #FF5A1F 0%, #FF7A3D 100%)',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'center',
              color: 'white'
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>📋</div>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: 600 }}>Activity</p>
          </div>
          <div 
            onClick={() => history.push('/messages')}
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'center',
              color: 'white'
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>💬</div>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: 600 }}>Messages</p>
          </div>
          <div 
            onClick={() => history.push('/report')}
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'center',
              color: '#1F2937'
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>⚠️</div>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: 600 }}>Report</p>
          </div>
        </div>

        {/* Profile Header */}
        <div style={{ padding: '24px 16px', textAlign: 'center', background: 'linear-gradient(135deg, #FF5A1F 0%, #FF7A3D 100%)' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid rgba(255, 255, 255, 0.5)'
          }}>
            <IonIcon icon={personOutline} style={{ fontSize: '40px', color: 'white' }} />
          </div>
          <h2 style={{ margin: '0 0 8px', color: 'white', fontWeight: 700 }}>{profile.name}</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'center', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', background: 'rgba(255,255,255,0.2)', borderRadius: '20px' }}>
              <span style={{ fontSize: '16px', color: '#FCD34D' }}>★</span>
              <span style={{ color: 'white', fontWeight: 600, fontSize: '13px' }}>{profile.rating}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', background: 'rgba(255,255,255,0.2)', borderRadius: '20px' }}>
              <span style={{ color: 'white', fontSize: '13px' }}>🚚</span>
              <span style={{ color: 'white', fontWeight: 600, fontSize: '13px' }}>{profile.totalDeliveries} Deliveries</span>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
              Personal Information
            </h3>
            <IonButton 
              fill="clear" 
              size="small"
              onClick={() => setIsEditing(!isEditing)}
              style={{ '--color': 'var(--ion-color-primary)', margin: 0 }}
            >
              {isEditing ? 'Done' : 'Edit'}
            </IonButton>
          </div>

          <IonCard style={{ margin: '0 0 12px', background: 'var(--ion-card-background)' }}>
            <IonCardContent style={{ padding: '16px' }}>
              {isEditing ? (
                <>
                  <IonItem lines="none" style={{ '--background': 'transparent', marginBottom: '12px' } as any}>
                    <IonIcon icon={personOutline} slot="start" style={{ color: 'var(--ion-color-primary)' }} />
                    <IonInput 
                      placeholder="Full Name"
                      value={profile.name}
                      onIonChange={(e) => handleInputChange('name', e.detail.value!)}
                      style={{ '--padding-start': '12px' }}
                    />
                  </IonItem>
                  <IonItem lines="none" style={{ '--background': 'transparent', marginBottom: '12px' } as any}>
                    <IonIcon icon={mailOutline} slot="start" style={{ color: 'var(--ion-color-primary)' }} />
                    <IonInput 
                      placeholder="Email"
                      value={profile.email}
                      onIonChange={(e) => handleInputChange('email', e.detail.value!)}
                      style={{ '--padding-start': '12px' }}
                    />
                  </IonItem>
                  <IonItem lines="none" style={{ '--background': 'transparent' } as any}>
                    <IonIcon icon={callOutline} slot="start" style={{ color: 'var(--ion-color-primary)' }} />
                    <IonInput 
                      placeholder="Phone"
                      value={profile.phone}
                      onIonChange={(e) => handleInputChange('phone', e.detail.value!)}
                      style={{ '--padding-start': '12px' }}
                    />
                  </IonItem>
                </>
              ) : (
                <>
                  <div style={{ margin: '0 0 12px' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>Full Name</p>
                    <p style={{ margin: '4px 0 0', color: 'var(--ion-text-color)', fontWeight: 600 }}>{profile.name}</p>
                  </div>
                  <div style={{ margin: '0 0 12px' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>Email</p>
                    <p style={{ margin: '4px 0 0', color: 'var(--ion-text-color)', fontWeight: 600 }}>{profile.email}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>Phone</p>
                    <p style={{ margin: '4px 0 0', color: 'var(--ion-text-color)', fontWeight: 600 }}>{profile.phone}</p>
                  </div>
                </>
              )}
            </IonCardContent>
          </IonCard>
        </div>

        {/* Vehicle Information */}
        <div style={{ padding: '0 16px 16px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
            Vehicle Information
          </h3>

          <IonCard style={{ margin: 0, background: 'var(--ion-card-background)' }}>
            <IonCardContent style={{ padding: '16px' }}>
              <div style={{ margin: '0 0 12px' }}>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>Vehicle</p>
                <p style={{ margin: '4px 0 0', color: 'var(--ion-text-color)', fontWeight: 600 }}>{profile.vehicle}</p>
              </div>
              <div style={{ margin: '0 0 12px' }}>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>License Plate</p>
                <p style={{ margin: '4px 0 0', color: 'var(--ion-text-color)', fontWeight: 600 }}>{profile.licensePlate}</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>License Number</p>
                <p style={{ margin: '4px 0 0', color: 'var(--ion-text-color)', fontWeight: 600 }}>{profile.licenseNumber}</p>
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Banking Information */}
        <div style={{ padding: '0 16px 16px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
            Banking Information
          </h3>

          <IonCard style={{ margin: 0, background: 'var(--ion-card-background)' }}>
            <IonCardContent style={{ padding: '16px' }}>
              <div style={{ margin: '0 0 12px' }}>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>Bank Name</p>
                <p style={{ margin: '4px 0 0', color: 'var(--ion-text-color)', fontWeight: 600 }}>{profile.bankName}</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>Account Number</p>
                <p style={{ margin: '4px 0 0', color: 'var(--ion-text-color)', fontWeight: 600 }}>{profile.bankAccount}</p>
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Notifications */}
        <div style={{ padding: '0 16px 16px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
            Preferences
          </h3>

          <IonCard style={{ margin: 0, background: 'var(--ion-card-background)' }}>
            <IonItem lines="none" style={{ '--background': 'transparent' } as any}>
              <IonLabel>Enable Notifications</IonLabel>
              <IonToggle 
                checked={notificationsEnabled} 
                onIonChange={(e) => setNotificationsEnabled(e.detail.checked)}
                slot="end"
                style={{ '--background-checked': 'var(--ion-color-primary)' }}
              />
            </IonItem>
          </IonCard>
        </div>

        {/* Action Buttons */}
        <div style={{ padding: '0 16px 16px' }}>
          {isEditing && (
            <IonButton 
              expand="block" 
              style={{ '--background': 'var(--ion-color-primary)', margin: '0 0 12px' }}
            >
              <IonIcon slot="start" icon={saveOutline} />
              Save Changes
            </IonButton>
          )}
          <IonButton 
            expand="block" 
            fill="outline"
            style={{ '--border-color': '#EF4444', '--color': '#EF4444', margin: 0 }}
            onClick={handleLogout}
          >
            <IonIcon slot="start" icon={logOutOutline} />
            Logout
          </IonButton>
        </div>
    </>
  );
};

export default RiderProfile;
