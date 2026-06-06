// src/pages/Guest/LocationPicker.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonFooter,
} from '@ionic/react';
import { locationOutline, cartOutline, documentTextOutline, personOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PageHeader from '../../components/PageHeader';
import AppFooter from '../../components/AppFooter';

interface Suggestion {
  display: string;
  lat: string;
  lon: string;
}

const markerIcon = L.divIcon({
  className: '',
  html: '<div style="background:#6366F1;width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const reverseGeocode = async (lat: number, lng: number): Promise<Suggestion | null> => {
  try {
    const res = await fetch(
      `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`
    );
    const data = await res.json();
    const f = data.features?.[0];
    if (!f) return null;
    const parts = [
      f.properties.name && f.properties.street
        ? `${f.properties.name} ${f.properties.street}`
        : f.properties.street || '',
      f.properties.district || '',
      f.properties.city || '',
      f.properties.state || '',
    ].filter(Boolean);
    return {
      display: parts.join(', '),
      lat: f.geometry.coordinates[1],
      lon: f.geometry.coordinates[0],
    };
  } catch {
    return null;
  }
};

const LocationMarker: React.FC<{
  position: [number, number] | null;
  onLocationChange: (loc: { lat: number; lng: number }) => void;
}> = ({ position, onLocationChange }) => {
  useMapEvents({
    click: async (e) => {
      onLocationChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return position ? <Marker position={position} icon={markerIcon} /> : null;
};

const MapController = ({ position }: { position: [number, number] | null }) => {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 150);
  }, []);

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom(), { animate: true });
    }
  }, [position]);

  return null;
};

const GuestLocationPicker: React.FC = () => {
  const history = useHistory();
  const { isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Suggestion | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [fetching, setFetching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const geocodeRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Forward geocoding: debounced search on query change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setSuggestions([]); return; }

    debounceRef.current = setTimeout(async () => {
      setFetching(true);
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=en`
        );
        const data = await res.json();
        setSuggestions(
          (data.features || []).map((f: any) => {
            const parts = [
              f.properties.name && f.properties.street
                ? `${f.properties.name} ${f.properties.street}`
                : f.properties.street || '',
              f.properties.district || '',
              f.properties.city || '',
              f.properties.state || '',
            ].filter(Boolean);
            return {
              display: parts.join(', '),
              lat: f.geometry.coordinates[1],
              lon: f.geometry.coordinates[0],
            };
          })
        );
      } catch {
        setSuggestions([]);
      } finally {
        setFetching(false);
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  // Reverse geocode when map is clicked
  useEffect(() => {
    if (!selectedLocation) return;
    if (geocodeRef.current) clearTimeout(geocodeRef.current);
    geocodeRef.current = setTimeout(async () => {
      setFetching(true);
      const result = await reverseGeocode(selectedLocation.lat, selectedLocation.lng);
      if (result) {
        setSelectedAddress(result);
        setQuery(result.display);
      }
      setFetching(false);
    }, 200);
    return () => { if (geocodeRef.current) clearTimeout(geocodeRef.current); };
  }, [selectedLocation]);

  const selectSuggestion = (s: Suggestion) => {
    setSelectedAddress(s);
    setQuery(s.display);
    setSuggestions([]);
    setSelectedLocation({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) });
  };

  const handleMapClick = (loc: { lat: number; lng: number }) => {
    setSelectedLocation(loc);
    setSuggestions([]);
  };

  const handleConfirm = () => {
    if (!selectedAddress || !selectedLocation) return;
    sessionStorage.setItem('selectedLocation', JSON.stringify(selectedLocation));
    sessionStorage.setItem('locationName', selectedAddress.display);
    history.goBack();
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--ion-border-color)',
    background: 'var(--ion-background-color)',
    color: 'var(--ion-text-color)',
    fontFamily: 'inherit',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  return (
    <IonPage>
      <PageHeader
        showLogo={true}
        showBack={true}
        cartCount={itemCount}
        onCartClick={() => history.push('/guest/cart')}
        onOrdersClick={() => history.push('/user/orders')}
        {...(isAuthenticated
          ? { onProfileClick: () => history.push('/user/profile') }
          : { onLoginClick: () => history.push('/user/login'), onRegisterClick: () => history.push('/user/register') }
        )}
      />

      <IonContent style={{ '--background': 'var(--ion-background-color)' } as any}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        <div className="page-container" style={{ flex: 1, paddingTop: '24px', paddingBottom: '24px' }}>
          {/* Map */}
          <div style={{ width: '100%', height: '40vh', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
            <MapContainer
              center={[selectedLocation?.lat || 14.5995, selectedLocation?.lng || 120.9842]}
              zoom={15}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <MapController position={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : null} />
              <LocationMarker
                position={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : null}
                onLocationChange={handleMapClick}
              />
            </MapContainer>
          </div>

          {/* Address Search with Autocomplete */}
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--ion-text-color)', textTransform: 'uppercase', opacity: 0.7 }}>
              Delivery Address
            </label>
            <div style={{ position: 'relative' }}>
              <IonIcon icon={locationOutline} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ion-color-primary)', fontSize: '18px', zIndex: 1 }} />
              <input
                type="text"
                placeholder="Search your address..."
                value={query}
                onChange={e => { setQuery(e.target.value); setSelectedAddress(null); }}
                style={{ ...inputStyle, paddingLeft: '38px' }}
              />
              {fetching && (
                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>
                  Searching...
                </span>
              )}
            </div>

            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div style={{
                position: 'absolute', left: 0, right: 0, top: '100%', zIndex: 100,
                background: 'var(--ion-card-background)',
                border: '1px solid var(--ion-border-color)',
                borderRadius: '0 0 8px 8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                maxHeight: '200px', overflowY: 'auto',
              }}>
                {suggestions.map((s, i) => (
                  <div key={i} onClick={() => selectSuggestion(s)}
                    style={{
                      padding: '10px 12px', cursor: 'pointer',
                      borderBottom: i < suggestions.length - 1 ? '1px solid var(--ion-border-color)' : 'none',
                      fontSize: '13px', color: 'var(--ion-text-color)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--ion-color-light)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <IonIcon icon={locationOutline} style={{ marginRight: '8px', color: 'var(--ion-color-primary)', fontSize: '14px', verticalAlign: 'middle' }} />
                    {s.display}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Address Display */}
          {selectedAddress && (
            <div style={{
              background: 'var(--ion-card-background)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid var(--ion-border-color)',
              marginBottom: '24px',
            }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <IonIcon icon={locationOutline} style={{ color: 'var(--ion-color-primary)', fontSize: '20px', minWidth: '20px', marginTop: '2px' }} />
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>
                    Selected Address
                  </p>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: 'var(--ion-text-color)' }}>
                    {selectedAddress.display}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <AppFooter />
        </div>
      </IonContent>

      {/* Footer */}
      {selectedAddress && selectedLocation && (
        <IonFooter style={{
          '--background': 'var(--ion-card-background)',
          borderTop: '1px solid var(--ion-border-color)',
        } as any}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
          <IonButton expand="block" size="large"
            style={{
              '--background': '#6366F1', '--border-radius': '8px',
              height: '48px', fontSize: '16px', fontWeight: 700,
            }}
            onClick={handleConfirm}
          >
            <IonIcon slot="start" icon={locationOutline} />
            Confirm Location
          </IonButton>
          </div>
        </IonFooter>
      )}
    </IonPage>
  );
};

export default GuestLocationPicker;
