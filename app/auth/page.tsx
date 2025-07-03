'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, BookOpen, Sparkles, GraduationCap, Library, ArrowRight, Phone, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { loginSchema, registerSchema, LoginFormData, RegisterFormData } from '../../lib/validations';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_country: '+33',
    phone_number: '',
    department: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = async () => {
    try {
      setFieldErrors({});
      
      if (isLogin) {
        await loginSchema.validate({
          email: formData.email,
          password: formData.password
        }, { abortEarly: false });
      } else {
        await registerSchema.validate(formData, { abortEarly: false });
      }
      
      return true;
    } catch (validationError: any) {
      const errors: Record<string, string> = {};
      
      if (validationError.inner) {
        validationError.inner.forEach((error: any) => {
          if (error.path) {
            errors[error.path] = error.message;
          }
        });
      }
      
      setFieldErrors(errors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation du formulaire
      const isValid = await validateForm();
      if (!isValid) {
        setLoading(false);
        return;
      }

      if (isLogin) {
        await login(formData.email, formData.password);
        router.push('/');
      } else {
        const phoneNumber = formData.phone_country + formData.phone_number;
        await register({
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: phoneNumber,
          department: formData.department
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
      phone_country: '+33',
      phone_number: '',
      department: '',
      confirmPassword: ''
    });
    setError('');
    setFieldErrors({});
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  // Helper pour afficher les erreurs de champ
  const renderFieldError = (fieldName: string) => {
    if (fieldErrors[fieldName]) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-red-500 text-xs mt-1 ml-1"
        >
          {fieldErrors[fieldName]}
        </motion.div>
      );
    }
    return null;
  };

  // Identifiants prédéfinis pour connexion rapide
  const adminLogin = () => {
    setFormData({
      ...formData,
      email: 'admin@yori.com',
      password: 'Password123!'
    });
  };

  const biblioLogin = () => {
    setFormData({
      ...formData,
      email: 'sophie.biblio@yori.com',
      password: 'Password123!'
    });
  };

  // Différents comptes étudiants disponibles
  const studentAccounts = [
    { name: 'Jean Dupont', email: 'jean.dupont@student.univ.com' },
    { name: 'Marie Martin', email: 'marie.martin@student.univ.com' },
    { name: 'Pierre Durand', email: 'pierre.durand@student.univ.com' },
    { name: 'Test', email: 'test@example.com' }
  ];

  const [selectedStudentIndex, setSelectedStudentIndex] = useState(0);

  const studentLogin = () => {
    const selectedStudent = studentAccounts[selectedStudentIndex];
    setFormData({
      ...formData,
      email: selectedStudent.email,
      password: 'Password123!'
    });
  };
  
  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStudentIndex(Number(e.target.value));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-main)] via-[var(--color-bg-alt)] to-[var(--color-bg-main)] relative overflow-hidden">
      {/* Effets de fond ultra-modernes */}
      <div className="absolute inset-0">
        {/* Dégradés organiques animés */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-[var(--color-accent-primary)]/20 via-[var(--color-accent-secondary)]/15 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[var(--color-accent-secondary)]/20 via-[var(--color-accent-tertiary)]/15 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-[var(--color-accent-primary)]/15 via-[var(--color-accent-secondary)]/10 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* Grille subtile */}
        <div className="absolute inset-0 bg-pattern opacity-[0.02]"></div>
      </div>

      <div className="relative min-h-screen flex">
        {/* Côté gauche - Branding ultra-moderne */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 xl:px-24 relative">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-12"
          >
            {/* Badge élégant */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-3 px-6 py-3 glass-effect rounded-2xl text-[var(--color-text-primary)] text-sm font-semibold w-fit shadow-lg"
            >
              <div className="w-2 h-2 bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] rounded-full animate-pulse"></div>
              Plateforme Universitaire Premium
            </motion.div>
            
            {/* Titre principal */}
            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-6xl xl:text-7xl font-bold leading-tight"
              >
                <span className="text-[var(--color-text-primary)]">Bienvenue sur</span>
                <br />
                <span className="bg-gradient-to-r from-[var(--color-accent-primary)] via-[var(--color-accent-secondary)] to-[var(--color-accent-tertiary)] bg-clip-text text-transparent">
                  YORI
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-xl text-[var(--color-text-secondary)] leading-relaxed max-w-2xl font-medium"
              >
                Votre bibliothèque universitaire digitale nouvelle génération. 
                Accédez à un écosystème complet de ressources académiques avec une expérience utilisateur exceptionnelle.
              </motion.p>
            </div>
            
            {/* Caractéristiques avec icônes */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="space-y-6 pt-8"
            >
              <div className="flex items-center gap-4 text-[var(--color-text-secondary)]">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] rounded-2xl flex items-center justify-center shadow-lg">
                  <Library className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg font-medium">Catalogue académique de référence</span>
              </div>
              <div className="flex items-center gap-4 text-[var(--color-text-secondary)]">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-accent-secondary)] to-[var(--color-accent-primary)] rounded-2xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg font-medium">Gestion intelligente des emprunts</span>
              </div>
              <div className="flex items-center gap-4 text-[var(--color-text-secondary)]">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-accent-tertiary)] to-[var(--color-accent-secondary)] rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg font-medium">Expérience personnalisée premium</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Côté droit - Formulaire ultra-moderne */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-lg"
          >
            {/* Container du formulaire avec glassmorphisme */}
            <div className="glass-effect-strong rounded-3xl shadow-2xl p-10 relative overflow-hidden">
              {/* Effet de brillance */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent-secondary)]/60 to-transparent"></div>
              
              {/* En-tête du formulaire */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-center mb-10"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] rounded-2xl mb-6 shadow-xl">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">
                  {isLogin ? 'Connexion' : 'Créer un compte'}
                </h2>
                <p className="text-[var(--color-text-secondary)] font-medium">
                  {isLogin 
                    ? 'Accédez à votre espace bibliothèque' 
                    : 'Rejoignez la communauté académique YORI'
                  }
                </p>
              </motion.div>

              {/* Messages d'erreur */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Formulaire */}
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                {/* Champs nom/prénom pour inscription */}
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <label className="absolute left-12 top-3 text-xs text-slate-500 font-normal transition-all duration-200 pointer-events-none z-10">
                            Prénom
                          </label>
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 z-10" />
                          <input
                            type="text"
                            placeholder="Jean"
                            value={formData.first_name}
                            onChange={(e) => handleInputChange('first_name', e.target.value)}
                            className={`w-full pl-12 pr-4 pt-7 pb-3 h-14 bg-[var(--glass-bg)] backdrop-blur-sm border rounded-2xl text-[var(--color-text-primary)] placeholder-slate-400 placeholder:text-sm focus:ring-2 focus:ring-[var(--color-accent-primary)]/20 focus:border-[var(--color-accent-secondary)] focus:bg-white transition-all duration-300 shadow-sm focus:shadow-lg font-medium text-sm ${
                              fieldErrors.first_name 
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                                : 'border-[var(--glass-border)]'
                            }`}
                            required={!isLogin}
                          />
                          {renderFieldError('first_name')}
                        </div>
                        <div className="relative">
                          <label className="absolute left-12 top-3 text-xs text-slate-500 font-normal transition-all duration-200 pointer-events-none z-10">
                            Nom
                          </label>
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 z-10" />
                          <input
                            type="text"
                            placeholder="Dupont"
                            value={formData.last_name}
                            onChange={(e) => handleInputChange('last_name', e.target.value)}
                            className={`w-full pl-12 pr-4 pt-7 pb-3 h-14 bg-[var(--glass-bg)] backdrop-blur-sm border rounded-2xl text-[var(--color-text-primary)] placeholder-slate-400 placeholder:text-sm focus:ring-2 focus:ring-[var(--color-accent-primary)]/20 focus:border-[var(--color-accent-secondary)] focus:bg-white transition-all duration-300 shadow-sm focus:shadow-lg font-medium text-sm ${
                              fieldErrors.last_name 
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                                : 'border-[var(--glass-border)]'
                            }`}
                            required={!isLogin}
                          />
                          {renderFieldError('last_name')}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Téléphone avec indicatif et numéro séparés */}
                        <div className="relative">
                          <label className="absolute left-4 top-1 text-xs text-slate-500 font-normal bg-white px-2 rounded z-20">
                            Téléphone
                          </label>
                          <div className="flex gap-3 pt-3">
                            <div className="relative w-24">
                              <input
                                type="text"
                                placeholder="+33"
                                value={formData.phone_country}
                                onChange={(e) => {
                                  // Garder le format +xxx
                                  let value = e.target.value;
                                  if (!value.startsWith('+')) {
                                    value = '+' + value.replace(/\D/g, '');
                                  } else {
                                    value = '+' + value.slice(1).replace(/\D/g, '');
                                  }
                                  handleInputChange('phone_country', value);
                                }}
                                className={`w-full px-3 py-4 h-14 bg-[var(--glass-bg)] backdrop-blur-sm border rounded-2xl text-[var(--color-text-primary)] placeholder-slate-400 placeholder:text-sm text-sm focus:ring-2 focus:ring-[var(--color-accent-primary)]/20 focus:border-[var(--color-accent-secondary)] focus:bg-white transition-all duration-300 shadow-sm focus:shadow-lg font-medium text-center ${
                                  fieldErrors.phone_country 
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                                    : 'border-[var(--glass-border)]'
                                }`}
                                maxLength={4}
                              />
                            </div>
                            <div className="relative flex-1">
                              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 z-10" />
                              <input
                                type="tel"
                                placeholder="612345678"
                                value={formData.phone_number}
                                onChange={(e) => {
                                  // Ne garder que les chiffres
                                  const numbersOnly = e.target.value.replace(/\D/g, '');
                                  handleInputChange('phone_number', numbersOnly);
                                }}
                                className={`w-full pl-12 pr-4 py-4 h-14 bg-[var(--glass-bg)] backdrop-blur-sm border rounded-2xl text-[var(--color-text-primary)] placeholder-slate-400 placeholder:text-sm text-sm focus:ring-2 focus:ring-[var(--color-accent-primary)]/20 focus:border-[var(--color-accent-secondary)] focus:bg-white transition-all duration-300 shadow-sm focus:shadow-lg font-medium ${
                                  fieldErrors.phone_number 
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                                    : 'border-[var(--glass-border)]'
                                }`}
                                maxLength={12}
                              />
                            </div>
                          </div>
                          {renderFieldError('phone_country')}
                          {renderFieldError('phone_number')}
                        </div>
                        
                        {/* Département */}
                        <div className="relative">
                          <label className="absolute left-12 top-3 text-xs text-slate-500 font-normal transition-all duration-200 pointer-events-none z-10">
                            Département
                          </label>
                          <GraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 z-10" />
                          <input
                            type="text"
                            placeholder="Informatique"
                            value={formData.department}
                            onChange={(e) => handleInputChange('department', e.target.value)}
                            className={`w-full pl-12 pr-4 pt-7 pb-3 h-14 bg-[var(--glass-bg)] backdrop-blur-sm border rounded-2xl text-[var(--color-text-primary)] placeholder-slate-400 placeholder:text-sm text-sm focus:ring-2 focus:ring-[var(--color-accent-primary)]/20 focus:border-[var(--color-accent-secondary)] focus:bg-white transition-all duration-300 shadow-sm focus:shadow-lg font-medium ${
                              fieldErrors.department 
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                                : 'border-[var(--glass-border)]'
                            }`}
                          />
                          {renderFieldError('department')}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email */}
                <div className="relative">
                  <label className="absolute left-12 top-3 text-xs text-slate-500 font-normal transition-all duration-200 pointer-events-none z-10">
                    Email
                  </label>
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 z-10" />
                  <input
                    type="email"
                    placeholder="jean.dupont@universite.fr"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-12 pr-4 pt-7 pb-3 h-14 bg-[var(--glass-bg)] backdrop-blur-sm border rounded-2xl text-[var(--color-text-primary)] placeholder-slate-400 placeholder:text-sm text-sm focus:ring-2 focus:ring-[var(--color-accent-primary)]/20 focus:border-[var(--color-accent-secondary)] focus:bg-white transition-all duration-300 shadow-sm focus:shadow-lg font-medium ${
                      fieldErrors.email 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-[var(--glass-border)]'
                    }`}
                    required
                  />
                  {renderFieldError('email')}
                </div>

                {/* Mot de passe */}
                <div className="relative">
                  <label className="absolute left-12 top-3 text-xs text-slate-500 font-normal transition-all duration-200 pointer-events-none z-10">
                    Mot de passe
                  </label>
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 z-10" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={isLogin ? "Votre mot de passe" : "8+ caractères avec majuscule, chiffre, symbole"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full pl-12 pr-12 pt-7 pb-3 h-14 bg-[var(--glass-bg)] backdrop-blur-sm border rounded-2xl text-[var(--color-text-primary)] placeholder-slate-400 placeholder:text-sm text-sm focus:ring-2 focus:ring-[var(--color-accent-primary)]/20 focus:border-[var(--color-accent-secondary)] focus:bg-white transition-all duration-300 shadow-sm focus:shadow-lg font-medium ${
                      fieldErrors.password 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-[var(--glass-border)]'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200 p-1 z-10"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {renderFieldError('password')}
                </div>

                {/* Confirmation mot de passe pour inscription */}
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      <label className="absolute left-12 top-3 text-xs text-slate-500 font-normal transition-all duration-200 pointer-events-none z-10">
                        Confirmation
                      </label>
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 z-10" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirmez votre mot de passe"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`w-full pl-12 pr-4 pt-7 pb-3 h-14 bg-[var(--glass-bg)] backdrop-blur-sm border rounded-2xl text-[var(--color-text-primary)] placeholder-slate-400 placeholder:text-sm text-sm focus:ring-2 focus:ring-[var(--color-accent-primary)]/20 focus:border-[var(--color-accent-secondary)] focus:bg-white transition-all duration-300 shadow-sm focus:shadow-lg font-medium ${
                          fieldErrors.confirmPassword 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                            : 'border-[var(--glass-border)]'
                        }`}
                        required={!isLogin}
                      />
                      {renderFieldError('confirmPassword')}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bouton de soumission */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] hover:from-[var(--color-hover-primary)] hover:to-[var(--color-hover-secondary)] disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 disabled:transform-none disabled:shadow-lg flex items-center justify-center gap-3 group"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="text-lg">
                        {isLogin ? 'Se connecter' : 'Créer mon compte'}
                      </span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </motion.button>

                {/* Boutons d'accès rapide */}
                {isLogin && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="flex flex-col items-center gap-2 mt-6"
                  >
                    <p className="text-xs text-[var(--color-text-secondary)] mb-2">
                      Connexion rapide (mot de passe: Password123!)
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        type="button"
                        onClick={adminLogin}
                        className="text-xs px-3 py-1.5 bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] rounded-lg hover:bg-[var(--color-accent-primary)]/20 transition-colors"
                      >
                        Administrateur
                      </button>
                      <button
                        type="button"
                        onClick={biblioLogin}
                        className="text-xs px-3 py-1.5 bg-[var(--color-accent-tertiary)]/10 text-[var(--color-accent-tertiary)] rounded-lg hover:bg-[var(--color-accent-tertiary)]/20 transition-colors"
                      >
                        Bibliothécaire
                      </button>
                      <div className="flex items-center gap-2">
                        <select 
                          value={selectedStudentIndex}
                          onChange={handleStudentChange}
                          className="text-xs bg-[var(--color-accent-secondary)]/5 text-[var(--color-text-secondary)] rounded-lg border border-[var(--color-accent-secondary)]/10 focus:ring-[var(--color-accent-secondary)] focus:border-[var(--color-accent-secondary)]"
                        >
                          {studentAccounts.map((student, index) => (
                            <option key={student.email} value={index}>
                              {student.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={studentLogin}
                          className="text-xs px-3 py-1.5 bg-[var(--color-accent-secondary)]/10 text-[var(--color-accent-secondary)] rounded-lg hover:bg-[var(--color-accent-secondary)]/20 transition-colors"
                        >
                          Étudiant
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Lien de basculement */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="text-center pt-6"
                >
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] font-medium transition-colors duration-200 underline decoration-transparent hover:decoration-current underline-offset-4"
                  >
                    {isLogin 
                      ? "Pas encore de compte ? S'inscrire" 
                      : "Déjà inscrit ? Se connecter"
                    }
                  </button>
                </motion.div>
              </motion.form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
