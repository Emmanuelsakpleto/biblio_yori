"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { authService, getImageUrl } from '../../lib/api';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Shield,
  Edit3,
  Save,
  X,
  Camera,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Calendar,
  MapPin,
  ArrowLeft,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, refreshProfile, logout } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    department: ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        department: user.department || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await authService.updateProfile(formData);
      
      if (response.success) {
        await refreshProfile();
        setSuccess('Profil mis à jour avec succès !');
        setEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setError('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation basique
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.success) {
        setSuccess('Mot de passe mis à jour avec succès !');
        setChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.error || 'Erreur lors du changement de mot de passe');
      }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      setError('Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.deleteAccount();
      
      if (response.success) {
        setSuccess('Compte supprimé avec succès. Redirection...');
        setTimeout(async () => {
          await logout();
          router.push('/');
        }, 2000);
      } else {
        setError(response.error || 'Erreur lors de la suppression du compte');
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      setError('Erreur lors de la suppression du compte');
      setShowDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation du fichier
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (file.size > maxSize) {
      setError('La taille de l\'image ne doit pas dépasser 5MB');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setError('Format d\'image non supporté. Utilisez JPG, PNG ou GIF');
      return;
    }

    setUploadingImage(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.uploadProfileImage(file);
      
      if (response.success) {
        setSuccess('Photo de profil mise à jour avec succès !');
        await refreshProfile(); // Recharger le profil pour afficher la nouvelle image
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.error || 'Erreur lors de l\'upload de l\'image');
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      setError('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
      // Réinitialiser l'input file
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement du profil...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Bouton de retour */}
      <div className="flex items-center">
        <button
          onClick={() => router.push('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour à l'accueil</span>
        </button>
      </div>

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600 mt-1">Gérez vos informations personnelles et la sécurité de votre compte</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {user.role === 'admin' ? 'Administrateur' : 
             user.role === 'librarian' ? 'Bibliothécaire' : 'Étudiant'}
          </span>
        </div>
      </div>

      {/* Messages d'erreur et de succès */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2"
        >
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2"
        >
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-green-700">{success}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar et informations de base */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 h-fit"
        >
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                {user.profile_image ? (
                  <img 
                    src={getImageUrl(user.profile_image) || ''} 
                    alt="Photo de profil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`
                )}
              </div>
              <div className="absolute bottom-0 right-0">
                <input
                  type="file"
                  id="profile-image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="profile-image-upload"
                  className={`bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors cursor-pointer block ${
                    uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploadingImage ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </label>
              </div>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-gray-600">{user.email}</p>
            
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Compte créé le {new Date(user.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
              {user.department && (
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{user.department}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Informations personnelles */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Informations personnelles</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Modifier</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Annuler</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prénom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Prénom
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{user.first_name}</p>
              )}
            </div>

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Nom
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{user.last_name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{user.email}</p>
              <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Téléphone
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Numéro de téléphone"
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{user.phone || 'Non renseigné'}</p>
              )}
            </div>

            {/* Département (si étudiant) */}
            {user.role === 'student' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <GraduationCap className="w-4 h-4 inline mr-2" />
                  Département
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Votre département d'études"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{user.department || 'Non renseigné'}</p>
                )}
              </div>
            )}

            {/* ID étudiant (si étudiant) */}
            {user.role === 'student' && user.student_id && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Numéro étudiant
                </label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{user.student_id}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Section Sécurité */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Sécurité</h2>
            <p className="text-gray-600 text-sm">Gérez votre mot de passe et la sécurité de votre compte</p>
          </div>
          {!changingPassword && (
            <button
              onClick={() => setChangingPassword(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Lock className="w-4 h-4" />
              <span>Changer le mot de passe</span>
            </button>
          )}
        </div>

        {changingPassword && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mot de passe actuel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe actuel
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mot de passe actuel"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword.current ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Nouveau mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nouveau mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword.new ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirmer le mot de passe */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirmer le nouveau mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword.confirm ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <button
                onClick={handlePasswordChange}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}</span>
              </button>
              <button
                onClick={() => {
                  setChangingPassword(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Annuler</span>
              </button>
            </div>
          </div>
        )}

        {!changingPassword && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Mot de passe</h3>
                <p className="text-sm text-gray-600">Dernière modification: Récemment</p>
              </div>
              <span className="text-green-600 text-sm font-medium">Sécurisé</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Statut du compte</h3>
                <p className="text-sm text-gray-600">Votre compte est actif et vérifié</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.is_active ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Section Suppression de compte - Zone dangereuse */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg border-l-4 border-red-500 p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              Zone dangereuse
            </h2>
            <p className="text-gray-600 text-sm">Actions irréversibles sur votre compte</p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-900 mb-2">Supprimer mon compte</h3>
          <p className="text-red-700 text-sm mb-4">
            Cette action est irréversible. Toutes vos données seront définitivement supprimées.
            Assurez-vous d'avoir rendu tous vos livres empruntés avant de supprimer votre compte.
          </p>
          
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer mon compte</span>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-white border border-red-300 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">Êtes-vous sûr(e) ?</h4>
                <p className="text-red-700 text-sm mb-4">
                  Tapez <strong>SUPPRIMER</strong> pour confirmer la suppression de votre compte.
                  Cette action ne peut pas être annulée.
                </p>
                <input
                  type="text"
                  placeholder="Tapez SUPPRIMER"
                  className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4"
                  onChange={(e) => {
                    const confirmButton = document.getElementById('confirm-delete') as HTMLButtonElement;
                    if (confirmButton) {
                      confirmButton.disabled = e.target.value !== 'SUPPRIMER';
                    }
                  }}
                />
                <div className="flex space-x-2">
                  <button
                    id="confirm-delete"
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{loading ? 'Suppression...' : 'Confirmer la suppression'}</span>
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Annuler</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
