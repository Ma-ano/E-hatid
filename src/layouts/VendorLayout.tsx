import React, { useState } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  appsOutline, apps,
  fastFoodOutline, fastFood,
  documentTextOutline, documentText,
  cashOutline, cash,
  starOutline, star,
  settingsOutline, settings,
  menuOutline, closeOutline,
} from 'ionicons/icons';

const sidebarItems = [
  { label: 'Dashboard', icon: appsOutline, activeIcon: apps, path: '/vendor/dashboard' },
  { label: 'Products', icon: fastFoodOutline, activeIcon: fastFood, path: '/vendor/products' },
  { label: 'Orders', icon: documentTextOutline, activeIcon: documentText, path: '/vendor/orders' },
  { label: 'Earnings', icon: cashOutline, activeIcon: cash, path: '/vendor/earnings' },
  { label: 'Reviews', icon: starOutline, activeIcon: star, path: '/vendor/reviews' },
  { label: 'Settings', icon: settingsOutline, activeIcon: settings, path: '/vendor/settings' },
];

const VendorLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const history = useHistory();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <IonPage>
      <IonContent>
        <div className="flex min-h-full">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`fixed lg:sticky top-0 left-0 z-50 h-full w-64 bg-[var(--ion-card-background)] border-r border-[var(--ion-border-color)] transform transition-transform duration-200 lg:translate-x-0 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-[var(--ion-border-color)]">
              <span className="text-lg font-bold text-[var(--ion-text-color)]">Vendor</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--ion-text-color-secondary)]"
              >
                <IonIcon icon={closeOutline} className="text-xl" />
              </button>
            </div>
            <nav className="p-2 space-y-1">
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => { history.push(item.path); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                      isActive
                        ? 'bg-[var(--ion-color-primary)]/10 text-[var(--ion-color-primary)]'
                        : 'text-[var(--ion-text-color-secondary)] hover:bg-[var(--ion-border-color)]/50'
                    }`}
                  >
                    <IonIcon icon={isActive ? item.activeIcon : item.icon} className="text-lg shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Top bar (mobile) */}
            <div className="sticky top-0 z-30 lg:hidden bg-[var(--ion-card-background)] border-b border-[var(--ion-border-color)]">
              <div className="flex items-center h-14 px-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--ion-text-color)]"
                >
                  <IonIcon icon={menuOutline} className="text-xl" />
                </button>
                <span className="ml-2 text-base font-bold text-[var(--ion-text-color)]">Vendor</span>
              </div>
            </div>
            <div className="p-3 sm:p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default VendorLayout;
