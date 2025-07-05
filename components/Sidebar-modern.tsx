'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home,
  BookOpen,
  Users,
  Calendar,
  Bell,
  Settings,
  BarChart3,
  FileText,
  Plus,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
  Shield,
  GraduationCap,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Types pour les éléments du menu
interface MenuItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  submenu?: MenuItem[];
}

const Sidebar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Menu pour les étudiants
  const studentMenuItems: MenuItem[] = [
    {
      title: "Tableau de bord",
      icon: <Home className="w-5 h-5" />,
      href: "/dashboard"
    },
    {
      title: "Mes emprunts",
      icon: <Calendar className="w-5 h-5" />,
      href: "/dashboard/loans"
    },
    {
      title: "Catalogue",
      icon: <BookOpen className="w-5 h-5" />,
      href: "/books"
    },
    {
      title: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      href: "/dashboard/notifications"
    },
    {
      title: "Mes avis",
      icon: <FileText className="w-5 h-5" />,
      href: "/dashboard/reviews"
    }
  ];

  // Menu pour les administrateurs
  const adminMenuItems: MenuItem[] = [
    {
      title: "Tableau de bord",
      icon: <BarChart3 className="w-5 h-5" />,
      href: "/dashboard"
    },
    {
      title: "Gestion des livres",
      icon: <BookOpen className="w-5 h-5" />,
      href: "/dashboard/books",
      submenu: [
        {
          title: "Tous les livres",
          icon: <BookOpen className="w-4 h-4" />,
          href: "/dashboard/books"
        },
        {
          title: "Ajouter un livre",
          icon: <Plus className="w-4 h-4" />,
          href: "/dashboard/books/add"
        }
      ]
    },
    {
      title: "Gestion des emprunts",
      icon: <Calendar className="w-5 h-5" />,
      href: "/dashboard/loans"
    },
    {
      title: "Utilisateurs",
      icon: <Users className="w-5 h-5" />,
      href: "/dashboard/users"
    },
    {
      title: "Modération d'avis",
      icon: <Star className="w-5 h-5" />,
      href: "/dashboard/reviews"
    },
    {
      title: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      href: "/dashboard/notifications"
    },
    {
      title: "Statistiques",
      icon: <BarChart3 className="w-5 h-5" />,
      href: "/dashboard/stats"
    }
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : studentMenuItems;

  const toggleSubmenu = (title: string) => {
    setExpandedMenus(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">YORI</h1>
            <p className="text-xs text-gray-500">
              {user?.role === 'admin' ? 'Administration' : 'Mon Espace'}
            </p>
          </div>
        </div>
        
        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              {user?.role === 'admin' ? (
                <>
                  <Shield className="w-3 h-3" />
                  <span>Administrateur</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-3 h-3" />
                  <span>Étudiant</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item, index) => (
          <div key={item.title}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => {
                  if (item.submenu) {
                    toggleSubmenu(item.title);
                  } else {
                    handleNavigation(item.href);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                {item.submenu && (
                  <ChevronDown className={`w-4 h-4 transition-transform ${
                    expandedMenus.includes(item.title) ? 'rotate-180' : ''
                  }`} />
                )}
              </button>
            </motion.div>

            {/* Submenu */}
            {item.submenu && expandedMenus.includes(item.title) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 ml-4 space-y-1"
              >
                {item.submenu.map((subItem) => (
                  <button
                    key={subItem.title}
                    onClick={() => handleNavigation(subItem.href)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                      isActive(subItem.href)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {subItem.icon}
                    <span>{subItem.title}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="p-6 border-t border-gray-200 space-y-2">
        <button
          onClick={() => handleNavigation('/profile')}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <User className="w-5 h-5" />
          <span>Mon profil</span>
        </button>
        
        <button
          onClick={() => handleNavigation('/settings')}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>Paramètres</span>
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-50"
            onClick={() => setIsMobileOpen(false)}
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="relative flex w-80 max-w-xs bg-white shadow-xl"
          >
            <SidebarContent />
          </motion.div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 bg-white shadow-xl">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
