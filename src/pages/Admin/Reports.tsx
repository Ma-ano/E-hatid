// src/pages/Admin/Reports.tsx
import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonIcon,
  IonBadge,
  IonButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonTextarea,
  IonItem,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import {
  warningOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  personOutline,
  timeOutline,
  documentTextOutline,
  pencilOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { Report } from '../../types';
import AppFooter from '../../components/AppFooter';

const AdminReports: React.FC = () => {
  const history = useHistory();
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [resolution, setResolution] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [reports, setReports] = useState<Report[]>([
    {
      id: 'RPT001',
      userId: 'user1',
      reporterId: 'user1',
      reporterRole: 'user',
      reportType: 'rider_behavior',
      type: 'behavior',
      title: 'Rider was rude',
      description: 'The rider was rude and unprofessional. He did not greet me and just threw the food at the door.',
      orderId: '#1001',
      riderId: 'rider1',
      priority: 'high',
      status: 'open',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 'RPT002',
      userId: 'user2',
      reporterId: 'user2',
      reporterRole: 'user',
      reportType: 'order_issue',
      type: 'quality',
      title: 'Missing items in order',
      description: 'I ordered 3 items but only received 2. The stall forgot to include the drinks.',
      orderId: '#1002',
      priority: 'medium',
      status: 'under_review',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      adminNotes: 'Verified with stall. They have promised to refund ₱150.',
    },
    {
      id: 'RPT003',
      userId: 'rider1',
      reporterId: 'rider1',
      reporterRole: 'rider',
      reportType: 'safety_concern',
      type: 'other',
      title: 'Customer was aggressive',
      description: 'Customer became aggressive when I delivered the order 2 minutes late. He threatened me.',
      orderId: '#999',
      priority: 'critical',
      status: 'under_review',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      adminNotes: 'Contacted customer. Sent warning to customer account.',
    },
    {
      id: 'RPT004',
      userId: 'user3',
      reporterId: 'user3',
      reporterRole: 'user',
      reportType: 'payment_issue',
      type: 'other',
      title: 'Double charged',
      description: 'I was charged twice for the same order. First transaction: ₱500, Second transaction: ₱500.',
      orderId: '#1003',
      priority: 'critical',
      status: 'resolved',
      createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      resolvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      resolvedBy: 'admin1',
      resolution: 'Refunded ₱500 to customer account. Issue resolved with payment provider.',
      adminNotes: 'Customer has confirmed receipt of refund.',
    },
    {
      id: 'RPT005',
      userId: 'user4',
      reporterId: 'user4',
      reporterRole: 'user',
      reportType: 'poor_condition',
      type: 'delivery',
      title: 'Food was cold',
      description: 'The food was delivered in poor condition. Items were cold and some were spilled inside the bag.',
      orderId: '#1004',
      priority: 'medium',
      status: 'closed',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      resolution: 'Offered ₱200 credit. Customer accepted.',
    },
  ]);

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'rider_behavior':
        return '🚴';
      case 'order_issue':
        return '📦';
      case 'poor_condition':
        return '😟';
      case 'safety_concern':
        return '⚠️';
      case 'payment_issue':
        return '💳';
      default:
        return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#EF4444';
      case 'under_review':
        return '#F59E0B';
      case 'resolved':
        return '#10B981';
      case 'closed':
        return '#6366F1';
      default:
        return '#9CA3AF';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '#DC2626';
      case 'high':
        return '#EF5350';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#9CA3AF';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch =
      (report.title ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.orderId?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || report.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleUpdateReport = (reportId: string, newReportStatus: string, adminResolution?: string) => {
    setReports(reports.map(r =>
      r.id === reportId
        ? {
          ...r,
          status: newReportStatus as 'open' | 'under_review' | 'resolved' | 'closed',
          resolution: adminResolution || r.resolution,
          adminNotes: adminResolution || r.adminNotes,
          updatedAt: new Date(),
          resolvedAt: (newReportStatus === 'resolved' || newReportStatus === 'closed') ? new Date() : r.resolvedAt,
          resolvedBy: (newReportStatus === 'resolved' || newReportStatus === 'closed') ? 'admin1' : r.resolvedBy,
        }
        : r
    ));
    setShowDetails(false);
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
              '--background': 'transparent',
              '--color': 'var(--ion-text-color)',
              height: '40px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'none',
              flex: '1',
              minWidth: '80px'
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
            ⚠️ Reports
          </IonButton>
        </div>

        {/* Header */}
        <div style={{ padding: '16px' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '24px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
            Incident Reports
          </h2>
          <IonSearchbar
            value={searchQuery}
            onIonChange={e => setSearchQuery(e.detail.value!)}
            placeholder="Search by title, ID, or order..."
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

        {/* Filters */}
        <div style={{ padding: '0 16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{
              padding: '10px 12px',
              background: 'var(--ion-card-background)',
              border: '1px solid var(--ion-border-color)',
              borderRadius: '8px',
              color: 'var(--ion-text-color)',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            style={{
              padding: '10px 12px',
              background: 'var(--ion-card-background)',
              border: '1px solid var(--ion-border-color)',
              borderRadius: '8px',
              color: 'var(--ion-text-color)',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <option value="all">All Priority</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Reports List */}
        <div style={{ padding: '0 16px 16px' }}>
          {filteredReports.length === 0 ? (
            <IonCard style={{ margin: 0, background: 'var(--ion-card-background)', textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: 'var(--ion-text-color-secondary)', margin: 0 }}>No reports found</p>
            </IonCard>
          ) : (
            filteredReports.map(report => (
              <IonCard
                key={report.id}
                style={{ margin: '0 0 12px', background: 'var(--ion-card-background)', cursor: 'pointer' }}
                onClick={() => {
                  setSelectedReport(report);
                  setNewStatus(report.status);
                  setResolution(report.resolution || '');
                  setShowDetails(true);
                }}
              >
                <IonCardContent style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    {/* Icon */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'var(--ion-background-color)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      flexShrink: 0
                    }}>
                      {getReportIcon(report.reportType ?? '')}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--ion-text-color)' }}>
                          {report.title ?? ''}
                        </h3>
                        <IonBadge style={{ '--background': getStatusColor(report.status), fontSize: '9px' }}>
                          {report.status.toUpperCase()}
                        </IonBadge>
                        <IonBadge style={{ '--background': getPriorityColor(report.priority ?? 'medium'), fontSize: '9px' }}>
                          { (report.priority ?? '').toUpperCase() }
                        </IonBadge>
                      </div>

                      <p style={{ margin: '2px 0', fontSize: '11px', color: 'var(--ion-text-color-secondary)' }}>
                        {report.id} • {report.orderId || 'No order'}
                      </p>

                      <p style={{
                        margin: '4px 0 0',
                        fontSize: '12px',
                        color: 'var(--ion-text-color)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {report.description.substring(0, 60)}...
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                        <IonIcon icon={personOutline} style={{ fontSize: '12px', color: 'var(--ion-text-color-secondary)' }} />
                        <span style={{ fontSize: '11px', color: 'var(--ion-text-color-secondary)' }}>
                          {report.reporterRole === 'user' ? '👤 User' : '🚴 Rider'}
                        </span>
                        <span style={{ margin: '0 4px', color: 'var(--ion-border-color)' }}>•</span>
                        <IonIcon icon={timeOutline} style={{ fontSize: '12px', color: 'var(--ion-text-color-secondary)' }} />
                        <span style={{ fontSize: '11px', color: 'var(--ion-text-color-secondary)' }}>
                          {new Date(report.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            ))
          )}
        </div>
        </div>
        <AppFooter />
      </IonContent>

      {/* Report Details Modal */}
      <IonModal isOpen={showDetails} onDidDismiss={() => setShowDetails(false)}>
        <IonHeader>
          <IonToolbar style={{ '--background': 'var(--ion-card-background)' }}>
            <IonButton slot="start" fill="clear" onClick={() => setShowDetails(false)}>
              <IonBackButton />
            </IonButton>
            <IonTitle>Report Details</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent style={{ '--background': 'var(--ion-background-color)' } as any}>
          {selectedReport && (
            <div style={{ padding: '16px' }}>
              <IonCard style={{ margin: '0 0 16px', background: 'var(--ion-card-background)' }}>
                <IonCardContent style={{ padding: '16px' }}>
                  {/* Header */}
                  <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--ion-border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ fontSize: '28px' }}>{getReportIcon(selectedReport.reportType ?? '')}</div>
                      <div>
                        <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 700, color: 'var(--ion-text-color)' }}>
                          {selectedReport.title}
                        </h2>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>
                          {selectedReport.id}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <IonBadge style={{ '--background': getStatusColor(selectedReport.status) }}>
                        {selectedReport.status}
                      </IonBadge>
                      <IonBadge style={{ '--background': getPriorityColor(selectedReport.priority ?? 'medium') }}>
                        {selectedReport.priority}
                      </IonBadge>
                    </div>
                  </div>

                  {/* Report Information */}
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: 'var(--ion-text-color-secondary)' }}>
                      Report Information
                    </h4>
                    <div style={{ display: 'grid', gap: '8px', fontSize: '12px' }}>
                      <div>
                        <span style={{ color: 'var(--ion-text-color-secondary)' }}>Reporter:</span>
                        <span style={{ marginLeft: '8px', color: 'var(--ion-text-color)', fontWeight: 600 }}>
                          {selectedReport.reporterRole === 'user' ? '👤 User' : '🚴 Rider'} ID: {selectedReport.reporterId}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--ion-text-color-secondary)' }}>Report Type:</span>
                        <span style={{ marginLeft: '8px', color: 'var(--ion-text-color)', fontWeight: 600 }}>
                          { (selectedReport.reportType ?? '').replace(/_/g, ' ') }
                        </span>
                      </div>
                      {selectedReport.orderId && (
                        <div>
                          <span style={{ color: 'var(--ion-text-color-secondary)' }}>Order ID:</span>
                          <span style={{ marginLeft: '8px', color: 'var(--ion-text-color)', fontWeight: 600 }}>
                            {selectedReport.orderId}
                          </span>
                        </div>
                      )}
                      {selectedReport.riderId && (
                        <div>
                          <span style={{ color: 'var(--ion-text-color-secondary)' }}>Rider ID:</span>
                          <span style={{ marginLeft: '8px', color: 'var(--ion-text-color)', fontWeight: 600 }}>
                            {selectedReport.riderId}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--ion-border-color)' }}>
                    <h4 style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: 'var(--ion-text-color-secondary)' }}>
                      Description
                    </h4>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--ion-text-color)', lineHeight: '1.5' }}>
                      {selectedReport.description}
                    </p>
                  </div>

                  {/* Timeline */}
                  <div style={{ marginBottom: '16px', fontSize: '12px' }}>
                    <h4 style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: 'var(--ion-text-color-secondary)' }}>
                      Timeline
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div>
                        <span style={{ color: 'var(--ion-text-color-secondary)' }}>Created:</span>
                        <span style={{ marginLeft: '8px', color: 'var(--ion-text-color)', fontWeight: 600 }}>
                          {new Date(selectedReport.createdAt ?? '').toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--ion-text-color-secondary)' }}>Last Updated:</span>
                        <span style={{ marginLeft: '8px', color: 'var(--ion-text-color)', fontWeight: 600 }}>
                          {new Date(selectedReport.updatedAt ?? '').toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Update Status */}
                  <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--ion-border-color)' }}>
                    <h4 style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: 'var(--ion-text-color)' }}>
                      Update Status
                    </h4>
                    <select
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'var(--ion-card-background)',
                        border: '1px solid var(--ion-border-color)',
                        borderRadius: '8px',
                        color: 'var(--ion-text-color)',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        marginBottom: '8px'
                      }}
                    >
                      <option value="open">Open</option>
                      <option value="under_review">Under Review</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  {/* Admin Notes/Resolution */}
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: 'var(--ion-text-color)' }}>
                      Admin Notes / Resolution
                    </h4>
                    <IonItem lines="none" style={{ '--background': 'var(--ion-background-color)' } as any}>
                      <IonTextarea
                        value={resolution}
                        onIonChange={e => setResolution(e.detail.value!)}
                        placeholder="Add your notes or resolution details here..."
                        rows={4}
                        style={{
                          color: 'var(--ion-text-color)',
                          '--padding-start': '12px',
                          '--padding-end': '12px',
                        } as any}
                      />
                    </IonItem>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <IonButton
                      expand="block"
                      style={{
                        '--background': '#6366F1',
                        '--color': 'white',
                        height: '44px',
                        fontSize: '12px',
                        fontWeight: 600,
                        margin: 0
                      }}
                      onClick={() => handleUpdateReport(selectedReport.id, newStatus, resolution)}
                    >
                      <IonIcon icon={shieldCheckmarkOutline} slot="start" />
                      Save Changes
                    </IonButton>
                    <IonButton
                      expand="block"
                      fill="outline"
                      style={{
                        '--border-color': '#6366F1',
                        '--color': '#6366F1',
                        height: '44px',
                        fontSize: '12px',
                        fontWeight: 600,
                        margin: 0
                      }}
                      onClick={() => setShowDetails(false)}
                    >
                      Cancel
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            </div>
          )}
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default AdminReports;
