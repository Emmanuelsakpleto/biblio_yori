'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Home from '../components/Home';

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si l'authentification est chargée et qu'il n'y a pas d'utilisateur, rediriger vers l'auth
    if (!loading && !user) {
      router.replace('/auth');
    }
  }, [user, loading, router]);
  
  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-full mb-4 shadow-lg">
            <span className="text-2xl text-white">📚</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Bibliothèque YORI</h2>
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 mt-4">Chargement...</p>
        </div>
      </div>
    );
  }
  
  // Si pas d'utilisateur, ne rien afficher (redirection en cours)
  if (!user) {
    return null;
  }
  
  // Utilisateur connecté, afficher l'accueil
  return <Home />;
}
