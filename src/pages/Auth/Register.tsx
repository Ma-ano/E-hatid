// src/pages/Auth/Register.tsx
import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonIcon,
  IonText,
  IonBackButton,
  IonButtons,
  IonLoading,
  IonCheckbox,
  IonLabel,
} from '@ionic/react';
import { personOutline, mailOutline, lockClosedOutline, callOutline, eyeOutline, eyeOffOutline, calendarOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getAuthErrorMessage } from '../../services/authService';
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



const Register: React.FC = () => {
  const history = useHistory();
  const { register } = useAuth();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [countryCode, setCountryCode] = useState('+63');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agreed) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: `${countryCode}${phoneNumber.replace(/^0+/, '').replace(/\s/g, '')}`,
        age: formData.age ? Number(formData.age) : undefined,
        address: formData.address,
        password: formData.password,
      });
      history.push('/user/home');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border page-header-constrained page-header-auth">
        <IonToolbar style={{ '--background': 'var(--ion-card-background)' } as any}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/guest/home" color="primary" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': 'var(--ion-background-color)' } as any}>
        <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '40px', paddingBottom: '140px' }}>
          {/* Header */}
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 800, 
              color: '#6366F1',
              marginBottom: '8px',
              margin: '0 0 12px 0'
            }}>
              Create Account
            </h1>
            <p style={{ color: 'var(--ion-text-color-secondary)', marginBottom: 0, fontSize: '15px' }}>
              Join our community of food lovers
            </p>
          </div>

          {error && (
            <div style={{ 
              background: '#fee2e2', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '24px',
              color: '#991b1b',
              fontSize: '14px',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--ion-text-color)', textTransform: 'uppercase', opacity: 0.7 }}>Full Name</label>
            <IonItem className="rider-input" style={{ marginBottom: '0', '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
              <IonIcon icon={personOutline} slot="start" color="primary" />
              <IonInput
                placeholder="Your full name"
                value={formData.name}
                onIonChange={e => setFormData({...formData, name: e.detail.value!})}
                style={{ '--color': 'var(--ion-text-color)' } as any}
              />
            </IonItem>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--ion-text-color)', textTransform: 'uppercase', opacity: 0.7 }}>Email</label>
            <IonItem className="rider-input" style={{ marginBottom: '0', '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
              <IonIcon icon={mailOutline} slot="start" color="primary" />
              <IonInput
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onIonChange={e => setFormData({...formData, email: e.detail.value!})}
                style={{ '--color': 'var(--ion-text-color)' } as any}
              />
            </IonItem>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--ion-text-color)', textTransform: 'uppercase', opacity: 0.7 }}>Phone</label>
            <div style={{ display: 'flex' }}>
              <select value={countryCode} onChange={e => setCountryCode(e.target.value)}
                style={{
                  padding: '12px', flexShrink: 0,
                  border: '1px solid var(--ion-border-color)',
                  borderRight: 'none',
                  borderRadius: '8px 0 0 8px',
                  background: 'var(--ion-card-background)', color: 'var(--ion-text-color)',
                  fontFamily: 'inherit', fontSize: '14px', cursor: 'pointer',
                  width: '110px',
                }}
              >
                {COUNTRY_CODES.map(c => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
              <input type="tel" value={(() => {
                const d = phoneNumber;
                if (d.length <= 3) return d;
                if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
                return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 10)}`;
              })()} onChange={e => {
                const digits = e.target.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 10);
                setPhoneNumber(digits);
              }}
                placeholder="912 345 6789"
                style={{
                  flex: 1, padding: '12px', borderRadius: '0 8px 8px 0',
                  border: '1px solid var(--ion-border-color)',
                  background: 'var(--ion-card-background)', color: 'var(--ion-text-color)',
                  fontFamily: 'inherit', fontSize: '14px',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--ion-text-color)', textTransform: 'uppercase', opacity: 0.7 }}>Age</label>
            <IonItem className="rider-input" style={{ marginBottom: '0', '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
              <IonInput
                type="number"
                placeholder="Your age"
                value={formData.age}
                onIonChange={e => setFormData({...formData, age: e.detail.value!})}
                style={{ '--color': 'var(--ion-text-color)' } as any}
              />
            </IonItem>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--ion-text-color)', textTransform: 'uppercase', opacity: 0.7 }}>Delivery Address</label>
            <IonItem className="rider-input" style={{ marginBottom: '0', '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
              <IonInput
                placeholder="Enter your delivery address"
                value={formData.address}
                onIonChange={e => setFormData({...formData, address: e.detail.value!})}
                style={{ '--color': 'var(--ion-text-color)' } as any}
              />
            </IonItem>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--ion-text-color)', textTransform: 'uppercase', opacity: 0.7 }}>Password</label>
            <IonItem className="rider-input" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
              <IonIcon icon={lockClosedOutline} slot="start" color="primary" />
              <IonInput
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onIonChange={e => setFormData({...formData, password: e.detail.value!})}
                style={{ '--color': 'var(--ion-text-color)' } as any}
              />
              <IonButton 
                fill="clear" 
                slot="end"
                onClick={() => setShowPassword(!showPassword)}
              >
                <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} color="primary" />
              </IonButton>
            </IonItem>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--ion-text-color)', textTransform: 'uppercase', opacity: 0.7 }}>Confirm Password</label>
            <IonItem className="rider-input" style={{ marginBottom: '0', '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
              <IonIcon icon={lockClosedOutline} slot="start" color="primary" />
              <IonInput
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onIonChange={e => setFormData({...formData, confirmPassword: e.detail.value!})}
                style={{ '--color': 'var(--ion-text-color)' } as any}
              />
            </IonItem>
          </div>

          <IonItem lines="none" style={{ '--background': 'transparent', marginBottom: '24px' } as any}>
            <IonCheckbox 
              slot="start"
              checked={agreed}
              onIonChange={e => setAgreed(e.detail.checked)}
              style={{ '--checkbox-background-checked': '#6366F1', '--border-color-checked': '#6366F1' } as any}
            />
            <IonLabel style={{ fontSize: '13px', color: 'var(--ion-text-color-secondary)' }}>
              I agree to the <span style={{ color: '#6366F1', fontWeight: 700 }}>Terms of Service</span> and{' '}
              <span style={{ color: '#6366F1', fontWeight: 700 }}>Privacy Policy</span>
            </IonLabel>
          </IonItem>

          <IonButton
            expand="block"
            size="large"
            className="rider-button"
            style={{
              '--background': '#6366F1',
              '--border-radius': '8px',
              height: '48px',
              fontSize: '16px',
              fontWeight: 700,
              marginBottom: '24px'
            }}
            onClick={handleRegister}
          >
            Create Account
          </IonButton>

          <div style={{ textAlign: 'center' }}>
            <span style={{ color: 'var(--ion-text-color-secondary)', fontSize: '14px' }}>
              Already have an account?{' '}
              <span 
                style={{ color: '#6366F1', fontWeight: 700, cursor: 'pointer' }}
                onClick={() => history.push('/user/login')}
              >
                Sign In
              </span>
            </span>
          </div>
        </div>

        <p style={{ textAlign: 'center', margin: '32px 0 16px', fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>
          By registering, you agree to our Terms of Service and Privacy Policy
        </p>
        <IonLoading isOpen={loading} message="Creating account..." />
      <AppFooter />
      </IonContent>
    </IonPage>
  );
};

export default Register;