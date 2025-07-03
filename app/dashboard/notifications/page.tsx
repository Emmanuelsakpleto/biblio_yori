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

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationService.getMyNotifications();
      if (response.success && response.data) {
        setNotifications(response.data);
      } else {
        setError(response.message || 'Erreur lors du chargement des notifications');
      }
    } catch (err) {
      setError('Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
    }
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

  const handleDelete = async (notificationId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
      return;
    }
    
    try {
      const response = await notificationService.deleteNotification(notificationId);
      if (response.success) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const getNotificationTypeText = (type: string) => {
    switch (type) {
      case 'loan_reminder': return '📚 Rappel d\'emprunt';
      case 'overdue_notice': return '⚠️ Retard';
      case 'reservation_ready': return '✅ Réservation prête';
      case 'book_returned': return '↩️ Livre retourné';
      case 'account_created': return '🎉 Compte créé';
      case 'password_reset': return '🔐 Mot de passe réinitialisé';
      default: return '📢 Notification';
    }
  };

  const getNotificationColor = (type: string, isRead: boolean) => {
    if (isRead) return '#f5f5f5';
    
    switch (type) {
      case 'overdue_notice': return '#ffebee';
      case 'loan_reminder': return '#fff3e0';
      case 'reservation_ready': return '#e8f5e8';
      case 'book_returned': return '#e3f2fd';
      default: return '#f8eadd';
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <ProtectedRoute>
      <main className="bookContainer">
        <aside>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="center" style={{ margin: 0 }}>Mes notifications</h2>
            {unreadCount > 0 && (
              <span style={{
                background: '#ff4444',
                color: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {unreadCount}
              </span>
            )}
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
              <p>Vous serez notifié des événements importants concernant vos emprunts.</p>
            </div>
          ) : (
            <div>
              {notifications.map(notification => (
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
                      
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="saveButton"
                        style={{
                          background: '#ff4444',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          fontSize: '10px'
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
        </aside>
      </main>
    </ProtectedRoute>
  );
}
