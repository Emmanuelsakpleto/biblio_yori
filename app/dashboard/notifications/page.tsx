"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useConfig } from '../../../contexts/ConfigContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { notificationService, utils, type Notification } from '../../../lib/api';

export default function NotificationsPage() {
  const { user } = useAuth();
  const config = useConfig();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchNotifications(1, true);
    // eslint-disable-next-line
  }, [filter]);

  const fetchNotifications = async (pageToFetch = 1, reset = false) => {
    try {
      setLoading(true);
      setError(null);
      // Ajout des options de filtrage côté backend si besoin
      const response = await notificationService.getMyNotifications({
        limit: PAGE_SIZE,
        offset: (pageToFetch - 1) * PAGE_SIZE,
        unread_only: filter === 'unread',
        type: '',
        priority: ''
      });
      if (response.success && response.data) {
        const data = response.data as Notification[];
        if (reset) setNotifications(data);
        else setNotifications(prev => [...prev, ...data]);
        setHasMore((data.length || 0) === PAGE_SIZE);
      } else {
        if (reset) setNotifications([]);
        setHasMore(false);
        setError(response.message || 'Erreur lors du chargement des notifications');
      }
    } catch (err) {
      setError('Erreur lors du chargement des notifications');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const response = await notificationService.markAsRead(notificationId);
      if (response.success) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
        );
      }
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await notificationService.markAllAsRead();
      if (response.success) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
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
      default: return '📢 Notification';
    }
  };

  const getNotificationColor = (type: string, isRead: boolean) => {
    if (isRead) return '#f5f5f5';
    switch (type) {
      case 'overdue_notice':
      case 'loan_overdue':
        return '#ffebee';
      case 'loan_reminder':
      case 'admin_reminder':
        return '#fff3e0';
      case 'reservation_ready':
      case 'loan_validated':
      case 'loan_created':
        return '#e8f5e8';
      case 'book_returned':
      case 'loan_renewed':
        return '#e3f2fd';
      case 'reservation_cancelled':
      case 'reservation_refused':
        return '#ffe0e0';
      default:
        return '#f8eadd';
    }
  };

  // Correction robustesse : notifications peut être un objet (backend paginé)
  const notificationList = Array.isArray(notifications)
    ? notifications
    : (notifications && Array.isArray(notifications.notifications))
      ? notifications.notifications
      : [];

  const unreadCount = notificationList.filter(n => !n.is_read).length;

  const filteredNotifications = notificationList.filter(n => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'read') return n.is_read;
    return true;
  });

  return (
    <ProtectedRoute>
      <main className="bookContainer" style={{ maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #0001', padding: 32 }}>
        <aside>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="center" style={{ margin: 0, fontWeight: 700, fontSize: 28, letterSpacing: 1 }}>Notifications administrateur</h2>
            {unreadCount > 0 && (
              <span style={{
                background: 'linear-gradient(90deg,#ff4444,#ff8800)',
                color: 'white',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px #ff444444'
              }}>
                {unreadCount}
              </span>
            )}
          </div>

          {/* Filtres d'affichage */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', justifyContent: 'center' }}>
            <button
              className={filter === 'all' ? 'saveButton' : ''}
              style={{ background: filter === 'all' ? '#4488ff' : '#eee', color: filter === 'all' ? 'white' : '#333', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: 600, fontSize: 15 }}
              onClick={() => setFilter('all')}
            >
              Toutes
            </button>
            <button
              className={filter === 'unread' ? 'saveButton' : ''}
              style={{ background: filter === 'unread' ? '#44aa44' : '#eee', color: filter === 'unread' ? 'white' : '#333', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: 600, fontSize: 15 }}
              onClick={() => setFilter('unread')}
            >
              Non lues
            </button>
            <button
              className={filter === 'read' ? 'saveButton' : ''}
              style={{ background: filter === 'read' ? '#aaa' : '#eee', color: filter === 'read' ? 'white' : '#333', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: 600, fontSize: 15 }}
              onClick={() => setFilter('read')}
            >
              Lues
            </button>
          </div>
          
          <p className="small">
            {unreadCount > 0 
              ? `Vous avez ${unreadCount} notification(s) non lue(s)`
              : 'Toutes vos notifications sont à jour'
            }
          </p>
          
          {notifications.length > 0 && unreadCount > 0 && (
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <button
                onClick={handleMarkAllAsRead}
                className="saveButton"
                style={{
                  background: '#4488ff',
                  color: 'white',
                  border: 'none'
                }}
              >
                Tout marquer comme lu
              </button>
            </div>
          )}
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div>Chargement des notifications...</div>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#ff4444' }}>
              {error}
              <button 
                onClick={fetchNotifications}
                className="saveButton"
                style={{ display: 'block', margin: '10px auto' }}
              >
                Réessayer
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p>Aucune notification pour le moment.</p>
              <p>Vous serez notifié des événements.</p>
            </div>
          ) : (
            <div>
              {filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  style={{ 
                    marginBottom: '15px',
                    padding: '15px',
                    borderRadius: '10px',
                    background: getNotificationColor(notification.type, notification.is_read),
                    border: notification.is_read ? '1px solid #ddd' : '2px solid #4488ff',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <span style={{ marginRight: '8px' }}>
                          {getNotificationTypeText(notification.type)}
                        </span>
                        {!notification.is_read && (
                          <span style={{
                            background: '#ff4444',
                            color: 'white',
                            fontSize: '10px',
                            padding: '2px 6px',
                            borderRadius: '10px'
                          }}>
                            NOUVEAU
                          </span>
                        )}
                      </div>
                      
                      <h4 style={{ 
                        margin: '0 0 8px 0', 
                        fontWeight: notification.is_read ? 'normal' : 'bold' 
                      }}>
                        {notification.title}
                      </h4>
                      
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        lineHeight: '1.5',
                        opacity: notification.is_read ? 0.8 : 1 
                      }}>
                        {notification.message}
                      </p>
                      
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {utils.formatDate(notification.created_at)}
                        {notification.scheduled_for && (
                          <span style={{ marginLeft: '10px' }}>
                            • Programmé pour : {utils.formatDate(notification.scheduled_for)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginLeft: '10px' }}>
                      {!notification.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="saveButton"
                          style={{
                            background: '#44aa44',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            fontSize: '10px'
                          }}
                        >
                          Marquer comme lu
                        </button>
                      )}
                      
                      {/* Suppression désactivée : bouton supprimé */}
                    </div>
                  </div>
                </div>
              ))}
              {hasMore && !loading && (
                <div style={{ textAlign: 'center', margin: '24px 0' }}>
                  <button
                    onClick={handleLoadMore}
                    className="saveButton"
                    style={{ background: '#4488ff', color: 'white', border: 'none', padding: '10px 32px', borderRadius: 8, fontWeight: 600, fontSize: 16 }}
                  >
                    Charger plus
                  </button>
                </div>
              )}
            </div>
          )}
        </aside>
      </main>
    </ProtectedRoute>
  );
}
