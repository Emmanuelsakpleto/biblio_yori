/**
 * Service API centralisé pour YORI
 * Conforme aux spécifications du backend YORI
 */

import { UserProfile } from '../types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Types pour les réponses API
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface LoginResponse {
  user: UserProfile;
  token: string;
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
  status: 'active' | 'returned' | 'overdue' | 'reserved';
  renewals_count: number;
  late_fee?: number;
  notes?: string;
  book?: Book;
  user?: UserProfile;
}

interface Notification {
  id: number;
  user_id: number;
  type: 'loan_reminder' | 'overdue_notice' | 'reservation_ready' | 'book_returned' | 'account_created' | 'password_reset';
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
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expiré, rediriger vers la connexion
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
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
  }
};

// Services des emprunts
export const loanService = {
  async getMyLoans(): Promise<ApiResponse<Loan[]>> {
    return authenticatedFetch('/loans/me');
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

  async extendLoan(loanId: number): Promise<ApiResponse<Loan>> {
    return authenticatedFetch(`/loans/${loanId}/extend`, {
      method: 'PUT'
    });
  },

  async getLoanHistory(): Promise<ApiResponse<Loan[]>> {
    return authenticatedFetch('/loans/history');
  }
};

// Services des notifications
export const notificationService = {
  async getMyNotifications(): Promise<ApiResponse<Notification[]>> {
    return authenticatedFetch('/notifications/me');
  },

  async markAsRead(notificationId: number): Promise<ApiResponse<void>> {
    return authenticatedFetch(`/notifications/${notificationId}/read`, {
      method: 'PUT'
    });
  },

  async markAllAsRead(): Promise<ApiResponse<void>> {
    return authenticatedFetch('/notifications/mark-all-read', {
      method: 'PUT'
    });
  },

  async deleteNotification(notificationId: number): Promise<ApiResponse<void>> {
    return authenticatedFetch(`/notifications/${notificationId}`, {
      method: 'DELETE'
    });
  }
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
