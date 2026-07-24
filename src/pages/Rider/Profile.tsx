// src/pages/Rider/Profile.tsx
import React, { useState, useEffect } from 'react';
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonToggle,
  IonSpinner,
  IonToast,
} from '@ionic/react';
import { personOutline, callOutline, mailOutline, carOutline, starOutline, saveOutline, logOutOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { getRoleProfile, updateRoleProfile, updateUserDocument } from '../../services/userService';

const RiderProfile: React.FC = () => {
  const history = useHistory();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    licensePlate: '',
    licenseNumber: '',
    rating: 0,
    totalDeliveries: 0,
    bankAccount: '',
    bankName: '',
  });

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const loadProfile = async () => {
      try {
        const profileData = await getRoleProfile(user.id, 'rider');
        setProfile({
          name: user.name || profileData?.fullName || '',
          email: user.email || profileData?.contactEmail || '',
          phone: user.phone || profileData?.contactPhone || '',
          vehicle: profileData?.vehicleType || user.vehicle || '',
          licensePlate: profileData?.licensePlate || user.licensePlate || '',
          licenseNumber: profileData?.driverLicenseNumber || user.licenseNumber || '',
          rating: profileData?.rating || 0,
          totalDeliveries: profileData?.totalDeliveries || 0,
          bankAccount: user.bankAccount || profileData?.bankAccount || '',
          bankName: user.bankName || profileData?.bankName || '',
        });
        console.log('Rider profile loaded from Firestore');
      } catch (err) {
        console.error('Error loading rider profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserDocument(user.id, {
        name: profile.name,
        phone: profile.phone,
        vehicle: profile.vehicle,
        licensePlate: profile.licensePlate,
        licenseNumber: profile.licenseNumber,
        bankAccount: profile.bankAccount,
        bankName: profile.bankName,
      } as any);
      await updateRoleProfile(user.id, 'rider', {
        fullName: profile.name,
        contactEmail: profile.email,
        contactPhone: profile.phone,
        vehicleType: profile.vehicle,
        licensePlate: profile.licensePlate,
        driverLicenseNumber: profile.licenseNumber,
        bankAccount: profile.bankAccount,
        bankName: profile.bankName,
      });
      console.log('Rider profile saved to Firestore');
      setToastMessage('Profile saved successfully');
      setShowToast(true);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving rider profile:', err);
      setToastMessage('Failed to save profile');
      setShowToast(true);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <IonSpinner name="crescent" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">

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
              disabled={saving}
              onClick={handleSave}
              style={{ '--background': 'var(--ion-color-primary)', margin: '0 0 12px' }}
            >
              <IonIcon slot="start" icon={saveOutline} />
              {saving ? 'Saving...' : 'Save Changes'}
            </IonButton>
          )}
          <IonButton 
            expand="block" 
            fill="outline"
            className="md:hidden"
            style={{ '--border-color': '#EF4444', '--color': '#EF4444', margin: 0 }}
            onClick={handleLogout}
          >
            <IonIcon slot="start" icon={logOutOutline} />
            Logout
          </IonButton>
        </div>
        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={3000}
          onDidDismiss={() => setShowToast(false)}
          position="bottom"
          color={toastMessage.includes('Failed') ? 'danger' : 'success'}
        />
    </div>
  );
};

export default RiderProfile;
