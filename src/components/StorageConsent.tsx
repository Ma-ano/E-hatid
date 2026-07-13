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
    <div className="fixed bottom-0 left-0 right-0 z-[99999] bg-[var(--ion-card-background)] text-[var(--ion-text-color)] border-t border-[var(--ion-border-color)] px-3 sm:px-4 py-3 sm:py-4 shadow-lg animate-[slideUp_0.3s_ease]"
      style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex items-center gap-3 max-w-4xl mx-auto">
        <p className="flex-1 m-0 text-xs sm:text-sm leading-relaxed">
          We use local storage to remember your preferences and cart items. By continuing, you agree to this.
        </p>
        <button onClick={accept}
          className="shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg border-none bg-[var(--ion-color-primary)] text-white text-xs sm:text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity min-h-[36px]"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default StorageConsent;
