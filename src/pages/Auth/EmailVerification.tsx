import React, { useState, useEffect } from 'react';
import {
  IonButton,
  IonIcon,
  IonText,
} from '@ionic/react';
import { mailOutline, arrowBackOutline, checkmarkCircleOutline, refreshOutline } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { auth } from '../../firebaseConfig';
import { sendEmailVerification } from 'firebase/auth';

const EmailVerification: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const emailParam = query.get('email');

  const [email, setEmail] = useState(emailParam || '');
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!email && auth.currentUser?.email) {
      setEmail(auth.currentUser.email);
    }
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError('');
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      } else {
        throw new Error('NO_USER');
      }
      setSent(true);
      setCooldown(60);
    } catch (err) {
      setError('Could not send verification email. Make sure you are signed in.');
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

      <div className="max-w-md mx-auto pt-8 sm:pt-12 md:pt-16 pb-32 sm:pb-40 text-center">
        <div className="w-20 h-20 rounded-full bg-[var(--ion-color-primary)]/10 flex items-center justify-center mx-auto mb-6">
          <IonIcon icon={mailOutline} className="text-4xl text-[var(--ion-color-primary)]" />
        </div>

        <h1 className="text-2xl xs:text-3xl font-extrabold text-[var(--ion-text-color)] m-0 mb-3">
          Verify your email
        </h1>
        <p className="text-sm sm:text-base text-[var(--ion-text-color-secondary)] m-0 mb-2">
          We sent a verification link to
        </p>
        <p className="text-base font-semibold text-[var(--ion-color-primary)] m-0 mb-6">
          {email || 'your email'}
        </p>

        {sent && (
          <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-4 rounded-lg mb-6 text-sm border border-green-200 dark:border-green-800 flex items-start gap-3 text-left">
            <IonIcon icon={checkmarkCircleOutline} className="text-lg shrink-0 mt-0.5" />
            <span>Verification email sent! Check your inbox and spam folder.</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-6 text-sm border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <IonButton
          expand="block"
          size="large"
          className="min-h-[48px]"
          style={{
            '--background': 'var(--ion-color-primary)',
            '--border-radius': '8px',
            fontSize: '15px',
            fontWeight: 700,
            marginBottom: '12px'
          }}
          onClick={handleResend}
          disabled={cooldown > 0}
        >
          {cooldown > 0
            ? `Resend in ${cooldown}s`
            : 'Resend verification email'}
        </IonButton>

        <IonButton
          expand="block"
          size="large"
          fill="outline"
          className="min-h-[48px]"
          style={{
            '--border-radius': '8px',
            fontSize: '15px',
            fontWeight: 600,
            marginBottom: '24px',
            '--border-color': 'var(--ion-color-primary)',
          }}
          onClick={() => history.push('/login')}
        >
          <IonIcon icon={checkmarkCircleOutline} slot="start" />
          I've verified — go to login
        </IonButton>

        <div className="text-sm text-[var(--ion-text-color-secondary)]">
          Didn't receive the email? Check your spam folder or{' '}
          <button
            onClick={handleResend}
            className="text-[var(--ion-color-primary)] font-semibold bg-transparent border-none p-0 cursor-pointer underline"
          >
            send again
          </button>
        </div>
      </div>
    </>
  );
};

export default EmailVerification;
