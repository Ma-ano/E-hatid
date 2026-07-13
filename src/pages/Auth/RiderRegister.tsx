// src/pages/Auth/RiderRegister.tsx
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
import { personOutline, mailOutline, lockClosedOutline, callOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getAuthErrorMessage } from '../../services/authService';
import AppFooter from '../../components/AppFooter';

const RiderRegister: React.FC = () => {
  const history = useHistory();
  const { register } = useAuth();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
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
        phone: formData.phone,
        password: formData.password,
      });
      history.push('/rider/home');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
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
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚴</div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 800, 
              color: 'var(--ion-color-primary)',
              marginBottom: '8px',
              margin: '0 0 12px 0'
            }}>
              Join as Rider
            </h1>
            <p style={{ color: 'var(--ion-text-color-secondary)', marginBottom: 0, fontSize: '15px' }}>
              Start your delivery journey
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
            <IonItem className="rider-input" style={{ marginBottom: '0', '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
              <IonIcon icon={callOutline} slot="start" color="primary" />
              <IonInput
                type="tel"
                placeholder="(02) 8-634-1111"
                value={formData.phone}
                onIonChange={e => setFormData({...formData, phone: e.detail.value!})}
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
              style={{ '--checkbox-background-checked': 'var(--ion-color-primary)', '--border-color-checked': 'var(--ion-color-primary)' } as any}
            />
            <IonLabel style={{ fontSize: '13px', color: 'var(--ion-text-color-secondary)' }}>
              I agree to the <span style={{ color: 'var(--ion-color-primary)', fontWeight: 700 }}>Terms of Service</span> and{' '}
              <span style={{ color: 'var(--ion-color-primary)', fontWeight: 700 }}>Privacy Policy</span>
            </IonLabel>
          </IonItem>

          <IonButton
            expand="block"
            size="large"
            className="rider-button"
            style={{
              '--background': 'var(--ion-color-primary)',
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
                style={{ color: 'var(--ion-color-primary)', fontWeight: 700, cursor: 'pointer' }}
                onClick={() => history.push('/rider/login')}
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

export default RiderRegister;
