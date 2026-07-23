import React, { useState, useRef, useEffect } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { mailOutline, arrowBackOutline, checkmarkCircleOutline, refreshOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { resendOtp } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const OtpVerification: React.FC = () => {
  const history = useHistory();
  const { user, completeRegistration } = useAuth();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = user?.email || '';

  useEffect(() => {
    if (!user) {
      history.replace('/register');
      return;
    }
  }, [user, history]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newOtp.every(d => d) && newOtp.join('').length === 6) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = Array(6).fill('');
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
    if (pasted.length === 6) {
      handleVerify(pasted);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || !email) return;
    setCooldown(60);
    setError('');
    setOtp(Array(6).fill(''));
    inputRefs.current[0]?.focus();
    try {
      await resendOtp(email);
    } catch (err: any) {
      setError(err?.message || 'Failed to resend code. Please try again.');
    }
  };

  const handleVerify = async (code: string) => {
    if (code.length !== 6) return;
    setVerifying(true);
    setError('');
    try {
      await completeRegistration(code);
      setSuccess(true);
      setTimeout(() => {
        history.push('/customer/home');
      }, 1500);
    } catch (err: any) {
      const msg = err?.message === 'INVALID_OTP' ? 'Invalid code. Please try again.'
        : err?.message === 'OTP_EXPIRED' ? 'Code has expired. Request a new one.'
        : 'Verification failed. Please try again.';
      setError(msg);
      setOtp(Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleBack = () => {
    history.goBack();
  };

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '24px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '40px', color: 'white' }} />
        </div>
        <h2 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 700, color: 'var(--ion-text-color)' }}>Email Verified!</h2>
        <p style={{ margin: 0, color: 'var(--ion-text-color-secondary)', textAlign: 'center' }}>Redirecting you to the app...</p>
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-20 bg-[var(--ion-card-background)] border-b border-[var(--ion-border-color)]">
        <button onClick={handleBack} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--ion-color-primary)]">
          <IonIcon icon={arrowBackOutline} className="text-lg" />
        </button>
      </div>
      <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '60px', paddingBottom: '140px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--ion-color-primary)/10', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <IonIcon icon={mailOutline} style={{ fontSize: '28px', color: 'var(--ion-color-primary)' }} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ion-color-primary)', margin: '0 0 8px' }}>Verify Email</h1>
          <p style={{ color: 'var(--ion-text-color-secondary)', fontSize: '14px', margin: 0 }}>
            Enter the 6-digit code sent to<br />
            <strong style={{ color: 'var(--ion-text-color)' }}>{email}</strong>
          </p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '8px', marginBottom: '24px', color: '#991b1b', fontSize: '14px', border: '1px solid #fecaca', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '32px' }}
          onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              style={{
                width: '48px', height: '56px', textAlign: 'center', fontSize: '24px', fontWeight: 700,
                border: `2px solid ${digit ? 'var(--ion-color-primary)' : 'var(--ion-border-color)'}`,
                borderRadius: '12px', outline: 'none', background: 'var(--ion-card-background)',
                color: 'var(--ion-text-color)', caretColor: 'var(--ion-color-primary)',
              }}
            />
          ))}
        </div>

        <IonButton
          expand="block"
          style={{ marginBottom: '16px', height: '48px', fontSize: '16px', fontWeight: 600 }}
          disabled={verifying || otp.some(d => !d)}
          onClick={() => handleVerify(otp.join(''))}
        >
          {verifying ? 'Verifying...' : 'Verify Email'}
        </IonButton>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--ion-text-color-secondary)', fontSize: '13px', margin: '0 0 8px' }}>
            Didn't receive the code?
          </p>
          <IonButton
            fill="clear"
            size="small"
            disabled={cooldown > 0}
            onClick={handleResend}
            style={{ '--color': 'var(--ion-color-primary)' } as any}
          >
            <IonIcon slot="start" icon={refreshOutline} />
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
          </IonButton>
        </div>
      </div>
    </>
  );
};

export default OtpVerification;
