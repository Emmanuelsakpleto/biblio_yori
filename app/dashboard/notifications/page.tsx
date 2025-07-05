"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useConfig } from '../../../contexts/ConfigContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { notificationService, utils, type Notification, type PaginatedNotificationsResponse } from '../../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, Clock, AlertTriangle, BookOpen, Calendar, FileText, Users, RefreshCcw, Settings } from 'lucide-react';

export default function NotificationsPage() {
  const { user } = useAuth();
  const config = useConfig();
  // Update state type to handle paginated response
  const [notificationsData, setNotificationsData] = useState<PaginatedNotificationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    // Pass reset = true to clear previous notifications when filter changes
    fetchNotifications(1, true);
    // eslint-disable-next-line
  }, [filter]);

  const fetchNotifications = async (pageToFetch = 1, reset = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationService.getMyNotifications({
        limit: PAGE_SIZE,
        offset: (pageToFetch - 1) * PAGE_SIZE,
        unread_only: filter === 'unread',
        type: '',
        priority: ''
      });
      if (response.success && response.data) {
        const data = response.data;
        if (reset) {
          setNotificationsData(data);
        } else {
          // Append new notifications to the existing list
          setNotificationsData(prev => ({
            ...(prev as PaginatedNotificationsResponse),
            notifications: [...(prev?.notifications || []), ...data.notifications],
            total: data.total,
            hasMore: data.hasMore,
          }));
        }
        setHasMore(data.hasMore);
      } else {
        if (reset) setNotificationsData(null);
        setHasMore(false);
        setError(response.message || 'Erreur lors du chargement des notifications');
      }
    } catch (err: any) {
      setError('Erreur lors du chargement des notifications: ' + err.message);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const response = await notificationService.markAsRead(notificationId);
      if (response.success) {
        // Update the specific notification in the state
        setNotificationsData(prev => {
          if (!prev) return null;
          const updatedNotifications = prev.notifications.map(n => n.id === notificationId ? { ...n, is_read: true } : n);
          return {
            ...prev,
            notifications: updatedNotifications
          };
        });
      }
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await notificationService.markAllAsRead();
      if (response.success) {
        // Mark all currently loaded notifications as read
        setNotificationsData(prev => {
          if (!prev) return null;
          const updatedNotifications = prev.notifications.map(n => ({ ...n, is_read: true }));
          return {
            ...prev,
            notifications: updatedNotifications
          };
        });
        // If the filter is 'unread', refetch to show no notifications
        if (filter === 'unread') {
            fetchNotifications(1, true);
        }
      }
    } catch (error) {
      console.error('Erreur lors du marquage global:', error);
    }
  };

  // Suppression désactivée : la suppression de notification n'est plus disponible côté backend.

  const getNotificationTypeText = (type: string) => {
    switch (type) {
      case 'loan_reminder': return '📚 Rappel d\'emprunt';
      case 'overdue_notice': return '⚠️ Retard';
      case 'reservation_ready': return '✅ Réservation prête';
      case 'book_returned': return '↩️ Livre retourné';
      case 'account_created': return '🎉 Compte créé';
      case 'password_reset': return '🔐 Mot de passe réinitialisé';
      case 'reservation_cancelled': return '❌ Réservation annulée';
      case 'reservation_refused': return '🚫 Réservation refusée';
      case 'admin_reminder': return '🔔 Rappel administrateur';
      case 'loan_validated': return '✅ Emprunt validé';
      case 'loan_created': return '📖 Emprunt créé';
      case 'loan_overdue': return '⚠️ Emprunt en retard';
      case 'loan_renewed': return '🔄 Emprunt prolongé';
      case 'book_available': return '📚 Livre disponible';
      case 'new_book': return '✨ Nouveau livre';
      case 'book_reservation': return '📥 Réservation';
      case 'book_deleted': return '🗑️ Livre supprimé';
      case 'book_reservation_admin': return '📥 Réservation (Admin)';
      case 'book_deleted_admin': return '🗑️ Livre supprimé (Admin)';
      case 'new_book_admin': return '✨ Nouveau livre (Admin)';
      case 'book_admin_update': return '🔄 Livre (Admin)';
      case 'loan_requested': return '📥 Demande emprunt';
      case 'loan_validated_admin': return '✅ Emprunt validé (Admin)';
      case 'loan_refused': return '🚫 Emprunt refusé';
      case 'loan_refused_admin': return '🚫 Emprunt refusé (Admin)';
      case 'loan_returned_admin': return '↩️ Livre retourné (Admin)';
      case 'loan_renewal_requested': return '🔄 Demande renouvellement';
      case 'loan_renewed_admin': return '🔄 Emprunt prolongé (Admin)';
      case 'loan_overdue_admin': return '⚠️ Emprunt en retard (Admin)';
      case 'loan_admin_update': return '🔄 Emprunt (Admin)';
      case 'welcome': return '👋 Bienvenue';
      case 'password_changed': return '🔐 Mot de passe';
      case 'email_verified': return '📧 Email vérifié';
      case 'profile_updated': return '👤 Profil mis à jour';
      case 'maintenance': return '🛠️ Maintenance';
      case 'custom': return '💬 Message';
      default: return '📢 Notification';
    }
  };

  const getNotificationColor = (type: string, isRead: boolean) => {
    if (isRead) return '#f5f5f5';
    switch (type) {
      case 'overdue_notice':
      case 'loan_overdue':
      case 'loan_overdue_admin':
        return '#ffebee'; // Reddish
      case 'loan_reminder':
      case 'admin_reminder':
        return '#fff3e0'; // Orangish
      case 'reservation_ready':
      case 'loan_validated':
      case 'loan_created':
      case 'loan_validated_admin':
        return '#e8f5e8'; // Greenish
      case 'book_returned':
      case 'loan_renewed':
      case 'book_returned_admin':
      case 'loan_renewed_admin':
        return '#e3f2fd'; // Bluish
      case 'reservation_cancelled':
      case 'reservation_refused':
      case 'loan_refused':
      case 'loan_refused_admin':
      case 'book_deleted':
      case 'book_deleted_admin':
        return '#ffe0e0'; // Light Reddish
      case 'account_created':
      case 'password_reset':
      case 'email_verified':
      case 'profile_updated':
      case 'welcome':
        return '#ede7f6'; // Purplish
      case 'new_book':
      case 'new_book_admin':
        return '#e0f2f7'; // Cyanish
      case 'book_reservation':
      case 'book_reservation_admin':
      case 'loan_requested':
        return '#fff9c4'; // Yellowish
      default:
        return '#f8eadd'; // Default light orange/brown
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'loan_reminder': return <Clock className="w-5 h-5 text-orange-500" />;
      case 'overdue_notice':
      case 'loan_overdue':
      case 'loan_overdue_admin': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'reservation_ready':
      case 'loan_validated':
      case 'loan_created':
      case 'loan_validated_admin': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'book_returned':
      case 'loan_renewed':
      case 'book_returned_admin':
      case 'loan_renewed_admin': return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'account_created':
      case 'password_reset':
      case 'email_verified':
      case 'profile_updated':
      case 'welcome': return <Users className="w-5 h-5 text-purple-500" />;
      case 'reservation_cancelled':
      case 'reservation_refused':
      case 'loan_refused':
      case 'loan_refused_admin':
      case 'book_deleted':
      case 'book_deleted_admin': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'admin_reminder': return <Bell className="w-5 h-5 text-yellow-500" />;
      case 'new_book':
      case 'new_book_admin': return <BookOpen className="w-5 h-5 text-cyan-500" />;
      case 'book_reservation':
      case 'book_reservation_admin':
      case 'loan_requested': return <Calendar className="w-5 h-5 text-yellow-700" />;
      case 'maintenance': return <Settings className="w-5 h-5 text-gray-700" />;
      case 'custom': return <Bell className="w-5 h-5 text-indigo-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // Access notifications list from notificationsData
  const notificationList = notificationsData?.notifications || [];

  // Calculate unread count from the current list
  const unreadCount = notificationList.filter(n => !n.is_read).length;

  // Filter the list based on the selected filter
  const filteredNotifications = notificationList.filter(n => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'read') return n.is_read;
    return true;
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-main)] via-[var(--color-bg-alt)] to-[var(--color-bg-main)] py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-white shadow-lg rounded-lg p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800">Notifications</CardTitle>
              {/* Display unread count badge */}
              {unreadCount > 0 && (
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-red-500 text-white text-xs font-bold shadow-md">
                  {unreadCount}
                </span>
              )}
            </CardHeader>

            <CardContent className="p-0">
              {/* Filtres d'affichage */}
              <div className="flex gap-3 mb-6 justify-center">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                >
                  Toutes
                </Button>
                <Button
                  variant={filter === 'unread' ? 'default' : 'outline'}
                  onClick={() => setFilter('unread')}
                >
                  Non lues ({unreadCount})
                </Button>
                <Button
                  variant={filter === 'read' ? 'default' : 'outline'}
                  onClick={() => setFilter('read')}
                >
                  Lues
                </Button>
              </div>

              {/* Mark all as read button */}
              {notificationList.length > 0 && unreadCount > 0 && filter !== 'read' && (
                <div className="text-center mb-6">
                  <Button onClick={handleMarkAllAsRead} variant="outline">
                    Tout marquer comme lu
                  </Button>
                </div>
              )}

              {/* Loading, Error, Empty, or Notifications List */}
              {loading && notificationList.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCcw className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="ml-3 text-gray-600">Chargement des notifications...</span>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <p>{error}</p>
                  <Button onClick={() => fetchNotifications(1, true)} className="mt-4" variant="outline">
                    Réessayer
                  </Button>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-lg font-semibold">Aucune notification pour le moment.</p>
                  <p className="text-sm">Vous serez notifié des événements importants.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map(notification => (
                    <Card 
                      key={notification.id} 
                      className={`cursor-pointer transition-all duration-200 ${notification.is_read ? 'bg-gray-100 border-gray-200' : 'bg-white border-blue-500 shadow-md'}`}
                      onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                    >
                      <CardContent className="p-4 flex items-start space-x-4">
                        <div className={`p-3 rounded-full ${notification.is_read ? 'bg-gray-200' : 'bg-blue-100'}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-base font-semibold ${notification.is_read ? 'text-gray-700 font-normal' : 'text-gray-900'}`}>
                              {notification.title}
                            </h4>
                            {!notification.is_read && (
                              <span className="text-xs font-medium text-white bg-red-500 px-2 py-0.5 rounded-full">
                                Nouveau
                              </span>
                            )}
                          </div>
                          
                          <p className={`text-sm mb-2 ${notification.is_read ? 'text-gray-600' : 'text-gray-800'}`}>
                            {notification.message}
                          </p>
                          
                          <div className="text-xs text-gray-500">
                            {utils.formatDate(notification.created_at)}
                            {notification.scheduled_for && (
                              <span className="ml-3">
                                • Programmé pour : {utils.formatDate(notification.scheduled_for)}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {/* Load More Button */}
                  {hasMore && !loading && (
                    <div className="text-center mt-6">
                      <Button onClick={handleLoadMore} variant="outline">
                        Charger plus
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
