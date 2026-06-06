// src/pages/Auth/RiderLogin.tsx
import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonIcon,
  IonText,
  IonBackButton,
  IonButtons,
  IonLoading,
} from '@ionic/react';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getAuthErrorMessage } from '../../services/authService';
import AppFooter from '../../components/AppFooter';

const RiderLogin: React.FC = () => {
  const history = useHistory();
  const { login } = useAuth();
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      await login(email, password);
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
              color: '#6366F1',
              marginBottom: '8px',
              margin: '0 0 12px 0'
            }}>
              Rider Login
            </h1>
            <p style={{ color: 'var(--ion-text-color-secondary)', marginBottom: 0, fontSize: '15px' }}>
              Start delivering and earn money
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

          {/* Email Input */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--ion-text-color)', textTransform: 'uppercase', opacity: 0.7 }}>Email</label>
            <IonItem className="rider-input" style={{ marginBottom: '0', '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
              <IonIcon icon={mailOutline} slot="start" color="primary" />
              <IonInput
                type="email"
                placeholder="your@email.com"
                value={email}
                onIonChange={e => setEmail(e.detail.value!)}
                style={{ '--padding-start': '8px', '--color': 'var(--ion-text-color)' } as any}
              />
            </IonItem>
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--ion-text-color)', textTransform: 'uppercase', opacity: 0.7 }}>Password</label>
            <IonItem className="rider-input" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
              <IonIcon icon={lockClosedOutline} slot="start" color="primary" />
              <IonInput
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onIonChange={e => setPassword(e.detail.value!)}
                style={{ '--padding-start': '8px', '--color': 'var(--ion-text-color)' } as any}
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

          <div style={{ textAlign: 'right', marginBottom: '24px' }}>
            <IonButton fill="clear" style={{ 
              '--color': '#6366F1', 
              fontSize: '13px',
              fontWeight: 600,
              padding: '0',
              height: 'auto'
            }}>
              Forgot Password?
            </IonButton>
          </div>

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
            onClick={handleLogin}
          >
            Sign In
          </IonButton>

          {/* Sign Up Link */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: 'var(--ion-text-color-secondary)', fontSize: '14px' }}>
              Don't have an account?{' '}
              <span 
                style={{ color: '#6366F1', fontWeight: 700, cursor: 'pointer' }}
                onClick={() => history.push('/rider/register')}
              >
                Sign Up
              </span>
            </span>
          </div>
        </div>

        <p style={{ textAlign: 'center', margin: '32px 0 16px', fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>
          By logging in as a rider, you agree to our Terms of Service and Privacy Policy
        </p>
        <IonLoading isOpen={loading} message="Signing in..." />
      <AppFooter />
      </IonContent>
    </IonPage>
  );
};

export default RiderLogin;
