import { UserProfile } from '../../../types/user';

interface UsersTableProps {
  users: UserProfile[];
}

export default function UsersTable({ users }: UsersTableProps) {
  return (
    <table className="min-w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-4 py-2">ID</th>
          <th className="border px-4 py-2">Nom</th>
          <th className="border px-4 py-2">Email</th>
          <th className="border px-4 py-2">Rôle</th>
          <th className="border px-4 py-2">Statut</th>
          <th className="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td className="border px-4 py-2">{u.id}</td>
            <td className="border px-4 py-2">{u.first_name} {u.last_name}</td>
            <td className="border px-4 py-2">{u.email}</td>
            <td className="border px-4 py-2">{u.role}</td>
            <td className="border px-4 py-2">{u.is_active ? 'Actif' : 'Inactif'}</td>
            <td className="border px-4 py-2">{/* Actions à venir */}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
