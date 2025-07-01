"use client";

import { useState } from "react";
import { Search, UserPlus, Pencil, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Types
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'client' | 'delivery';
  status: 'active' | 'inactive';
  registrationDate: string;
  orders?: number;
}

export default function CustomersPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "USR-001",
      name: "Jean Dupont",
      email: "jean.dupont@example.com",
      phone: "+225 0101010101",
      role: "admin",
      status: "active",
      registrationDate: "2023-01-15",
      orders: 12,
    },
    {
      id: "USR-002",
      name: "Marie Konan",
      email: "marie.konan@example.com",
      phone: "+225 0707070707",
      role: "client",
      status: "active",
      registrationDate: "2023-02-20",
      orders: 8,
    },
    {
      id: "USR-003",
      name: "Sophie Laurent",
      email: "sophie.laurent@example.com",
      phone: "+225 0505050505",
      role: "client",
      status: "inactive",
      registrationDate: "2023-03-05",
      orders: 3,
    },
    {
      id: "USR-004",
      name: "Karim Ouattara",
      email: "karim.ouattara@example.com",
      phone: "+225 0202020202",
      role: "delivery",
      status: "active",
      registrationDate: "2023-03-18",
    },
  ]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const getRoleBadgeClass = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'client': return 'bg-blue-100 text-blue-800';
      case 'delivery': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusBadgeClass = (status: User['status']) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };
  
  const getRoleLabel = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'client': return 'Client';
      case 'delivery': return 'Livreur';
      default: return role;
    }
  };
  
  const getStatusLabel = (status: User['status']) => {
    return status === 'active' ? 'Actif' : 'Inactif';
  };
  
  const filteredUsers = users.filter(user => {
    // Apply role filter
    if (roleFilter !== 'all' && user.role !== roleFilter) return false;
    
    // Apply status filter
    if (statusFilter !== 'all' && user.status !== statusFilter) return false;
    
    // Apply search filter
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.phone.includes(searchQuery)
    );
  });

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
          <p className="text-gray-500">Gérer les clients, administrateurs et livreurs</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Ajouter un utilisateur
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher des utilisateurs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            className="form-select rounded-md border border-gray-300 py-1.5 pl-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Tous les rôles</option>
            <option value="admin">Administrateurs</option>
            <option value="client">Clients</option>
            <option value="delivery">Livreurs</option>
          </select>
          <select
            className="form-select rounded-md border border-gray-300 py-1.5 pl-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} trouvé{filteredUsers.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3">Utilisateur</th>
                  <th className="px-4 py-3">Rôle</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Date d'inscription</th>
                  <th className="px-4 py-3">Commandes</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{user.phone}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(user.status)}`}>
                        {getStatusLabel(user.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {user.registrationDate}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {user.orders ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun utilisateur ne correspond aux critères de recherche.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
