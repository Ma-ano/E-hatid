import React, { useState, useEffect } from 'react';

const CONSENT_KEY = 'foodie_consent';

const StorageConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consented = localStorage.getItem(CONSENT_KEY);
    if (!consented) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99999,
      background: 'var(--ion-card-background)', color: 'var(--ion-text-color)',
      borderTop: '1px solid var(--ion-border-color)',
      padding: '14px 16px', paddingBottom: 'calc(14px + env(safe-area-inset-bottom, 0px))',
      display: 'flex', alignItems: 'center', gap: '12px',
      boxShadow: '0 -2px 12px rgba(0,0,0,0.1)',
      animation: 'slideUp 0.3s ease',
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
      <p style={{ flex: 1, margin: 0, fontSize: '13px', lineHeight: 1.4 }}>
        We use local storage to remember your preferences and cart items. By continuing, you agree to this.
      </p>
      <button onClick={accept} style={{
        flexShrink: 0, padding: '8px 20px', borderRadius: '8px', border: 'none',
        background: 'var(--ion-color-primary)', color: '#fff',
        fontSize: '13px', fontWeight: 600, cursor: 'pointer',
      }}>
        Accept
      </button>
    </div>
  );
};

export default StorageConsent;
