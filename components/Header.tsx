'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { notificationService, type Notification } from '../lib/api';

const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setNotifLoading(true);
    notificationService.getMyNotifications()
      .then(res => {
        if (res.success && res.data) {
          if (Array.isArray(res.data)) setNotifications(res.data);
          else if (Array.isArray(res.data.notifications)) setNotifications(res.data.notifications);
          else setNotifications([]);
        } else {
          setNotifications([]);
        }
      })
      .finally(() => setNotifLoading(false));
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'backdrop-blur-xl bg-white/95 border-slate-200/60 shadow-lg' 
        : 'backdrop-blur-md bg-white/90 border-slate-200/40'
    } border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo et navigation principale */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200 transform group-hover:scale-105">
                  <span className="text-white font-bold text-lg">Y</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-900">YORI</span>
                <span className="text-xs text-slate-500 -mt-1">Bibliothèque</span>
              </div>
            </Link>

            {/* Navigation desktop */}
            <nav className="hidden md:flex items-center space-x-1">
              <NavLink href="/" label="Accueil" />
              <NavLink href="/books" label="Catalogue" />
              {user?.role === 'admin' || user?.role === 'librarian' ? (
                <NavLink href="/dashboard" label="Administration" />
              ) : (
                <NavLink href="/dashboard" label="Mon Espace" />
              )}
            </nav>
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="relative p-2.5 rounded-lg bg-slate-100/70 hover:bg-slate-200/70 transition-all duration-200 group"
                  >
                    <svg className="w-5 h-5 text-slate-600 group-hover:text-slate-800 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19H6.5A2.5 2.5 0 0 1 4 16.5v-9A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v3.5" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs flex items-center justify-center rounded-full border-2 border-white font-bold">{unreadCount}</span>
                    )}
                  </button>

                  {/* Menu notifications */}
                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-slate-200/60 overflow-hidden animate-slideDown z-50">
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-800">Notifications</h3>
                        <Link href="/dashboard/notifications" className="text-xs text-blue-600 hover:underline">Tout voir</Link>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifLoading ? (
                          <div className="p-4 text-center text-gray-400">Chargement...</div>
                        ) : notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-400">Aucune notification</div>
                        ) : notifications.slice(0, 6).map((notif) => (
                          <div key={notif.id} className={`p-4 border-b border-slate-50 last:border-0 ${!notif.is_read ? 'bg-blue-50/60' : ''}`}>
                            <div className="flex items-center gap-2">
                              <span className="text-base">
                                {notif.type === 'loan_reminder' && '📚'}
                                {notif.type === 'overdue_notice' && '⚠️'}
                                {notif.type === 'reservation_ready' && '✅'}
                                {notif.type === 'book_returned' && '↩️'}
                                {notif.type === 'reservation_cancelled' && '❌'}
                                {notif.type === 'reservation_refused' && '🚫'}
                                {notif.type === 'admin_reminder' && '🔔'}
                                {notif.type === 'loan_validated' && '✅'}
                                {notif.type === 'loan_created' && '📖'}
                                {notif.type === 'loan_overdue' && '⚠️'}
                                {notif.type === 'loan_renewed' && '🔄'}
                              </span>
                              <span className="text-sm text-slate-700 font-medium truncate">{notif.title}</span>
                            </div>
                            <div className="text-xs text-slate-500 mt-1 truncate">{notif.message}</div>
                            <div className="text-xs text-slate-400 mt-1">{new Date(notif.created_at).toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profil utilisateur */}
                <div className="relative group">
                  <button className="flex items-center space-x-3 p-2 pr-3 rounded-lg bg-slate-100/70 hover:bg-slate-200/70 transition-all duration-200">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.first_name?.charAt(0).toUpperCase() || user.last_name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="hidden sm:block text-slate-700 font-medium text-sm">{user.first_name} {user.last_name}</span>
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Menu profil */}
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-lg shadow-xl border border-slate-200/60 overflow-hidden opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                    <Link href="/profile" className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50/70 transition-colors">
                      Mon profil
                    </Link>
                    <Link href="/dashboard" className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50/70 transition-colors">
                      Mon espace
                    </Link>
                    <hr className="border-slate-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50/70 hover:text-red-600 transition-colors"
                    >
                      Se déconnecter
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link
                href="/auth"
                className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Connexion
              </Link>
            )}

            {/* Menu mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 rounded-lg bg-slate-100/70 hover:bg-slate-200/70 transition-all duration-200"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-lg animate-slideDown">
            <nav className="px-4 py-4 space-y-2">
              <MobileNavLink href="/" label="Accueil" />
              <MobileNavLink href="/books" label="Catalogue" />
              <MobileNavLink href="/dashboard" label="Mon Espace" />
              {user?.role === 'admin' && <MobileNavLink href="/dashboard" label="Administration" />}
              {!user && (
                <Link
                  href="/auth"
                  className="block w-full text-center px-4 py-3 bg-slate-900 text-white rounded-lg font-medium mt-4"
                >
                  Connexion
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

const NavLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all duration-200 font-medium text-sm"
  >
    {label}
  </Link>
);

const MobileNavLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="block px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 rounded-lg transition-all duration-200 font-medium"
  >
    {label}
  </Link>
);

export default Header;
