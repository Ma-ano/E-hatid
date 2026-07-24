// src/pages/Rider/Earnings.tsx
import React, { useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
} from '@ionic/react';
import { cashOutline, trendingUpOutline, downloadOutline, calendarOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

const RiderEarnings: React.FC = () => {
  const history = useHistory();
  const { logout } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const earnings = { total: 0, trips: 0, average: 0 };
  const weeklyEarnings: { day: string; amount: number; trips: number }[] = [];
  const maxEarning = 1;

  return (
    <>

        {/* Rider Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '8px',
          padding: '16px',
          overflowX: 'auto',
          background: 'var(--ion-card-background)',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px'
        }}>
          <IonButton
            expand="block"
            style={{
              '--background': 'transparent',
              '--color': 'var(--ion-text-color)',
              border: '1px solid var(--ion-color-primary)',
              height: '40px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'none',
              flex: '1',
              minWidth: '80px'
            }}
            onClick={() => history.push('/rider/dashboard')}
          >
            🏠 Home
          </IonButton>
          <IonButton
            expand="block"
            style={{
              '--background': 'transparent',
              '--color': 'var(--ion-text-color)',
              height: '40px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'none',
              flex: '1',
              minWidth: '80px'
            }}
            onClick={() => history.push('/rider/orders')}
          >
            📦 Orders
          </IonButton>
          <IonButton
            expand="block"
            style={{
              '--background': 'var(--ion-color-primary)',
              '--color': '#FFFFFF',
              height: '40px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'none',
              flex: '1',
              minWidth: '80px'
            }}
          >
            💰 Earnings
          </IonButton>
          <IonButton
            expand="block"
            style={{
              '--background': 'transparent',
              '--color': 'var(--ion-text-color)',
              height: '40px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'none',
              flex: '1',
              minWidth: '80px'
            }}
            onClick={() => history.push('/rider/profile')}
          >
            👤 Profile
          </IonButton>
        </div>

        {/* Quick Access Menu */}
        <div style={{
          padding: '0 16px 16px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px'
        }}>
          <div 
            onClick={() => history.push('/activities')}
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #FF5A1F 0%, #FF7A3D 100%)',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'center',
              color: 'white'
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>📋</div>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: 600 }}>Activity</p>
          </div>
          <div 
            onClick={() => history.push('/messages')}
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'center',
              color: 'white'
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>💬</div>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: 600 }}>Messages</p>
          </div>
        </div>

        {/* Period Selection */}
        <div style={{ padding: '16px' }}>
          <IonSegment 
            value={selectedPeriod} 
            onIonChange={e => setSelectedPeriod(e.detail.value as string)}
            style={{ '--background': 'transparent' }}
          >
            <IonSegmentButton value="today" style={{ '--color-checked': '#FFFFFF', '--border-radius': '8px' }}>
              <IonLabel style={{ fontSize: '12px' }}>Today</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="week" style={{ '--color-checked': '#FFFFFF', '--border-radius': '8px' }}>
              <IonLabel style={{ fontSize: '12px' }}>Week</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="month" style={{ '--color-checked': '#FFFFFF', '--border-radius': '8px' }}>
              <IonLabel style={{ fontSize: '12px' }}>Month</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        {/* Total Earnings Card */}
        <div style={{ padding: '0 16px 16px' }}>
          <IonCard style={{ margin: 0, background: 'linear-gradient(135deg, #FF5A1F 0%, #FF7A3D 100%)' }}>
            <IonCardContent style={{ padding: '24px' }}>
              <div style={{ textAlign: 'center', color: 'white' }}>
                <p style={{ margin: '0 0 8px', fontSize: '14px', opacity: 0.9 }}>Total Earnings</p>
                <h2 style={{ margin: 0, fontSize: '36px', fontWeight: 700 }}>₱{earnings.total.toFixed(2)}</h2>
                <p style={{ margin: '12px 0 0', fontSize: '12px', opacity: 0.8 }}>
                  {earnings.trips} trips • Avg: ₱{earnings.average.toFixed(2)}
                </p>
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Stats Grid */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <IonCard style={{ margin: 0, background: 'var(--ion-card-background)' }}>
              <IonCardContent style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'rgba(99, 102, 241, 0.1)', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IonIcon icon={cashOutline} style={{ fontSize: '20px', color: 'var(--ion-color-primary)' }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>Trips</p>
                    <h4 style={{ margin: '4px 0 0', color: 'var(--ion-text-color)', fontWeight: 700 }}>{earnings.trips}</h4>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard style={{ margin: 0, background: 'var(--ion-card-background)' }}>
              <IonCardContent style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'rgba(16, 185, 129, 0.1)', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IonIcon icon={trendingUpOutline} style={{ fontSize: '20px', color: '#10B981' }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>Average</p>
                    <h4 style={{ margin: '4px 0 0', color: 'var(--ion-text-color)', fontWeight: 700 }}>₱{earnings.average.toFixed(2)}</h4>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        </div>

        {/* Weekly Chart */}
        {selectedPeriod !== 'month' && (
          <div style={{ padding: '0 16px 16px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
              Weekly Breakdown
            </h3>
            <IonCard style={{ margin: 0, background: 'var(--ion-card-background)' }}>
              <IonCardContent style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '150px', gap: '8px' }}>
                  {weeklyEarnings.map((day, index) => (
                    <div key={index} style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                      <div 
                        style={{
                          height: `${(day.amount / maxEarning) * 100}%`,
                          background: 'linear-gradient(180deg, #FF5A1F 0%, #FF7A3D 100%)',
                          borderRadius: '8px 8px 0 0',
                          marginBottom: '8px',
                          minHeight: '20px'
                        }}
                      />
                      <p style={{ margin: 0, fontSize: '11px', color: 'var(--ion-text-color-secondary)' }}>{day.day}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '10px', color: 'var(--ion-text-color-secondary)' }}>₱{day.amount}</p>
                    </div>
                  ))}
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ padding: '0 16px 16px' }}>
          <IonButton 
            expand="block" 
            fill="outline"
            style={{ '--border-color': 'var(--ion-color-primary)', '--color': 'var(--ion-color-primary)', margin: 0 }}
          >
            <IonIcon slot="start" icon={downloadOutline} />
            Download Statement
          </IonButton>
        </div>
    </>
  );
};

export default RiderEarnings;
