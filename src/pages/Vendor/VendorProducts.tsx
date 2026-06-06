import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonCard, IonCardContent, IonButton, IonIcon, IonBadge, IonToggle, IonLabel, IonSpinner } from '@ionic/react';
import { addOutline, createOutline, star, starOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { getStallByVendorId, updateStallMenu } from '../../services/stallService';
import { MenuItem } from '../../types';
import ProductEditorModal from './components/ProductEditorModal';
import './VendorProducts.css';
import AppFooter from '../../components/AppFooter';

const VendorProducts: React.FC = () => {
  const history = useHistory();
  const { logout, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stallId, setStallId] = useState<string | null>(null);
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (!user) return;
    const loadMenu = async () => {
      try {
        const stall = await getStallByVendorId(user.id);
        if (stall) {
          setStallId(stall.id);
          if (stall.menu) setProducts(stall.menu);
        }
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadMenu();
  }, [user]);

  const saveMenu = async (newMenu: MenuItem[]) => {
    setProducts(newMenu);
    if (stallId) await updateStallMenu(stallId, newMenu);
  };

  const toggleAvailable = (id: string) => {
    saveMenu(products.map(p => p.id === id ? { ...p, available: !p.available } : p));
  };

  const togglePopular = (id: string) => {
    saveMenu(products.map(p => p.id === id ? { ...p, popular: !p.popular } : p));
  };

  const handleAddProduct = () => {
    const newItem: MenuItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: '',
      price: 0,
      category: '',
      available: true,
      stallId: stallId || '',
      popular: false,
      description: '',
      options: [],
      addOns: [],
    };
    setEditingItem(newItem);
  };

  const handleSave = (updated: MenuItem) => {
    const exists = products.find(p => p.id === updated.id);
    if (exists) {
      saveMenu(products.map(p => p.id === updated.id ? updated : p));
    } else {
      saveMenu([...products, updated]);
    }
  };

  return (
    <IonPage>
      <PageHeader
        showLogo={true}
        showBack={true}
        backHref="/vendor/dashboard"
        onLogoutClick={() => { logout(); history.push('/vendor/login'); }}
      />

      <IonContent className="vendor-content-fix" style={{ '--background': 'var(--ion-background-color)' } as any}>
        <div className="products-page">
          <div className="page-header">
            <h1>Products</h1>
            <p className="page-subtitle">Manage your menu items, options, and availability</p>
          </div>

          <div className="products-header-actions">
            <IonButton style={{ '--background': '#8B5CF6' }} onClick={handleAddProduct}>
              <IonIcon icon={addOutline} slot="start" />
              Add Product
            </IonButton>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px' }}><IonSpinner name="crescent" /></div>
          ) : products.length === 0 ? (
            <IonCard className="orders-card"><IonCardContent><p style={{ textAlign: 'center', color: 'var(--ion-text-color-secondary)', margin: 0 }}>No products yet. Add your first menu item.</p></IonCardContent></IonCard>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <IonCard key={product.id} className={`product-card ${!product.available ? 'unavailable' : ''}`} style={{ margin: 0 }}>
                  <div className="product-image" style={{ background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    {product.popular && <span className="product-popular-badge">🔥 Popular</span>}
                    {product.image ? (
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                    ) : (
                      <span style={{ fontSize: '36px', color: 'rgba(255,255,255,0.5)' }}>{product.name.charAt(0)}</span>
                    )}
                  </div>
                  <IonCardContent>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px', fontWeight: 700, color: 'var(--ion-text-color)' }}>{product.name}</h3>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--ion-text-color-secondary)' }}>{product.category}</p>
                      </div>
                      <IonBadge color={product.available ? 'success' : 'medium'} style={{ fontSize: '11px' }}>
                        {product.available ? 'Available' : 'Unavailable'}
                      </IonBadge>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '20px', fontWeight: 700, color: '#8B5CF6' }}>₱{product.price.toFixed(2)}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {product.options && product.options.length > 0 && (
                          <span style={{ fontSize: '11px', color: 'var(--ion-text-color-secondary)', background: 'var(--ion-card-background)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--ion-border-color)' }}>
                            {product.options.length} option groups
                          </span>
                        )}
                        {product.addOns && product.addOns.length > 0 && (
                          <span style={{ fontSize: '11px', color: 'var(--ion-text-color-secondary)', background: 'var(--ion-card-background)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--ion-border-color)' }}>
                            {product.addOns.length} add-ons
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="product-toggles">
                      <div className="product-toggle-row">
                        <IonLabel className="toggle-label">Available</IonLabel>
                        <IonToggle checked={product.available} onIonChange={() => toggleAvailable(product.id)} style={{ '--background-checked': '#8B5CF6' }} />
                      </div>
                      <div className="product-toggle-row">
                        <IonLabel className="toggle-label">
                          <IonIcon icon={product.popular ? star : starOutline} style={{ color: '#F59E0B', marginRight: '4px', fontSize: '14px' }} />
                          Popular
                        </IonLabel>
                        <IonToggle checked={product.popular} onIonChange={() => togglePopular(product.id)} style={{ '--background-checked': '#F59E0B' }} />
                      </div>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                      <IonButton size="small" fill="outline" style={{ width: '100%', '--border-color': '#8B5CF6', '--color': '#8B5CF6' }} onClick={() => setEditingItem(product)}>
                        <IonIcon icon={createOutline} slot="start" />
                        Edit Options & Add-ons
                      </IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          )}
        </div>
        <AppFooter />
      </IonContent>

      {editingItem && (
        <ProductEditorModal
          item={editingItem}
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSave}
        />
      )}
    </IonPage>
  );
};

export default VendorProducts;
