import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useHistory } from 'react-router-dom';
import { IonIcon, IonButton, IonBackButton, IonButtons, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { locationOutline, star, timeOutline, carOutline, cartOutline, documentTextOutline, personOutline } from 'ionicons/icons';
import { fetchStallById } from '../../services/stallService';
import { Stall, MenuItem, SelectedOption, SelectedAddOn } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import MenuItemModal from '../../components/Stall/MenuItemModal';

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
      { threshold: 0, rootMargin: '-112px 0px -90% 0px' }
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
      <>
        <div className="loading-state"><p>Loading...</p></div>
      </>
    );
  }

  if (!stall) {
    return (
      <>
      <IonHeader className="sticky top-0 z-20">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/guest/home" />
            </IonButtons>
            <IonTitle>Not Found</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="not-found-state">
            <h2>Stall not found</h2>
            <IonButton routerLink="/guest/home">Go back home</IonButton>
          </div>
      </>
    );
  }

  const menuItemsByCategory = (category: string) =>
    availableItems.filter(item => item.category === category && !item.popular);

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--ion-card-background)] border-b border-[var(--ion-border-color)]">
        <div className="flex items-center gap-1 sm:gap-2 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 min-h-[56px]">
            <IonBackButton defaultHref={user ? '/customer/home' : '/guest/home'} className="shrink-0" />
            <span className="text-sm sm:text-base md:text-lg font-semibold flex-1 truncate text-[var(--ion-text-color)]">{stall.name}</span>
            <IonButton fill="clear" onClick={() => history.push(user ? '/customer/cart' : '/guest/cart')} className="relative min-w-[44px] min-h-[44px] shrink-0">
              <IonIcon icon={cartOutline} className="text-xl sm:text-2xl text-[var(--ion-color-primary)]" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[var(--ion-color-primary)] text-white rounded-full w-4 h-4 sm:w-[18px] sm:h-[18px] text-[9px] sm:text-[10px] font-bold flex items-center justify-center shadow-sm">{itemCount}</span>
              )}
            </IonButton>
            <IonButton fill="clear" onClick={() => history.push('/customer/orders')} className="min-w-[44px] min-h-[44px] shrink-0 hidden xs:flex">
              <IonIcon icon={documentTextOutline} className="text-xl sm:text-2xl text-[var(--ion-color-primary)]" />
            </IonButton>
            <IonButton fill="clear" onClick={() => history.push(user ? '/customer/profile' : '/login')} className="min-w-[44px] min-h-[44px] shrink-0">
              <IonIcon icon={personOutline} className="text-xl sm:text-2xl text-[var(--ion-text-color)]" />
            </IonButton>
          </div>
        </header>
        <div className="max-w-7xl mx-auto">
          <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] md:aspect-[4/1] overflow-hidden" data-initial={stall.name.charAt(0)} style={stall.accentColor ? { '--hero-accent': stall.accentColor } as any : undefined}>
            <img src={stall.image} alt={stall.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.add('img-failed'); }} />
            {stall.logo && (
              <img src={stall.logo} alt={`${stall.name} logo`} className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 w-12 h-12 sm:w-16 sm:h-16 rounded-xl border-2 border-white shadow-md object-cover" />
            )}
          </div>

          <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6" style={stall.accentColor ? { '--stall-accent': stall.accentColor } as any : undefined}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--ion-text-color)] m-0 truncate">{stall.name}</h1>
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shrink-0">
                <IonIcon icon={star} className="text-amber-500" />
                <span>{stall.rating}</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[var(--ion-color-primary)] font-medium mb-2">{stall.category}</p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-[var(--ion-text-color-secondary)] mb-2 sm:mb-3">
              <span className="flex items-center gap-1">
                <IonIcon icon={timeOutline} className="text-sm" />
                {stall.deliveryTime}
              </span>
              <span className="flex items-center gap-1">
                <IonIcon icon={carOutline} className="text-sm" />
                ₱{stall.deliveryFee} delivery
              </span>
              <span className="flex items-center gap-1">
                <IonIcon icon={locationOutline} className="text-sm" />
                Near you
              </span>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-[var(--ion-text-color-secondary)] leading-relaxed">{stall.description}</p>
          </div>

          {navItems.length > 1 && (
            <div className="sticky top-14 z-10 bg-[var(--ion-card-background)] border-b border-[var(--ion-border-color)]">
              <div className="flex gap-2 bg-gray-100 dark:bg-slate-800 p-1 rounded-full w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-2">
                {navItems.map(nav => (
                  <button
                    key={nav.id}
                    onClick={() => {
                      setActiveSection(nav.id);
                      const el = sectionRefMap.current.get(nav.id);
                      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="relative flex-1 px-2 py-2 text-sm font-medium whitespace-nowrap transition-colors"
                  >
                    {activeSection === nav.id && (
                      <motion.div
                        layoutId="active-section-pill"
                        layout="position"
                        className="absolute inset-0 bg-[var(--ion-color-primary)] rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 block truncate ${activeSection === nav.id ? "text-white" : "text-[var(--ion-text-color-secondary)]"}`}>
                      {nav.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto">
            {popularItems.length > 0 && (
              <div ref={setSectionRef('popular')} data-section="popular" className="mb-6 sm:mb-8">
                <div ref={setHeaderRef('popular')} data-header="popular" className="mb-3 sm:mb-4">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-[var(--ion-text-color)] m-0"><span className="mr-1">🔥</span> Popular Orders</h2>
                  <p className="text-xs sm:text-sm text-[var(--ion-text-color-secondary)] mt-1">Most ordered items</p>
                </div>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {popularItems.map(item => (
                    <div
                      key={item.id}
                      className={`rounded-2xl overflow-hidden bg-[var(--ion-card-background)] border border-[var(--ion-border-color)] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${!item.available ? 'opacity-60' : ''}`}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img src={item.image || stall.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.add('img-failed'); }} />
                        <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">🔥 Popular</span>
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="text-sm sm:text-base font-bold text-[var(--ion-text-color)] m-0 mb-1">{item.name}</h3>
                        <p className="text-xs sm:text-sm text-[var(--ion-text-color-secondary)] m-0 mb-2 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm sm:text-base font-bold text-[var(--ion-color-primary)]">₱{item.price.toFixed(2)}</span>
                          <button className="text-xs sm:text-sm font-semibold text-[var(--ion-color-primary)] bg-[var(--ion-color-primary)]/10 px-3 py-1.5 rounded-full hover:bg-[var(--ion-color-primary)]/20 transition-colors min-h-[36px]">Customize</button>
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
                <div key={category} ref={setSectionRef(sectionId)} data-section={sectionId} className="mb-6 sm:mb-8">
                  <div ref={setHeaderRef(sectionId)} data-header={sectionId} className="mb-3 sm:mb-4">
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-[var(--ion-text-color)] m-0">{category}</h2>
                  </div>
                  <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {items.map(item => (
                      <div
                        key={item.id}
                        className={`rounded-2xl overflow-hidden bg-[var(--ion-card-background)] border border-[var(--ion-border-color)] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${!item.available ? 'opacity-60' : ''}`}
                        onClick={() => handleItemClick(item)}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img src={item.image || stall.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.add('img-failed'); }} />
                        </div>
                        <div className="p-3 sm:p-4">
                          <h3 className="text-sm sm:text-base font-bold text-[var(--ion-text-color)] m-0 mb-1">{item.name}</h3>
                          <p className="text-xs sm:text-sm text-[var(--ion-text-color-secondary)] m-0 mb-2 line-clamp-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm sm:text-base font-bold text-[var(--ion-color-primary)]">₱{item.price.toFixed(2)}</span>
                            <button className="text-xs sm:text-sm font-semibold text-[var(--ion-color-primary)] bg-[var(--ion-color-primary)]/10 px-3 py-1.5 rounded-full hover:bg-[var(--ion-color-primary)]/20 transition-colors min-h-[36px]">Customize</button>
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
            <div className={`fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 bg-[var(--ion-card-background)] border-t border-[var(--ion-border-color)] shadow-lg transition-transform duration-300 ${isFooterVisible ? 'translate-y-full' : 'translate-y-0'}`} onClick={() => history.push(user ? '/customer/cart' : '/guest/cart')}>
              <div className="max-w-lg mx-auto flex items-center justify-between bg-[var(--ion-color-primary)] text-white px-4 sm:px-5 py-3 sm:py-4 rounded-xl cursor-pointer hover:opacity-90 transition-opacity">
                <span className="text-xs sm:text-sm font-medium">{itemCount} item{itemCount > 1 ? 's' : ''}</span>
                <span className="text-sm sm:text-base font-bold">₱{total.toFixed(2)}</span>
              </div>
            </div>
          )}

        </div>

      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          isMobile={isMobile}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  );
};

export default StallDetail;
