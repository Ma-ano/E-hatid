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
          ionRouter.push('/customer/home');
      }
    }
  }, [user]);

  const getButtonColor = () => {
    switch (authType) {
      case 'admin': return '#DC2626';
      case 'rider': return 'var(--ion-color-primary)';
      default: return 'var(--ion-color-primary)';
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
          ionRouter.push('/customer/home');
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
        ionRouter.push('/customer/home');
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <>
      <div className="mb-3 sm:mb-4">
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

      <div className="mb-3 sm:mb-4">
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

      <div className="text-right mb-4 sm:mb-5">
        <IonButton fill="clear" className="text-xs sm:text-sm font-semibold h-auto p-0" style={{ '--color': getButtonColor() }}>
          Forgot Password?
        </IonButton>
      </div>

      <IonButton
        expand="block"
        className="min-h-[48px] mb-4 sm:mb-5"
        style={{ '--background': getButtonColor(), '--border-radius': '8px', fontSize: '15px', fontWeight: 700 }}
        onClick={handleLogin}
      >
        Sign In
      </IonButton>

      <div className="bg-[var(--ion-card-background)] rounded-xl border border-[var(--ion-border-color)] p-3 sm:p-4 mb-4 text-center">
        <p className="text-xs font-semibold text-[var(--ion-text-color-secondary)] m-0 mb-2">Test Credentials</p>
        <p className="text-[11px] sm:text-xs text-[var(--ion-text-color)] m-1 font-mono">📧 {getTestCredentials().email}</p>
        <p className="text-[11px] sm:text-xs text-[var(--ion-text-color)] m-1 font-mono">🔑 {getTestCredentials().password}</p>
      </div>

      <div className="text-center">
        <span className="text-xs sm:text-sm text-[var(--ion-text-color-secondary)]">
          Don't have an account?{' '}
          <span className="font-bold cursor-pointer hover:underline" style={{ color: getButtonColor() }} onClick={() => setIsLogin(false)}>
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
        <div className="mb-3 sm:mb-4">
          <label className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--ion-text-color)] uppercase opacity-70">Full Name</label>
          <IonItem className="rounded-lg overflow-hidden" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)', '--border-radius': '8px', '--min-height': '48px' } as any}>
            <IonIcon icon={personOutline} slot="start" color="primary" />
            <IonInput
              placeholder="Your full name"
              value={formData.name}
              onIonChange={e => setFormData({...formData, name: e.detail.value!})}
              className="[--color:var(--ion-text-color)]"
            />
          </IonItem>
        </div>

        <div className="mb-3 sm:mb-4">
          <label className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--ion-text-color)] uppercase opacity-70">Email</label>
          <IonItem className="rounded-lg overflow-hidden" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)', '--border-radius': '8px', '--min-height': '48px' } as any}>
            <IonIcon icon={mailOutline} slot="start" color="primary" />
            <IonInput
              type="email"
              placeholder="your@email.com"
              value={email}
              onIonChange={e => setEmail(e.detail.value!)}
              className="[--color:var(--ion-text-color)]"
            />
          </IonItem>
        </div>

          <div className="mb-3 sm:mb-4">
            <label className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--ion-text-color)] uppercase opacity-70">Phone</label>
            <div className="flex gap-2">
              <select value={countryCode} onChange={e => setCountryCode(e.target.value)}
                className="p-2.5 sm:p-3 rounded-lg shrink-0 border border-[var(--ion-border-color)] bg-[var(--ion-card-background)] text-[var(--ion-text-color)] text-xs sm:text-sm cursor-pointer w-24 sm:w-28 outline-none"
              >
                {COUNTRY_CODES.map(c => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
              <input type="tel" value={phoneNumber} onChange={e => { const digits = e.target.value.replace(/\D/g, ''); setPhoneNumber(formatPhone(digits, countryCode)); }}
                placeholder="912 345 6789"
                className="flex-1 p-2.5 sm:p-3 rounded-lg border border-[var(--ion-border-color)] bg-[var(--ion-card-background)] text-[var(--ion-text-color)] text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[var(--ion-color-primary)]"
              />
            </div>
          </div>

          <div className="mb-3 sm:mb-4">
            <label className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--ion-text-color)] uppercase opacity-70">Age</label>
            <IonItem className="rounded-lg overflow-hidden" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)', '--border-radius': '8px', '--min-height': '48px' } as any}>
              <IonInput
                type="number"
                placeholder="Your age"
                value={formData.age}
                onIonChange={e => setFormData({...formData, age: e.detail.value!})}
                className="[--color:var(--ion-text-color)]"
              />
            </IonItem>
          </div>

          <div className="mb-3 sm:mb-4">
            <label className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--ion-text-color)] uppercase opacity-70">Delivery Address</label>
            <IonItem className="rounded-lg overflow-hidden" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)', '--border-radius': '8px', '--min-height': '48px' } as any}>
              <IonInput
                placeholder="Enter your delivery address"
                value={formData.address}
                onIonChange={e => setFormData({...formData, address: e.detail.value!})}
                className="[--color:var(--ion-text-color)]"
              />
            </IonItem>
          </div>

          {authType === 'rider' && (
          <>
            <div className="mb-3 sm:mb-4">
              <label className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--ion-text-color)] uppercase opacity-70">Vehicle</label>
              <IonItem className="rounded-lg overflow-hidden" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)', '--border-radius': '8px', '--min-height': '48px' } as any}>
                <IonIcon icon={carOutline} slot="start" color="primary" />
                <IonInput
                  placeholder="e.g., Honda CB500F"
                  value={formData.vehicle}
                  onIonChange={e => setFormData({...formData, vehicle: e.detail.value!})}
                  className="[--color:var(--ion-text-color)]"
                />
              </IonItem>
            </div>

            <div className="mb-3 sm:mb-4">
              <label className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--ion-text-color)] uppercase opacity-70">License Plate</label>
              <IonItem className="rounded-lg overflow-hidden" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)', '--border-radius': '8px', '--min-height': '48px' } as any}>
                <IonIcon icon={documentOutline} slot="start" color="primary" />
                <IonInput
                  placeholder="e.g., ABC-1234"
                  value={formData.licensePlate}
                  onIonChange={e => setFormData({...formData, licensePlate: e.detail.value!})}
                  className="[--color:var(--ion-text-color)]"
                />
              </IonItem>
            </div>

            <div className="mb-3 sm:mb-4">
              <label className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--ion-text-color)] uppercase opacity-70">License Number</label>
              <IonItem className="rounded-lg overflow-hidden" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)', '--border-radius': '8px', '--min-height': '48px' } as any}>
                <IonIcon icon={documentOutline} slot="start" color="primary" />
                <IonInput
                  placeholder="Your license number"
                  value={formData.licenseNumber}
                  onIonChange={e => setFormData({...formData, licenseNumber: e.detail.value!})}
                  className="[--color:var(--ion-text-color)]"
                />
              </IonItem>
            </div>

            <div className="mb-3 sm:mb-4">
              <label className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--ion-text-color)] uppercase opacity-70">Bank Name</label>
              <IonItem className="rounded-lg overflow-hidden" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)', '--border-radius': '8px', '--min-height': '48px' } as any}>
                <IonIcon icon={businessOutline} slot="start" color="primary" />
                <IonInput
                  placeholder="e.g., Philippine National Bank"
                  value={formData.bankName}
                  onIonChange={e => setFormData({...formData, bankName: e.detail.value!})}
                  className="[--color:var(--ion-text-color)]"
                />
              </IonItem>
            </div>

            <div className="mb-3 sm:mb-4">
              <label className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--ion-text-color)] uppercase opacity-70">Bank Account Number</label>
              <IonItem className="rounded-lg overflow-hidden" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)', '--border-radius': '8px', '--min-height': '48px' } as any}>
                <IonIcon icon={businessOutline} slot="start" color="primary" />
                <IonInput
                  placeholder="Your account number"
                  value={formData.bankAccount}
                  onIonChange={e => setFormData({...formData, bankAccount: e.detail.value!})}
                  className="[--color:var(--ion-text-color)]"
                />
              </IonItem>
            </div>
          </>
        )}

        <div className="mb-3 sm:mb-4">
          <label className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--ion-text-color)] uppercase opacity-70">Password</label>
          <IonItem className="rounded-lg overflow-hidden" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)', '--border-radius': '8px', '--min-height': '48px' } as any}>
            <IonIcon icon={lockClosedOutline} slot="start" color="primary" />
            <IonInput
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onIonChange={e => setPassword(e.detail.value!)}
              className="[--color:var(--ion-text-color)]"
            />
            <IonButton fill="clear" slot="end" onClick={() => setShowPassword(!showPassword)} className="min-h-[44px] min-w-[44px]">
              <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} color="primary" />
            </IonButton>
          </IonItem>
        </div>

        <div className="mb-3 sm:mb-4">
          <label className="block mb-2 text-xs sm:text-sm font-semibold text-[var(--ion-text-color)] uppercase opacity-70">Confirm Password</label>
          <IonItem className="rounded-lg overflow-hidden" style={{ '--background': 'var(--ion-card-background)', '--border': '1px solid var(--ion-border-color)', '--border-radius': '8px', '--min-height': '48px' } as any}>
            <IonIcon icon={lockClosedOutline} slot="start" color="primary" />
            <IonInput
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onIonChange={e => setConfirmPassword(e.detail.value!)}
              className="[--color:var(--ion-text-color)]"
            />
          </IonItem>
        </div>

        <div className="flex items-start gap-3 mb-4 sm:mb-5">
          <IonCheckbox
            checked={agreed}
            onIonChange={e => setAgreed(e.detail.checked)}
            className="mt-0.5 shrink-0"
            style={{ '--checkbox-background-checked': getButtonColor(), '--border-color-checked': getButtonColor() } as any}
          />
          <span className="text-xs sm:text-sm text-[var(--ion-text-color-secondary)] leading-relaxed">
            I agree to the <span className="font-bold" style={{ color: getButtonColor() }}>Terms of Service</span> and{' '}
            <span className="font-bold" style={{ color: getButtonColor() }}>Privacy Policy</span>
          </span>
        </div>

        <IonButton
          expand="block"
          className="min-h-[48px] mb-4 sm:mb-5"
          style={{ '--background': getButtonColor(), '--border-radius': '8px', fontSize: '15px', fontWeight: 700 }}
          onClick={handleRegister}
        >
          Create Account
        </IonButton>

        <div className="text-center">
          <span className="text-xs sm:text-sm text-[var(--ion-text-color-secondary)]">
            Already have an account?{' '}
            <span className="font-bold cursor-pointer hover:underline" style={{ color: getButtonColor() }} onClick={() => setIsLogin(true)}>
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

      <IonContent className="ion-padding">
        <div className="max-w-md mx-auto pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-12">
          <div className="mb-6 sm:mb-8 text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">{getIcon()}</div>
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-extrabold m-0 mb-2" style={{ color: getButtonColor() }}>
              {getTitle()}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--ion-text-color-secondary)] m-0">{getSubtitle()}</p>
          </div>

          <div className="flex gap-2 sm:gap-3 mb-5 sm:mb-6">
            <IonButton
              expand="block"
              fill={authType === 'user' ? 'solid' : 'outline'}
              onClick={() => { setAuthType('user'); setIsLogin(true); }}
              className="min-h-[44px] text-xs sm:text-sm"
              style={{ '--background': authType === 'user' ? 'var(--ion-color-primary)' : 'transparent', '--color': authType === 'user' ? '#fff' : 'var(--ion-color-primary)', '--border-color': 'var(--ion-color-primary)' } as any}
            >
              <IonIcon icon={peopleOutline} slot="start" className="text-sm" />
              User
            </IonButton>
            <IonButton
              expand="block"
              fill={authType === 'rider' ? 'solid' : 'outline'}
              onClick={() => { setAuthType('rider'); setIsLogin(true); }}
              className="min-h-[44px] text-xs sm:text-sm"
              style={{ '--background': authType === 'rider' ? 'var(--ion-color-primary)' : 'transparent', '--color': authType === 'rider' ? '#fff' : 'var(--ion-color-primary)', '--border-color': 'var(--ion-color-primary)' } as any}
            >
              <IonIcon icon={bicycleOutline} slot="start" className="text-sm" />
              Rider
            </IonButton>
            <IonButton
              expand="block"
              fill={authType === 'admin' ? 'solid' : 'outline'}
              onClick={() => { setAuthType('admin'); setIsLogin(true); }}
              className="min-h-[44px] text-xs sm:text-sm"
              style={{ '--background': authType === 'admin' ? '#DC2626' : 'transparent', '--color': authType === 'admin' ? '#fff' : '#DC2626', '--border-color': '#DC2626' } as any}
            >
              <IonIcon icon={storefrontOutline} slot="start" className="text-sm" />
              Admin
            </IonButton>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-5 text-sm border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          {isLogin ? renderLoginForm() : renderRegisterForm()}
        </div>

        <p className="text-center my-6 sm:my-8 text-[10px] sm:text-xs text-[var(--ion-text-color-secondary)] px-4">
          {authType === 'admin' ? 'Admin access only. Authorized users only.' : 'By continuing, you agree to our Terms of Service and Privacy Policy'}
        </p>
        <IonLoading isOpen={loading} message={isLogin ? 'Signing in...' : 'Creating account...'} />
      <AppFooter />
      </IonContent>
    </IonPage>
  );
};

export default Auth;