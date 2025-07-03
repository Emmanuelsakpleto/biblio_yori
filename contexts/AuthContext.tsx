"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types/user';
import { authService } from '../lib/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { 
    email: string; 
    password: string; 
    first_name: string; 
    last_name: string;
    phone?: string;
    department?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger l'utilisateur depuis le localStorage si présent
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        console.log('InitAuth - User dans localStorage:', storedUser);
        console.log('InitAuth - Token dans localStorage:', storedToken ? 'présent' : 'absent');
        
        if (storedUser && storedToken) {
          console.log('Utilisateur trouvé dans localStorage:', JSON.parse(storedUser));
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          
          // Vérifier si le token est toujours valide
          try {
            console.log('Vérification du token...');
            const profileResponse = await authService.profile();
            if (profileResponse.success && profileResponse.data) {
              console.log('Token valide, utilisateur:', profileResponse.data);
              setUser(profileResponse.data);
              localStorage.setItem('user', JSON.stringify(profileResponse.data));
            }
          } catch (error) {
            console.log('Token invalide, nettoyage du localStorage:', error);
            // Token invalide, nettoyer
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
            setToken(null);
          }
        } else {
          console.log('Aucun utilisateur trouvé dans localStorage');
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const isAuthenticated = !!(user && token);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      if (response.success && response.data) {
        // Gestion de l'ancienne et nouvelle structure de réponse
        const user = response.data.user;
        const token = response.data.tokens?.accessToken || response.data.token;
        
        if (token) {
          setUser(user);
          setToken(token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: { 
    email: string; 
    password: string; 
    first_name: string; 
    last_name: string;
    phone?: string;
    department?: string;
  }) => {
    try {
      const response = await authService.register(userData);
      if (response.success && response.data) {
        // Gestion de l'ancienne et nouvelle structure de réponse
        const user = response.data.user;
        const token = response.data.tokens?.accessToken || response.data.token;
        
        if (token) {
          setUser(user);
          setToken(token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Appeler l'API de déconnexion
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer l'état local
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await authService.profile();
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du profil:', error);
      // Si l'erreur est due à un token invalide, déconnecter
      if (error instanceof Error && error.message.includes('Session expirée')) {
        await logout();
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      isAuthenticated,
      login, 
      register,
      logout, 
      refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
  }
  return context;
};
