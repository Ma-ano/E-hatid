import React, { useState, useEffect, useRef } from 'react';
import { IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonIcon, IonToggle, IonSpinner, IonToast } from '@ionic/react';
import { storefrontOutline, timeOutline, bicycleOutline, cartOutline, notificationsOutline, colorPaletteOutline, cameraOutline, personOutline, callOutline, locationOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { getStallByVendorId, createStall, updateStall } from '../../services/stallService';
import { compressImage } from '../../utils/compressImage';

const VendorSettings: React.FC = () => {
  const history = useHistory();
  const { logout, user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stallId, setStallId] = useState<string | null>(null);
  const [vendorName, setVendorName] = useState('');
  const [vendorPhone, setVendorPhone] = useState('');
  const [stallAddress, setStallAddress] = useState('');
  const [stallName, setStallName] = useState('');
  const [description, setDescription] = useState('');
  const [openTime, setOpenTime] = useState('08:00');
  const [closeTime, setCloseTime] = useState('22:00');
  const [deliveryFee, setDeliveryFee] = useState(30);
  const [active, setActive] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [coverPhoto, setCoverPhoto] = useState('');
  const [stallLogo, setStallLogo] = useState('');
  const [accentColor, setAccentColor] = useState('#6366F1');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    setVendorName(user.name || '');
    setVendorPhone(user.phone || '');
    setStallAddress(user.stallAddress || '');
    const loadStall = async () => {
      try {
        const stall = await getStallByVendorId(user.id);
        if (stall) {
          setStallId(stall.id);
          setStallName(stall.name);
          setDescription(stall.description || '');
          setDeliveryFee(stall.deliveryFee);
          setCoverPhoto(stall.image || '');
          setStallLogo(stall.logo || '');
          setAccentColor(stall.accentColor || '#6366F1');
          setActive(stall.active ?? true);
          if (stall.address) setStallAddress(stall.address);
          if (stall.deliveryTime) {
            const parts = stall.deliveryTime.split(' - ');
            if (parts.length === 2) {
              setOpenTime(parts[0]);
              setCloseTime(parts[1]);
            }
          }
        } else {
          if (user.stallName) setStallName(user.stallName);
          if (user.stallAddress) setStallAddress(user.stallAddress);
        }
      } catch (err) {
        console.error('Error loading stall:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStall();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile({
        name: vendorName,
        phone: vendorPhone,
        stallAddress,
      });
      const stallData = {
        id: user.id,
        name: stallName,
        description,
        image: coverPhoto || '/default-stall.jpg',
        rating: 0,
        deliveryTime: `${openTime} - ${closeTime}`,
        deliveryFee,
        vendorId: user.id,
        category: 'Fast Food',
        logo: stallLogo || '',
        accentColor,
        active,
        address: stallAddress,
      };
      if (stallId) {
        await updateStall(stallId, stallData);
      } else {
        await createStall(stallData as any);
        setStallId(user.id);
      }
      setToastMessage('Settings saved successfully!');
      setShowToast(true);
    } catch (err) {
      console.error('Error saving stall:', err);
      setToastMessage('Failed to save settings');
      setShowToast(true);
    } finally {
      setSaving(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingCover(true);
    try {
      const dataUrl = await compressImage(file, 800, 800, 400);
      setCoverPhoto(dataUrl);
    } catch (err) {
      console.error('Error uploading cover:', err);
      setToastMessage('Failed to upload cover photo');
      setShowToast(true);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingLogo(true);
    try {
      const dataUrl = await compressImage(file, 200, 200, 200);
      setStallLogo(dataUrl);
    } catch (err) {
      console.error('Error uploading logo:', err);
      setToastMessage('Failed to upload logo');
      setShowToast(true);
    } finally {
      setUploadingLogo(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader showLogo={true} showBack={true} backHref="/vendor/dashboard" />
        <IonSpinner name="crescent" />
      </>
    );
  }

  return (
    <>
      <PageHeader
        showLogo={true}
        showBack={true}
        backHref="/vendor/dashboard"
        onLogoutClick={() => { logout(); history.push('/vendor/login'); }}
      />
        <div className="settings-page">
          <div className="page-header">
            <h1>Settings</h1>
            <p className="page-subtitle">Manage your stall preferences</p>
          </div>

          <IonCard className="settings-card">
            <IonCardContent>
              <h3 className="section-title">
                <IonIcon icon={personOutline} />
                Personal Information
              </h3>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <IonItem className="form-input">
                  <IonInput value={vendorName} onIonChange={e => setVendorName(e.detail.value!)} />
                </IonItem>
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <IonItem className="form-input">
                  <IonIcon icon={callOutline} slot="start" />
                  <IonInput type="tel" value={vendorPhone} onIonChange={e => setVendorPhone(e.detail.value!)} />
                </IonItem>
              </div>
              <div className="form-group">
                <label className="form-label">Stall Address</label>
                <IonItem className="form-input">
                  <IonIcon icon={locationOutline} slot="start" />
                  <IonInput value={stallAddress} onIonChange={e => setStallAddress(e.detail.value!)} />
                </IonItem>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="settings-card">
            <IonCardContent>
              <h3 className="section-title">
                <IonIcon icon={storefrontOutline} />
                Stall Information
              </h3>
              <div className="form-group">
                <label className="form-label">Stall Name</label>
                <IonItem className="form-input">
                  <IonInput value={stallName} onIonChange={e => setStallName(e.detail.value!)} />
                </IonItem>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <IonItem className="form-input">
                  <IonTextarea value={description} onIonChange={e => setDescription(e.detail.value!)} rows={3} />
                </IonItem>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="settings-card">
            <IonCardContent>
              <h3 className="section-title">
                <IonIcon icon={timeOutline} />
                Operating Hours
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Open Time</label>
                  <IonItem className="form-input">
                    <IonInput type="time" value={openTime} onIonChange={e => setOpenTime(e.detail.value!)} />
                  </IonItem>
                </div>
                <div className="form-group">
                  <label className="form-label">Close Time</label>
                  <IonItem className="form-input">
                    <IonInput type="time" value={closeTime} onIonChange={e => setCloseTime(e.detail.value!)} />
                  </IonItem>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="settings-card">
            <IonCardContent>
              <h3 className="section-title">
                <IonIcon icon={bicycleOutline} />
                Delivery Settings
              </h3>
              <div className="form-group">
                <label className="form-label">Delivery Fee (₱)</label>
                <IonItem className="form-input">
                  <IonInput type="number" value={deliveryFee} onIonChange={e => setDeliveryFee(Number(e.detail.value))} />
                </IonItem>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="settings-card">
            <IonCardContent>
              <h3 className="section-title">
                <IonIcon icon={cartOutline} />
                Store Status
              </h3>
              <IonItem lines="none">
                <IonLabel>Show on Home Page</IonLabel>
                <IonToggle checked={active} onIonChange={e => setActive(e.detail.checked)} style={{ '--background-checked': '#8B5CF6' }} />
              </IonItem>
            </IonCardContent>
          </IonCard>

          <IonCard className="settings-card">
            <IonCardContent>
              <h3 className="section-title">
                <IonIcon icon={notificationsOutline} />
                Notifications
              </h3>
              <IonItem lines="none">
                <IonLabel>Push Notifications</IonLabel>
                <IonToggle checked={notifications} onIonChange={e => setNotifications(e.detail.checked)} style={{ '--background-checked': '#8B5CF6' }} />
              </IonItem>
            </IonCardContent>
          </IonCard>

          <IonCard className="settings-card">
            <IonCardContent>
              <h3 className="section-title">
                <IonIcon icon={colorPaletteOutline} />
                Stall Appearance
              </h3>
              <div className="form-group">
                <label className="form-label">Cover Photo</label>
                <div className="settings-image-upload" onClick={() => coverInputRef.current?.click()}>
                  {uploadingCover ? (
                    <div className="settings-image-placeholder">
                      <IonSpinner name="crescent" />
                      <span>Uploading...</span>
                    </div>
                  ) : coverPhoto ? (
                    <img src={coverPhoto} alt="Cover" className="settings-image-preview" />
                  ) : (
                    <div className="settings-image-placeholder">
                      <IonIcon icon={cameraOutline} />
                      <span>Tap to add cover photo</span>
                    </div>
                  )}
                  <input ref={coverInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverUpload} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Stall Logo</label>
                <div className="settings-logo-upload" onClick={() => logoInputRef.current?.click()}>
                  {uploadingLogo ? (
                    <div className="settings-logo-placeholder">
                      <IonSpinner name="crescent" />
                    </div>
                  ) : stallLogo ? (
                    <img src={stallLogo} alt="Logo" className="settings-logo-preview" />
                  ) : (
                    <div className="settings-logo-placeholder">
                      <IonIcon icon={cameraOutline} />
                    </div>
                  )}
                  <input ref={logoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Accent Color</label>
                <div className="settings-color-row">
                  <div className="settings-color-preview" style={{ background: accentColor }} />
                  <IonItem className="form-input" style={{ flex: 1 }}>
                    <IonInput value={accentColor} onIonChange={e => setAccentColor(e.detail.value! || '#6366F1')} placeholder="#6366F1" />
                  </IonItem>
                  <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="settings-color-picker" />
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonButton expand="block" disabled={saving} style={{ '--background': '#8B5CF6', marginTop: '8px' }} onClick={handleSave}>
            {saving ? 'Saving...' : 'Save Settings'}
          </IonButton>

          <IonToast
            isOpen={showToast}
            message={toastMessage}
            duration={3000}
            onDidDismiss={() => setShowToast(false)}
            position="bottom"
            color={toastMessage.includes('Failed') ? 'danger' : 'success'}
          />
        </div>
    </>
  );
};

export default VendorSettings;
