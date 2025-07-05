'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  UserCog,
  LogOut,
  Menu,
  X,
  Book,
  Clock,
  Star,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.role === 'librarian';

  // Menu items pour les étudiants
  const studentMenuItems = [
    {
      title: "Tableau de bord",
      href: "/dashboard",
      icon: Home,
      description: "Vue d'ensemble"
    },
    {
      title: "Mes Emprunts",
      href: "/dashboard/loans",
      icon: BookOpen,
      description: "Livres empruntés"
    },
    {
      title: "Catalogue",
      href: "/books",
      icon: Book,
      description: "Parcourir les livres"
    },
    {
      title: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
      description: "Messages et alertes"
    },
    {
      title: "Mes Avis",
      href: "/dashboard/reviews",
      icon: Star,
      description: "Avis et commentaires"
    }
  ];

  // Menu items pour les administrateurs
  const adminMenuItems = [
    {
      title: "Tableau de bord",
      href: "/dashboard",
      icon: BarChart3,
      description: "Statistiques générales"
    },
    {
      title: "Gestion Livres",
      href: "/dashboard/books",
      icon: BookOpen,
      description: "Catalogue et ajouts"
    },
    {
      title: "Gestion Emprunts",
      href: "/dashboard/loans",
      icon: Clock,
      description: "Emprunts actifs"
    },
    {
      title: "Utilisateurs",
      href: "/dashboard/users",
      icon: Users,
      description: "Gestion des comptes"
    },
    {
      title: "Modération d'avis",
      href: "/dashboard/reviews",
      icon: Star,
      description: "Modérer les avis utilisateurs"
    },
    {
      title: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
      description: "Messages système"
    },
    {
      title: "Rapports",
      href: "/dashboard/reports",
      icon: FileText,
      description: "Statistiques détaillées"
    },
    {
      title: "Configuration",
      href: "/dashboard/settings",
      icon: Settings,
      description: "Paramètres système"
    }
  ];

  const menuItems = isAdmin ? adminMenuItems : studentMenuItems;

  const handleLogout = async () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      await logout();
      router.push('/auth');
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">YORI</h2>
            <p className="text-xs text-gray-500">
              {isAdmin ? 'Administration' : 'Mon Espace'}
            </p>
          </div>
        </div>
        
        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.role === 'admin' ? 'Administrateur' : 
               user?.role === 'librarian' ? 'Bibliothécaire' : 'Étudiant'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`mr-3 h-5 w-5 ${
                isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              <div className="flex-1">
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <Link
            href="/profile"
            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <UserCog className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            Mon Profil
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full group flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
          >
            <LogOut className="mr-3 h-5 w-5 text-red-500" />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md text-gray-600 hover:text-gray-900"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setIsMobileOpen(false)}
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="relative flex flex-col w-64 bg-white shadow-xl"
          >
            {sidebarContent}
          </motion.div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
