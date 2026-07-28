import React from 'react';
import { IonToggle } from '@ionic/react';

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  onlineLabel?: string;
  offlineLabel?: string;
}

const StatusToggle: React.FC<Props> = ({ checked, onChange, onlineLabel, offlineLabel }) => (
  <div className="rounded-xl border border-[var(--ion-border-color)] bg-[var(--ion-card-background)] p-4">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="m-0 text-sm font-bold text-[var(--ion-text-color)]">
          {checked ? 'Online' : 'Offline'}
        </h3>
        <p className="m-0 mt-1 text-xs text-[var(--ion-text-color-secondary)]">
          {checked ? (onlineLabel || 'Ready to accept orders') : (offlineLabel || 'Tap to go online')}
        </p>
      </div>
      <IonToggle
        checked={checked}
        onIonChange={(e) => onChange(e.detail.checked)}
        style={{ '--background-checked': 'var(--ion-color-primary)' }}
      />
    </div>
  </div>
);

export default StatusToggle;
