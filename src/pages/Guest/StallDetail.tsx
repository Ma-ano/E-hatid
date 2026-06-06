import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { IonPage, IonContent, IonIcon, IonButton, IonBackButton, IonButtons, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { locationOutline, star, timeOutline, carOutline, cartOutline, documentTextOutline, personOutline } from 'ionicons/icons';
import { fetchStallById } from '../../services/stallService';
import { Stall, MenuItem, SelectedOption, SelectedAddOn } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import MenuItemModal from '../../components/Stall/MenuItemModal';
import AppFooter from '../../components/AppFooter';
import './StallDetail.css';

const StallDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [stall, setStall] = useState<Stall | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const history = useHistory();
  const { user } = useAuth();
  const { items, addToCart, total, itemCount } = useCart();
  const [activeSection, setActiveSection] = useState<string>('');
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const sectionRefMap = useRef<Map<string, HTMLDivElement>>(new Map());

  const setSectionRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    if (el) {
      sectionRefMap.current.set(id, el);
    } else {
      sectionRefMap.current.delete(id);
    }
  }, []);

  const headerRefMap = useRef<Map<string, HTMLDivElement>>(new Map());

  const setHeaderRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    if (el) {
      headerRefMap.current.set(id, el);
    } else {
      headerRefMap.current.delete(id);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadStall = async () => {
      setLoading(true);
      try {
        if (id) {
          const data = await fetchStallById(id);
          setStall(data || null);
        }
      } catch (error) {
        console.error('Error loading stall:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStall();
  }, [id]);

  const availableItems = stall?.menu?.filter(item => item.available) || [];
  const popularItems = availableItems.filter(item => item.popular);
  const categories = [...new Set(availableItems.map(item => item.category))];
  const navItems = [
    ...(popularItems.length > 0 ? [{ id: 'popular', label: '🔥 Popular' }] : []),
    ...categories.map(c => ({ id: c, label: c }))
  ];

  const handleItemClick = useCallback((item: MenuItem) => {
    setSelectedItem(item);
  }, []);

  const handleAddToCart = useCallback((input: {
    item: MenuItem;
    selectedOptions: SelectedOption[];
    selectedAddOns: SelectedAddOn[];
    specialInstructions: string;
  }) => {
    addToCart(input);
  }, [addToCart]);

  const handleCloseModal = useCallback(() => {
    setSelectedItem(null);
  }, []);

  useEffect(() => {
    if (loading || !stall || navItems.length === 0) return;
    setActiveSection(prev => prev || navItems[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        let bestEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting && (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio)) {
            bestEntry = entry;
          }
        }
        if (bestEntry) {
          const sectionId = bestEntry.target.getAttribute('data-header');
          if (sectionId) setActiveSection(sectionId);
        }
      },
      { threshold: 0, rootMargin: '-64px 0px -90% 0px' }
    );

    const refs = headerRefMap.current;
    refs.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [loading, stall, navItems.length]);

  const handleScroll = useCallback((e: CustomEvent) => {
    const { scrollTop, scrollHeight, contentHeight } = e.detail;
    setIsFooterVisible(scrollTop + contentHeight >= scrollHeight - 200);
  }, []);

  if (loading) {
    return (
      <IonPage>
        <IonContent className="stall-detail-page">
          <div className="loading-state"><p>Loading...</p></div>
        </IonContent>
      </IonPage>
    );
  }

  if (!stall) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/guest/home" />
            </IonButtons>
            <IonTitle>Not Found</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="stall-detail-page">
          <div className="not-found-state">
            <h2>Stall not found</h2>
            <IonButton routerLink="/guest/home">Go back home</IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const menuItemsByCategory = (category: string) =>
    availableItems.filter(item => item.category === category && !item.popular);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ padding: '0 16px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
            <IonBackButton defaultHref={user ? '/user/home' : '/guest/home'} />
            <span style={{ fontSize: '18px', fontWeight: 600, flex: 1 }}>{stall.name}</span>
            <IonButton fill="clear" onClick={() => history.push(user ? '/user/cart' : '/guest/cart')} style={{ position: 'relative' }}>
              <IonIcon icon={cartOutline} style={{ fontSize: '22px', color: '#6366F1' }} />
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-2px', right: '-2px',
                  background: 'var(--ion-color-primary)', color: 'white',
                  borderRadius: '50%', width: '18px', height: '18px',
                  fontSize: '10px', fontWeight: 700, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}>{itemCount}</span>
              )}
            </IonButton>
            <IonButton fill="clear" onClick={() => history.push('/user/orders')}>
              <IonIcon icon={documentTextOutline} style={{ fontSize: '22px', color: '#6366F1' }} />
            </IonButton>
            <IonButton fill="clear" onClick={() => history.push(user ? '/user/profile' : '/user/login')}>
              <IonIcon icon={personOutline} style={{ fontSize: '22px', color: 'var(--ion-text-color)' }} />
            </IonButton>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="stall-detail-page" onIonScroll={handleScroll}>
        <div className="stall-hero" data-initial={stall.name.charAt(0)} style={stall.accentColor ? { '--hero-accent': stall.accentColor } as any : undefined}>
          <img src={stall.image} alt={stall.name} className="stall-hero-img" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.add('img-failed'); }} />
          {stall.logo && (
            <img src={stall.logo} alt={`${stall.name} logo`} className="stall-hero-logo" />
          )}
        </div>

        <div className="stall-info-section" style={stall.accentColor ? { '--stall-accent': stall.accentColor } as any : undefined}>
          <div className="stall-title-row">
            <h1 className="stall-title">{stall.name}</h1>
            <div className="stall-rating">
              <IonIcon icon={star} />
              <span>{stall.rating}</span>
            </div>
          </div>
          <p className="stall-category">{stall.category}</p>
          <div className="stall-meta">
            <div className="stall-meta-item">
              <IonIcon icon={timeOutline} />
              <span>{stall.deliveryTime}</span>
            </div>
            <div className="stall-meta-item">
              <IonIcon icon={carOutline} />
              <span>₱{stall.deliveryFee} delivery</span>
            </div>
            <div className="stall-meta-item">
              <IonIcon icon={locationOutline} />
              <span>Near you</span>
            </div>
          </div>
          <p className="stall-description">{stall.description}</p>
        </div>

        {navItems.length > 1 && (
          <div className="sticky-nav" style={stall.accentColor ? { '--stall-accent': stall.accentColor } as any : undefined}>
            {navItems.map(nav => (
              <button
                key={nav.id}
                className={`sticky-nav-item ${activeSection === nav.id ? 'active' : ''}`}
                onClick={() => {
                  const el = sectionRefMap.current.get(nav.id);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                {nav.label}
              </button>
            ))}
          </div>
        )}

        <div className="menu-section">
          {popularItems.length > 0 && (
            <div
              ref={setSectionRef('popular')}
              data-section="popular"
              className="menu-section-group"
            >
              <div ref={setHeaderRef('popular')} data-header="popular" className="menu-section-header">
                <h2 className="menu-section-title"><span className="fire-icon">🔥</span> Popular Orders</h2>
                <span className="menu-section-subtitle">Most ordered items</span>
              </div>
              <div className="menu-grid popular-grid">
                {popularItems.map(item => (
                  <div
                    key={item.id}
                    className={`menu-card popular ${!item.available ? 'unavailable' : ''}`}
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="menu-card-image">
                      <img src={item.image || stall.image} alt={item.name} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.add('img-failed'); }} />
                      <span className="popular-tag">🔥 Popular</span>
                    </div>
                    <div className="menu-card-body">
                      <h3 className="menu-card-name">{item.name}</h3>
                      <p className="menu-card-desc">{item.description}</p>
                      <div className="menu-card-footer">
                        <span className="menu-card-price">₱{item.price.toFixed(2)}</span>
                        <button className="customize-btn">Customize</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {categories.map(category => {
            const items = menuItemsByCategory(category);
            if (items.length === 0) return null;
            const sectionId = category;
            return (
              <div
                key={category}
                ref={setSectionRef(sectionId)}
                data-section={sectionId}
                className="menu-section-group"
              >
                <div ref={setHeaderRef(sectionId)} data-header={sectionId} className="menu-section-header">
                  <h2 className="menu-section-title">{category}</h2>
                </div>
                <div className="menu-grid">
                  {items.map(item => (
                    <div
                      key={item.id}
                      className={`menu-card ${!item.available ? 'unavailable' : ''}`}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="menu-card-image">
                        <img src={item.image || stall.image} alt={item.name} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.add('img-failed'); }} />
                      </div>
                      <div className="menu-card-body">
                        <h3 className="menu-card-name">{item.name}</h3>
                        <p className="menu-card-desc">{item.description}</p>
                        <div className="menu-card-footer">
                          <span className="menu-card-price">₱{item.price.toFixed(2)}</span>
                          <button className="customize-btn">Customize</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {items.length > 0 && (
          <div className={`cart-float-btn${isFooterVisible ? ' footer-visible' : ''}`} onClick={() => history.push(user ? '/user/cart' : '/guest/cart')}>
            <div className="cart-float-content">
              <span className="cart-float-count">{itemCount} item{itemCount > 1 ? 's' : ''}</span>
              <span className="cart-float-price">₱{total.toFixed(2)}</span>
            </div>
          </div>
        )}

        <AppFooter />
      </IonContent>

      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          isMobile={isMobile}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}
    </IonPage>
  );
};

export default StallDetail;
