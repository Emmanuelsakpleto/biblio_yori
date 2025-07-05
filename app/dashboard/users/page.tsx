// Page de gestion des utilisateurs pour l'admin
"use client";
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '../../../lib/api';
import UsersTable from './UsersTable';
import { useAuth } from '../../../contexts/AuthContext';
import { UserProfile } from '../../../types/user';
import ProtectedRoute from '../../../components/ProtectedRoute';

// Types pour les filtres
interface UserFilters {
  role: 'all' | 'admin' | 'student' | 'librarian';
  status: 'all' | 'active' | 'inactive';
  search: string;
}

export default function UsersDashboardPage() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>({
    role: 'all',
    status: 'all',
    search: ''
  });
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/dashboard');
      return;
    }
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [user, loading, router]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminService.getAllUsers();
      if (response.success && response.data?.users) {
        setUsers(response.data.users);
      } else {
        setError('Erreur lors du chargement des utilisateurs');
        setUsers([]);
      }
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrage des utilisateurs
  const filteredUsers = useMemo(() => {
    return users.filter(userItem => {
      // Filtre par rôle
      if (filters.role !== 'all' && userItem.role !== filters.role) return false;
      
      // Filtre par statut
      if (filters.status === 'active' && !userItem.is_active) return false;
      if (filters.status === 'inactive' && userItem.is_active) return false;
      
      // Filtre par recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const fullName = `${userItem.first_name} ${userItem.last_name}`.toLowerCase();
        const email = userItem.email.toLowerCase();
        const studentId = userItem.student_id?.toLowerCase() || '';
        
        if (!fullName.includes(searchLower) && 
            !email.includes(searchLower) && 
            !studentId.includes(searchLower)) return false;
      }
      
      return true;
    });
  }, [users, filters]);

  // Statistiques
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter(u => u.is_active).length;
    const inactive = total - active;
    const byRole = users.reduce((acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { 
      total, 
      active, 
      inactive, 
      admins: byRole.admin || 0,
      students: byRole.student || 0,
      librarians: byRole.librarian || 0
    };
  }, [users]);

  const handleUserUpdate = async (userId: number, updates: Partial<UserProfile>) => {
    try {
      // Ici vous devrez implémenter la logique de mise à jour via votre API
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, ...updates } : u
      ));
      
      setShowSuccess('Utilisateur mis à jour avec succès');
      setTimeout(() => setShowSuccess(null), 3000);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const resetFilters = () => {
    setFilters({
      role: 'all',
      status: 'all',
      search: ''
    });
  };

  if (loading || isLoading) {
    return (
      <ProtectedRoute>
        <main className="bookContainer">
          <aside>
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>⟳</div>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>Chargement des utilisateurs...</div>
              <div style={{ color: '#666', fontSize: '14px' }}>Veuillez patienter</div>
            </div>
          </aside>
        </main>
      </ProtectedRoute>
    );
  }

  if (error) {
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
                onClick={fetchUsers}
                className="saveButton"
                style={{ background: '#ef4444' }}
              >
                Réessayer
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
          {/* Message de succès */}
          {showSuccess && (
            <div style={{
              background: '#dcfce7',
              border: '1px solid #10b981',
              color: '#065f46',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>✅</span>
              <span>{showSuccess}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="center" style={{ margin: 0 }}>
              Gestion des utilisateurs
              {filteredUsers.length !== users.length && (
                <span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>
                  {' '}({filteredUsers.length}/{users.length})
                </span>
              )}
            </h2>
            <button 
              onClick={fetchUsers}
              className="saveButton"
              style={{ background: '#6b7280', fontSize: '14px', padding: '8px 16px' }}
              disabled={isLoading}
            >
              {isLoading ? '⟳' : '🔄'} Actualiser
            </button>
          </div>

          {/* Statistiques */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '15px',
            marginBottom: '25px'
          }}>
            <div style={{
              background: '#f8fafc',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>
                {stats.total}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Total</div>
            </div>
            <div style={{
              background: '#ecfdf5',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #10b981',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                {stats.active}
              </div>
              <div style={{ fontSize: '12px', color: '#065f46' }}>Actifs</div>
            </div>
            <div style={{
              background: '#fef2f2',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #ef4444',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                {stats.inactive}
              </div>
              <div style={{ fontSize: '12px', color: '#991b1b' }}>Inactifs</div>
            </div>
            <div style={{
              background: '#f0f9ff',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #0ea5e9',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0ea5e9' }}>
                {stats.students}
              </div>
              <div style={{ fontSize: '12px', color: '#0369a1' }}>Étudiants</div>
            </div>
            <div style={{
              background: '#fefce8',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #eab308',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#eab308' }}>
                {stats.admins}
              </div>
              <div style={{ fontSize: '12px', color: '#a16207' }}>Admins</div>
            </div>
            <div style={{
              background: '#f3e8ff',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #a855f7',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#a855f7' }}>
                {stats.librarians}
              </div>
              <div style={{ fontSize: '12px', color: '#7c2d12' }}>Bibliothécaires</div>
            </div>
          </div>

          {/* Filtres */}
          <div style={{
            background: '#f8fafc',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            marginBottom: '25px'
          }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Rôle :</label>
                <select
                  value={filters.role}
                  onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value as any }))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px'
                  }}
                >
                  <option value="all">Tous</option>
                  <option value="admin">Administrateurs</option>
                  <option value="student">Étudiants</option>
                  <option value="librarian">Bibliothécaires</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Statut :</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px'
                  }}
                >
                  <option value="all">Tous</option>
                  <option value="active">Actifs</option>
                  <option value="inactive">Inactifs</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Recherche :</label>
                <input
                  type="text"
                  placeholder="Nom, email ou ID étudiant..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    flex: 1,
                    maxWidth: '300px'
                  }}
                />
              </div>

              <button
                onClick={resetFilters}
                className="saveButton"
                style={{
                  background: '#6b7280',
                  padding: '6px 12px',
                  fontSize: '14px'
                }}
              >
                Réinitialiser
              </button>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>
                {users.length === 0 ? '👥' : '🔍'}
              </div>
              <h3 style={{ color: '#374151', marginBottom: '10px' }}>
                {users.length === 0 ? 'Aucun utilisateur' : 'Aucun utilisateur trouvé'}
              </h3>
              <p style={{ color: '#6b7280' }}>
                {users.length === 0 
                  ? 'Aucun utilisateur n\'est enregistré dans le système.'
                  : 'Essayez de modifier vos critères de recherche.'
                }
              </p>
              {users.length > 0 && (
                <button
                  onClick={resetFilters}
                  className="saveButton"
                  style={{ background: '#6b7280', marginTop: '15px' }}
                >
                  Voir tous les utilisateurs
                </button>
              )}
            </div>
          ) : (
            <UsersTable 
              users={filteredUsers} 
              onUserUpdate={handleUserUpdate}
            />
          )}
        </aside>
      </main>
    </ProtectedRoute>
  );
}
