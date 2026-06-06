// src/pages/User/Home.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  IonPage,
  IonContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { fetchStalls, getCategories } from '../../services/stallService';
import PageHeader from '../../components/PageHeader';
import { Stall } from '../../types/index';
import {
  locationOutline,
  starOutline,
  chevronForwardOutline,
  timeOutline,
  carOutline,
} from 'ionicons/icons';
import '../Guest/Home.css';
import AppFooter from '../../components/AppFooter';

const UserHome: React.FC = () => {
  const history = useHistory();
  const { user } = useAuth();
  const { itemCount } = useCart();
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const categories = getCategories();

  const loadStalls = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStalls({
        category: selectedCategory,
        search: searchQuery,
      });
      setStalls(data);
    } catch (error) {
      console.error('Error loading stalls:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    loadStalls();
  }, [loadStalls]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSearch = (e: any) => {
    setSearchQuery(e.detail.value || '');
  };

  return (
    <IonPage>
      <PageHeader
        showLogo={true}
        cartCount={itemCount}
        onCartClick={() => history.push('/user/cart')}
        onOrdersClick={() => history.push('/user/orders')}
        onProfileClick={() => history.push('/user/profile')}
      />
      <IonContent className="home-content">
        {/* Header Section */}
        <div className="home-header">
          <div className="home-greeting">
            <h1>{getGreeting()}, {user?.name}!</h1>
            <p>What would you like to eat today?</p>
          </div>
        </div>

        {/* Location */}
        <div className="home-location-container" onClick={() => history.push('/user/profile')} style={{ cursor: 'pointer' }}>
          <div className="home-location">
            <IonIcon icon={locationOutline} />
            <span>{user?.address || 'Set your delivery address'}</span>
            <IonIcon icon={chevronForwardOutline} className="home-location-arrow" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="home-search-container">
          <IonSearchbar
            className="home-searchbar"
            placeholder="Search for food, stalls..."
            value={searchQuery}
            onIonInput={handleSearch}
          />
        </div>

        {/* Categories */}
        <div className="home-categories">
          <IonSegment scrollable value={selectedCategory} onIonChange={(e: any) => setSelectedCategory(e.detail.value || 'All')}>
            {categories.map((category) => (
              <IonSegmentButton key={category} value={category}>
                <IonLabel>{category}</IonLabel>
              </IonSegmentButton>
            ))}
          </IonSegment>
        </div>

        {/* Main Content */}
        <div className="home-main">
          <div className="home-section-header">
            <h2 className="home-section-title">
              {selectedCategory === 'All' ? 'All Stalls' : selectedCategory}
            </h2>
            <span className="home-section-count">{stalls.length} results</span>
          </div>

          {loading ? (
            <div className="home-empty-state">
              <p>Loading...</p>
            </div>
          ) : stalls.length === 0 ? (
            <div className="home-empty-state">
              <div className="home-empty-icon">
                <IonIcon icon={carOutline} />
              </div>
              <h3>No stalls found</h3>
              <p>Try a different search or category</p>
            </div>
          ) : (
            <div className="home-stalls-grid">
              {stalls.map((stall) => (
                <div key={stall.id} className="stall-card" onClick={() => history.push(`/stall/${stall.id}/menu`)}>
                  <div className="stall-card-image-container" data-initial={stall.name.charAt(0)}>
                    <img src={stall.logo || stall.image} alt={stall.name} className="stall-card-image" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.add('img-failed'); }} />
                    <div className="stall-card-image-overlay" />
                    <div className="stall-card-rating">
                      <IonIcon icon={starOutline} className="stall-card-star-icon" />
                      <span>{stall.rating}</span>
                    </div>
                  </div>
                  <div className="stall-card-content">
                    <div className="stall-card-title-row">
                      <h3 className="stall-card-title">{stall.name}</h3>
                    </div>
                    <p className="stall-card-cuisine">{stall.category}</p>
                    <div className="stall-card-info-row">
                      <div className="stall-card-info">
                        <IonIcon icon={timeOutline} />
                        <span>{stall.deliveryTime}</span>
                      </div>
                      <div className="stall-card-info">
                        <IonIcon icon={carOutline} />
                        <span>₱{stall.deliveryFee}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      <AppFooter />
      </IonContent>
    </IonPage>
  );
};

export default UserHome;
