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
  IonSegment,
  IonSegmentButton,
  IonList,
} from '@ionic/react';
import { 
  personOutline, 
  mailOutline, 
  lockClosedOutline, 
  callOutline, 
  eyeOutline, 
  eyeOffOutline, 
  carOutline, 
  documentOutline, 
  businessOutline,
  storefrontOutline,
  peopleOutline,
  bicycleOutline
} from 'ionicons/icons';
import { useIonRouter } from '@ionic/react';
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

type AuthType = 'user' | 'rider' | 'admin';

const Auth: React.FC = () => {
  const ionRouter = useIonRouter();
  const { login, register, user, isRoleAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();

  const [authType, setAuthType] = useState<AuthType>('user');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    address: '',
    vehicle: '',
    licensePlate: '',
    licenseNumber: '',
    bankAccount: '',
    bankName: ''
  });
  const [countryCode, setCountryCode] = useState('+63');
  const [phoneNumber, setPhoneNumber] = useState('');

  React.useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'admin':
          ionRouter.push('/admin/dashboard');
          break;
        case 'rider':
          ionRouter.push('/rider/home');
          break;
        default:
          ionRouter.push('/user/home');
      }
    }
  }, [user]);

  const getButtonColor = () => {
    switch (authType) {
      case 'admin': return '#DC2626';
      case 'rider': return '#6366F1';
      default: return '#6366F1';
    }
  };

  const getTitle = () => {
    if (!isLogin) {
      switch (authType) {
        case 'admin': return 'Admin Access';
        case 'rider': return 'Join as Rider';
        default: return 'Create Account';
      }
    }
    switch (authType) {
      case 'admin': return 'Admin Login';
      case 'rider': return 'Rider Login';
      default: return 'Welcome Back';
    }
  };

  const getSubtitle = () => {
    if (!isLogin) {
      switch (authType) {
        case 'admin': return 'Authorized personnel only';
        case 'rider': return 'Start your delivery journey';
        default: return 'Join our community of food lovers';
      }
    }
    switch (authType) {
      case 'admin': return 'Manage your platform';
      case 'rider': return 'Start delivering and earn money';
      default: return 'Sign in to continue';
    }
  };

  const getIcon = () => {
    switch (authType) {
      case 'admin': return '🛡️';
      case 'rider': return '🚴';
      default: return '👤';
    }
  };

  const getTestCredentials = () => {
    switch (authType) {
      case 'admin':
        return { email: 'admin@example.com', password: 'Admin@123' };
      case 'rider':
        return { email: 'rider@example.com', password: 'Rider@123' };
      default:
        return { email: 'user@example.com', password: 'User@123' };
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      switch (authType) {
        case 'admin':
          ionRouter.push('/admin/dashboard');
          break;
        case 'rider':
          const savedAuth = localStorage.getItem('auth_user');
          if (savedAuth) {
            const authData = JSON.parse(savedAuth);
            if (authData.user?.verificationStatus === 'pending') {
              ionRouter.push('/rider/pending-approval');
              return;
            }
          }
          ionRouter.push('/rider/home');
          break;
        default:
          ionRouter.push('/user/home');
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    if (authType !== 'user' && (!formData.vehicle || !formData.licensePlate)) {
      setError('Please fill in vehicle information');
      return;
    }
    if (authType === 'rider' && (!formData.bankAccount || !formData.bankName)) {
      setError('Please fill in bank information');
      return;
    }
    if (password !== confirmPassword) {
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
        email,
        password,
        phone: `${countryCode}${phoneNumber.replace(/\s/g, '')}`,
        age: formData.age ? Number(formData.age) : undefined,
        address: formData.address,
        ...(authType === 'rider' && {
          vehicle: formData.vehicle,
          licensePlate: formData.licensePlate,
          licenseNumber: formData.licenseNumber,
          bankAccount: formData.bankAccount,
          bankName: formData.bankName,
          role: 'rider'
        })
      });
      if (authType === 'rider') {
        ionRouter.push('/rider/pending-approval');
      } else if (authType === 'admin') {
        ionRouter.push('/admin/dashboard');
      } else {
        ionRouter.push('/user/home');
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <>
      <div className="form-group-mobile">
        <label className="form-label">Email</label>
        <IonItem className="rider-input" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
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

      <div className="form-group-mobile">
        <label className="form-label">Password</label>
        <IonItem className="rider-input" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
          <IonIcon icon={lockClosedOutline} slot="start" color="primary" />
          <IonInput
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
            style={{ '--padding-start': '8px', '--color': 'var(--ion-text-color)' } as any}
          />
          <IonButton fill="clear" slot="end" onClick={() => setShowPassword(!showPassword)}>
            <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} color="primary" />
          </IonButton>
        </IonItem>
      </div>

      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <IonButton fill="clear" style={{ '--color': getButtonColor(), fontSize: '13px', fontWeight: 600, padding: '0', height: 'auto' }}>
          Forgot Password?
        </IonButton>
      </div>

      <IonButton
        expand="block"
        className="mobile-button"
        style={{ '--background': getButtonColor(), marginBottom: '20px' }}
        onClick={handleLogin}
      >
        Sign In
      </IonButton>

      <div className="mobile-card" style={{ marginBottom: '16px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: 'var(--ion-text-color-secondary)', margin: '0 0 8px 0', fontWeight: 600 }}>Test Credentials</p>
        <p style={{ fontSize: '12px', color: 'var(--ion-text-color)', margin: '4px 0', fontFamily: 'monospace' }}>📧 {getTestCredentials().email}</p>
        <p style={{ fontSize: '12px', color: 'var(--ion-text-color)', margin: '4px 0', fontFamily: 'monospace' }}>🔑 {getTestCredentials().password}</p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <span className="text-base" style={{ color: 'var(--ion-text-color-secondary)' }}>
          Don't have an account?{' '}
          <span style={{ color: getButtonColor(), fontWeight: 700, cursor: 'pointer' }} onClick={() => setIsLogin(false)}>
            Sign Up
          </span>
        </span>
      </div>
    </>
  );

  const renderRegisterForm = () => {
    if (authType === 'admin') {
      return (
        <div>
          <div style={{
            background: 'var(--ion-card-background)',
            padding: '20px',
            borderRadius: '12px',
            border: '2px solid #DC2626',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <IonIcon icon={personOutline} style={{ fontSize: '32px', color: '#DC2626', marginBottom: '12px', display: 'block' }} />
            <p style={{ margin: 0, color: 'var(--ion-text-color)', fontWeight: 600 }}>
              Admin registration is restricted.
            </p>
            <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'var(--ion-text-color-secondary)' }}>
              Contact your administrator to request access.
            </p>
          </div>

          <IonButton expand="block" onClick={() => setIsLogin(true)} style={{ '--background': '#DC2626' }}>
            Back to Admin Login
          </IonButton>
        </div>
      );
    }

    return (
      <>
        <div className="form-group-mobile">
          <label className="form-label">Full Name</label>
          <IonItem className="rider-input" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
            <IonIcon icon={personOutline} slot="start" color="primary" />
            <IonInput
              placeholder="Your full name"
              value={formData.name}
              onIonChange={e => setFormData({...formData, name: e.detail.value!})}
              style={{ '--color': 'var(--ion-text-color)' } as any}
            />
          </IonItem>
        </div>

        <div className="form-group-mobile">
          <label className="form-label">Email</label>
          <IonItem className="rider-input" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
            <IonIcon icon={mailOutline} slot="start" color="primary" />
            <IonInput
              type="email"
              placeholder="your@email.com"
              value={email}
              onIonChange={e => setEmail(e.detail.value!)}
              style={{ '--color': 'var(--ion-text-color)' } as any}
            />
          </IonItem>
        </div>

          <div className="form-group-mobile">
            <label className="form-label">Phone</label>
            <div style={{ display: 'flex', gap: '8px' }}>
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
              <input type="tel" value={phoneNumber} onChange={e => { const digits = e.target.value.replace(/\D/g, ''); setPhoneNumber(formatPhone(digits, countryCode)); }}
                placeholder="912 345 6789"
                style={{
                  flex: 1, padding: '12px', borderRadius: '8px',
                  border: '1px solid var(--ion-border-color)',
                  background: 'var(--ion-card-background)', color: 'var(--ion-text-color)',
                  fontFamily: 'inherit', fontSize: '14px',
                }}
              />
            </div>
          </div>

          <div className="form-group-mobile">
            <label className="form-label">Age</label>
            <IonItem className="rider-input" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
              <IonInput
                type="number"
                placeholder="Your age"
                value={formData.age}
                onIonChange={e => setFormData({...formData, age: e.detail.value!})}
                style={{ '--color': 'var(--ion-text-color)' } as any}
              />
            </IonItem>
          </div>

          <div className="form-group-mobile">
            <label className="form-label">Delivery Address</label>
            <IonItem className="rider-input" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
              <IonInput
                placeholder="Enter your delivery address"
                value={formData.address}
                onIonChange={e => setFormData({...formData, address: e.detail.value!})}
                style={{ '--color': 'var(--ion-text-color)' } as any}
              />
            </IonItem>
          </div>

          {authType === 'rider' && (
          <>
            <div className="form-group-mobile">
              <label className="form-label">Vehicle</label>
              <IonItem className="rider-input" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
                <IonIcon icon={carOutline} slot="start" color="primary" />
                <IonInput
                  placeholder="e.g., Honda CB500F"
                  value={formData.vehicle}
                  onIonChange={e => setFormData({...formData, vehicle: e.detail.value!})}
                  style={{ '--color': 'var(--ion-text-color)' } as any}
                />
              </IonItem>
            </div>

            <div className="form-group-mobile">
              <label className="form-label">License Plate</label>
              <IonItem className="rider-input" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
                <IonIcon icon={documentOutline} slot="start" color="primary" />
                <IonInput
                  placeholder="e.g., ABC-1234"
                  value={formData.licensePlate}
                  onIonChange={e => setFormData({...formData, licensePlate: e.detail.value!})}
                  style={{ '--color': 'var(--ion-text-color)' } as any}
                />
              </IonItem>
            </div>

            <div className="form-group-mobile">
              <label className="form-label">License Number</label>
              <IonItem className="rider-input" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
                <IonIcon icon={documentOutline} slot="start" color="primary" />
                <IonInput
                  placeholder="Your license number"
                  value={formData.licenseNumber}
                  onIonChange={e => setFormData({...formData, licenseNumber: e.detail.value!})}
                  style={{ '--color': 'var(--ion-text-color)' } as any}
                />
              </IonItem>
            </div>

            <div className="form-group-mobile">
              <label className="form-label">Bank Name</label>
              <IonItem className="rider-input" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
                <IonIcon icon={businessOutline} slot="start" color="primary" />
                <IonInput
                  placeholder="e.g., Philippine National Bank"
                  value={formData.bankName}
                  onIonChange={e => setFormData({...formData, bankName: e.detail.value!})}
                  style={{ '--color': 'var(--ion-text-color)' } as any}
                />
              </IonItem>
            </div>

            <div className="form-group-mobile">
              <label className="form-label">Bank Account Number</label>
              <IonItem className="rider-input" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
                <IonIcon icon={businessOutline} slot="start" color="primary" />
                <IonInput
                  placeholder="Your account number"
                  value={formData.bankAccount}
                  onIonChange={e => setFormData({...formData, bankAccount: e.detail.value!})}
                  style={{ '--color': 'var(--ion-text-color)' } as any}
                />
              </IonItem>
            </div>
          </>
        )}

        <div className="form-group-mobile">
          <label className="form-label">Password</label>
          <IonItem className="rider-input" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
            <IonIcon icon={lockClosedOutline} slot="start" color="primary" />
            <IonInput
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onIonChange={e => setPassword(e.detail.value!)}
              style={{ '--color': 'var(--ion-text-color)' } as any}
            />
            <IonButton fill="clear" slot="end" onClick={() => setShowPassword(!showPassword)}>
              <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} color="primary" />
            </IonButton>
          </IonItem>
        </div>

        <div className="form-group-mobile">
          <label className="form-label">Confirm Password</label>
          <IonItem className="rider-input" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)' } as any}>
            <IonIcon icon={lockClosedOutline} slot="start" color="primary" />
            <IonInput
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onIonChange={e => setConfirmPassword(e.detail.value!)}
              style={{ '--color': 'var(--ion-text-color)' } as any}
            />
          </IonItem>
        </div>

        <IonItem lines="none" style={{ '--background': 'transparent', marginBottom: '20px' } as any}>
          <IonCheckbox 
            slot="start"
            checked={agreed}
            onIonChange={e => setAgreed(e.detail.checked)}
            style={{ '--checkbox-background-checked': getButtonColor(), '--border-color-checked': getButtonColor() } as any}
          />
          <IonLabel style={{ fontSize: '13px', color: 'var(--ion-text-color-secondary)' }}>
            I agree to the <span style={{ color: getButtonColor(), fontWeight: 700 }}>Terms of Service</span> and{' '}
            <span style={{ color: getButtonColor(), fontWeight: 700 }}>Privacy Policy</span>
          </IonLabel>
        </IonItem>

        <IonButton
          expand="block"
          className="mobile-button"
          style={{ '--background': getButtonColor(), marginBottom: '20px' }}
          onClick={handleRegister}
        >
          Create Account
        </IonButton>

        <div style={{ textAlign: 'center' }}>
          <span className="text-base" style={{ color: 'var(--ion-text-color-secondary)' }}>
            Already have an account?{' '}
            <span style={{ color: getButtonColor(), fontWeight: 700, cursor: 'pointer' }} onClick={() => setIsLogin(true)}>
              Sign In
            </span>
          </span>
        </div>
      </>
    );
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
        <div className="auth-container">
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>{getIcon()}</div>
            <h1 className="auth-title" style={{ color: getButtonColor() }}>
              {getTitle()}
            </h1>
            <p className="auth-subtitle">{getSubtitle()}</p>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <IonButton 
              expand="block" 
              fill={authType === 'user' ? 'solid' : 'outline'}
              onClick={() => { setAuthType('user'); setIsLogin(true); }}
              style={{ '--background': authType === 'user' ? '#6366F1' : 'transparent', '--color': authType === 'user' ? '#fff' : '#6366F1', '--border-color': '#6366F1' } as any}
            >
              <IonIcon icon={peopleOutline} slot="start" />
              User
            </IonButton>
            <IonButton 
              expand="block" 
              fill={authType === 'rider' ? 'solid' : 'outline'}
              onClick={() => { setAuthType('rider'); setIsLogin(true); }}
              style={{ '--background': authType === 'rider' ? '#6366F1' : 'transparent', '--color': authType === 'rider' ? '#fff' : '#6366F1', '--border-color': '#6366F1' } as any}
            >
              <IonIcon icon={bicycleOutline} slot="start" />
              Rider
            </IonButton>
            <IonButton 
              expand="block" 
              fill={authType === 'admin' ? 'solid' : 'outline'}
              onClick={() => { setAuthType('admin'); setIsLogin(true); }}
              style={{ '--background': authType === 'admin' ? '#DC2626' : 'transparent', '--color': authType === 'admin' ? '#fff' : '#DC2626', '--border-color': '#DC2626' } as any}
            >
              <IonIcon icon={storefrontOutline} slot="start" />
              Admin
            </IonButton>
          </div>

          {error && (
            <div className="error-alert">
              {error}
            </div>
          )}

          {isLogin ? renderLoginForm() : renderRegisterForm()}
        </div>

        <p style={{ textAlign: 'center', margin: '32px 0 16px', fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>
          {authType === 'admin' ? 'Admin access only. Authorized users only.' : 'By continuing, you agree to our Terms of Service and Privacy Policy'}
        </p>
        <IonLoading isOpen={loading} message={isLogin ? 'Signing in...' : 'Creating account...'} />
      <AppFooter />
      </IonContent>
    </IonPage>
  );
};

export default Auth;