/**
 * Service API centralisé pour YORI
 * Conforme aux spécifications du backend YORI
 */

import { UserProfile } from '../types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Fonction utilitaire pour construire les URLs des images
export const getImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null;
  
  // Si l'URL est déjà absolue, la retourner telle quelle
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Construire l'URL absolue
  return `${API_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

// Types pour les réponses API
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface LoginResponse {
  user: UserProfile;
  token?: string; // Ancienne structure
  tokens?: { // Nouvelle structure
    accessToken: string;
    refreshToken: string;
  };
  refreshToken?: string;
}

interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publication_year?: number;
  category?: string;
  description?: string;
  total_copies: number;
  available_copies: number;
  status: 'available' | 'borrowed' | 'reserved' | 'maintenance' | 'lost';
  cover_image?: string;
  language?: string;
  pages?: number;
  location?: string;
  created_at: string;
  updated_at: string;
}

interface Loan {
  id: number;
  user_id: number;
  book_id: number;
  loan_date: string;
  due_date: string;
  return_date?: string;
  status: 'pending' | 'active' | 'returned' | 'overdue' | 'reserved' | 'cancelled' | 'refused';
  renewals_count: number;
  late_fee?: number;
  notes?: string;
  book?: Book;
  user?: UserProfile;
  // Champs à plat pour compat backend
  title?: string;
  author?: string;
}

interface Notification {
  id: number;
  user_id: number;
  type:
    | 'loan_reminder'
    | 'overdue_notice'
    | 'reservation_ready'
    | 'book_returned'
    | 'account_created'
    | 'password_reset'
    | 'reservation_cancelled'
    | 'reservation_refused'
    | 'admin_reminder'
    | 'loan_validated'
    | 'loan_created'
    | 'loan_overdue'
    | 'loan_renewed';
  title: string;
  message: string;
  is_read: boolean;
  is_sent: boolean;
  related_loan_id?: number;
  related_book_id?: number;
  scheduled_for?: string;
  created_at: string;
  updated_at: string;
}

interface Review {
  id: number;
  user_id: number;
  book_id: number;
  rating: number;
  comment?: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user?: UserProfile;
  book?: Book;
}

// Utilitaire pour les requêtes authentifiées
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  // Construction des headers
  const headers: Record<string, string> = {};
  
  // Ajout du Content-Type seulement si ce n'est pas une FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  // Ajout du token d'authentification
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Fusion avec les headers personnalisés
  Object.assign(headers, options.headers);

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Token expiré ou invalide, nettoyer le localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Ne pas rediriger automatiquement, laisser les composants gérer la redirection
      throw new Error('Session expirée');
    }
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json();
};

// Services d'authentification
export const authService = {
  async login({ email, password }: { email: string; password: string }): Promise<ApiResponse<LoginResponse>> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  async register(data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
    student_id?: string;
    department?: string;
  }): Promise<ApiResponse<LoginResponse>> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async profile(): Promise<ApiResponse<UserProfile>> {
    return authenticatedFetch('/auth/profile');
  },

  async updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return authenticatedFetch('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async logout(): Promise<ApiResponse<void>> {
    return authenticatedFetch('/auth/logout', { method: 'POST' });
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<void>> {
    return authenticatedFetch('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async deleteAccount(): Promise<ApiResponse<void>> {
    return authenticatedFetch('/auth/delete-account', {
      method: 'DELETE'
    });
  },

  async uploadProfileImage(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('profile_image', file);
    
    return authenticatedFetch('/auth/profile-image', {
      method: 'POST',
      body: formData // Ne pas définir Content-Type, le navigateur le fera automatiquement avec boundary
    });
  },
};

// Services des livres
export const bookService = {
  async getBooks(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    author?: string;
  }): Promise<ApiResponse<{ books: Book[]; total: number; pagination: any }>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.author) queryParams.append('author', params.author);

    return authenticatedFetch(`/books?${queryParams.toString()}`);
  },

  async getBook(id: number): Promise<ApiResponse<Book>> {
    return authenticatedFetch(`/books/${id}`);
  },

  async searchBooks(query: string): Promise<ApiResponse<{ books: Book[] }>> {
    return authenticatedFetch(`/books/search?q=${encodeURIComponent(query)}`);
  },

  async getCategories(): Promise<ApiResponse<string[]>> {
    return authenticatedFetch('/books/categories');
  },

  async getAuthors(): Promise<ApiResponse<string[]>> {
    return authenticatedFetch('/books/authors');
  },

  // Services CRUD Admin
  async createBook(data: {
    title: string;
    author: string;
    isbn?: string;
    publisher?: string;
    publication_year?: number;
    category: string;
    description?: string;
    total_copies: number;
    available_copies?: number;
    language?: string;
    pages?: number;
    location?: string;
    tags?: string[];
  }, coverFile?: File | null, pdfFile?: File | null): Promise<ApiResponse<Book>> {
    const formData = new FormData();
    
    // Ajout des données du livre
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    
    // Ajout des fichiers si fournis
    if (coverFile) {
      formData.append('cover_image', coverFile);
    }
    if (pdfFile) {
      formData.append('pdf_file', pdfFile);
    }

    return authenticatedFetch('/books', {
      method: 'POST',
      body: formData
    });
  },

  async updateBook(id: number, data: {
    title?: string;
    author?: string;
    isbn?: string;
    publisher?: string;
    publication_year?: number;
    category?: string;
    description?: string;
    total_copies?: number;
    available_copies?: number;
    language?: string;
    pages?: number;
    location?: string;
    tags?: string[];
  }, coverFile?: File | null, pdfFile?: File | null): Promise<ApiResponse<Book>> {
    
    // Si on a des fichiers, utiliser FormData
    if (coverFile || pdfFile) {
      const formData = new FormData();
      
      // Ajout des données du livre
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      // Ajout des fichiers si fournis
      if (coverFile) {
        formData.append('cover_image', coverFile);
      }
      if (pdfFile) {
        formData.append('pdf_file', pdfFile);
      }

      return authenticatedFetch(`/books/${id}`, {
        method: 'PUT',
        body: formData
      });
    } else {
      // Sinon, utiliser JSON
      return authenticatedFetch(`/books/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    }
  },

  async deleteBook(id: number): Promise<ApiResponse<void>> {
    return authenticatedFetch(`/books/${id}`, {
      method: 'DELETE'
    });
  },

  async uploadBookCover(id: number, file: File): Promise<ApiResponse<{ cover_image: string }>> {
    const formData = new FormData();
    formData.append('cover_image', file);
    
    const token = localStorage.getItem('token');
    return fetch(`${API_URL}/books/${id}/cover`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData
    }).then(res => res.json());
  },

  async createBookWithFiles(data: {
    title: string;
    author: string;
    isbn?: string;
    publisher?: string;
    publication_year?: number;
    category: string;
    description?: string;
    total_copies: number;
    language?: string;
    pages?: number;
    location?: string;
  }, files?: {
    cover_image?: File;
    pdf_file?: File;
  }): Promise<ApiResponse<Book>> {
    const formData = new FormData();
    
    // Ajouter les données du livre
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
    // Ajouter les fichiers si présents
    if (files?.cover_image) {
      formData.append('cover_image', files.cover_image);
    }
    if (files?.pdf_file) {
      formData.append('pdf_file', files.pdf_file);
    }
    
    const token = localStorage.getItem('token');
    return fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData
    }).then(res => res.json());
  },

  async updateBookWithFiles(id: number, data: {
    title?: string;
    author?: string;
    isbn?: string;
    publisher?: string;
    publication_year?: number;
    category?: string;
    description?: string;
    total_copies?: number;
    language?: string;
    pages?: number;
    location?: string;
  }, files?: {
    cover_image?: File;
    pdf_file?: File;
  }): Promise<ApiResponse<Book>> {
    const formData = new FormData();
    
    // Ajouter les données du livre
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
    // Ajouter les fichiers si présents
    if (files?.cover_image) {
      formData.append('cover_image', files.cover_image);
    }
    if (files?.pdf_file) {
      formData.append('pdf_file', files.pdf_file);
    }
    
    const token = localStorage.getItem('token');
    return fetch(`${API_URL}/books/${id}`, {
      method: 'PUT',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData
    }).then(res => res.json());
  }
};

// Services des emprunts
export const loanService = {
  async getMyLoans(): Promise<ApiResponse<Loan[]>> {
    return authenticatedFetch('/loans/me');
  },

  async getAllLoans(params?: { status?: string, user_id?: number, page?: number, limit?: number }): Promise<ApiResponse<{ loans: Loan[], pagination: any }>> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.user_id) query.append('user_id', params.user_id.toString());
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    return authenticatedFetch(`/loans?${query.toString()}`);
  },

  async createLoan(bookId: number): Promise<ApiResponse<Loan>> {
    return authenticatedFetch('/loans', {
      method: 'POST',
      body: JSON.stringify({ book_id: bookId })
    });
  },

  async returnLoan(loanId: number): Promise<ApiResponse<Loan>> {
    return authenticatedFetch(`/loans/${loanId}/return`, {
      method: 'PATCH'
    });
  },

  async validateLoan(loanId: number): Promise<ApiResponse<Loan>> {
    return authenticatedFetch(`/loans/${loanId}/validate`, {
      method: 'PATCH'
    });
  },

  async markAsOverdue(loanId: number): Promise<ApiResponse<Loan>> {
    return authenticatedFetch(`/loans/${loanId}/overdue`, {
      method: 'PATCH'
    });
  },

  async extendLoan(loanId: number): Promise<ApiResponse<Loan>> {
    return authenticatedFetch(`/loans/${loanId}/extend`, {
      method: 'PUT'
    });
  },

  async getLoanHistory(): Promise<ApiResponse<Loan[]>> {
    return authenticatedFetch('/loans/history');
  },

  async cancelLoan(loanId: number): Promise<ApiResponse<Loan>> {
    return authenticatedFetch(`/loans/${loanId}/cancel`, {
      method: 'PATCH'
    });
  },

  async refuseLoan(loanId: number): Promise<ApiResponse<Loan>> {
    return authenticatedFetch(`/loans/${loanId}/refuse`, {
      method: 'PATCH'
    });
  },

  async sendReminder(loanId: number): Promise<ApiResponse<void>> {
    return authenticatedFetch(`/loans/${loanId}/reminder`, {
      method: 'POST'
    });
  }
};

// Services des notifications
export const notificationService = {
  async getMyNotifications(): Promise<ApiResponse<Notification[]>> {
    return authenticatedFetch('/notifications/me');
  },

  async markAsRead(notificationId: number): Promise<ApiResponse<void>> {
    return authenticatedFetch(`/notifications/${notificationId}/read`, {
      method: 'PATCH'
    });
  },

  async markAllAsRead(): Promise<ApiResponse<void>> {
    return authenticatedFetch('/notifications/mark-all-read', {
      method: 'PUT'
    });
  },

  // Suppression désactivée côté backend, méthode retirée.
};

// Services des avis
export const reviewService = {
  async getReviews(): Promise<ApiResponse<Review[]>> {
    return authenticatedFetch('/reviews');
  },

  async getBookReviews(bookId: number): Promise<ApiResponse<Review[]>> {
    return authenticatedFetch(`/reviews/book/${bookId}`);
  },

  async createReview(data: {
    book_id: number;
    rating: number;
    comment?: string;
  }): Promise<ApiResponse<Review>> {
    return authenticatedFetch('/reviews', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateReview(reviewId: number, data: {
    rating: number;
    comment?: string;
  }): Promise<ApiResponse<Review>> {
    return authenticatedFetch(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteReview(reviewId: number): Promise<ApiResponse<void>> {
    return authenticatedFetch(`/reviews/${reviewId}`, {
      method: 'DELETE'
    });
  }
};

// Services pour les statistiques admin
export const adminService = {
  async getDashboard(): Promise<ApiResponse<{
    totalUsers: number;
    totalBooks: number;
    activeLoans: number;
    overdueLoans: number;
    pendingReturns: number;
    newUsersThisWeek: number;
    availableBooks: number;
    totalReviews: number;
    averageRating: number;
    unreadNotifications: number;
  }>> {
    return authenticatedFetch('/admin/dashboard');
  },

  async getSystemStats(): Promise<ApiResponse<{
    active_users: number;
    admin_users: number;
    available_books: number;
    total_books: number;
    active_loans: number;
    overdue_loans: number;
    total_loans: number;
    total_reviews: number;
    average_rating: number;
    unread_notifications: number;
  }>> {
    return authenticatedFetch('/admin/stats/system');
  },

  async getStatsByPeriod(period: 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<any>> {
    return authenticatedFetch(`/admin/stats/period?period=${period}`);
  },

  async getRecentActivities(limit: number = 10): Promise<ApiResponse<any[]>> {
    return authenticatedFetch(`/admin/activities/recent?limit=${limit}`);
  },

  async getMonthlyReport(): Promise<ApiResponse<any>> {
    return authenticatedFetch('/admin/reports/monthly');
  },

  async getAllUsers(filters?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    sort_by?: string;
    sort_order?: string;
  }): Promise<ApiResponse<{
    users: UserProfile[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const query = params.toString();
    return authenticatedFetch(`/admin/users${query ? `?${query}` : ''}`);
  }
};

// Utilitaires
export const utils = {
  getImageUrl: (imagePath?: string) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${baseUrl}${imagePath}`;
  },

  formatDate: (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  },

  isOverdue: (dueDate: string) => {
    return new Date(dueDate) < new Date();
  },

  getDaysUntilDue: (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
};

// Export des types
export type { 
  UserProfile, 
  Book, 
  Loan, 
  Notification, 
  Review, 
  ApiResponse,
  LoginResponse 
};
