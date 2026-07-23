import React, { useEffect, useState } from 'react';
import { IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  personOutline, shieldCheckmarkOutline,
  carOutline, storefrontOutline, checkmarkCircle, logOutOutline,
} from 'ionicons/icons';
import { useAuth } from '../../context/AuthContext';
import { getRoleRedirect } from '../../services/roleGuard';

const roleInfo: Record<string, { label: string; icon: string; description: string; color: string }> = {
  customer: { label: 'Customer', icon: personOutline, description: 'Browse stalls and order food', color: '#FF5A1F' },
  rider: { label: 'Rider', icon: carOutline, description: 'Deliver orders and earn', color: '#6366F1' },
  vendor: { label: 'Vendor', icon: storefrontOutline, description: 'Manage your store', color: '#06B6D4' },
  admin: { label: 'Admin', icon: shieldCheckmarkOutline, description: 'Manage the platform', color: '#DC2626' },
};

const roleHomePaths: Record<string, string> = {
  customer: '/customer/home',
  rider: '/rider/dashboard',
  vendor: '/vendor/dashboard',
  admin: '/admin/dashboard',
};

const RoleSelection: React.FC = () => {
  const history = useHistory();
  const { user, roles, setActiveRole, logout } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  useEffect(() => {
    if (roles.length === 1) {
      const single = roles[0];
      history.replace(roleHomePaths[single] || `/${single}/home`);
    }
  }, [roles, history]);

  const handleSelect = async (role: string) => {
    setSelected(role);
    setLoading(true);
    await setActiveRole(role);
    const redirect = getRoleRedirect(user!, role);
    history.replace(redirect || roleHomePaths[role] || `/${role}/home`);
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[var(--ion-color-primary)]/10 flex items-center justify-center mx-auto mb-4">
            <IonIcon icon={carOutline} className="text-2xl sm:text-3xl text-[var(--ion-color-primary)]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--ion-text-color)] m-0">Choose Your Role</h1>
          <p className="text-xs sm:text-sm text-[var(--ion-text-color-secondary)] mt-2 m-0">
            You have access to multiple roles. Pick one to continue.
          </p>
        </div>

        <div className="space-y-3">
          {roles.map(role => {
            const info = roleInfo[role] || { label: role, icon: personOutline, description: '', color: 'var(--ion-text-color)' };
            const isSelected = selected === role;
            return (
              <button
                key={role}
                onClick={() => handleSelect(role)}
                disabled={loading}
                className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 transition-all text-left min-h-[56px] sm:min-h-[64px] ${
                  isSelected
                    ? 'border-[var(--ion-color-primary)] bg-[var(--ion-color-primary)]/5'
                    : 'border-[var(--ion-border-color)] bg-[var(--ion-card-background)] hover:border-[var(--ion-color-primary)]/50'
                } ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${info.color}15` }}
                >
                  <IonIcon icon={info.icon} className="text-base sm:text-xl" style={{ color: info.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-[var(--ion-text-color)]">{info.label}</div>
                  {info.description && (
                    <div className="text-[10px] sm:text-xs text-[var(--ion-text-color-secondary)] mt-0.5">{info.description}</div>
                  )}
                </div>
                <div className="flex items-center shrink-0">
                  {isSelected && (
                    <IonIcon icon={checkmarkCircle} className="text-green-500 text-base sm:text-lg" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleLogout}
          className="w-full max-w-xs mx-auto mt-8 flex items-center justify-center gap-2 p-3 sm:p-4 rounded-xl border-2 border-[var(--ion-border-color)] bg-[var(--ion-card-background)] hover:border-[var(--ion-color-primary)]/50 transition-all text-[var(--ion-text-color-secondary)] hover:text-[var(--ion-color-primary)] text-sm sm:text-base font-medium cursor-pointer"
        >
          <IonIcon icon={logOutOutline} className="text-base sm:text-lg" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
