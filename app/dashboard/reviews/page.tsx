"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useConfig } from '../../../contexts/ConfigContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { reviewService, utils, type Review } from '../../../lib/api';
import ReviewsTable from './ReviewsTable';
import Link from 'next/link';

export default function ReviewsPage() {
  const { user } = useAuth();
  const config = useConfig();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewService.getReviews();
      if (response.success && Array.isArray(response.data)) {
        // Si admin, afficher tous les avis, sinon seulement ceux de l'utilisateur
        if (user?.role === 'admin') {
          setReviews(response.data);
        } else {
          const userReviews = response.data.filter(review => review.user_id === user?.id);
          setReviews(userReviews);
        }
      } else {
        setReviews([]);
        setError(response?.message || 'Erreur lors du chargement des avis');
      }
    } catch (err) {
      setError('Erreur lors du chargement des avis');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      return;
    }
    
    try {
      const response = await reviewService.deleteReview(reviewId);
      if (response.success) {
        setReviews(prev => prev.filter(r => r.id !== reviewId));
      } else {
        alert(response.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ 
        color: i < rating ? '#ffd700' : '#ddd',
        fontSize: '16px'
      }}>
        ★
      </span>
    ));
  };

  const getStatusColor = (isApproved: boolean) => {
    return isApproved ? '#44aa44' : '#ff8800';
  };

  const getStatusText = (isApproved: boolean) => {
    return isApproved ? '✅ Approuvé' : '⏳ En attente de modération';
  };

  return (
    <ProtectedRoute>
      <main className="bookContainer">
        <aside>
          {user?.role === 'admin' ? (
            <>
              <h2 className="center" style={{ margin: 0 }}>Modération des avis</h2>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div>Chargement des avis...</div>
                </div>
              ) : error ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#ff4444' }}>
                  {error}
                  <button 
                    onClick={fetchReviews}
                    className="saveButton"
                    style={{ display: 'block', margin: '10px auto' }}
                  >
                    Réessayer
                  </button>
                </div>
              ) : (
                <ReviewsTable reviews={reviews} />
              )}
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="center" style={{ margin: 0 }}>Mes avis</h2>
                <Link 
                  href="/dashboard/reviews/add" 
                  className="saveButton"
                  style={{
                    background: '#44aa44',
                    color: 'white',
                    border: 'none',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  + Nouvel avis
                </Link>
              </div>
              <p className="small">
                Partagez votre opinion sur les livres que vous avez lus
              </p>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div>Chargement de vos avis...</div>
                </div>
              ) : error ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#ff4444' }}>
                  {error}
                  <button 
                    onClick={fetchReviews}
                    className="saveButton"
                    style={{ display: 'block', margin: '10px auto' }}
                  >
                    Réessayer
                  </button>
                </div>
              ) : reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p>Vous n'avez pas encore publié d'avis.</p>
                  <p>Commencez par emprunter des livres et partagez votre expérience !</p>
                  <Link 
                    href="/dashboard/reviews/add" 
                    className="saveButton"
                    style={{
                      background: '#4488ff',
                      color: 'white',
                      border: 'none',
                      textDecoration: 'none',
                      display: 'inline-block',
                      marginTop: '15px'
                    }}
                  >
                    Écrire mon premier avis
                  </Link>
                </div>
              ) : (
                <div>
                  {reviews.map(review => (
                    <div 
                      key={review.id} 
                      className="hover-card"
                      style={{ 
                        marginBottom: '20px',
                        padding: '20px',
                        borderRadius: '10px',
                        border: '1px solid #ddd'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
                            {review.book?.title || 'Livre inconnu'}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ marginRight: '10px' }}>Note :</span>
                            {renderStars(review.rating)}
                            <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>
                              {review.rating}/5
                            </span>
                          </div>
                          {review.comment && (
                            <div style={{ marginBottom: '15px' }}>
                              <strong>Mon commentaire :</strong>
                              <p style={{ 
                                margin: '5px 0', 
                                padding: '10px',
                                background: '#f9f9f9',
                                borderRadius: '5px',
                                fontStyle: 'italic',
                                lineHeight: '1.5'
                              }}>
                                "{review.comment}"
                              </p>
                            </div>
                          )}
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            fontSize: '14px',
                            color: '#666'
                          }}>
                            <span>
                              Publié le {utils.formatDate(review.created_at)}
                            </span>
                            <span style={{ 
                              color: getStatusColor(review.is_approved),
                              fontWeight: 'bold'
                            }}>
                              {getStatusText(review.is_approved)}
                            </span>
                          </div>
                        </div>
                        <div style={{ marginLeft: '20px' }}>
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="saveButton"
                            style={{
                              background: '#ff4444',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              fontSize: '12px'
                            }}
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {reviews.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    Total : {reviews.length} avis publié{reviews.length > 1 ? 's' : ''}
                  </p>
                  <p style={{ fontSize: '12px', color: '#888' }}>
                    Les avis sont modérés avant publication publique
                  </p>
                </div>
              )}
            </>
          )}
        </aside>
      </main>
    </ProtectedRoute>
  );
}
