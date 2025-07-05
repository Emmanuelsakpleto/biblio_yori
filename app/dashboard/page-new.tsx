"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useConfig } from '../../contexts/ConfigContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import { loanService, notificationService, utils, bookService } from '../../lib/api';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  BookOpen, 
  Users, 
  Bell, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  BarChart3,
  UserCheck,
  BookMarked,
  Settings,
  RefreshCw,
  Eye,
  Plus
} from 'lucide-react';

interface DashboardStats {
  activeLoans: number;
  unreadNotifications: number;
  overdueLoans: number;
  totalReviews: number;
  // Stats admin/bibliothécaire
  totalUsers?: number;
  totalBooks?: number;
  pendingReturns?: number;
  monthlyLoans?: number;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const config = useConfig();
  const isAdmin = user?.role === 'admin' || user?.role === 'librarian';
  
  const [stats, setStats] = useState<DashboardStats>({
    activeLoans: 0,
    unreadNotifications: 0,
    overdueLoans: 0,
    totalReviews: 0,
    totalUsers: 0,
    totalBooks: 0,
    pendingReturns: 0,
    monthlyLoans: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentLoans, setRecentLoans] = useState<any[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const [userLoanLimit, setUserLoanLimit] = useState<{current: number, max: number}>({current: 0, max: 5});

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Charger les emprunts de l'utilisateur
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
        
        setUserLoanLimit({
          current: activeLoans.length,
          max: 5
        });
        
        setRecentLoans(loans.slice(0, 3));
      }

      // Stats spécifiques aux admin/bibliothécaires
      if (isAdmin) {
        try {
          const booksRes = await bookService.getBooks({ limit: 1 });
          
          if (booksRes.success && booksRes.data) {
            setStats(prev => ({
              ...prev,
              totalBooks: booksRes.data?.total || 0
            }));
          }
        } catch (error) {
          console.log('Erreur lors du chargement des stats admin:', error);
        }
      }
      
      // Charger les notifications
      const notificationsResponse = await notificationService.getMyNotifications();
      if (notificationsResponse.success && notificationsResponse.data) {
        const notifications = notificationsResponse.data.notifications || [];
        const unreadNotifications = notifications.filter((n: any) => !n.is_read);
        
        setStats(prev => ({
          ...prev,
          unreadNotifications: unreadNotifications.length
        }));
        
        setRecentNotifications(notifications.slice(0, 3));
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!user) return null;

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-6 shadow-xl animate-pulse">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
              Chargement du tableau de bord
            </h2>
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* En-tête avec salutation */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                  {getGreeting()}, {user.first_name} !
                </h1>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-sm">
                    {getRoleText(user.role)}
                  </Badge>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-600">{config.APP_NAME}</span>
                </div>
              </div>
              
              {/* Limite d'emprunts pour les étudiants */}
              {!isAdmin && (
                <div className="bg-slate-50 rounded-xl p-4 border">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Emprunts actifs
                      </p>
                      <p className="text-xs text-slate-600">
                        {userLoanLimit.current} sur {userLoanLimit.max} maximum
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="w-12 h-12 rounded-full border-4 border-slate-200 flex items-center justify-center relative">
                        <div 
                          className={`absolute inset-0 rounded-full border-4 border-transparent ${
                            userLoanLimit.current >= userLoanLimit.max 
                              ? 'border-red-500' 
                              : userLoanLimit.current >= 4 
                                ? 'border-orange-500' 
                                : 'border-green-500'
                          }`}
                          style={{
                            background: `conic-gradient(from 0deg, ${
                              userLoanLimit.current >= userLoanLimit.max 
                                ? '#ef4444' 
                                : userLoanLimit.current >= 4 
                                  ? '#f97316' 
                                  : '#10b981'
                            } ${(userLoanLimit.current / userLoanLimit.max) * 360}deg, transparent 0deg)`
                          }}
                        />
                        <span className="text-xs font-bold text-slate-700 z-10">
                          {userLoanLimit.current}
                        </span>
                      </div>
                    </div>
                  </div>
                  {userLoanLimit.current >= userLoanLimit.max && (
                    <Alert variant="warning" className="mt-3">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Limite d'emprunts atteinte. Retournez un livre pour en emprunter un nouveau.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Emprunts actifs */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isAdmin ? 'Total Emprunts' : 'Mes Emprunts'}
                </CardTitle>
                <BookOpen className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.activeLoans}</div>
                <p className="text-xs text-muted-foreground">
                  {isAdmin ? 'emprunts en cours' : 'livres empruntés'}
                </p>
              </CardContent>
            </Card>

            {/* Emprunts en retard */}
            {stats.overdueLoans > 0 && (
              <Card className="hover:shadow-lg transition-shadow duration-200 border-red-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">
                    Emprunts en retard
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.overdueLoans}</div>
                  <p className="text-xs text-red-600">
                    {stats.overdueLoans === 1 ? 'livre en retard' : 'livres en retard'}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Notifications */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                <Bell className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.unreadNotifications}</div>
                <p className="text-xs text-muted-foreground">non lues</p>
              </CardContent>
            </Card>

            {/* Stats admin */}
            {isAdmin && (
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bibliothèque</CardTitle>
                  <BookMarked className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.totalBooks}</div>
                  <p className="text-xs text-muted-foreground">livres disponibles</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Emprunts récents */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    {isAdmin ? 'Emprunts récents' : 'Mes emprunts récents'}
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/loans">
                      <Eye className="w-4 h-4 mr-2" />
                      Voir tout
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentLoans.length > 0 ? (
                  <div className="space-y-4">
                    {recentLoans.map((loan) => (
                      <div key={loan.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 truncate">
                            {loan.book_title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant={loan.status === 'active' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {loan.status === 'active' ? 'En cours' : 'Terminé'}
                            </Badge>
                            <span className="text-xs text-slate-600">
                              Emprunté le {formatDate(loan.loan_date)}
                            </span>
                          </div>
                          {loan.status === 'active' && (
                            <p className="text-xs text-slate-600 mt-1">
                              À rendre le {formatDate(loan.due_date)}
                              {utils.isOverdue(loan.due_date) && (
                                <span className="text-red-600 font-medium ml-1">• En retard</span>
                              )}
                            </p>
                          )}
                        </div>
                        <div className="ml-4">
                          {loan.status === 'active' && utils.isOverdue(loan.due_date) ? (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          ) : loan.status === 'active' ? (
                            <Clock className="w-5 h-5 text-blue-500" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">
                      {isAdmin ? 'Aucun emprunt récent' : 'Vous n\'avez pas encore emprunté de livre'}
                    </p>
                    {!isAdmin && (
                      <Button asChild>
                        <Link href="/books">
                          <Plus className="w-4 h-4 mr-2" />
                          Découvrir le catalogue
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications récentes */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-orange-600" />
                    Notifications récentes
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/notifications">
                      <Eye className="w-4 h-4 mr-2" />
                      Voir tout
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentNotifications.length > 0 ? (
                  <div className="space-y-4">
                    {recentNotifications.map((notification) => (
                      <div key={notification.id} className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">
                              {notification.title}
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-slate-500 mt-2">
                              {formatDate(notification.created_at)}
                            </p>
                          </div>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">Aucune notification récente</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides */}
          <div className="mt-8">
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Actions rapides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {isAdmin ? (
                    <>
                      <Button variant="outline" asChild className="h-16 flex-col gap-2">
                        <Link href="/dashboard/inventory">
                          <BookMarked className="w-5 h-5" />
                          Gestion des livres
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="h-16 flex-col gap-2">
                        <Link href="/dashboard/loans">
                          <Users className="w-5 h-5" />
                          Gestion des emprunts
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="h-16 flex-col gap-2">
                        <Link href="/dashboard/analytics">
                          <BarChart3 className="w-5 h-5" />
                          Statistiques
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="h-16 flex-col gap-2">
                        <Link href="/dashboard/settings">
                          <Settings className="w-5 h-5" />
                          Configuration
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" asChild className="h-16 flex-col gap-2">
                        <Link href="/books">
                          <BookOpen className="w-5 h-5" />
                          Catalogue
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="h-16 flex-col gap-2">
                        <Link href="/dashboard/loans">
                          <Calendar className="w-5 h-5" />
                          Mes emprunts
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="h-16 flex-col gap-2">
                        <Link href="/dashboard/notifications">
                          <Bell className="w-5 h-5" />
                          Notifications
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="h-16 flex-col gap-2">
                        <Link href="/dashboard/profile">
                          <UserCheck className="w-5 h-5" />
                          Mon profil
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
