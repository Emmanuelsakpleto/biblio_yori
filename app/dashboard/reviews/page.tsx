'use client';

import { useEffect, useState } from 'react';
import { 
  Star, 
  BookOpen, 
  Plus, 
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Calendar,
  User,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { reviewService, type Review } from '../../../lib/api';
import Link from 'next/link';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { motion } from 'framer-motion';

export default function ReviewsPage() {
  const { user } = useAuth();
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  const isAdmin = user?.role === 'admin' || user?.role === 'librarian';

  useEffect(() => {
    if (isAdmin) {
      fetchAllReviews();
    } else {
      fetchMyReviews();
    }
  }, [isAdmin]);

  useEffect(() => {
    filterReviews();
  }, [allReviews, searchTerm, statusFilter, ratingFilter]);

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getReviews();
      if (response.success && response.data) {
        setAllReviews(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getReviews();
      if (response.success && response.data) {
        // Filtrer pour ne montrer que les avis de l'utilisateur connecté
        const myReviews = response.data.filter((review: any) => review.user_id === user?.id);
        setAllReviews(myReviews);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = [...allReviews];

    // Filtre par texte de recherche
    if (searchTerm) {
      filtered = filtered.filter(review => 
        review.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(review => 
        statusFilter === 'approved' ? review.is_approved : !review.is_approved
      );
    }

    // Filtre par note
    if (ratingFilter !== 'all') {
      filtered = filtered.filter(review => review.rating === ratingFilter);
    }

    setFilteredReviews(filtered);
  };

  const handleApproveReview = async (reviewId: number) => {
    try {
      await reviewService.approveReview(reviewId);
      // Rafraîchir les données
      if (isAdmin) {
        fetchAllReviews();
      } else {
        fetchMyReviews();
      }
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
    }
  };

  const handleRejectReview = async (reviewId: number) => {
    try {
      await reviewService.rejectReview(reviewId);
      // Rafraîchir les données
      if (isAdmin) {
        fetchAllReviews();
      } else {
        fetchMyReviews();
      }
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getStatsData = () => {
    const total = allReviews.length;
    const approved = allReviews.filter(r => r.is_approved).length;
    const pending = allReviews.filter(r => !r.is_approved).length;
    const avgRating = allReviews.length > 0 
      ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
      : '0';

    return { total, approved, pending, avgRating };
  };

  const stats = getStatsData();

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

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* En-tête */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-start"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isAdmin ? 'Gestion des Avis' : 'Mes Avis'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isAdmin 
                ? 'Modérez et gérez tous les avis des utilisateurs'
                : 'Gérez vos évaluations et commentaires sur les livres'
              }
            </p>
          </div>
          {!isAdmin && (
            <Link 
              href="/dashboard/reviews/add"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouvel avis
            </Link>
          )}
        </motion.div>

        {/* Statistiques améliorées */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total avis</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Approuvés</p>
                <p className="text-3xl font-bold">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">En attente</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Note moyenne</p>
                <p className="text-3xl font-bold">{stats.avgRating}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filtres et recherche pour admin */}
        {isAdmin && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher un avis, livre ou utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filtre par statut */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="approved">Approuvés</option>
                <option value="pending">En attente</option>
              </select>

              {/* Filtre par note */}
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toutes les notes</option>
                <option value="5">5 étoiles</option>
                <option value="4">4 étoiles</option>
                <option value="3">3 étoiles</option>
                <option value="2">2 étoiles</option>
                <option value="1">1 étoile</option>
              </select>

              {/* Bouton reset */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setRatingFilter('all');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Réinitialiser
              </button>
            </div>
          </motion.div>
        )}

        {/* Liste des avis améliorée */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' || ratingFilter !== 'all'
                  ? 'Aucun avis trouvé'
                  : 'Aucun avis pour le moment'
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' || ratingFilter !== 'all'
                  ? 'Essayez de modifier vos filtres de recherche'
                  : isAdmin 
                    ? 'Les avis des utilisateurs apparaîtront ici'
                    : 'Commencez par évaluer un livre que vous avez lu !'
                }
              </p>
              {!isAdmin && !searchTerm && statusFilter === 'all' && ratingFilter === 'all' && (
                <Link 
                  href="/dashboard/reviews/add"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Écrire mon premier avis
                </Link>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredReviews.map((review, index) => (
                  <motion.div 
                    key={review.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold text-gray-900">
                              {review.book?.title || `Livre #${review.book_id}`}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                            <span className="ml-1 text-sm text-gray-600">({review.rating}/5)</span>
                          </div>
                        </div>

                        {isAdmin && (
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Par {review.user?.first_name || 'Utilisateur'} {review.user?.last_name || ''}
                            </span>
                          </div>
                        )}
                        
                        {review.comment && (
                          <div className="bg-gray-50 rounded-lg p-4 mb-3">
                            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(review.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {review.is_approved ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-green-600 font-medium">Approuvé</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-4 h-4 text-orange-500" />
                                <span className="text-orange-600 font-medium">En attente</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions admin */}
                      {isAdmin && (
                        <div className="flex items-center gap-2 ml-4">
                          {!review.is_approved && (
                            <button
                              onClick={() => handleApproveReview(review.id)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                              title="Approuver"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleRejectReview(review.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Rejeter"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/book/${review.book_id}`}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Voir le livre"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
