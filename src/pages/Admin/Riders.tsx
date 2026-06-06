// src/pages/Admin/Riders.tsx
import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonSearchbar,
  IonIcon,
  IonButton,
  IonBadge,
  IonToggle,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/react';
import { bicycleOutline, trashOutline, checkmarkCircleOutline, closeCircleOutline, starHalfOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';
import AppFooter from '../../components/AppFooter';

const AdminRiders: React.FC = () => {
  const history = useHistory();
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [riders, setRiders] = useState([
    {
      id: '1',
      name: 'Juan Dela Cruz',
      email: 'juan@example.com',
      phone: '+63 910 123 4567',
      vehicle: 'Honda CB500F',
      licensePlate: 'XYZ-1234',
      totalDeliveries: 245,
      rating: 4.8,
      earnings: 12450.50,
      status: 'online',
      isVerified: true,
      joinedDate: '2023-06-15',
    },
    {
      id: '2',
      name: 'Maria Gonzales',
      email: 'maria@example.com',
      phone: '+63 911 234 5678',
      vehicle: 'Yamaha NMAX',
      licensePlate: 'ABC-5678',
      totalDeliveries: 182,
      rating: 4.6,
      earnings: 9120.75,
      status: 'offline',
      isVerified: true,
      joinedDate: '2023-08-20',
    },
    {
      id: '3',
      name: 'Carlos Santos',
      email: 'carlos@example.com',
      phone: '+63 912 345 6789',
      vehicle: 'Suzuki GSX-R150',
      licensePlate: 'DEF-9012',
      totalDeliveries: 95,
      rating: 4.3,
      earnings: 4850.25,
      status: 'busy',
      isVerified: false,
      joinedDate: '2024-01-10',
    },
  ]);

  const filteredRiders = riders.filter(rider => {
    const matchesSearch =
      rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rider.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && rider.status === filterStatus;
  });

  const toggleVerification = (riderId: string) => {
    setRiders(riders.map(rider =>
      rider.id === riderId
        ? { ...rider, isVerified: !rider.isVerified }
        : rider
    ));
  };

  const deleteRider = (riderId: string) => {
    if (window.confirm('Are you sure you want to delete this rider?')) {
      setRiders(riders.filter(rider => rider.id !== riderId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#10B981';
      case 'busy': return '#F59E0B';
      case 'offline': return '#9CA3AF';
      default: return '#9CA3AF';
    }
  };

  return (
    <IonPage>
      <PageHeader 
        showLogo={true}
        onProfileClick={() => {
          logout();
          history.push('/user/login');
        }}
      />

      <IonContent style={{ '--background': 'var(--ion-background-color)' } as any}>
        <div className="page-container" style={{ paddingTop: '16px', paddingBottom: '40px' }}>
        {/* Admin Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '8px',
          padding: '16px',
          overflowX: 'auto',
          background: 'var(--ion-card-background)',
          borderRadius: '12px'
        }}>
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
              minWidth: '90px'
            }}
            onClick={() => history.push('/admin/dashboard')}
          >
            📊 Dashboard
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
            onClick={() => history.push('/admin/users')}
          >
            👥 Users
          </IonButton>
          <IonButton
            expand="block"
            style={{
              '--background': '#6366F1',
              '--color': '#FFFFFF',
              height: '40px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'none',
              flex: '1',
              minWidth: '90px'
            }}
          >
            🚴 Riders
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
            onClick={() => history.push('/admin/orders')}
          >
            📦 Orders
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
              minWidth: '90px'
            }}
            onClick={() => history.push('/admin/reports')}
          >
            ⚠️ Reports
          </IonButton>
        </div>

        {/* Header */}
        <div style={{ padding: '16px' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '24px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
            Manage Riders
          </h2>
          <IonSearchbar
            value={searchQuery}
            onIonChange={e => setSearchQuery(e.detail.value!)}
            placeholder="Search riders by name or email..."
            style={{
              '--background': 'var(--ion-card-background)',
              '--border-radius': '12px',
              '--border': '1px solid var(--ion-border-color)',
              '--placeholder-color': 'var(--ion-text-color-secondary)',
              '--icon-color': 'var(--ion-color-primary)',
              '--color': 'var(--ion-text-color)',
              padding: '0',
              height: '48px',
            } as any}
          />
        </div>

        {/* Filter */}
        <div style={{ padding: '0 16px 16px' }}>
          <IonSegment
            value={filterStatus}
            onIonChange={e => setFilterStatus(e.detail.value as string)}
            style={{ '--background': 'transparent' }}
          >
            <IonSegmentButton value="all" style={{ '--color-checked': '#FFFFFF', '--border-radius': '8px' }}>
              <IonLabel style={{ fontSize: '12px' }}>All</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="online" style={{ '--color-checked': '#FFFFFF', '--border-radius': '8px' }}>
              <IonLabel style={{ fontSize: '12px' }}>Online</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="busy" style={{ '--color-checked': '#FFFFFF', '--border-radius': '8px' }}>
              <IonLabel style={{ fontSize: '12px' }}>Busy</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="offline" style={{ '--color-checked': '#FFFFFF', '--border-radius': '8px' }}>
              <IonLabel style={{ fontSize: '12px' }}>Offline</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        {/* Stats */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <IonCard style={{ margin: 0, background: 'var(--ion-card-background)' }}>
              <IonCardContent style={{ padding: '16px' }}>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>Total Riders</p>
                <h3 style={{ margin: '8px 0 0', fontSize: '24px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
                  {riders.length}
                </h3>
              </IonCardContent>
            </IonCard>
            <IonCard style={{ margin: 0, background: 'var(--ion-card-background)' }}>
              <IonCardContent style={{ padding: '16px' }}>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>Verified</p>
                <h3 style={{ margin: '8px 0 0', fontSize: '24px', fontWeight: 700, color: '#10B981' }}>
                  {riders.filter(r => r.isVerified).length}
                </h3>
              </IonCardContent>
            </IonCard>
          </div>
        </div>

        {/* Riders List */}
        <div style={{ padding: '0 16px 16px' }}>
          {filteredRiders.length === 0 ? (
            <IonCard style={{ margin: 0, background: 'var(--ion-card-background)', textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: 'var(--ion-text-color-secondary)' }}>No riders found</p>
            </IonCard>
          ) : (
            filteredRiders.map(rider => (
              <IonCard key={rider.id} style={{ margin: '0 0 12px', background: 'var(--ion-card-background)' }}>
                <IonCardContent style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
                          {rider.name}
                        </h3>
                        {rider.isVerified && (
                          <IonBadge style={{ '--background': '#10B981', color: 'white' }}>
                            ✓
                          </IonBadge>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--ion-text-color-secondary)' }}>
                        {rider.email}
                      </p>
                    </div>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: getStatusColor(rider.status),
                      marginLeft: '12px'
                    }} />
                  </div>

                  <div style={{
                    padding: '12px',
                    background: 'var(--ion-background-color)',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    fontSize: '13px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--ion-text-color-secondary)' }}>Vehicle:</span>
                      <span style={{ color: 'var(--ion-text-color)', fontWeight: 600 }}>{rider.vehicle}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--ion-text-color-secondary)' }}>Deliveries:</span>
                      <span style={{ color: 'var(--ion-text-color)', fontWeight: 600 }}>{rider.totalDeliveries}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--ion-text-color-secondary)' }}>Rating:</span>
                      <span style={{ color: '#F59E0B', fontWeight: 600 }}>★ {rider.rating}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <IonButton
                      fill="outline"
                      size="small"
                      style={{
                        '--border-color': rider.isVerified ? '#EF4444' : '#10B981',
                        '--color': rider.isVerified ? '#EF4444' : '#10B981',
                        flex: 1
                      }}
                      onClick={() => toggleVerification(rider.id)}
                    >
                      <IonIcon slot="start" icon={rider.isVerified ? closeCircleOutline : checkmarkCircleOutline} />
                      {rider.isVerified ? 'Unverify' : 'Verify'}
                    </IonButton>
                    <IonButton
                      fill="outline"
                      size="small"
                      style={{ '--border-color': '#EF4444', '--color': '#EF4444' }}
                      onClick={() => deleteRider(rider.id)}
                    >
                      <IonIcon icon={trashOutline} />
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            ))
          )}
        </div>
      </div>
      <AppFooter />
      </IonContent>
    </IonPage>
  );
};

export default AdminRiders;
