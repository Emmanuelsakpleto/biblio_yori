// Page de gestion des utilisateurs pour l'admin
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '../../../lib/api';
import UsersTable from './UsersTable';
import { useAuth } from '../../../contexts/AuthContext';
import { UserProfile } from '../../../types/user';


export default function UsersDashboardPage() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/dashboard');
      return;
    }
    if (user && user.role === 'admin') {
      adminService.getAllUsers()
        .then(res => setUsers(res.data?.users || []))
        .catch((err) => setError(err.message || 'Erreur lors du chargement'))
        .finally(() => setIsLoading(false));
    }
  }, [user, loading, router]);

  if (loading || isLoading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gestion des utilisateurs</h1>
      <UsersTable users={users} />
    </div>
  );
}
