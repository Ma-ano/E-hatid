// src/pages/Admin/Dashboard.tsx
import React, { useState } from 'react';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonIcon,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonBadge,
} from '@ionic/react';
import { peopleOutline, bicycleOutline, cartOutline, trendingUpOutline, warningOutline, settingsOutline, logOutOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const history = useHistory();
  const { logout } = useAuth();
  const [showActivityDetails, setShowActivityDetails] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  const stats = {
    totalUsers: 1245,
    totalRiders: 89,
    totalOrders: 3421,
    totalRevenue: 125480.50,
  };

  const recentActivities = [
    { id: '1', type: 'user', message: 'New user registered: Maria Santos', time: '2 minutes ago' },
    { id: '2', type: 'rider', message: 'Juan Dela Cruz completed 50 deliveries', time: '15 minutes ago' },
    { id: '3', type: 'order', message: 'Order #5832 delivered successfully', time: '28 minutes ago' },
    { id: '4', type: 'user', message: 'New user registered: Carlos Rodriguez', time: '45 minutes ago' },
  ];

  return (
    <>
      <PageHeader 
        showLogo={true}
        onProfileClick={() => {
          logout();
          history.push('/login');
        }}
      />

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
              '--background': 'var(--ion-color-primary)',
              '--color': '#FFFFFF',
              height: '40px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'none',
              flex: '1',
              minWidth: '90px'
            }}
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
              '--background': 'transparent',
              '--color': 'var(--ion-text-color)',
              height: '40px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'none',
              flex: '1',
              minWidth: '90px'
            }}
            onClick={() => history.push('/admin/riders')}
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
              minWidth: '80px'
            }}
            onClick={() => history.push('/admin/reports')}
          >
            ⚠️ Reports
          </IonButton>
        </div>

        {/* Welcome Section */}
        <div style={{ padding: '24px 16px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
            Admin Dashboard
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--ion-text-color-secondary)' }}>
            Welcome back, Administrator
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Total Users */}
            <IonCard 
              style={{ margin: 0, background: 'linear-gradient(135deg, #FF5A1F 0%, #FF7A3D 100%)' }}
            >
              <IonCardContent style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'rgba(255,255,255,0.2)', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IonIcon icon={peopleOutline} style={{ fontSize: '20px', color: 'white' }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>Total Users</p>
                    <h4 style={{ margin: '4px 0 0', color: 'white', fontWeight: 700, fontSize: '20px' }}>
                      {stats.totalUsers.toLocaleString()}
                    </h4>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            {/* Total Riders */}
            <IonCard 
              style={{ margin: 0, background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' }}
            >
              <IonCardContent style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'rgba(255,255,255,0.2)', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IonIcon icon={bicycleOutline} style={{ fontSize: '20px', color: 'white' }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>Total Riders</p>
                    <h4 style={{ margin: '4px 0 0', color: 'white', fontWeight: 700, fontSize: '20px' }}>
                      {stats.totalRiders}
                    </h4>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            {/* Total Orders */}
            <IonCard 
              style={{ margin: 0, background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)' }}
            >
              <IonCardContent style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'rgba(255,255,255,0.2)', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IonIcon icon={cartOutline} style={{ fontSize: '20px', color: 'white' }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>Total Orders</p>
                    <h4 style={{ margin: '4px 0 0', color: 'white', fontWeight: 700, fontSize: '20px' }}>
                      {stats.totalOrders.toLocaleString()}
                    </h4>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            {/* Total Revenue */}
            <IonCard style={{ margin: 0, background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)' }}>
              <IonCardContent style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'rgba(255,255,255,0.2)', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IonIcon icon={trendingUpOutline} style={{ fontSize: '20px', color: 'white' }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>Total Revenue</p>
                    <h4 style={{ margin: '4px 0 0', color: 'white', fontWeight: 700, fontSize: '20px' }}>
                      ₱{stats.totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </h4>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            {/* Pending Reports */}
            <IonCard 
              style={{ margin: 0, background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)', cursor: 'pointer' }}
              onClick={() => history.push('/admin/reports')}
            >
              <IonCardContent style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'rgba(255,255,255,0.2)', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IonIcon icon={warningOutline} style={{ fontSize: '20px', color: 'white' }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>Pending Reports</p>
                    <h4 style={{ margin: '4px 0 0', color: 'white', fontWeight: 700, fontSize: '20px' }}>
                      5
                    </h4>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        </div>

        {/* Recent Activities */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
              Recent Activities
            </h3>
            <IonButton 
              fill="clear" 
              size="small"
              style={{ '--color': 'var(--ion-color-primary)', margin: 0, height: '24px' } as any}
              onClick={() => history.push('/activities')}
            >
              See All
            </IonButton>
          </div>
          <IonCard style={{ margin: 0, background: 'var(--ion-card-background)' }}>
            <IonCardContent style={{ padding: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentActivities.map(activity => (
                  <div 
                    key={activity.id}
                    onClick={() => {
                      setSelectedActivity(activity);
                      setShowActivityDetails(true);
                    }}
                    style={{
                      padding: '12px',
                      background: 'var(--ion-background-color)',
                      borderRadius: '8px',
                      borderLeft: `4px solid var(--ion-color-primary)`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'var(--ion-card-background)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'var(--ion-background-color)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <p style={{ margin: 0, color: 'var(--ion-text-color)', fontSize: '14px' }}>
                        {activity.message}
                      </p>
                      <span style={{ fontSize: '12px', color: 'var(--ion-text-color-secondary)', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Management Links */}
        <div style={{ padding: '0 16px 16px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
            Quick Access
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <IonButton 
              expand="block"
              style={{ '--background': 'var(--ion-color-primary)', margin: 0 }}
              onClick={() => history.push('/admin/users')}
            >
              <IonIcon slot="start" icon={peopleOutline} />
              Manage Users
            </IonButton>
            <IonButton 
              expand="block"
              style={{ '--background': '#F59E0B', margin: 0 }}
              onClick={() => history.push('/admin/riders')}
            >
              <IonIcon slot="start" icon={bicycleOutline} />
              Manage Riders
            </IonButton>
          </div>
        </div>
        </div>


      {/* Activity Details Modal */}
      <IonModal isOpen={showActivityDetails} onDidDismiss={() => setShowActivityDetails(false)}>
        <IonHeader>
          <IonToolbar style={{ '--background': 'var(--ion-card-background)' } as any}>
            <IonButton slot="start" fill="clear" onClick={() => setShowActivityDetails(false)}>
              <IonBackButton />
            </IonButton>
            <IonTitle>Activity Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent style={{ '--background': 'var(--ion-background-color)' } as any}>
          {selectedActivity && (
            <div style={{ padding: '16px' }}>
              <IonCard style={{ margin: 0, background: 'var(--ion-card-background)' }}>
                <IonCardContent style={{ padding: '16px' }}>
                  <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--ion-border-color)' }}>
                    <h2 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
                      {selectedActivity.message}
                    </h2>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>
                      {selectedActivity.time}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{ padding: '12px', background: 'var(--ion-background-color)', borderRadius: '8px' }}>
                      <p style={{ margin: '0 0 4px', fontSize: '11px', color: 'var(--ion-text-color-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Type</p>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--ion-text-color)' }}>System Event</p>
                    </div>
                    <div style={{ padding: '12px', background: 'var(--ion-background-color)', borderRadius: '8px' }}>
                      <p style={{ margin: '0 0 4px', fontSize: '11px', color: 'var(--ion-text-color-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Status</p>
                      <IonBadge style={{ '--background': '#10B981', color: 'white' } as any}>Completed</IonBadge>
                    </div>
                    <div style={{ padding: '12px', background: 'var(--ion-background-color)', borderRadius: '8px' }}>
                      <p style={{ margin: '0 0 4px', fontSize: '11px', color: 'var(--ion-text-color-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Timestamp</p>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--ion-text-color)' }}>
                        {new Date().toLocaleString()}
                      </p>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            </div>
          )}
        </IonContent>
      </IonModal>
    </>
  );
};

export default AdminDashboard;
