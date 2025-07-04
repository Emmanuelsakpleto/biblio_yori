"use client";

import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

export default function TestAuth() {
  const { user, login, logout, loading } = useAuth();
  const [email, setEmail] = useState('admin@lectura.com');
  const [password, setPassword] = useState('admin123');

  const handleTestLogin = async () => {
    try {
      await login(email, password);
      console.log('Login réussi');
      // Vérifier le localStorage après login
      const storedUser = localStorage.getItem('user');
      console.log('Structure dans localStorage après login:', JSON.parse(storedUser || '{}'));
    } catch (error) {
      console.error('Erreur login:', error);
    }
  };

  const checkLocalStorage = () => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    console.log('=== ÉTAT LOCALSTORAGE ===');
    console.log('User:', storedUser ? JSON.parse(storedUser) : 'null');
    console.log('Token:', storedToken ? 'présent' : 'absent');
    console.log('========================');
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Test Authentification</h1>
      
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">État actuel</h2>
        <p>Utilisateur connecté: {user ? `${user.first_name} ${user.last_name} (${user.role})` : 'Non connecté'}</p>
        <p>Rôle: {user?.role}</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Test Login</h2>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          placeholder="Email"
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded ml-2"
          placeholder="Mot de passe"
        />
        <button 
          onClick={handleTestLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
        >
          Test Login
        </button>
      </div>

      <div className="space-y-2">
        <button 
          onClick={checkLocalStorage}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Vérifier localStorage
        </button>
        
        <button 
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded ml-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
