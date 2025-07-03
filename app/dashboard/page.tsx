
"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useConfig } from '../../contexts/ConfigContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import { loanService, notificationService, utils } from '../../lib/api';
import Link from 'next/link';

interface DashboardStats {
  activeLoans: number;
  unreadNotifications: number;
  overdueLoans: number;
  totalReviews: number;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const config = useConfig();
  const [stats, setStats] = useState<DashboardStats>({
    activeLoans: 0,
    unreadNotifications: 0,
    overdueLoans: 0,
    totalReviews: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentLoans, setRecentLoans] = useState<any[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Charger les emprunts
      const loansResponse = await loanService.getMyLoans();
      if (loansResponse.success && loansResponse.data) {
        const loans = loansResponse.data;
        const activeLoans = loans.filter(loan => loan.status === 'active');
        const overdueLoans = activeLoans.filter(loan => utils.isOverdue(loan.due_date));
        
        setStats(prev => ({
          ...prev,
          activeLoans: activeLoans.length,
          overdueLoans: overdueLoans.length
        }));
        
        setRecentLoans(loans.slice(0, 3));
      }
      
      // Charger les notifications
      const notificationsResponse = await notificationService.getMyNotifications();
      if (notificationsResponse.success && notificationsResponse.data) {
        const notifications = notificationsResponse.data;
        const unreadNotifications = notifications.filter(n => !n.is_read);
        
        setStats(prev => ({
          ...prev,
          unreadNotifications: unreadNotifications.length
        }));
        
        setRecentNotifications(notifications.slice(0, 3));
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement des données du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      await logout();
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'librarian': return 'Bibliothécaire';
      case 'student': return 'Étudiant';
      default: return role;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <main className="bookContainer">
        <aside style={{ width: '100%' }}>
          {/* En-tête avec salutation */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '30px',
            padding: '24px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div>
              <h1 className="center" style={{ 
                margin: '0 0 8px 0', 
                fontSize: '28px',
                color: '#1e293b',
                fontWeight: '700'
              }}>
                {getGreeting()}, {user.first_name} !
              </h1>
              <p style={{ margin: 0, color: '#64748b', fontSize: '16px' }}>
                {getRoleText(user.role)} • Connecté à {config.APP_NAME}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link 
                href="/dashboard/profile"
                style={{ 
                  background: '#1e293b', 
                  color: 'white', 
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                Mon profil
              </Link>
              <button
                onClick={handleLogout}
                style={{ 
                  background: '#ef4444', 
                  color: 'white', 
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Déconnexion
              </button>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <Link href="/dashboard/loans" style={{ textDecoration: 'none' }}>
              <div style={{ 
                padding: '24px', 
                textAlign: 'center',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: stats.overdueLoans > 0 ? '2px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(-4px)';
                (e.target as HTMLElement).style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(0)';
                (e.target as HTMLElement).style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
              }}
              >
                <h3 style={{ margin: '0 0 12px 0', color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>
                  📚 Emprunts actifs
                </h3>
                <p style={{ fontSize: '32px', fontWeight: '700', margin: '0', color: '#3b82f6' }}>
                  {stats.activeLoans}
                </p>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '8px 0 0 0' }}>
                  sur {config.MAX_BOOKS_PER_USER} max
                </p>
                {stats.overdueLoans > 0 && (
                  <p style={{ fontSize: '14px', color: '#ef4444', fontWeight: '600', margin: '8px 0 0 0' }}>
                    {stats.overdueLoans} en retard !
                  </p>
                )}
              </div>
            </Link>

            <Link href="/dashboard/notifications" style={{ textDecoration: 'none' }}>
              <div style={{ 
                padding: '24px', 
                textAlign: 'center',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: stats.unreadNotifications > 0 ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(-4px)';
                (e.target as HTMLElement).style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(0)';
                (e.target as HTMLElement).style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
              }}
              >
                <h3 style={{ margin: '0 0 12px 0', color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>
                  🔔 Notifications
                </h3>
                <p style={{ fontSize: '32px', fontWeight: '700', margin: '0', color: '#f59e0b' }}>
                  {stats.unreadNotifications}
                </p>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '8px 0 0 0' }}>
                  non lue(s)
                </p>
              </div>
            </Link>

            <Link href="/dashboard/reviews" style={{ textDecoration: 'none' }}>
              <div style={{ 
                padding: '24px', 
                textAlign: 'center',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(-4px)';
                (e.target as HTMLElement).style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(0)';
                (e.target as HTMLElement).style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
              }}
              >
                <h3 style={{ margin: '0 0 12px 0', color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>
                  ⭐ Mes avis
                </h3>
                <p style={{ fontSize: '32px', fontWeight: '700', margin: '0', color: '#10b981' }}>
                  {stats.totalReviews}
                </p>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '8px 0 0 0' }}>
                  publiés
                </p>
              </div>
            </Link>

            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{ 
                padding: '24px', 
                textAlign: 'center',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(-4px)';
                (e.target as HTMLElement).style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(0)';
                (e.target as HTMLElement).style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
              }}
              >
                <h3 style={{ margin: '0 0 12px 0', color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>
                  📖 Catalogue
                </h3>
                <p style={{ fontSize: '20px', fontWeight: '600', margin: '0', color: '#8b5cf6' }}>
                  Explorer
                </p>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '8px 0 0 0' }}>
                  Découvrir des livres
                </p>
              </div>
            </Link>
          </div>

          {/* Sections d'activité récente */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {/* Emprunts récents */}
            <div style={{ 
              padding: '24px', 
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ 
                margin: '0 0 20px 0',
                color: '#1e293b',
                fontSize: '18px',
                fontWeight: '600'
              }}>📚 Emprunts récents</h3>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    border: '3px solid #e2e8f0',
                    borderTop: '3px solid #1e293b',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 12px'
                  }}></div>
                  <p style={{ color: '#64748b', margin: 0 }}>Chargement...</p>
                </div>
              ) : recentLoans.length === 0 ? (
                <p style={{ color: '#64748b', fontStyle: 'italic', margin: 0 }}>Aucun emprunt récent</p>
              ) : (
                <div>
                  {recentLoans.map(loan => (
                    <div key={loan.id} style={{ 
                      marginBottom: '16px', 
                      paddingBottom: '16px', 
                      borderBottom: '1px solid #e2e8f0' 
                    }}>
                      <strong style={{ color: '#1e293b', fontSize: '14px' }}>
                        {loan.book?.title || 'Livre inconnu'}
                      </strong><br />
                      <small style={{ color: '#64748b', fontSize: '13px' }}>
                        À rendre le {utils.formatDate(loan.due_date)}
                        {utils.isOverdue(loan.due_date) && (
                          <span style={{ color: '#ef4444', fontWeight: '600' }}> (En retard)</span>
                        )}
                      </small>
                    </div>
                  ))}
                  <Link 
                    href="/dashboard/loans"
                    style={{ 
                      fontSize: '14px', 
                      color: '#3b82f6', 
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    Voir tous mes emprunts →
                  </Link>
                </div>
              )}
            </div>

            {/* Notifications récentes */}
            <div style={{ 
              padding: '24px', 
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ 
                margin: '0 0 20px 0',
                color: '#1e293b',
                fontSize: '18px',
                fontWeight: '600'
              }}>🔔 Notifications récentes</h3>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    border: '3px solid #e2e8f0',
                    borderTop: '3px solid #1e293b',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 12px'
                  }}></div>
                  <p style={{ color: '#64748b', margin: 0 }}>Chargement...</p>
                </div>
              ) : recentNotifications.length === 0 ? (
                <p style={{ color: '#64748b', fontStyle: 'italic', margin: 0 }}>Aucune notification récente</p>
              ) : (
                <div>
                  {recentNotifications.map(notification => (
                    <div key={notification.id} style={{ 
                      marginBottom: '16px', 
                      paddingBottom: '16px', 
                      borderBottom: '1px solid #e2e8f0',
                      opacity: notification.is_read ? 0.7 : 1
                    }}>
                      <strong style={{ color: '#1e293b', fontSize: '14px' }}>
                        {notification.title}
                      </strong><br />
                      <small style={{ color: '#64748b', fontSize: '13px' }}>
                        {utils.formatDate(notification.created_at)}
                        {!notification.is_read && (
                          <span style={{ color: '#f59e0b', fontWeight: '600' }}> • Non lu</span>
                        )}
                      </small>
                    </div>
                  ))}
                  <Link 
                    href="/dashboard/notifications"
                    style={{ 
                      fontSize: '14px', 
                      color: '#3b82f6', 
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    Voir toutes les notifications →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Actions rapides */}
          <div style={{ 
            marginTop: '30px',
            padding: '24px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              margin: '0 0 24px 0',
              color: '#1e293b',
              fontSize: '20px',
              fontWeight: '600'
            }}>🚀 Actions rapides</h3>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                href="/"
                style={{ 
                  background: '#8b5cf6', 
                  color: 'white', 
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                🔍 Rechercher un livre
              </Link>
              <Link 
                href="/dashboard/reviews/add"
                style={{ 
                  background: '#10b981', 
                  color: 'white', 
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                ⭐ Écrire un avis
              </Link>
              <Link 
                href="/dashboard/profile"
                style={{ 
                  background: '#3b82f6', 
                  color: 'white', 
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                👤 Modifier mon profil
              </Link>
            </div>
          </div>
        </aside>
      </main>
    </ProtectedRoute>
  );
}

