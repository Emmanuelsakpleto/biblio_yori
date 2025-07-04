"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Shield,
  Edit3,
  Save,
  X
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function ProfilePageNew() {
  const { user, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    department: ''
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
    try {
      // Ici on pourrait appeler une API de mise à jour
      // Pour l'instant, on simule juste
      await new Promise(resolve => setTimeout(resolve, 1000));
      await refreshProfile();
      setEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setLoading(false);
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {user.role === 'admin' ? 'Administrateur' : 
             user.role === 'librarian' ? 'Bibliothécaire' : 'Étudiant'}
          </span>
        </div>
      </div>

      {/* Carte principale */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8"
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

        {/* Informations de compte */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du compte</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Compte créé le:</span>
              <span className="ml-2 text-gray-900">
                {new Date(user.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Dernière mise à jour:</span>
              <span className="ml-2 text-gray-900">
                {new Date(user.updated_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Statut:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.is_active ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
