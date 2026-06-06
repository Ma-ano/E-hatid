import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonCard, IonCardContent, IonIcon, IonSpinner } from '@ionic/react';
import { star, starOutline, thumbsUp } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { fetchReviewsByStall, getReviewStats } from '../../services/reviewService';
import { getStallByVendorId } from '../../services/stallService';
import { Review } from '../../types';
import './VendorReviews.css';
import AppFooter from '../../components/AppFooter';

const VendorReviews: React.FC = () => {
  const history = useHistory();
  const { logout, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stallId, setStallId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [total, setTotal] = useState(0);
  const [distribution, setDistribution] = useState<number[]>([0, 0, 0, 0, 0]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      try {
        const stall = await getStallByVendorId(user.id);
        if (stall) {
          setStallId(stall.id);
          const [stats, allReviews] = await Promise.all([
            getReviewStats(stall.id),
            fetchReviewsByStall(stall.id),
          ]);
          setRating(stats.average);
          setTotal(stats.total);
          setDistribution(stats.distribution);
          setReviews(allReviews);
        }
      } catch (err) {
        console.error('Error loading reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  return (
    <IonPage>
      <PageHeader
        showLogo={true}
        showBack={true}
        backHref="/vendor/dashboard"
        onLogoutClick={() => { logout(); history.push('/vendor/login'); }}
      />

      <IonContent className="vendor-content-fix" style={{ '--background': 'var(--ion-background-color)' } as any}>
        <div className="reviews-page">
          <div className="page-header">
            <h1>Reviews</h1>
            <p className="page-subtitle">See what your customers are saying</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px' }}><IonSpinner name="crescent" /></div>
          ) : (
            <>
              <IonCard className="rating-summary-card">
                <IonCardContent>
                  <div className="rating-summary-grid">
                    <div className="rating-main">
                      <div style={{ fontSize: '48px', fontWeight: 800, color: '#8B5CF6' }}>{total > 0 ? rating : '—'}</div>
                      <div style={{ display: 'flex', gap: '4px', margin: '8px 0' }}>
                        {[1,2,3,4,5].map(s => (
                          <IonIcon key={s} icon={s <= Math.round(rating) ? star : starOutline} style={{ fontSize: '20px', color: '#F59E0B' }} />
                        ))}
                      </div>
                      <p style={{ margin: 0, fontSize: '14px', color: 'var(--ion-text-color-secondary)' }}>{total} reviews</p>
                    </div>
                    <div className="rating-bars">
                      {[5,4,3,2,1].map((stars, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '14px', minWidth: '40px', color: 'var(--ion-text-color)' }}>{stars} ★</span>
                          <div style={{ flex: 1, height: '8px', background: 'var(--ion-border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: total > 0 ? `${(distribution[5 - stars] / total) * 100}%` : '0%', height: '100%', background: '#F59E0B', borderRadius: '4px' }} />
                          </div>
                          <span style={{ fontSize: '13px', minWidth: '30px', color: 'var(--ion-text-color-secondary)' }}>{distribution[5 - stars]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>

              {reviews.length === 0 ? (
                <IonCard className="orders-card"><IonCardContent><p style={{ textAlign: 'center', color: 'var(--ion-text-color-secondary)', margin: 0 }}>No reviews yet</p></IonCardContent></IonCard>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {reviews.map((review, i) => (
                    <IonCard key={i} className="orders-card" style={{ margin: 0 }}>
                      <IonCardContent>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <h3 style={{ margin: '0 0 4px', fontWeight: 700, color: 'var(--ion-text-color)' }}>{review.userName}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ display: 'flex', gap: '2px' }}>
                                {[1,2,3,4,5].map(s => (
                                  <IonIcon key={s} icon={s <= review.rating ? star : starOutline} style={{ fontSize: '14px', color: '#F59E0B' }} />
                                ))}
                              </div>
                              <span style={{ fontSize: '12px', color: 'var(--ion-text-color-secondary)' }}>{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p style={{ margin: '12px 0', fontSize: '14px', color: 'var(--ion-text-color)', lineHeight: 1.5 }}>{review.comment}</p>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--ion-text-color-secondary)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <IonIcon icon={thumbsUp} /> {review.likes}
                          </span>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      <AppFooter />
      </IonContent>
    </IonPage>
  );
};

export default VendorReviews;
