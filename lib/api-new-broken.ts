// API Service moderne et propre pour YORI
// Startup 2025 style - Simple, efficace, moderne

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types TypeScript
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'librarian' | 'student';
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

// Utilitaire pour les requêtes API
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Ajouter le token si disponible (côté client uniquement)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('yori_token');
      if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      console.log('🚀 API Request:', { method: config.method || 'GET', url });
      
      const response = await fetch(url, config);
      const data = await response.json();

      console.log('📡 API Response:', { 
        status: response.status, 
        success: data.success, 
        message: data.message 
      });

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  // Méthodes HTTP
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Instance de l'API client
const apiClient = new ApiClient(API_BASE_URL);

// Services d'authentification
export const authService = {
  async login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    const response = await apiClient.post<{ user: User; token: string }>('/auth/login', credentials);
    
    if (response.success && response.data && typeof window !== 'undefined') {
      // Stocker le token (côté client uniquement)
      localStorage.setItem('yori_token', response.data.token);
      localStorage.setItem('yori_user', JSON.stringify(response.data.user));
    }
    
    return response as LoginResponse;
  },

  async register(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role?: string;
  }): Promise<LoginResponse> {
    const response = await apiClient.post<{ user: User; token: string }>('/auth/register', userData);
    
    if (response.success && response.data && typeof window !== 'undefined') {
      // Stocker le token (côté client uniquement)
      localStorage.setItem('yori_token', response.data.token);
      localStorage.setItem('yori_user', JSON.stringify(response.data.user));
    }
    
    return response as LoginResponse;
  },

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('yori_token');
      localStorage.removeItem('yori_user');
    }
  },

  async getCurrentUser(): Promise<User | null> {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('yori_user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  async verifyToken(): Promise<{ user: User; valid: boolean } | null> {
    try {
      const response = await apiClient.get<{ user: User; valid: boolean }>('/auth/verify');
      return response.data || null;
    } catch (error) {
      this.logout(); // Nettoyer si le token est invalide
      return null;
    }
  },

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('yori_token');
    }
    return false;
  }
};

export default apiClient;
