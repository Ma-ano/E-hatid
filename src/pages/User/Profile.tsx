// src/pages/User/Profile.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { personOutline, mailOutline, callOutline, locationOutline, logOutOutline, cameraOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import AppFooter from '../../components/AppFooter';

const COUNTRY_CODES = [
  { code: '+63', label: 'PH +63' },
  { code: '+1', label: 'US +1' },
  { code: '+44', label: 'UK +44' },
  { code: '+65', label: 'SG +65' },
  { code: '+61', label: 'AU +61' },
  { code: '+81', label: 'JP +81' },
  { code: '+852', label: 'HK +852' },
];

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const PHONE_FORMATS: Record<string, number[]> = {
  '+63': [3, 3, 4],
  '+1':  [3, 3, 4],
  '+44': [4, 3, 4],
  '+65': [4, 4],
  '+61': [3, 3, 3],
  '+81': [2, 4, 4],
  '+852':[4, 4],
};

const formatPhone = (digits: string, code: string) => {
  const groups = PHONE_FORMATS[code] || [3, 3, 4];
  let result = '';
  let i = 0;
  for (const size of groups) {
    if (i >= digits.length) break;
    if (result) result += ' ';
    result += digits.slice(i, i + size);
    i += size;
  }
  if (i < digits.length) result += ' ' + digits.slice(i);
  return result;
};

const UserProfile: React.FC = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const { itemCount } = useCart();
  const history = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPhone = user?.phone || '+63';
  const currentCountryCode = COUNTRY_CODES.find(c => currentPhone.startsWith(c.code))?.code || '+63';
  const currentNumber = currentPhone.startsWith(currentCountryCode)
    ? currentPhone.slice(currentCountryCode.length).replace(/\s/g, '')
    : currentPhone.replace(/\s/g, '');

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [emailError, setEmailError] = useState(
    user?.email && !isValidEmail(user.email) ? 'Invalid email address' : ''
  );
  const [countryCode, setCountryCode] = useState(currentCountryCode);
  const [phoneNumber, setPhoneNumber] = useState(formatPhone(currentNumber, currentCountryCode));
  const [phoneError, setPhoneError] = useState(
    currentNumber && currentNumber.length < 7 ? 'Phone must be at least 7 digits' : currentNumber === '' ? 'Phone is required' : ''
  );
  const [address, setAddress] = useState(user?.address || '');
  const [age, setAge] = useState(user?.age?.toString() || '');

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setAddress(user?.address || '');
    setAge(user?.age?.toString() || '');
    setEmailError(user?.email && !isValidEmail(user.email) ? 'Invalid email address' : '');
    const phone = user?.phone || '+63';
    const code = COUNTRY_CODES.find(c => phone.startsWith(c.code))?.code || '+63';
    const digits = phone.startsWith(code) ? phone.slice(code.length).replace(/\s/g, '') : phone.replace(/\s/g, '');
    setCountryCode(code);
    setPhoneNumber(formatPhone(digits, code));
    setPhoneError(
      digits && digits.length < 7 ? 'Phone must be at least 7 digits' : digits === '' ? 'Phone is required' : ''
    );
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateUserProfile({ avatar: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateUserProfile({
      name,
      email,
      phone: `${countryCode}${phoneNumber.replace(/\s/g, '')}`,
      address,
      age: age ? Number(age) : undefined,
    });
    history.push('/user/home');
  };

  return (
    <IonPage>
      <PageHeader
        title="My Profile"
        showBack={true}
        backHref="/user/home"
        cartCount={itemCount}
        onCartClick={() => history.push('/user/cart')}
        onOrdersClick={() => history.push('/user/orders')}
        onProfileClick={() => history.push('/user/profile')}
      />

      <IonContent style={{ '--background': 'var(--ion-background-color)' } as any}>
        <div className="page-container" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
          {/* Avatar */}
          <div style={{ textAlign: 'center', marginBottom: '32px', paddingTop: '16px' }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '88px', height: '88px', borderRadius: '50%',
                margin: '0 auto 16px', cursor: 'pointer', position: 'relative',
                overflow: 'hidden', background: 'var(--ion-color-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <IonIcon icon={personOutline} style={{ fontSize: '44px', color: '#fff' }} />
              )}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'rgba(0,0,0,0.4)', padding: '4px 0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IonIcon icon={cameraOutline} style={{ fontSize: '14px', color: '#fff' }} />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ion-text-color)', margin: '0 0 4px 0' }}>
              {name}
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--ion-text-color-secondary)', margin: 0 }}>
              Member since 2024
            </p>
          </div>

          {/* Contact Info */}
          <div style={{
            background: 'var(--ion-card-background)', borderRadius: '12px',
            padding: '16px', marginBottom: '24px',
            border: '1px solid var(--ion-border-color)',
          }}>
            <h3 style={{
              fontSize: '14px', fontWeight: 600, color: 'var(--ion-text-color)',
              marginBottom: '16px', textTransform: 'uppercase', opacity: 0.7,
            }}>
              Contact Information
            </h3>

            {/* Name */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <IonIcon icon={personOutline} style={{ marginRight: '8px', color: 'var(--ion-color-primary)' }} />
                <span style={{ fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>Full Name</span>
              </div>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                style={{
                  width: '100%', padding: '10px', borderRadius: '8px',
                  border: '1px solid var(--ion-border-color)',
                  background: 'var(--ion-background-color)', color: 'var(--ion-text-color)',
                  fontFamily: 'inherit', fontSize: '14px',
                }}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <IonIcon icon={mailOutline} style={{ marginRight: '8px', color: 'var(--ion-color-primary)' }} />
                <span style={{ fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>Email</span>
              </div>
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setEmailError(isValidEmail(e.target.value) ? '' : 'Invalid email address'); }}
                style={{
                  width: '100%', padding: '10px', borderRadius: '8px',
                  border: '1px solid var(--ion-border-color)',
                  background: 'var(--ion-background-color)', color: 'var(--ion-text-color)',
                  fontFamily: 'inherit', fontSize: '14px',
                }}
              />
              {emailError && <span style={{ color: 'var(--ion-color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{emailError}</span>}
            </div>

            {/* Address */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <IonIcon icon={locationOutline} style={{ marginRight: '8px', color: 'var(--ion-color-primary)' }} />
                <span style={{ fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>Delivery Address</span>
              </div>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                placeholder="Enter your delivery address"
                style={{
                  width: '100%', padding: '10px', borderRadius: '8px',
                  border: '1px solid var(--ion-border-color)',
                  background: 'var(--ion-background-color)', color: 'var(--ion-text-color)',
                  fontFamily: 'inherit', fontSize: '14px',
                }}
              />
            </div>

            {/* Age */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>Age</span>
              </div>
              <input type="number" value={age} onChange={e => setAge(e.target.value)}
                placeholder="Your age"
                style={{
                  width: '100%', padding: '10px', borderRadius: '8px',
                  border: '1px solid var(--ion-border-color)',
                  background: 'var(--ion-background-color)', color: 'var(--ion-text-color)',
                  fontFamily: 'inherit', fontSize: '14px',
                }}
              />
            </div>

            {/* Phone */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <IonIcon icon={callOutline} style={{ marginRight: '8px', color: 'var(--ion-color-primary)' }} />
                <span style={{ fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>Phone</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select value={countryCode} onChange={e => setCountryCode(e.target.value)}
                  style={{
                    padding: '8px', borderRadius: '8px', flexShrink: 0,
                    border: '1px solid var(--ion-border-color)',
                    background: 'var(--ion-background-color)', color: 'var(--ion-text-color)',
                    fontFamily: 'inherit', fontSize: '14px', cursor: 'pointer',
                  }}
                >
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
                <input type="tel" value={phoneNumber} onChange={e => { const digits = e.target.value.replace(/\D/g, ''); setPhoneNumber(formatPhone(digits, countryCode)); setPhoneError(digits.length >= 7 ? '' : digits.length === 0 ? 'Phone is required' : 'Phone must be at least 7 digits'); }}
                  placeholder="9123456789"
                  style={{
                    flex: 1, padding: '10px', borderRadius: '8px',
                    border: '1px solid var(--ion-border-color)',
                    background: 'var(--ion-background-color)', color: 'var(--ion-text-color)',
                    fontFamily: 'inherit', fontSize: '14px',
                  }}
                />
              </div>
              {phoneError && <span style={{ color: 'var(--ion-color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{phoneError}</span>}
            </div>
          </div>

          {/* Save Button */}
          <IonButton expand="block" onClick={handleSave} disabled={!!emailError || !!phoneError || !name.trim() || !email.trim()}
            style={{
              '--background': 'var(--ion-color-primary)',
              '--border-radius': '8px',
              height: '48px', fontSize: '16px', fontWeight: 600,
              marginBottom: '12px',
            }}
          >
            Save Changes
          </IonButton>

          {/* Sign Out */}
          <IonButton expand="block" color="danger" onClick={() => { logout(); history.push('/guest/home'); }}
            style={{
              '--border-radius': '8px', height: '48px', fontSize: '16px', fontWeight: 600,
            }}
          >
            <IonIcon icon={logOutOutline} slot="start" />
            Sign Out
          </IonButton>
        </div>
      <AppFooter />
      </IonContent>
    </IonPage>
  );
};

export default UserProfile;
