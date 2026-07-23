import React, { useState } from 'react';
import {
  IonButton,
  IonInput,
  IonItem,
  IonIcon,
  IonLoading,
} from '@ionic/react';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, arrowBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAuthErrorMessage } from '../../services/authService';

const Login: React.FC = () => {
  const history = useHistory();
  const { login } = useAuth();
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
    } catch (err) {
      const msg = getAuthErrorMessage(err);
      if (msg === 'NO_ROLES') {
        setError('Your account has no assigned roles. Please contact support.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-20 bg-[var(--ion-card-background)] border-b border-[var(--ion-border-color)]">
        <button
          onClick={() => history.goBack()}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--ion-color-primary)]"
        >
          <IonIcon icon={arrowBackOutline} className="text-lg" />
        </button>
      </div>

      <div className="max-w-md mx-auto pt-8 sm:pt-12 md:pt-16 pb-32 sm:pb-40">
        <div className="mb-8 sm:mb-10 text-center">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-[var(--ion-color-primary)] m-0 mb-2 sm:mb-3">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base text-[var(--ion-text-color-secondary)] m-0">
            Sign in to continue
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-6 text-sm border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--ion-text-color)] uppercase opacity-70">Email</label>
          <IonItem className="rounded-lg overflow-hidden" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)', '--border-radius': '8px', '--min-height': '48px' } as any}>
            <IonIcon icon={mailOutline} slot="start" color="primary" />
            <IonInput
              type="email"
              placeholder="your@email.com"
              value={email}
              onIonChange={e => setEmail(e.detail.value!)}
              className="[--padding-start:8px] [--color:var(--ion-text-color)]"
            />
          </IonItem>
        </div>

        <div className="mb-3">
          <label className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--ion-text-color)] uppercase opacity-70">Password</label>
          <IonItem className="rounded-lg overflow-hidden" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)', '--border-radius': '8px', '--min-height': '48px' } as any}>
            <IonIcon icon={lockClosedOutline} slot="start" color="primary" />
            <IonInput
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onIonChange={e => setPassword(e.detail.value!)}
              className="[--padding-start:8px] [--color:var(--ion-text-color)]"
            />
            <IonButton fill="clear" slot="end" onClick={() => setShowPassword(!showPassword)} className="min-h-[44px] min-w-[44px]">
              <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} color="primary" />
            </IonButton>
          </IonItem>
        </div>

        <div className="text-right mb-6">
          <IonButton fill="clear" className="text-xs sm:text-sm font-semibold h-auto p-0" style={{ '--color': 'var(--ion-color-primary)' }}>
            Forgot Password?
          </IonButton>
        </div>

        <IonButton
          expand="block"
          size="large"
          className="min-h-[48px]"
          style={{
            '--background': 'var(--ion-color-primary)',
            '--border-radius': '8px',
            fontSize: '15px',
            fontWeight: 700,
            marginBottom: '24px'
          }}
          onClick={handleLogin}
        >
          Sign In
        </IonButton>

        <div className="text-center">
          <span className="text-sm text-[var(--ion-text-color-secondary)]">
            Don't have an account?{' '}
            <span className="text-[var(--ion-color-primary)] font-bold cursor-pointer hover:underline" onClick={() => history.push('/register')}>
              Sign Up
            </span>
          </span>
        </div>
      </div>

      <p className="text-center my-8 text-xs text-[var(--ion-text-color-secondary)] px-4">
        By logging in, you agree to our Terms of Service and Privacy Policy
      </p>
      <IonLoading isOpen={loading} message="Signing in..." />
    </>
  );
};

export default Login;
