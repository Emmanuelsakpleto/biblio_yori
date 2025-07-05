"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { reviewService, type Review } from '../../../lib/api';
import Link from 'next/link';
import { Star, Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getReviews();
      if (response.success && Array.isArray(response.data)) {
        // Si admin, afficher tous les avis, sinon seulement ceux de l'utilisateur
        if (user?.role === 'admin') {
          setReviews(response.data);
        } else {
          const userReviews = response.data.filter((review: any) => review.user_id === user?.id);
          setReviews(userReviews);
        }
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
      setReviews([]);
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
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des avis...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const isAdmin = user?.role === 'admin';
  const approvedReviews = reviews.filter(r => r.is_approved);
  const pendingReviews = reviews.filter(r => !r.is_approved);

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isAdmin ? 'Gestion des Avis' : 'Mes Avis'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isAdmin 
                ? 'Modération et gestion des avis de livres' 
                : 'Vos avis sur les livres que vous avez lus'
              }
            </p>
          </div>
          
          {!isAdmin && (
            <Link href="/dashboard/reviews/add">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Ajouter un avis
              </button>
            </Link>
          )}
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Avis</p>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approuvés</p>
                <p className="text-2xl font-bold text-green-600">{approvedReviews.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-orange-600">{pendingReviews.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Liste des avis */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {isAdmin ? 'Tous les avis' : 'Vos avis'}
            </h2>
          </div>

          {reviews.length === 0 ? (
            <div className="p-12 text-center">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isAdmin ? 'Aucun avis pour le moment' : 'Vous n\'avez pas encore d\'avis'}
              </h3>
              <p className="text-gray-600 mb-4">
                {isAdmin 
                  ? 'Les avis des utilisateurs apparaîtront ici'
                  : 'Commencez par lire un livre et partagez votre avis'
                }
              </p>
              {!isAdmin && (
                <Link href="/dashboard/reviews/add">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                    Écrire mon premier avis
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <div key={review.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {review.book?.title || 'Livre inconnu'}
                        </h3>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          review.is_approved 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {review.is_approved ? 'Approuvé' : 'En attente'}
                        </span>
                      </div>
                      
                      {review.comment && (
                        <p className="text-gray-600 mb-2">{review.comment}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Publié le {formatDate(review.created_at)}</span>
                        {isAdmin && (
                          <span>Par {review.user?.first_name} {review.user?.last_name}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {!isAdmin && (
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
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
        setShowDeleteSuccess(true);
        setTimeout(() => setShowDeleteSuccess(false), 3000);
      } else {
        alert(response.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  // Filtrage des reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      // Filtre par statut
      if (filters.status === 'approved' && !review.is_approved) return false;
      if (filters.status === 'pending' && review.is_approved) return false;
      
      // Filtre par note
      if (filters.rating && review.rating !== filters.rating) return false;
      
      // Filtre par recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const bookTitle = review.book?.title?.toLowerCase() || '';
        const comment = review.comment?.toLowerCase() || '';
        if (!bookTitle.includes(searchLower) && !comment.includes(searchLower)) return false;
      }
      
      return true;
    });
  }, [reviews, filters]);

  // Statistiques
  const stats = useMemo(() => {
    const total = reviews.length;
    const approved = reviews.filter(r => r.is_approved).length;
    const pending = total - approved;
    const averageRating = total > 0 
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / total) * 10) / 10 
      : 0;

    return { total, approved, pending, averageRating };
  }, [reviews]);

  const renderStars = (rating: number, size: 'small' | 'medium' | 'large' = 'medium') => {
    const sizes = {
      small: '14px',
      medium: '16px', 
      large: '20px'
    };

    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ 
        color: i < rating ? '#ffd700' : '#ddd',
        fontSize: sizes[size],
        textShadow: i < rating ? '0 0 2px rgba(255, 215, 0, 0.5)' : 'none'
      }}>
        ★
      </span>
    ));
  };

  const getStatusColor = (isApproved: boolean) => {
    return isApproved ? '#10b981' : '#f59e0b';
  };

  const getStatusText = (isApproved: boolean) => {
    return isApproved ? '✅ Approuvé' : '⏳ En attente';
  };

  const handleApprovalChange = (reviewId: number, newStatus: boolean) => {
    setReviews(prev => prev.map(r => 
      r.id === reviewId ? { ...r, is_approved: newStatus } : r
    ));
    setShowApprovalSuccess(true);
    setTimeout(() => setShowApprovalSuccess(false), 3000);
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      rating: null,
      search: ''
    });
  };

  return (
    <ProtectedRoute>
      <main className="bookContainer">
        <aside>
          {/* Messages de succès */}
          {showDeleteSuccess && (
            <div style={{
              background: '#dcfce7',
              border: '1px solid #10b981',
              color: '#065f46',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>✅</span>
              <span>Avis supprimé avec succès</span>
            </div>
          )}

          {showApprovalSuccess && (
            <div style={{
              background: '#dbeafe',
              border: '1px solid #3b82f6',
              color: '#1e40af',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>✅</span>
              <span>Statut d'approbation mis à jour</span>
            </div>
          )}

          {user?.role === 'admin' ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="center" style={{ margin: 0 }}>
                  Modération des avis
                  {filteredReviews.length !== reviews.length && (
                    <span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>
                      {' '}({filteredReviews.length}/{reviews.length})
                    </span>
                  )}
                </h2>
                <button 
                  onClick={fetchReviews}
                  className="saveButton"
                  style={{ background: '#6b7280', fontSize: '14px', padding: '8px 16px' }}
                  disabled={loading}
                >
                  {loading ? '⟳' : '🔄'} Actualiser
                </button>
              </div>

              {/* Statistiques admin */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '15px',
                marginBottom: '25px'
              }}>
                <div style={{
                  background: '#f8fafc',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>
                    {stats.total}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Total</div>
                </div>
                <div style={{
                  background: '#ecfdf5',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #10b981',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                    {stats.approved}
                  </div>
                  <div style={{ fontSize: '12px', color: '#065f46' }}>Approuvés</div>
                </div>
                <div style={{
                  background: '#fffbeb',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #f59e0b',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                    {stats.pending}
                  </div>
                  <div style={{ fontSize: '12px', color: '#92400e' }}>En attente</div>
                </div>
                <div style={{
                  background: '#fef3e4',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #ffd700',
                  textAlign: 'center'
                }}>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold', 
                    color: '#b45309',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}>
                    {renderStars(Math.round(stats.averageRating), 'small')}
                    {stats.averageRating.toFixed(1)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#92400e' }}>Moyenne</div>
                </div>
              </div>

              {/* Filtres admin */}
              <div style={{
                background: '#f8fafc',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                marginBottom: '25px'
              }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500' }}>Statut :</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px'
                      }}
                    >
                      <option value="all">Tous</option>
                      <option value="approved">Approuvés</option>
                      <option value="pending">En attente</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500' }}>Note :</label>
                    <select
                      value={filters.rating || ''}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        rating: e.target.value ? parseInt(e.target.value) : null 
                      }))}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Toutes</option>
                      {[5,4,3,2,1].map(rating => (
                        <option key={rating} value={rating}>
                          {rating} étoile{rating > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <label style={{ fontSize: '14px', fontWeight: '500' }}>Recherche :</label>
                    <input
                      type="text"
                      placeholder="Titre du livre ou commentaire..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        flex: 1,
                        maxWidth: '300px'
                      }}
                    />
                  </div>

                  <button
                    onClick={resetFilters}
                    className="saveButton"
                    style={{
                      background: '#6b7280',
                      padding: '6px 12px',
                      fontSize: '14px'
                    }}
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ fontSize: '18px', marginBottom: '10px' }}>⟳ Chargement des avis...</div>
                  <div style={{ color: '#666', fontSize: '14px' }}>Veuillez patienter</div>
                </div>
              ) : error ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ color: '#ef4444', fontSize: '18px', marginBottom: '15px' }}>
                    ❌ {error}
                  </div>
                  <button 
                    onClick={fetchReviews}
                    className="saveButton"
                    style={{ background: '#ef4444' }}
                  >
                    Réessayer
                  </button>
                </div>
              ) : filteredReviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>📝</div>
                  <h3 style={{ color: '#374151', marginBottom: '10px' }}>
                    {reviews.length === 0 ? 'Aucun avis publié' : 'Aucun avis trouvé'}
                  </h3>
                  <p style={{ color: '#6b7280' }}>
                    {reviews.length === 0 
                      ? 'Les utilisateurs n\'ont pas encore publié d\'avis.'
                      : 'Essayez de modifier vos critères de recherche.'
                    }
                  </p>
                  {reviews.length > 0 && (
                    <button
                      onClick={resetFilters}
                      className="saveButton"
                      style={{ background: '#6b7280', marginTop: '15px' }}
                    >
                      Voir tous les avis
                    </button>
                  )}
                </div>
              ) : (
                <ReviewsTable 
                  reviews={filteredReviews} 
                  onApprovalChange={handleApprovalChange}
                  onDelete={handleDelete}
                />
              )}
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="center" style={{ margin: 0 }}>
                  Mes avis
                  <span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>
                    {' '}({reviews.length})
                  </span>
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={fetchReviews}
                    className="saveButton"
                    style={{ 
                      background: '#6b7280', 
                      fontSize: '14px', 
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                    disabled={loading}
                  >
                    {loading ? '⟳' : '🔄'} Actualiser
                  </button>
                  <Link 
                    href="/dashboard/reviews/add" 
                    className="saveButton"
                    style={{
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    ✍️ Nouvel avis
                  </Link>
                </div>
              </div>

              {/* Statistiques utilisateur */}
              {reviews.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '15px',
                  marginBottom: '25px'
                }}>
                  <div style={{
                    background: '#f0f9ff',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid #0ea5e9',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0ea5e9' }}>
                      {stats.total}
                    </div>
                    <div style={{ fontSize: '12px', color: '#0369a1' }}>Avis publiés</div>
                  </div>
                  <div style={{
                    background: '#ecfdf5',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid #10b981',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                      {stats.approved}
                    </div>
                    <div style={{ fontSize: '12px', color: '#065f46' }}>Approuvés</div>
                  </div>
                  <div style={{
                    background: '#fffbeb',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid #f59e0b',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                      {stats.pending}
                    </div>
                    <div style={{ fontSize: '12px', color: '#92400e' }}>En attente</div>
                  </div>
                  <div style={{
                    background: '#fef3e4',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid #ffd700',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: 'bold', 
                      color: '#b45309',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '3px'
                    }}>
                      {renderStars(Math.round(stats.averageRating), 'small')}
                      <span style={{ marginLeft: '5px' }}>{stats.averageRating.toFixed(1)}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#92400e' }}>Ma moyenne</div>
                  </div>
                </div>
              )}

              {/* Filtres utilisateur */}
              {reviews.length > 0 && (
                <div style={{
                  background: '#f8fafc',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500' }}>Statut :</label>
                      <select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          fontSize: '14px'
                        }}
                      >
                        <option value="all">Tous</option>
                        <option value="approved">Approuvés</option>
                        <option value="pending">En attente</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500' }}>Note :</label>
                      <select
                        value={filters.rating || ''}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          rating: e.target.value ? parseInt(e.target.value) : null 
                        }))}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          fontSize: '14px'
                        }}
                      >
                        <option value="">Toutes</option>
                        {[5,4,3,2,1].map(rating => (
                          <option key={rating} value={rating}>
                            {rating} étoile{rating > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                      <label style={{ fontSize: '14px', fontWeight: '500' }}>Recherche :</label>
                      <input
                        type="text"
                        placeholder="Titre du livre ou commentaire..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          fontSize: '14px',
                          flex: 1,
                          maxWidth: '300px'
                        }}
                      />
                    </div>

                    {(filters.status !== 'all' || filters.rating || filters.search) && (
                      <button
                        onClick={resetFilters}
                        className="saveButton"
                        style={{
                          background: '#6b7280',
                          padding: '6px 12px',
                          fontSize: '14px'
                        }}
                      >
                        Réinitialiser
                      </button>
                    )}
                  </div>
                </div>
              )}

              <p className="small" style={{ 
                color: '#6b7280', 
                fontSize: '14px', 
                lineHeight: '1.5',
                marginBottom: '20px',
                padding: '12px',
                background: '#f8fafc',
                borderRadius: '6px',
                border: '1px solid #e2e8f0'
              }}>
                💡 <strong>Partagez votre opinion</strong> sur les livres que vous avez lus. 
                Vos avis aident d'autres lecteurs et sont modérés avant publication publique.
              </p>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>⟳</div>
                  <div style={{ fontSize: '18px', marginBottom: '10px' }}>Chargement de vos avis...</div>
                  <div style={{ color: '#666', fontSize: '14px' }}>Veuillez patienter</div>
                </div>
              ) : error ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>❌</div>
                  <div style={{ color: '#ef4444', fontSize: '18px', marginBottom: '15px' }}>
                    {error}
                  </div>
                  <button 
                    onClick={fetchReviews}
                    className="saveButton"
                    style={{ background: '#ef4444' }}
                  >
                    Réessayer
                  </button>
                </div>
              ) : filteredReviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>
                    {reviews.length === 0 ? '📝' : '🔍'}
                  </div>
                  <h3 style={{ color: '#374151', marginBottom: '15px' }}>
                    {reviews.length === 0 ? 'Aucun avis publié' : 'Aucun avis trouvé'}
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '20px', lineHeight: '1.5' }}>
                    {reviews.length === 0 
                      ? 'Commencez par emprunter des livres et partagez votre expérience !'
                      : 'Aucun avis ne correspond à vos critères de recherche.'
                    }
                  </p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    {reviews.length === 0 ? (
                      <Link 
                        href="/dashboard/reviews/add" 
                        className="saveButton"
                        style={{
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        ✍️ Écrire mon premier avis
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={resetFilters}
                          className="saveButton"
                          style={{ background: '#6b7280' }}
                        >
                          Voir tous mes avis
                        </button>
                        <Link 
                          href="/dashboard/reviews/add" 
                          className="saveButton"
                          style={{
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          ✍️ Nouvel avis
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  {filteredReviews.map(review => (
                    <div 
                      key={review.id} 
                      className="hover-card"
                      style={{ 
                        marginBottom: '20px',
                        padding: '25px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        background: 'white',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                    >
                      {/* Badge de statut */}
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: review.is_approved 
                          ? '#ecfdf5' 
                          : '#fffbeb',
                        color: review.is_approved 
                          ? '#065f46' 
                          : '#92400e',
                        border: `1px solid ${review.is_approved ? '#10b981' : '#f59e0b'}`
                      }}>
                        {getStatusText(review.is_approved)}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, paddingRight: '15px' }}>
                          <h3 style={{ 
                            margin: '0 0 15px 0', 
                            fontWeight: 'bold',
                            fontSize: '18px',
                            color: '#1e293b'
                          }}>
                            📚 {review.book?.title || 'Livre inconnu'}
                          </h3>
                          
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            marginBottom: '15px',
                            padding: '10px',
                            background: '#fef3e4',
                            borderRadius: '8px',
                            border: '1px solid #ffd700'
                          }}>
                            <span style={{ marginRight: '10px', fontWeight: '500' }}>Ma note :</span>
                            {renderStars(review.rating, 'large')}
                            <span style={{ 
                              marginLeft: '12px', 
                              fontWeight: 'bold',
                              fontSize: '18px',
                              color: '#b45309'
                            }}>
                              {review.rating}/5
                            </span>
                          </div>
                          
                          {review.comment && (
                            <div style={{ marginBottom: '20px' }}>
                              <strong style={{ color: '#374151' }}>Mon commentaire :</strong>
                              <div style={{ 
                                margin: '8px 0', 
                                padding: '15px',
                                background: '#f8fafc',
                                borderRadius: '8px',
                                fontStyle: 'italic',
                                lineHeight: '1.6',
                                border: '1px solid #e2e8f0',
                                position: 'relative'
                              }}>
                                <div style={{
                                  position: 'absolute',
                                  top: '-8px',
                                  left: '15px',
                                  background: '#f8fafc',
                                  padding: '0 8px',
                                  fontSize: '20px'
                                }}>
                                  💭
                                </div>
                                "{review.comment}"
                              </div>
                            </div>
                          )}
                          
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            fontSize: '14px',
                            color: '#64748b',
                            paddingTop: '15px',
                            borderTop: '1px solid #e2e8f0'
                          }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              📅 Publié le {utils.formatDate(review.created_at)}
                            </span>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="saveButton"
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {filteredReviews.length > 0 && (
                <div style={{ 
                  textAlign: 'center', 
                  marginTop: '30px', 
                  paddingTop: '20px', 
                  borderTop: '2px solid #e2e8f0',
                  background: '#f8fafc',
                  padding: '20px',
                  borderRadius: '8px'
                }}>
                  <p style={{ fontSize: '16px', color: '#374151', marginBottom: '5px', fontWeight: '500' }}>
                    📊 Récapitulatif de vos avis
                  </p>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '10px' }}>
                    {filteredReviews.length === reviews.length 
                      ? `Total : ${reviews.length} avis publié${reviews.length > 1 ? 's' : ''}`
                      : `Affichage : ${filteredReviews.length}/${reviews.length} avis`
                    }
                  </p>
                  <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                    💡 Les avis sont modérés avant publication publique pour maintenir la qualité de notre communauté
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
