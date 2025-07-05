'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Bell, 
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { loanService, notificationService, adminService, bookService } from '../../lib/api';
import ProtectedRoute from '../../components/ProtectedRoute';

interface DashboardStats {
  totalBooks: number;
  activeLoans: number;
  unreadNotifications: number;
  overdueLoans: number;
}

interface AdminStats extends DashboardStats {
  totalUsers: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    activeLoans: 0,
    unreadNotifications: 0,
    overdueLoans: 0
  });
  
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalBooks: 0,
    activeLoans: 0,
    unreadNotifications: 0,
    overdueLoans: 0,
    totalUsers: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Vérifier que l'utilisateur est bien authentifié
      const token = localStorage.getItem('token');
      if (token) {
        loadDashboardData();
      } else {
        console.warn('Aucun token d\'authentification trouvé');
        setLoading(false);
      }
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Vérifier à nouveau le token avant les requêtes
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Aucun token trouvé pour charger le dashboard');
        setError('Session expirée. Veuillez vous reconnecter.');
        setLoading(false);
        return;
      }
      
      if (user?.role === 'admin') {
        await loadAdminDashboard();
      } else {
        await loadStudentDashboard();
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement du dashboard:', error);
      
      // Si c'est une erreur 401, rediriger vers la page de connexion
      if (error?.status === 401 || error?.message?.includes('401')) {
        console.error('Token expiré ou invalide, redirection vers la connexion');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
      } else {
        setError('Erreur lors du chargement des données. Veuillez rafraîchir la page.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadStudentDashboard = async () => {
    try {
      console.log('🔍 Chargement des données dashboard étudiant...');
      
      // Initialisation avec des valeurs par défaut
      let activeLoans = 0;
      let overdueLoans = 0;
      let unreadNotifications = 0;

      // 1. Emprunts de l'utilisateur - avec gestion d'erreur robuste
      try {
        console.log('📖 Chargement des emprunts utilisateur...');
        const loansResponse = await loanService.getMyLoans();
        console.log('📖 Réponse emprunts brute:', loansResponse);
        
        if (loansResponse.success && loansResponse.data) {
          const loans = Array.isArray(loansResponse.data) ? loansResponse.data : 
                       (loansResponse.data as any)?.loans ? (loansResponse.data as any).loans : [];
          
          activeLoans = loans.filter((loan: any) => 
            loan.status === 'active' || loan.current_status === 'active'
          ).length;
          
          overdueLoans = loans.filter((loan: any) => 
            loan.status === 'overdue' || loan.current_status === 'overdue' ||
            (loan.status === 'active' && loan.days_overdue > 0)
          ).length;
        }
        console.log('✅ Emprunts traités:', { activeLoans, overdueLoans });
      } catch (error) {
        console.warn('⚠️ Erreur emprunts:', error);
        activeLoans = 0;
        overdueLoans = 0;
      }

      // 3. Notifications non lues - avec fallback
      try {
        console.log('🔔 Chargement des notifications...');
        const notificationsResponse = await notificationService.getMyNotifications({ limit: 50 });
        console.log('🔔 Réponse notifications brute:', notificationsResponse);
        
        if (notificationsResponse.success && notificationsResponse.data) {
          const notifications = notificationsResponse.data.notifications || [];
          unreadNotifications = Array.isArray(notifications) ? 
            notifications.filter((n: any) => !n.is_read).length : 0;
        }
        console.log('✅ Notifications traitées:', unreadNotifications);
      } catch (error) {
        console.warn('⚠️ Erreur notifications:', error);
        unreadNotifications = 0;
      }

      // 4. Mise à jour des stats avec les valeurs collectées
      const finalStats = {
        totalBooks: 0, // Plus nécessaire pour les étudiants
        activeLoans,
        unreadNotifications,
        overdueLoans
      };
      
      console.log('📊 Stats finales étudiant:', finalStats);
      setStats(finalStats);
      
    } catch (error) {
      console.error('❌ Erreur globale lors du chargement des données étudiant:', error);
      
      // Fallback complet avec des valeurs par défaut
      setStats({
        totalBooks: 0,
        activeLoans: 0,
        unreadNotifications: 0,
        overdueLoans: 0
      });
    }
  };

  const loadAdminDashboard = async () => {
    try {
      // Pour le moment, on utilise directement le fallback qui est plus fiable
      console.log('Chargement des données admin via APIs individuelles...');
      
      // Livres
      const booksResponse = await bookService.getBooks({ page: 1, limit: 1000 });
      const totalBooks = booksResponse.data?.total || booksResponse.data?.books?.length || 0;

      // Emprunts
      const loansResponse = await loanService.getAllLoans();
      const allLoans = loansResponse.data?.loans || [];
      const activeLoans = allLoans.filter((loan: any) => loan.status === 'active').length;
      const overdueLoans = allLoans.filter((loan: any) => loan.status === 'overdue').length;

      // Utilisateurs
      const usersResponse = await adminService.getAllUsers();
      const totalUsers = usersResponse.data?.users?.length || 0;

      // Notifications
      const notificationsResponse = await notificationService.getMyNotifications();
      const unreadNotifications = notificationsResponse.data?.notifications?.filter((n: any) => !n.is_read).length || 0;

      console.log('Stats chargées:', { totalBooks, activeLoans, overdueLoans, totalUsers, unreadNotifications });

      setAdminStats({
        totalBooks,
        activeLoans,
        unreadNotifications,
        overdueLoans,
        totalUsers
      });

    } catch (error) {
      console.error('Erreur lors du chargement des données admin:', error);
      // En cas d'erreur, au moins charger quelques données de base
      try {
        console.log('Tentative de chargement minimal...');
        const booksResponse = await bookService.getBooks({ page: 1, limit: 100 });
        const totalBooks = booksResponse.data?.total || booksResponse.data?.books?.length || 0;

        setAdminStats(prev => ({
          ...prev,
          totalBooks
        }));
      } catch (fallbackError) {
        console.error('Erreur fallback:', fallbackError);
      }
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'librarian': return 'Bibliothécaire';
      case 'student': return 'Étudiant';
      default: return role;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du tableau de bord...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Rafraîchir la page
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!user) return null;

  const isAdmin = user?.role === 'admin';
  const currentStats = isAdmin ? adminStats : stats;

  return (
    <ProtectedRoute>
      <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {user.first_name} !
        </h1>
        <p className="text-gray-600 mt-1">
          {getRoleText(user.role)} • Tableau de bord
        </p>
      </div>

      {/* Statistiques */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
        {/* Livres - seulement pour admin */}
        {isAdmin && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Livres</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentStats.totalBooks}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        )}

        {/* Emprunts */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {isAdmin ? 'Emprunts Actifs' : 'Mes Emprunts'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {currentStats.activeLoans}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Notifications</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentStats.unreadNotifications}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Carte spécifique selon le rôle */}
        {isAdmin ? (
          // Utilisateurs pour admin
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {adminStats.totalUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        ) : (
          // Retards pour étudiant
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Retard</p>
                <p className="text-2xl font-bold text-red-600">
                  {currentStats.overdueLoans}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alerte pour les retards (admin uniquement) */}
      {isAdmin && adminStats.overdueLoans > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Attention requise
              </h3>
              <p className="text-sm text-red-700">
                {adminStats.overdueLoans} emprunt(s) en retard nécessitent votre attention.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}
