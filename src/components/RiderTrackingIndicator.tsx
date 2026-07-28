import React from 'react';
import { IonIcon } from '@ionic/react';
import { navigateOutline, closeCircleOutline } from 'ionicons/icons';
import { useRiderTracking } from '../hooks/useRiderTracking';

interface RiderTrackingIndicatorProps {
  userId: string | undefined;
}

const RiderTrackingIndicator: React.FC<RiderTrackingIndicatorProps> = ({ userId }) => {
  const { isTracking, activeOrderId, error, requestPermission } = useRiderTracking(userId);

  if (!activeOrderId) return null;

  const needsPermission = error && !isTracking;

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2">
      {needsPermission && (
        <button
          onClick={requestPermission}
          className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold shadow-lg cursor-pointer border-none"
          style={{
            background: '#FFF3E0',
            color: '#E65100',
          }}
        >
          <IonIcon icon={navigateOutline} className="text-sm" />
          Enable GPS
        </button>
      )}

      {isTracking && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold shadow-lg"
          style={{
            background: '#E8F5E9',
            color: '#2E7D32',
          }}
        >
          <span className="relative flex w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600" />
          </span>
          GPS Active
        </div>
      )}

      {error && !needsPermission && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold shadow-lg"
          style={{
            background: '#FFEBEE',
            color: '#C62828',
          }}
        >
          <IonIcon icon={closeCircleOutline} className="text-sm" />
          {error}
        </div>
      )}
    </div>
  );
};

export default RiderTrackingIndicator;
