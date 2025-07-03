'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, BookOpen, Sparkles } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register, user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      throw new Error('Email et mot de passe requis');
    }

    if (!isLogin) {
      if (!formData.first_name || !formData.last_name) {
        throw new Error('Prénom et nom requis');
      }
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      if (formData.password.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      validateForm();

      if (isLogin) {
        await login(formData.email, formData.password);
        router.push('/');
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name
        });
        router.push('/');
      }
    } catch (err: any) {
      console.error('Erreur d\'authentification:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      confirmPassword: ''
    });
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-main)] via-[var(--color-bg-alt)] to-[var(--color-bg-main)]">
      {/* Effets de fond subtils et élégants */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--color-accent-secondary)]/8 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[var(--color-accent-primary)]/8 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-[var(--color-accent-tertiary)]/8 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* Motifs subtils pour ajouter de la profondeur */}
        <div className="absolute top-1/4 right-1/4 w-48 h-48 border border-[var(--color-accent-primary)]/10 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/5 w-64 h-64 border border-[var(--color-accent-secondary)]/10 rounded-full"></div>
        
        {/* Grain texture overlay */}
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center lg:grid lg:grid-cols-2">
        {/* Côté gauche - Branding & Texte */}
        <div className="hidden lg:flex flex-col justify-center px-12 xl:px-16 space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/30 backdrop-blur-md border border-white/30 rounded-full text-[var(--color-accent-primary)] text-sm font-medium w-fit shadow-sm">
            <Sparkles className="w-4 h-4" />
            Bibliothèque Universitaire Numérique
          </div>
          
          {/* Contenu principal */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl xl:text-6xl font-bold text-[var(--color-text-primary)] leading-tight">
                Bienvenue sur
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)]">
                  YORI
                </span>
              </h1>
              
              <p className="text-xl text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
                Votre plateforme moderne de gestion de bibliothèque universitaire. Accédez à des milliers de ressources académiques et gérez vos emprunts en toute simplicité.
              </p>
            </div>
            
            {/* Caractéristiques */}
            <div className="space-y-4 pt-8">
              <div className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                <div className="w-2 h-2 bg-[var(--color-accent-primary)] rounded-full"></div>
                <span>Catalogue académique complet et recherche avancée</span>
              </div>
              <div className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                <div className="w-2 h-2 bg-[var(--color-accent-secondary)] rounded-full"></div>
                <span>Gestion intelligente des emprunts et réservations</span>
              </div>
              <div className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                <div className="w-2 h-2 bg-[var(--color-accent-tertiary)] rounded-full"></div>
                <span>Suivi personnalisé de vos ressources académiques</span>
              </div>
            </div>
          </div>
        </div>

        {/* Côté droit - Formulaire */}
        <div className="w-full max-w-md mx-auto lg:mx-0 lg:max-w-lg xl:max-w-xl p-6 lg:p-12">
          <div className="glass-card p-8 lg:p-10 relative shadow-2xl before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:rounded-3xl before:pointer-events-none before:z-0">
            {/* Highlight effect */}
            <div className="absolute -inset-px bg-gradient-to-t from-transparent via-white/5 to-white/20 rounded-3xl pointer-events-none"></div>
            
            {/* Logo Mobile */}
            <div className="lg:hidden flex items-center justify-center mb-8 relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg">
                <BookOpen className="w-8 h-8 text-[var(--color-accent-primary)]" />
              </div>
            </div>

            {/* En-tête */}
            <div className="text-center mb-8 relative z-10">
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                {isLogin ? 'Connexion' : 'Inscription'}
              </h2>
              <p className="text-[var(--color-text-secondary)]">
                {isLogin 
                  ? 'Accédez à votre espace personnel' 
                  : 'Rejoignez la communauté universitaire'
                }
              </p>
            </div>

            {/* Boutons de basculement */}
            <div className="flex bg-white/40 backdrop-blur-md rounded-2xl p-1 mb-8 border border-white/30 shadow-sm relative z-10">
              <button
                type="button"
                onClick={() => !isLogin && toggleMode()}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  isLogin 
                    ? 'bg-[var(--color-accent-primary)] text-white shadow-lg shadow-[var(--color-accent-primary)]/25' 
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => isLogin && toggleMode()}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  !isLogin 
                    ? 'bg-[var(--color-accent-primary)] text-white shadow-lg shadow-[var(--color-accent-primary)]/25' 
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                Inscription
              </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Prénom"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-md border border-white/30 rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent transition-all shadow-sm"
                      required={!isLogin}
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Nom"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-md border border-white/30 rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent transition-all shadow-sm"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] w-5 h-5" />
                <input
                  type="email"
                  placeholder="Adresse e-mail"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-md border border-white/30 rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent transition-all shadow-sm"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-white/50 backdrop-blur-md border border-white/30 rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent transition-all shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {!isLogin && (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirmer le mot de passe"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-md border border-white/30 rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent transition-all shadow-sm"
                    required={!isLogin}
                  />
                </div>
              )}

              {error && (
                <div className="p-4 bg-[var(--color-error)]/10 backdrop-blur-md border border-[var(--color-error)]/20 rounded-xl text-[var(--color-error)] text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 text-lg font-semibold rounded-xl bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-primary)] hover:from-[var(--color-hover-primary)] hover:to-[var(--color-accent-primary)] text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--color-accent-primary)]/20 ${
                  loading ? 'cursor-wait' : ''
                }`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {isLogin ? 'Se connecter' : 'Créer le compte'}
                  </>
                )}
              </button>
            </form>

            {/* Quick Login (pour les tests) */}
            {isLogin && (
              <div className="mt-8 p-4 bg-white/30 backdrop-blur-md rounded-xl border border-white/30 shadow-sm relative z-10">
                <p className="text-[var(--color-text-secondary)] text-sm mb-3 font-medium">Comptes de test :</p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ 
                        ...prev, 
                        email: 'admin@yori.com', 
                        password: 'Password123!' 
                      }));
                    }}
                    className="w-full px-3 py-2 bg-white/40 backdrop-blur-sm text-[var(--color-text-primary)] text-sm rounded-lg hover:bg-[var(--color-accent-primary)]/5 transition-colors border border-white/30"
                  >
                    👑 Admin - admin@yori.com
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ 
                        ...prev, 
                        email: 'sophie.biblio@yori.com', 
                        password: 'Password123!' 
                      }));
                    }}
                    className="w-full px-3 py-2 bg-white/40 backdrop-blur-sm text-[var(--color-text-primary)] text-sm rounded-lg hover:bg-[var(--color-accent-primary)]/5 transition-colors border border-white/30"
                  >
                    📚 Bibliothécaire - sophie.biblio@yori.com
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ 
                        ...prev, 
                        email: 'jean.dupont@student.univ.com', 
                        password: 'Password123!' 
                      }));
                    }}
                    className="w-full px-3 py-2 bg-white/40 backdrop-blur-sm text-[var(--color-text-primary)] text-sm rounded-lg hover:bg-[var(--color-accent-primary)]/5 transition-colors border border-white/30"
                  >
                    🎓 Étudiant - jean.dupont@student.univ.com
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
