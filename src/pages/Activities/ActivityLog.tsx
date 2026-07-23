// src/pages/Activities/ActivityLog.tsx
import React, { useState } from 'react';
import {
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonIcon,
  IonBadge,
  IonButton,
  IonModal,
  IonBackButton,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
import {
  checkmarkCircleOutline,
  alertCircleOutline,
  warningOutline,
  informationCircleOutline,
  closeCircleOutline,
  timeOutline,
  personOutline,
  cartOutline,
  bicycleOutline,
  arrowBack,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { Activity } from '../../types';

const ActivityLog: React.FC = () => {
  const history = useHistory();
  const { user, logout } = useAuth();
  const [filterType, setFilterType] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock activities - in production, fetch from backend
  const allActivities: Activity[] = [
    {
      id: '1',
      userId: user?.id || '',
      type: 'order_delivered',
      title: 'Order Delivered Successfully',
      description: 'Your order from Burger King has been delivered by Juan Dela Cruz',
      metadata: { orderId: '#1001', stallName: 'Burger King', riderName: 'Juan Dela Cruz', amount: 450.50 },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      severity: 'info',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      userId: user?.id || '',
      type: 'order_placed',
      title: 'Order Placed',
      description: 'You have placed an order from Sushi Master',
      metadata: { orderId: '#1002', stallName: 'Sushi Master', items: 3, amount: 620.75 },
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      severity: 'info',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      userId: user?.id || '',
      type: 'payment_made',
      title: 'Payment Completed',
      description: 'Payment of ₱450.50 has been successfully processed',
      metadata: { orderId: '#1001', amount: 450.50, method: 'GCash' },
      createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
      severity: 'info',
      timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      userId: user?.id || '',
      type: 'order_cancelled',
      title: 'Order Cancelled',
      description: 'Your order #999 has been cancelled due to unavailable items',
      metadata: { orderId: '#999', stallName: 'Pizza Palace', reason: 'Unavailable items' },
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      severity: 'warning',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      userId: user?.id || '',
      type: 'report_filed',
      title: 'Report Filed',
      description: 'Your incident report has been submitted to the admin team',
      metadata: { reportId: '#RPT001', type: 'rider_behavior', status: 'under_review' },
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      severity: 'warning',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order_delivered':
      case 'order_accepted':
        return checkmarkCircleOutline;
      case 'order_cancelled':
        return closeCircleOutline;
      case 'report_filed':
        return alertCircleOutline;
      case 'rider_online':
      case 'rider_offline':
        return bicycleOutline;
      case 'order_placed':
        return cartOutline;
      case 'user_login':
        return personOutline;
      default:
        return informationCircleOutline;
    }
  };

  const getActivityColor = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      case 'info':
      default:
        return 'var(--ion-color-primary)';
    }
  };

  const getStatusBadge = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return 'CRITICAL';
      case 'warning':
        return 'WARNING';
      case 'info':
      default:
        return 'INFO';
    }
  };

  const formatTime = (date: string | Date | undefined) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  const userRoles = user?.roles || (user?.role ? [user.role] : []);
  const roleBasedActivities = allActivities.filter(activity => {
    if (userRoles.includes('admin')) {
      return true;
    } else if (userRoles.includes('rider')) {
      return (
        activity.type.startsWith('order_') ||
        activity.type === 'rider_online' ||
        activity.type === 'rider_offline' ||
        activity.type === 'payment_made'
      );
    } else {
      return (
        activity.type.startsWith('order_') ||
        activity.type === 'payment_made' ||
        activity.type === 'report_filed' ||
        activity.type === 'user_login'
      );
    }
  });

  const filteredActivities = filterType === 'all'
    ? roleBasedActivities
    : roleBasedActivities.filter(a => {
        if (filterType === 'critical') return a.severity === 'critical';
        if (filterType === 'warning') return a.severity === 'warning';
        if (filterType === 'order') return a.type.startsWith('order_');
        if (filterType === 'report') return a.type === 'report_filed' || a.type === 'report_resolved';
        return true;
      });

  return (
    <>
      <Navbar />

        {/* Header with Back Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--ion-border-color)' }}>
          <IonButton 
            fill="clear" 
            onClick={() => history.goBack()}
            style={{ '--color': 'var(--ion-color-primary)', margin: '0 0 0 -8px' } as any}
          >
            <IonIcon icon={arrowBack} />
          </IonButton>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--ion-text-color)', flex: 1 }}>
            Activity Log
          </h2>
          <div style={{ width: '44px' }}></div>
        </div>

        {/* Description */}
        <div style={{ padding: '16px' }}>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--ion-text-color-secondary)' }}>
            Track your activities and incidents
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ padding: '0 16px 16px', overflowX: 'auto' }}>
          <IonSegment
            value={filterType}
            onIonChange={e => setFilterType(e.detail.value as string)}
            scrollable
            style={{ '--background': 'transparent' }}
          >
            <IonSegmentButton value="all" style={{ '--color-checked': '#FFFFFF', '--border-radius': '8px', whiteSpace: 'nowrap' }}>
              <IonLabel style={{ fontSize: '12px' }}>All</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="order" style={{ '--color-checked': '#FFFFFF', '--border-radius': '8px', whiteSpace: 'nowrap' }}>
              <IonLabel style={{ fontSize: '12px' }}>Orders</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="report" style={{ '--color-checked': '#FFFFFF', '--border-radius': '8px', whiteSpace: 'nowrap' }}>
              <IonLabel style={{ fontSize: '12px' }}>Reports</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="warning" style={{ '--color-checked': '#FFFFFF', '--border-radius': '8px', whiteSpace: 'nowrap' }}>
              <IonLabel style={{ fontSize: '12px' }}>Warnings</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="critical" style={{ '--color-checked': '#FFFFFF', '--border-radius': '8px', whiteSpace: 'nowrap' }}>
              <IonLabel style={{ fontSize: '12px' }}>Critical</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        {/* Activities List */}
        <div style={{ padding: '0 16px 16px' }}>
          {filteredActivities.length === 0 ? (
            <IonCard style={{ margin: 0, background: 'var(--ion-card-background)', textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: 'var(--ion-text-color-secondary)', margin: 0 }}>No activities found</p>
            </IonCard>
          ) : (
            filteredActivities.map(activity => (
              <IonCard
                key={activity.id}
                style={{ margin: '0 0 12px', background: 'var(--ion-card-background)', cursor: 'pointer' }}
                onClick={() => {
                  setSelectedActivity(activity);
                  setShowDetails(true);
                }}
              >
                <IonCardContent style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      background: getActivityColor(activity.severity),
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <IonIcon icon={getActivityIcon(activity.type)} style={{ fontSize: '22px', color: 'white' }} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--ion-text-color)' }}>
                          {activity.title}
                        </h3>
                        <IonBadge style={{ '--background': getActivityColor(activity.severity), fontSize: '10px' }}>
                          {getStatusBadge(activity.severity)}
                        </IonBadge>
                      </div>

                      <p style={{ margin: '4px 0', fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>
                        {activity.description}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                        <IonIcon icon={timeOutline} style={{ fontSize: '12px', color: 'var(--ion-text-color-secondary)' }} />
                        <span style={{ fontSize: '11px', color: 'var(--ion-text-color-secondary)' }}>
                          {formatTime(activity.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            ))
          )}
        </div>

        {/* Activity Details Modal */}
        <IonModal isOpen={showDetails} onDidDismiss={() => setShowDetails(false)}>
          <IonHeader>
            <IonToolbar style={{ '--background': 'var(--ion-card-background)' }}>
              <IonButton slot="start" fill="clear" onClick={() => setShowDetails(false)}>
                <IonBackButton defaultHref="/customer/home" />
              </IonButton>
              <IonTitle>Activity Details</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent style={{ '--background': 'var(--ion-background-color)' } as any}>
            {selectedActivity && (
              <div style={{ padding: '16px' }}>
                <IonCard style={{ margin: 0, background: 'var(--ion-card-background)' }}>
                  <IonCardContent style={{ padding: '16px' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        background: getActivityColor(selectedActivity.severity),
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <IonIcon icon={getActivityIcon(selectedActivity.type)} style={{ fontSize: '28px', color: 'white' }} />
                      </div>
                      <div>
                        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
                          {selectedActivity.title}
                        </h2>
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>
                          {new Date(selectedActivity.createdAt ?? '').toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div style={{ marginBottom: '16px' }}>
                      <IonBadge style={{ '--background': getActivityColor(selectedActivity.severity), fontSize: '12px', padding: '6px 12px' }}>
                        {getStatusBadge(selectedActivity.severity)}
                      </IonBadge>
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--ion-border-color)' }}>
                      <h4 style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: 'var(--ion-text-color-secondary)' }}>
                        Description
                      </h4>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--ion-text-color)' }}>
                        {selectedActivity.description}
                      </p>
                    </div>

                    {/* Metadata */}
                    {selectedActivity.metadata && Object.keys(selectedActivity.metadata).length > 0 && (
                      <div>
                        <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 600, color: 'var(--ion-text-color-secondary)' }}>
                          Details
                        </h4>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '12px',
                          padding: '12px',
                          background: 'var(--ion-background-color)',
                          borderRadius: '8px'
                        }}>
                          {Object.entries(selectedActivity.metadata).map(([key, value]) => (
                            <div key={key}>
                              <p style={{ margin: '0 0 4px', fontSize: '11px', color: 'var(--ion-text-color-secondary)', textTransform: 'capitalize' }}>
                                {key.replace(/_/g, ' ')}
                              </p>
                              <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--ion-text-color)' }}>
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </IonCardContent>
                </IonCard>
              </div>
            )}
          </IonContent>
        </IonModal>
      </>
  );
};

export default ActivityLog;
