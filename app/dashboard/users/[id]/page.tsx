"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminService } from '../../../../lib/api';
import { useAuth } from '../../../../contexts/AuthContext';
import { UserProfile } from '../../../../types/user';
import ProtectedRoute from '../../../../components/ProtectedRoute';

export default function UserProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = parseInt(params.id as string);
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/dashboard');
      return;
    }
    if (user && user.role === 'admin' && userId) {
      fetchUserProfile();
    }
  }, [user, loading, router, userId]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminService.getUserById(userId);
      if (response.success && response.data) {
        setUserProfile(response.data);
      } else {
        setError('Utilisateur non trouvé');
      }
    } catch (err) {
      setError('Erreur lors du chargement du profil');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <ProtectedRoute>
        <main className="bookContainer">
          <aside>
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>⟳</div>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>Chargement du profil...</div>
            </div>
          </aside>
        </main>
      </ProtectedRoute>
    );
  }

  if (error || !userProfile) {
    return (
      <ProtectedRoute>
        <main className="bookContainer">
          <aside>
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>❌</div>
              <div style={{ color: '#ef4444', fontSize: '18px', marginBottom: '15px' }}>
                {error}
              </div>
              <button 
                onClick={() => router.back()}
                className="saveButton"
                style={{ background: '#6b7280' }}
              >
                Retour
              </button>
            </div>
          </aside>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="bookContainer">
        <aside>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="center" style={{ margin: 0 }}>
              Profil de {userProfile.first_name} {userProfile.last_name}
            </h2>
            <button 
              onClick={() => router.back()}
              className="saveButton"
              style={{ background: '#6b7280', fontSize: '14px', padding: '8px 16px' }}
            >
              ← Retour
            </button>
          </div>

          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Avatar et informations de base */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: userProfile.profile_image ? 
                  `url(${userProfile.profile_image})` : 
                  `linear-gradient(45deg, #${userProfile.id.toString().slice(-6).padStart(6, '0')}, #${(userProfile.id * 123).toString().slice(-6).padStart(6, '0')})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '24px',
                border: '3px solid #e2e8f0'
              }}>
                {!userProfile.profile_image && `${userProfile.first_name[0]}${userProfile.last_name[0]}`}
              </div>
              <div>
                <h3 style={{ fontSize: '24px', margin: '0 0 5px 0', color: '#1f2937' }}>
                  {userProfile.first_name} {userProfile.last_name}
                </h3>
                <p style={{ color: '#6b7280', margin: '0 0 10px 0' }}>{userProfile.email}</p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: userProfile.role === 'admin' ? '#fef2f2' : userProfile.role === 'student' ? '#f0f9ff' : '#f3e8ff',
                    color: userProfile.role === 'admin' ? '#991b1b' : userProfile.role === 'student' ? '#1e40af' : '#6b21a8',
                    border: `1px solid ${userProfile.role === 'admin' ? '#ef4444' : userProfile.role === 'student' ? '#3b82f6' : '#a855f7'}`
                  }}>
                    {userProfile.role === 'admin' ? '👑 Admin' : 
                     userProfile.role === 'student' ? '🎓 Étudiant' : 
                     '📚 Bibliothécaire'}
                  </span>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: userProfile.is_active ? '#ecfdf5' : '#fef2f2',
                    color: userProfile.is_active ? '#065f46' : '#991b1b',
                    border: `1px solid ${userProfile.is_active ? '#10b981' : '#ef4444'}`
                  }}>
                    {userProfile.is_active ? '✅ Actif' : '❌ Inactif'}
                  </span>
                </div>
              </div>
            </div>

            {/* Informations détaillées */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#374151' }}>
                  📋 Informations personnelles
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Email :</span>
                    <div style={{ fontSize: '14px', color: '#1f2937' }}>{userProfile.email}</div>
                  </div>
                  {userProfile.phone && (
                    <div>
                      <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Téléphone :</span>
                      <div style={{ fontSize: '14px', color: '#1f2937' }}>{userProfile.phone}</div>
                    </div>
                  )}
                  {userProfile.student_id && (
                    <div>
                      <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Numéro étudiant :</span>
                      <div style={{ fontSize: '14px', color: '#1f2937' }}>{userProfile.student_id}</div>
                    </div>
                  )}
                  {userProfile.department && (
                    <div>
                      <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Département :</span>
                      <div style={{ fontSize: '14px', color: '#1f2937' }}>{userProfile.department}</div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#374151' }}>
                  📅 Informations compte
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>ID utilisateur :</span>
                    <div style={{ fontSize: '14px', color: '#1f2937' }}>#{userProfile.id}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Date d'inscription :</span>
                    <div style={{ fontSize: '14px', color: '#1f2937' }}>
                      {new Date(userProfile.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Dernière mise à jour :</span>
                    <div style={{ fontSize: '14px', color: '#1f2937' }}>
                      {new Date(userProfile.updated_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#374151' }}>
                ⚙️ Actions rapides
              </h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  className="saveButton"
                  style={{ background: '#10b981', fontSize: '14px' }}
                  onClick={() => {
                    // TODO: Implémenter la réinitialisation de mot de passe
                    alert('Réinitialisation du mot de passe à implémenter');
                  }}
                >
                  🔄 Réinitialiser mot de passe
                </button>
                <button
                  className="saveButton"
                  style={{ 
                    background: userProfile.is_active ? '#ef4444' : '#10b981', 
                    fontSize: '14px' 
                  }}
                  onClick={() => {
                    // TODO: Implémenter la bascule de statut
                    alert('Bascule de statut à implémenter');
                  }}
                >
                  {userProfile.is_active ? '🔒 Désactiver' : '🔓 Activer'}
                </button>
                <button
                  className="saveButton"
                  style={{ background: '#8b5cf6', fontSize: '14px' }}
                  onClick={() => {
                    // TODO: Implémenter la vue d'activité
                    alert('Vue de l\'activité à implémenter');
                  }}
                >
                  📈 Voir l'activité
                </button>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </ProtectedRoute>
  );
}
