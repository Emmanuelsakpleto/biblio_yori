import { useState } from 'react';
import { UserProfile } from '../../../types/user';
import { utils } from '../../../lib/api';

interface UsersTableProps {
  users: UserProfile[];
  onUserUpdate: (userId: number, updates: Partial<UserProfile>) => void;
}

export default function UsersTable({ users, onUserUpdate }: UsersTableProps) {
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<{
    userId: number;
    action: string;
    newValue: any;
  } | null>(null);

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: { bg: '#fef2f2', color: '#991b1b', border: '#ef4444' },
      student: { bg: '#f0f9ff', color: '#1e40af', border: '#3b82f6' },
      librarian: { bg: '#f3e8ff', color: '#6b21a8', border: '#a855f7' }
    };
    
    const style = styles[role as keyof typeof styles] || styles.student;
    
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500',
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`
      }}>
        {role === 'admin' ? '👑 Admin' : 
         role === 'student' ? '🎓 Étudiant' : 
         '📚 Bibliothécaire'}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500',
        background: isActive ? '#ecfdf5' : '#fef2f2',
        color: isActive ? '#065f46' : '#991b1b',
        border: `1px solid ${isActive ? '#10b981' : '#ef4444'}`
      }}>
        {isActive ? '✅ Actif' : '❌ Inactif'}
      </span>
    );
  };

  const handleRoleChange = (userId: number, newRole: string) => {
    setShowConfirmModal({
      userId,
      action: 'role',
      newValue: newRole
    });
  };

  const handleStatusChange = (userId: number, newStatus: boolean) => {
    setShowConfirmModal({
      userId,
      action: 'status',
      newValue: newStatus
    });
  };

  const confirmAction = () => {
    if (!showConfirmModal) return;
    
    const { userId, action, newValue } = showConfirmModal;
    
    if (action === 'role') {
      onUserUpdate(userId, { role: newValue });
    } else if (action === 'status') {
      onUserUpdate(userId, { is_active: newValue });
    }
    
    setShowConfirmModal(null);
  };

  const getActionText = () => {
    if (!showConfirmModal) return '';
    
    const user = users.find(u => u.id === showConfirmModal.userId);
    if (!user) return '';
    
    if (showConfirmModal.action === 'role') {
      return `Changer le rôle de ${user.first_name} ${user.last_name} vers "${showConfirmModal.newValue}"`;
    } else if (showConfirmModal.action === 'status') {
      return `${showConfirmModal.newValue ? 'Activer' : 'Désactiver'} le compte de ${user.first_name} ${user.last_name}`;
    }
    
    return '';
  };

  return (
    <>
      {/* Modal de confirmation */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#1f2937' }}>
                Confirmer l'action
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.5' }}>
                {getActionText()}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowConfirmModal(null)}
                className="saveButton"
                style={{ background: '#6b7280' }}
              >
                Annuler
              </button>
              <button
                onClick={confirmAction}
                className="saveButton"
                style={{ background: '#ef4444' }}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ 
                padding: '15px', 
                textAlign: 'left', 
                borderBottom: '1px solid #e2e8f0',
                fontWeight: '600',
                color: '#374151',
                fontSize: '14px'
              }}>
                👤 Utilisateur
              </th>
              <th style={{ 
                padding: '15px', 
                textAlign: 'left', 
                borderBottom: '1px solid #e2e8f0',
                fontWeight: '600',
                color: '#374151',
                fontSize: '14px'
              }}>
                📧 Contact
              </th>
              <th style={{ 
                padding: '15px', 
                textAlign: 'left', 
                borderBottom: '1px solid #e2e8f0',
                fontWeight: '600',
                color: '#374151',
                fontSize: '14px'
              }}>
                🎭 Rôle
              </th>
              <th style={{ 
                padding: '15px', 
                textAlign: 'left', 
                borderBottom: '1px solid #e2e8f0',
                fontWeight: '600',
                color: '#374151',
                fontSize: '14px'
              }}>
                📊 Statut
              </th>
              <th style={{ 
                padding: '15px', 
                textAlign: 'left', 
                borderBottom: '1px solid #e2e8f0',
                fontWeight: '600',
                color: '#374151',
                fontSize: '14px'
              }}>
                📅 Inscription
              </th>
              <th style={{ 
                padding: '15px', 
                textAlign: 'center', 
                borderBottom: '1px solid #e2e8f0',
                fontWeight: '600',
                color: '#374151',
                fontSize: '14px'
              }}>
                ⚙️ Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((userItem, index) => (
              <tr 
                key={userItem.id} 
                style={{ 
                  borderBottom: index < users.length - 1 ? '1px solid #f1f5f9' : 'none',
                  background: index % 2 === 0 ? '#ffffff' : '#fafbfc'
                }}
              >
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: userItem.profile_image ? 
                        `url(${userItem.profile_image})` : 
                        `linear-gradient(45deg, #${userItem.id.toString().slice(-6).padStart(6, '0')}, #${(userItem.id * 123).toString().slice(-6).padStart(6, '0')})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}>
                      {!userItem.profile_image && `${userItem.first_name[0]}${userItem.last_name[0]}`}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1f2937' }}>
                        {userItem.first_name} {userItem.last_name}
                      </div>
                      {userItem.student_id && (
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          ID: {userItem.student_id}
                        </div>
                      )}
                      {userItem.department && (
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {userItem.department}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '15px' }}>
                  <div>
                    <div style={{ color: '#1f2937', marginBottom: '4px' }}>
                      {userItem.email}
                    </div>
                    {userItem.phone && (
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        📱 {userItem.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {getRoleBadge(userItem.role)}
                    <select
                      value={userItem.role}
                      onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid #d1d5db',
                        fontSize: '12px',
                        background: 'white'
                      }}
                    >
                      <option value="student">Étudiant</option>
                      <option value="librarian">Bibliothécaire</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {getStatusBadge(userItem.is_active)}
                    <button
                      onClick={() => handleStatusChange(userItem.id, !userItem.is_active)}
                      className="saveButton"
                      style={{
                        background: userItem.is_active ? '#ef4444' : '#10b981',
                        fontSize: '11px',
                        padding: '4px 8px'
                      }}
                    >
                      {userItem.is_active ? 'Désactiver' : 'Activer'}
                    </button>
                  </div>
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    {utils.formatDate(userItem.created_at)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    #{userItem.id}
                  </div>
                </td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => setEditingUser(editingUser === userItem.id ? null : userItem.id)}
                      className="saveButton"
                      style={{
                        background: '#6b7280',
                        fontSize: '12px',
                        padding: '6px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      ✏️ {editingUser === userItem.id ? 'Fermer' : 'Modifier'}
                    </button>
                    
                    {editingUser === userItem.id && (
                      <div style={{
                        position: 'absolute',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '15px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        zIndex: 10,
                        minWidth: '200px'
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                          Actions pour {userItem.first_name}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button
                            className="saveButton"
                            style={{ background: '#3b82f6', fontSize: '12px' }}
                          >
                            👁️ Voir le profil
                          </button>
                          <button
                            className="saveButton"
                            style={{ background: '#8b5cf6', fontSize: '12px' }}
                          >
                            📈 Voir l'activité
                          </button>
                          <button
                            className="saveButton"
                            style={{ background: '#10b981', fontSize: '12px' }}
                          >
                            🔄 Réinitialiser mot de passe
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>👥</div>
          <h3 style={{ color: '#374151', marginBottom: '10px' }}>
            Aucun utilisateur trouvé
          </h3>
          <p style={{ color: '#6b7280' }}>
            Aucun utilisateur ne correspond aux critères de recherche.
          </p>
        </div>
      )}
    </>
  );
}
