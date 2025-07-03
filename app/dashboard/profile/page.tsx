"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { authService, utils, type UserProfile } from "../../../lib/api";
import ProtectedRoute from "../../../components/ProtectedRoute";

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEditForm({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        department: user.department,
      });
    }
  }, [user]);

  const handleEdit = () => {
    setEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setEditing(false);
    setError(null);
    setSuccess(null);
    if (user) {
      setEditForm({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        department: user.department,
      });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.updateProfile(editForm);
      if (response.success) {
        setSuccess('Profil mis à jour avec succès !');
        setEditing(false);
        await refreshProfile();
        
        // Effacer le message de succès après 3 secondes
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || 'Erreur lors de la mise à jour du profil');
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
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

  if (!user) return (
    <ProtectedRoute>
      <div className="bookContainer">
        <aside>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Impossible de charger le profil utilisateur.
          </div>
        </aside>
      </div>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute>
      <main className="bookContainer">
        <aside>
          <h2 className="center">Mon profil</h2>
          <p className="small">Gérez vos informations personnelles</p>
          
          {error && (
            <div style={{ 
              background: '#ffebee', 
              color: '#c62828', 
              padding: '10px', 
              borderRadius: '5px', 
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={{ 
              background: '#e8f5e8', 
              color: '#2e7d32', 
              padding: '10px', 
              borderRadius: '5px', 
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {success}
            </div>
          )}

          <div className="hover-card" style={{ padding: '20px', borderRadius: '10px' }}>
            {/* Image de profil */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#daa4a4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {user.first_name?.[0]?.toUpperCase()}{user.last_name?.[0]?.toUpperCase()}
              </div>
            </div>

            {/* Informations de base (non modifiables) */}
            <div style={{ marginBottom: '20px' }}>
              <p><strong>Email :</strong> {user.email}</p>
              <p><strong>Rôle :</strong> {getRoleText(user.role)}</p>
              <p><strong>Numéro étudiant :</strong> {user.student_id || "Non renseigné"}</p>
              <p><strong>Statut :</strong> 
                <span style={{ 
                  color: user.is_active ? '#44aa44' : '#ff4444',
                  fontWeight: 'bold',
                  marginLeft: '5px'
                }}>
                  {user.is_active ? "Actif" : "Inactif"}
                </span>
              </p>
            </div>

            {/* Informations modifiables */}
            <div>
              <div style={{ marginBottom: '15px' }}>
                <strong>Prénom :</strong>
                {editing ? (
                  <input
                    type="text"
                    value={editForm.first_name || ''}
                    onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                    style={{
                      marginLeft: '10px',
                      padding: '5px',
                      border: '1px solid #ccc',
                      borderRadius: '3px'
                    }}
                  />
                ) : (
                  <span style={{ marginLeft: '10px' }}>{user.first_name}</span>
                )}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <strong>Nom :</strong>
                {editing ? (
                  <input
                    type="text"
                    value={editForm.last_name || ''}
                    onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                    style={{
                      marginLeft: '10px',
                      padding: '5px',
                      border: '1px solid #ccc',
                      borderRadius: '3px'
                    }}
                  />
                ) : (
                  <span style={{ marginLeft: '10px' }}>{user.last_name}</span>
                )}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <strong>Téléphone :</strong>
                {editing ? (
                  <input
                    type="tel"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    style={{
                      marginLeft: '10px',
                      padding: '5px',
                      border: '1px solid #ccc',
                      borderRadius: '3px'
                    }}
                  />
                ) : (
                  <span style={{ marginLeft: '10px' }}>{user.phone || "Non renseigné"}</span>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <strong>Département :</strong>
                {editing ? (
                  <input
                    type="text"
                    value={editForm.department || ''}
                    onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                    style={{
                      marginLeft: '10px',
                      padding: '5px',
                      border: '1px solid #ccc',
                      borderRadius: '3px'
                    }}
                  />
                ) : (
                  <span style={{ marginLeft: '10px' }}>{user.department || "Non renseigné"}</span>
                )}
              </div>
            </div>

            {/* Boutons d'action */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              {editing ? (
                <div>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="saveButton"
                    style={{
                      background: '#44aa44',
                      color: 'white',
                      border: 'none',
                      marginRight: '10px'
                    }}
                  >
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="saveButton"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEdit}
                  className="saveButton"
                  style={{
                    background: '#4488ff',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  Modifier le profil
                </button>
              )}
            </div>

            {/* Informations supplémentaires */}
            <div style={{ 
              marginTop: '30px', 
              paddingTop: '20px', 
              borderTop: '1px solid #ddd',
              fontSize: '14px',
              color: '#666'
            }}>
              <p><strong>Compte créé le :</strong> {utils.formatDate(user.created_at)}</p>
              {user.updated_at !== user.created_at && (
                <p><strong>Dernière modification :</strong> {utils.formatDate(user.updated_at)}</p>
              )}
            </div>
          </div>
        </aside>
      </main>
    </ProtectedRoute>
  );
}
