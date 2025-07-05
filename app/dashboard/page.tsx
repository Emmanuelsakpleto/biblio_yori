'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Bell, 
  TrendingUp,
  AlertTriangle,
  Settings,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  Plus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useConfig } from '../../contexts/ConfigContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import { loanService, notificationService, adminService, utils } from '../../lib/api';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DashboardStats {
  activeLoans: number;
  unreadNotifications: number;
  overdueLoans: number;
  totalReviews: number;
}

interface AdminStats {
  totalUsers: number;
  totalBooks: number;
  activeLoans: number;
  overdueLoans: number;
  pendingReturns: number;
  newUsersThisWeek: number;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const config = useConfig();
  
  // États pour les étudiants
  const [stats, setStats] = useState<DashboardStats>({
    activeLoans: 0,
    unreadNotifications: 0,
    overdueLoans: 0,
    totalReviews: 0
  });
  const [recentLoans, setRecentLoans] = useState<any[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);

  // États pour les administrateurs
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 0,
    totalBooks: 0,
    activeLoans: 0,
    overdueLoans: 0,
    pendingReturns: 0,
    newUsersThisWeek: 0
  });

  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'admin' || user?.role === 'librarian';

  useEffect(() => {
    // Attendre que l'AuthContext soit complètement chargé
    if (!loading && user) {
      // Test API au démarrage
      testApiConnection();
      loadDashboardData();
    }
  }, [isAdmin, loading, user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Debug: Vérifier l'authentification
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      console.log('Token présent:', !!token);
      console.log('User présent:', !!storedUser);
      console.log('User role:', user?.role);
      console.log('Is admin:', isAdmin);
      
      if (isAdmin) {
        // Statistiques administrateur depuis l'API
        try {
          console.log('Tentative de chargement des stats admin...');
          const dashboardResponse = await adminService.getDashboard();
          if (dashboardResponse.success && dashboardResponse.data) {
            console.log('Stats admin chargées:', dashboardResponse.data);
            setAdminStats({
              totalUsers: dashboardResponse.data.totalUsers,
              totalBooks: dashboardResponse.data.totalBooks,
              activeLoans: dashboardResponse.data.activeLoans,
              overdueLoans: dashboardResponse.data.overdueLoans,
              pendingReturns: dashboardResponse.data.pendingReturns,
              newUsersThisWeek: dashboardResponse.data.newUsersThisWeek
            });
          }
        } catch (error) {
          console.error('Erreur lors du chargement des statistiques admin:', error);
          // Fallback avec des données simulées
          setAdminStats({
            totalUsers: 150,
            totalBooks: 1250,
            activeLoans: 89,
            overdueLoans: 12,
            pendingReturns: 8,
            newUsersThisWeek: 5
          });
        }
      } else {
        console.log('Chargement des données étudiant...');
        // Données pour les étudiants
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
          
          setRecentLoans(activeLoans.slice(0, 3));
        }
      }
      
      // Notifications pour tous
      const notificationsResponse = await notificationService.getMyNotifications();
      if (notificationsResponse.success && notificationsResponse.data) {
        const notifications = notificationsResponse.data.notifications;
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

  // Fonction de test pour vérifier la connectivité API
  const testApiConnection = async () => {
    try {
      console.log('Test de connexion API...');
      const response = await fetch('http://localhost:5000/api/test');
      const data = await response.json();
      console.log('API accessible:', data);
      
      // Test des routes auth
      const token = localStorage.getItem('token');
      if (token) {
        const authResponse = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Auth test status:', authResponse.status);
        if (authResponse.ok) {
          const authData = await authResponse.json();
          console.log('Auth test data:', authData);
        } else {
          console.log('Auth test failed:', await authResponse.text());
        }
      }
    } catch (error) {
      console.error('Erreur de connexion API:', error);
    }
  };

  if (!user) return null;

  // Interface administrateur
  if (isAdmin) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-main)] via-[var(--color-bg-alt)] to-[var(--color-bg-main)]">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* En-tête administrateur */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-2">
                  {getGreeting()}, {user.first_name} !
                </h1>
                <p className="text-[var(--color-text-secondary)] text-lg">
                  {getRoleText(user.role)} • Tableau de bord d'administration
                </p>
              </div>
              
              <div className="flex gap-3">
                <Link href="/dashboard/profile">
                  <Button variant="outline">Mon profil</Button>
                </Link>
                <Button variant="destructive" onClick={handleLogout}>
                  Déconnexion
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-[var(--color-accent-primary)] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Statistiques principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{adminStats.totalUsers}</div>
                      <p className="text-xs text-muted-foreground">
                        +{adminStats.newUsersThisWeek} cette semaine
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Livres Total</CardTitle>
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{adminStats.totalBooks}</div>
                      <p className="text-xs text-muted-foreground">
                        Collection complète
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Emprunts Actifs</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{adminStats.activeLoans}</div>
                      <p className="text-xs text-muted-foreground">
                        En cours actuellement
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Emprunts en Retard</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">{adminStats.overdueLoans}</div>
                      <p className="text-xs text-muted-foreground">
                        Nécessitent attention
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Actions rapides */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <Link href="/dashboard/books">
                    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Gestion des Livres</h3>
                            <p className="text-sm text-gray-600">Ajouter, modifier, supprimer</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/dashboard/users">
                    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Gestion des Utilisateurs</h3>
                            <p className="text-sm text-gray-600">Comptes et permissions</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/dashboard/loans">
                    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Gestion des Emprunts</h3>
                            <p className="text-sm text-gray-600">Suivi et retours</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/dashboard/analytics">
                    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Analytics & Rapports</h3>
                            <p className="text-sm text-gray-600">Statistiques détaillées</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/dashboard/settings">
                    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Settings className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Configuration</h3>
                            <p className="text-sm text-gray-600">Paramètres système</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/dashboard/notifications">
                    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                            <Bell className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                            <p className="text-sm text-gray-600">Alertes système</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>

                {/* Alertes importantes */}
                {adminStats.overdueLoans > 0 && (
                  <Card className="border-red-200 bg-red-50 mb-6">
                    <CardHeader>
                      <CardTitle className="text-red-800 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Attention requise
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-red-700">
                        {adminStats.overdueLoans} emprunt(s) en retard nécessitent votre attention.
                      </p>
                      <Link href="/dashboard/loans?filter=overdue">
                        <Button variant="outline" className="mt-2 text-red-700 border-red-300">
                          Voir les détails
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Interface étudiant (code existant simplifié)
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-main)] via-[var(--color-bg-alt)] to-[var(--color-bg-main)]">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* En-tête étudiant */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-2">
                {getGreeting()}, {user.first_name} !
              </h1>
              <p className="text-[var(--color-text-secondary)] text-lg">
                {getRoleText(user.role)} • Mon espace personnel
              </p>
            </div>
            
            <div className="flex gap-3">
              <Link href="/dashboard/profile">
                <Button variant="outline">Mon profil</Button>
              </Link>
              <Button variant="destructive" onClick={handleLogout}>
                Déconnexion
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-[var(--color-accent-primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Statistiques étudiant */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Emprunts Actifs</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeLoans}</div>
                    <p className="text-xs text-muted-foreground">
                      Livres empruntés
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.unreadNotifications}</div>
                    <p className="text-xs text-muted-foreground">
                      Non lues
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">En Retard</CardTitle>
                    <Clock className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{stats.overdueLoans}</div>
                    <p className="text-xs text-muted-foreground">
                      À retourner
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Actions rapides étudiant */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/books">
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Catalogue de Livres</h3>
                          <p className="text-sm text-gray-600">Découvrir et emprunter</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/loans">
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Mes Emprunts</h3>
                          <p className="text-sm text-gray-600">Gérer mes prêts</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/reviews">
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Mes Avis</h3>
                          <p className="text-sm text-gray-600">Évaluer les livres</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/notifications">
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                          <Bell className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Notifications</h3>
                          <p className="text-sm text-gray-600">Alertes et rappels</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
