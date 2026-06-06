// src/pages/Reports/ReportIncident.tsx
import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonBadge,
  IonAlert,
} from '@ionic/react';
import {
  warningOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  closeOutline,
  arrowBack,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';
import AppFooter from '../../components/AppFooter';

const ReportIncident: React.FC = () => {
  const history = useHistory();
  const { user, logout } = useAuth();
  const [reportType, setReportType] = useState('');
  const [priority, setPriority] = useState('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [orderId, setOrderId] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const reportTypes = [
    { value: 'order_issue', label: 'Order Issue', icon: '📦' },
    { value: 'rider_behavior', label: 'Rider Behavior', icon: '🚴' },
    { value: 'poor_condition', label: 'Poor Condition', icon: '😟' },
    { value: 'safety_concern', label: 'Safety Concern', icon: '⚠️' },
    { value: 'payment_issue', label: 'Payment Issue', icon: '💳' },
    { value: 'other', label: 'Other', icon: '❓' },
  ];

  const validateForm = () => {
    const newErrors = [];
    if (!reportType) newErrors.push('Report type is required');
    if (!title.trim()) newErrors.push('Title is required');
    if (title.length < 5) newErrors.push('Title must be at least 5 characters');
    if (!description.trim()) newErrors.push('Description is required');
    if (description.length < 20) newErrors.push('Description must be at least 20 characters');
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // In production, send to backend
      console.log('Report submitted:', {
        reportType,
        priority,
        title,
        description,
        orderId: orderId || undefined,
      });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
      }, 2000);
    }
  };

  const resetForm = () => {
    setReportType('');
    setPriority('medium');
    setTitle('');
    setDescription('');
    setOrderId('');
  };

  const selectedReportType = reportTypes.find(t => t.value === reportType);

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
        {/* Header with Back Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--ion-border-color)' }}>
          <IonButton 
            fill="clear" 
            onClick={() => history.goBack()}
            style={{ '--color': '#6366F1', margin: '0 0 0 -8px' } as any}
          >
            <IonIcon icon={arrowBack} />
          </IonButton>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--ion-text-color)', flex: 1 }}>
            Report an Incident
          </h2>
          <div style={{ width: '44px' }}></div>
        </div>

        {/* Description */}
        <div style={{ padding: '16px', borderBottom: '1px solid var(--ion-border-color)' }}>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--ion-text-color-secondary)' }}>
            Help us improve the service by reporting issues
          </p>
        </div>

        {/* Errors Display */}
        {errors.length > 0 && (
          <div style={{ padding: '0 16px 12px' }}>
            <IonCard style={{ margin: 0, background: '#FEE2E2', border: '1px solid #FECACA' }}>
              <IonCardContent style={{ padding: '12px' }}>
                {errors.map((error, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: idx === errors.length - 1 ? 0 : '8px' }}>
                    <IonIcon icon={alertCircleOutline} style={{ color: '#DC2626', fontSize: '16px', flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', color: '#991B1B' }}>{error}</span>
                  </div>
                ))}
              </IonCardContent>
            </IonCard>
          </div>
        )}

        <div style={{ padding: '0 16px 16px' }}>
          {/* Report Type Selection */}
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 600, color: 'var(--ion-text-color)' }}>
              Report Type
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '8px'
            }}>
              {reportTypes.map(type => (
                <div
                  key={type.value}
                  style={{
                    padding: '12px',
                    background: reportType === type.value ? '#6366F1' : 'var(--ion-card-background)',
                    border: reportType === type.value ? 'none' : '2px solid var(--ion-border-color)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setReportType(type.value)}
                >
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>{type.icon}</div>
                  <p style={{
                    margin: 0,
                    fontSize: '11px',
                    fontWeight: 600,
                    color: reportType === type.value ? 'white' : 'var(--ion-text-color)'
                  }}>
                    {type.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Selection */}
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 600, color: 'var(--ion-text-color)' }}>
              Priority Level
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px'
            }}>
              {[
                { value: 'low', label: 'Low', color: '#6366F1' },
                { value: 'medium', label: 'Medium', color: '#F59E0B' },
                { value: 'high', label: 'High', color: '#EF5350' },
                { value: 'critical', label: 'Critical', color: '#DC2626' },
              ].map(p => (
                <div
                  key={p.value}
                  style={{
                    padding: '12px',
                    background: priority === p.value ? p.color : 'var(--ion-card-background)',
                    border: priority === p.value ? 'none' : `2px solid ${p.color}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                  onClick={() => setPriority(p.value)}
                >
                  <p style={{
                    margin: 0,
                    fontSize: '12px',
                    fontWeight: 600,
                    color: priority === p.value ? 'white' : p.color
                  }}>
                    {p.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order ID (Optional) */}
          <div style={{ marginBottom: '16px' }}>
            <IonItem lines="none" style={{ '--background': 'var(--ion-card-background)', marginBottom: '8px' } as any}>
              <IonLabel position="floating" style={{ color: 'var(--ion-text-color-secondary)' }}>
                Related Order ID (Optional)
              </IonLabel>
              <IonInput
                value={orderId}
                onIonChange={e => setOrderId(e.detail.value!)}
                placeholder="e.g., #1001"
                style={{ color: 'var(--ion-text-color)' }}
              />
            </IonItem>
          </div>

          {/* Title */}
          <div style={{ marginBottom: '16px' }}>
            <IonItem lines="none" style={{ '--background': 'var(--ion-card-background)', marginBottom: '8px' } as any}>
              <IonLabel position="floating" style={{ color: 'var(--ion-text-color-secondary)', fontSize: '13px' }}>
                Report Title
              </IonLabel>
              <IonInput
                value={title}
                onIonChange={e => setTitle(e.detail.value!)}
                placeholder="Brief summary of the issue"
                maxlength={100}
                style={{ color: 'var(--ion-text-color)' }}
              />
            </IonItem>
            <p style={{
              margin: '4px 12px 0',
              fontSize: '11px',
              color: 'var(--ion-text-color-secondary)'
            }}>
              {title.length}/100 characters
            </p>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '16px' }}>
            <IonItem lines="none" style={{ '--background': 'var(--ion-card-background)', marginBottom: '8px', alignItems: 'flex-start' } as any}>
              <IonLabel position="floating" style={{ color: 'var(--ion-text-color-secondary)', marginTop: '8px', fontSize: '13px' }}>
                Detailed Description
              </IonLabel>
              <IonTextarea
                value={description}
                onIonChange={e => setDescription(e.detail.value!)}
                placeholder="Please provide detailed information about the incident..."
                maxlength={500}
                rows={6}
                style={{
                  color: 'var(--ion-text-color)',
                  '--padding-start': '12px',
                  '--padding-end': '12px',
                } as any}
              />
            </IonItem>
            <p style={{
              margin: '4px 12px 0',
              fontSize: '11px',
              color: 'var(--ion-text-color-secondary)'
            }}>
              {description.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <IonButton
            expand="block"
            style={{
              '--background': '#6366F1',
              '--color': 'white',
              height: '48px',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '12px'
            }}
            onClick={handleSubmit}
          >
            <IonIcon icon={warningOutline} slot="start" />
            Submit Report
          </IonButton>

          {/* Info Box */}
          <IonCard style={{ margin: 0, background: 'var(--ion-card-background)', border: '1px solid var(--ion-border-color)' }}>
            <IonCardContent style={{ padding: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <IonIcon icon={alertCircleOutline} style={{ color: '#F59E0B', fontSize: '16px', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 600, color: 'var(--ion-text-color)' }}>
                    What happens next?
                  </p>
                  <ul style={{
                    margin: 0, padding: '0 0 0 16px', fontSize: '11px', color: 'var(--ion-text-color-secondary)',
                    lineHeight: '1.4'
                  }}>
                    <li>Your report will be reviewed by our admin team</li>
                    <li>We will investigate and take appropriate action</li>
                    <li>You will receive updates via your account</li>
                    <li>Response time: 24-48 hours</li>
                  </ul>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
        <AppFooter />
      </IonContent>

      {/* Success Alert */}
      <IonAlert
        isOpen={showSuccess}
        onDidDismiss={() => setShowSuccess(false)}
        header="Report Submitted"
        message="Thank you for reporting this issue. Our team will review it shortly."
        buttons={['OK']}
      />
    </IonPage>
  );
};

export default ReportIncident;
