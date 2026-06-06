// src/pages/Admin/Users.tsx
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
  IonItem,
  IonLabel,
} from '@ionic/react';
import { personOutline, trashOutline, lockOpenOutline, lockClosedOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';
import AppFooter from '../../components/AppFooter';

const AdminUsers: React.FC = () => {
  const history = useHistory();
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'Maria Santos',
      email: 'maria@example.com',
      phone: '+63 910 123 4567',
      joinedDate: '2024-01-15',
      orders: 23,
      isActive: true,
      status: 'active',
    },
    {
      id: '2',
      name: 'Carlos Rodriguez',
      email: 'carlos@example.com',
      phone: '+63 911 234 5678',
      joinedDate: '2024-02-10',
      orders: 5,
      isActive: true,
      status: 'active',
    },
    {
      id: '3',
      name: 'Ana Cruz',
      email: 'ana@example.com',
      phone: '+63 912 345 6789',
      joinedDate: '2023-12-20',
      orders: 45,
      isActive: false,
      status: 'inactive',
    },
    {
      id: '4',
      name: 'Pedro Reyes',
      email: 'pedro@example.com',
      phone: '+63 913 456 7890',
      joinedDate: '2024-01-05',
      orders: 12,
      isActive: true,
      status: 'active',
    },
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, isActive: !user.isActive, status: user.isActive ? 'inactive' : 'active' }
        : user
    ));
  };

  const deleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
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
              '--background': '#6366F1',
              '--color': '#FFFFFF',
              height: '40px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'none',
              flex: '1',
              minWidth: '80px'
            }}
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
            Manage Users
          </h2>
          <IonSearchbar
            value={searchQuery}
            onIonChange={e => setSearchQuery(e.detail.value!)}
            placeholder="Search users by name or email..."
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

        {/* Stats */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <IonCard style={{ margin: 0, background: 'var(--ion-card-background)' }}>
              <IonCardContent style={{ padding: '16px' }}>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>Total Users</p>
                <h3 style={{ margin: '8px 0 0', fontSize: '24px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
                  {users.length}
                </h3>
              </IonCardContent>
            </IonCard>
            <IonCard style={{ margin: 0, background: 'var(--ion-card-background)' }}>
              <IonCardContent style={{ padding: '16px' }}>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>Active Users</p>
                <h3 style={{ margin: '8px 0 0', fontSize: '24px', fontWeight: 700, color: '#10B981' }}>
                  {users.filter(u => u.isActive).length}
                </h3>
              </IonCardContent>
            </IonCard>
          </div>
        </div>

        {/* Users List */}
        <div style={{ padding: '0 16px 16px' }}>
          {filteredUsers.length === 0 ? (
            <IonCard style={{ margin: 0, background: 'var(--ion-card-background)', textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: 'var(--ion-text-color-secondary)' }}>No users found</p>
            </IonCard>
          ) : (
            filteredUsers.map(user => (
              <IonCard key={user.id} style={{ margin: '0 0 12px', background: 'var(--ion-card-background)' }}>
                <IonCardContent style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
                        {user.name}
                      </h3>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--ion-text-color-secondary)' }}>
                        {user.email}
                      </p>
                    </div>
                    <IonBadge 
                      style={{
                        '--background': user.isActive ? '#10B981' : '#EF4444',
                        color: 'white',
                        marginLeft: 'auto'
                      }}
                    >
                      {user.status}
                    </IonBadge>
                  </div>

                  <div style={{
                    padding: '12px',
                    background: 'var(--ion-background-color)',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    fontSize: '13px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--ion-text-color-secondary)' }}>Phone:</span>
                      <span style={{ color: 'var(--ion-text-color)', fontWeight: 600 }}>{user.phone}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--ion-text-color-secondary)' }}>Joined:</span>
                      <span style={{ color: 'var(--ion-text-color)', fontWeight: 600 }}>{user.joinedDate}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--ion-text-color-secondary)' }}>Orders:</span>
                      <span style={{ color: 'var(--ion-text-color)', fontWeight: 600 }}>{user.orders}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <IonButton
                      fill="outline"
                      size="small"
                      style={{
                        '--border-color': user.isActive ? '#EF4444' : '#10B981',
                        '--color': user.isActive ? '#EF4444' : '#10B981',
                        flex: 1
                      }}
                      onClick={() => toggleUserStatus(user.id)}
                    >
                      <IonIcon slot="start" icon={user.isActive ? lockOpenOutline : lockClosedOutline} />
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </IonButton>
                    <IonButton
                      fill="outline"
                      size="small"
                      style={{ '--border-color': '#EF4444', '--color': '#EF4444' }}
                      onClick={() => deleteUser(user.id)}
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

export default AdminUsers;
