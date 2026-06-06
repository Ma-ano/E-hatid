import React, { useState, useEffect } from 'react';
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

const COUNTRY_CODES = [
  { code: '+63', label: 'PH +63' },
  { code: '+1', label: 'US +1' },
  { code: '+44', label: 'UK +44' },
  { code: '+65', label: 'SG +65' },
  { code: '+61', label: 'AU +61' },
  { code: '+81', label: 'JP +81' },
  { code: '+852', label: 'HK +852' },
];

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

const isGappable = (raw: string) => {
  const stripped = raw.replace(/[\s()-]/g, '');
  return /^\d*$/.test(stripped);
};

const formatLandline = (digits: string) => {
  let result = '';
  for (let i = 0; i < digits.length; i++) {
    if (i === 0) result += '(';
    if (i === 2) result += ') ';
    if (i === 3) result += '-';
    if (i === 6) result += '-';
    result += digits[i];
  }
  return result;
};

const VendorRegister: React.FC = () => {
  const history = useHistory();
  const { register } = useAuth();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    stallName: '',
    stallAddress: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [countryCode, setCountryCode] = useState('+63');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isGapMode, setIsGapMode] = useState(true);
  const [phoneType, setPhoneType] = useState<'mobile' | 'company'>('mobile');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isGapMode || phoneType === 'company') return;
    let digits = phoneNumber.replace(/\D/g, '');
    if (digits.startsWith('0')) digits = digits.slice(1);
    digits = digits.slice(0, 10);
    const formatted = formatPhone(digits, countryCode);
    if (formatted !== phoneNumber) setPhoneNumber(formatted);
  }, [countryCode]);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.stallName) {
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
        password: formData.password,
        phone: phoneType === 'mobile'
          ? `${countryCode}${phoneNumber.replace(/\s/g, '')}`
          : phoneNumber,
        stallName: formData.stallName,
        stallAddress: formData.stallAddress,
        role: 'vendor',
      } as any);
      history.push('/vendor/dashboard');
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
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏪</div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 800, 
              color: '#8B5CF6',
              marginBottom: '8px',
              margin: '0 0 12px 0'
            }}>
              Register Your Stall
            </h1>
            <p style={{ color: 'var(--ion-text-color-secondary)', marginBottom: 0, fontSize: '15px' }}>
              Start selling and grow your business
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
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--ion-text-color)', textTransform: 'uppercase', opacity: 0.7 }}>Stall Name</label>
            <IonItem className="rider-input" style={{ marginBottom: '0', '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
              <IonIcon icon={personOutline} slot="start" color="primary" />
              <IonInput
                placeholder="Your stall name"
                value={formData.stallName}
                onIonChange={e => setFormData({...formData, stallName: e.detail.value!})}
                style={{ '--color': 'var(--ion-text-color)' } as any}
              />
            </IonItem>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--ion-text-color)', textTransform: 'uppercase', opacity: 0.7 }}>Stall Address</label>
            <IonItem className="rider-input" style={{ marginBottom: '0', '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
              <IonIcon icon={personOutline} slot="start" color="primary" />
              <IonInput
                placeholder="Your stall address"
                value={formData.stallAddress}
                onIonChange={e => setFormData({...formData, stallAddress: e.detail.value!})}
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
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              <button onClick={() => setPhoneType('mobile')}
                style={{
                  flex: 1, padding: '6px', borderRadius: '6px', cursor: 'pointer',
                  border: phoneType === 'mobile' ? '2px solid #6366F1' : '1px solid var(--ion-border-color)',
                  background: phoneType === 'mobile' ? '#6366F1' : 'var(--ion-card-background)',
                  color: phoneType === 'mobile' ? '#fff' : 'var(--ion-text-color)',
                  fontFamily: 'inherit', fontSize: '13px', fontWeight: 600,
                }}
              >
                Mobile
              </button>
              <button onClick={() => setPhoneType('company')}
                style={{
                  flex: 1, padding: '6px', borderRadius: '6px', cursor: 'pointer',
                  border: phoneType === 'company' ? '2px solid #6366F1' : '1px solid var(--ion-border-color)',
                  background: phoneType === 'company' ? '#6366F1' : 'var(--ion-card-background)',
                  color: phoneType === 'company' ? '#fff' : 'var(--ion-text-color)',
                  fontFamily: 'inherit', fontSize: '13px', fontWeight: 600,
                }}
              >
                Company / Landline
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {phoneType === 'mobile' && (
                <select value={countryCode} onChange={e => setCountryCode(e.target.value)}
                  style={{
                    padding: '12px', borderRadius: '8px', flexShrink: 0,
                    border: '1px solid var(--ion-border-color)',
                    background: 'var(--ion-card-background)', color: 'var(--ion-text-color)',
                    fontFamily: 'inherit', fontSize: '14px', cursor: 'pointer',
                    width: '110px',
                  }}
                >
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
              )}
              <input type="tel" value={phoneNumber} onChange={e => {
                const raw = e.target.value;
                if (!isGappable(raw)) return;
                setIsGapMode(true);
                let digits = raw.replace(/\D/g, '');
                if (phoneType === 'mobile' && digits.startsWith('0')) {
                  digits = digits.slice(1);
                }
                digits = digits.slice(0, 10);
                setPhoneNumber(
                  phoneType === 'mobile'
                    ? formatPhone(digits, countryCode)
                    : formatLandline(digits)
                );
              }}
                placeholder={phoneType === 'mobile' ? "912 345 6789" : "(02) 8-634-1111"}
                style={{
                  flex: 1, padding: '12px', borderRadius: '8px',
                  border: '1px solid var(--ion-border-color)',
                  background: 'var(--ion-card-background)', color: 'var(--ion-text-color)',
                  fontFamily: 'inherit', fontSize: '14px',
                }}
              />
            </div>
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
              style={{ '--checkbox-background-checked': '#8B5CF6', '--border-color-checked': '#8B5CF6' } as any}
            />
            <IonLabel style={{ fontSize: '13px', color: 'var(--ion-text-color-secondary)' }}>
              I agree to the <span style={{ color: '#8B5CF6', fontWeight: 700 }}>Terms of Service</span> and{' '}
              <span style={{ color: '#8B5CF6', fontWeight: 700 }}>Privacy Policy</span>
            </IonLabel>
          </IonItem>

          <IonButton
            expand="block"
            size="large"
            className="rider-button"
            style={{
              '--background': '#8B5CF6',
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
                style={{ color: '#8B5CF6', fontWeight: 700, cursor: 'pointer' }}
                onClick={() => history.push('/vendor/login')}
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

export default VendorRegister;
