'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  Users,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Home
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { bookService, type Book } from '../../../lib/api';
import Link from 'next/link';

interface BooksManagementPageProps {}

const BooksManagementPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  // Vérifier si l'utilisateur est admin ou librarian
  const isAuthorized = user?.role === 'admin' || user?.role === 'librarian';

  useEffect(() => {
    if (isAuthorized) {
      fetchBooks();
      fetchCategories();
    }
  }, [isAuthorized, currentPage, searchTerm, selectedCategory]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBooks({
        page: currentPage,
        limit: 20,
        search: searchTerm,
        category: selectedCategory === 'all' ? undefined : selectedCategory
      });
      
      if (response.success && response.data) {
        setBooks(response.data.books);
        setTotalPages(Math.ceil(response.data.total / 20));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des livres:', error);
      setMessage({ text: 'Erreur lors du chargement des livres', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await bookService.getCategories();
      if (response.success && response.data) {
        // Extraire juste les noms des catégories depuis les objets
        const categoryNames = response.data.map((cat: any) => cat.category);
        setCategories(categoryNames);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const handleDeleteBook = async (bookId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) return;
    
    try {
      const response = await bookService.deleteBook(bookId);
      if (response.success) {
        setMessage({ text: 'Livre supprimé avec succès', type: 'success' });
        fetchBooks(); // Recharger la liste
      } else {
        setMessage({ text: response.message || 'Erreur lors de la suppression', type: 'error' });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setMessage({ text: 'Erreur lors de la suppression du livre', type: 'error' });
    }
  };

  // Si l'utilisateur n'est pas autorisé, afficher un message d'erreur
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-main)] via-[var(--color-bg-alt)] to-[var(--color-bg-main)] flex items-center justify-center">
        <div className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Accès non autorisé</h1>
          <p className="text-gray-600 mb-6">Cette section est réservée aux administrateurs et bibliothécaires.</p>
          <Link 
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-main)] via-[var(--color-bg-alt)] to-[var(--color-bg-main)]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              {/* Bouton retour à l'accueil */}
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/20 rounded-xl transition-all duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <Home className="w-4 h-4" />
                <span className="font-medium">Accueil</span>
              </Link>
              
              <div className="h-6 w-px bg-[var(--color-text-secondary)]/30"></div>
              
              <div>
                <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-2">
                  Gestion des Livres
                </h1>
                <p className="text-[var(--color-text-secondary)]">
                  Administration de la collection de la bibliothèque
                </p>
              </div>
            </div>
            <Link 
              href="/dashboard/books/add"
              className="glass-effect-strong px-6 py-3 rounded-xl text-white font-semibold 
                       bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)]
                       hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ajouter un livre
            </Link>
          </div>

          {/* Filtres et recherche */}
          <div className="glass-effect-strong rounded-2xl p-6 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un livre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/20 
                           bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 
                           focus:ring-[var(--color-accent-primary)] text-[var(--color-text-primary)]"
                />
              </div>

              {/* Filtre par catégorie */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/20 
                           bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 
                           focus:ring-[var(--color-accent-primary)] text-[var(--color-text-primary)]"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
            <button 
              onClick={() => setMessage(null)}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </motion.div>
        )}

        {/* Liste des livres */}
        <div className="glass-effect-strong rounded-2xl border border-white/20 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-[var(--color-accent-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[var(--color-text-secondary)]">Chargement des livres...</p>
            </div>
          ) : books.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                Aucun livre trouvé
              </h3>
              <p className="text-[var(--color-text-secondary)] mb-6">
                Aucun livre ne correspond à vos critères de recherche.
              </p>
              <Link 
                href="/dashboard/books/add"
                className="inline-flex items-center px-4 py-2 bg-[var(--color-accent-primary)] 
                         text-white rounded-lg hover:bg-[var(--color-hover-primary)] transition-colors gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter le premier livre
              </Link>
            </div>
          ) : (
            <>
              {/* En-tête du tableau */}
              <div className="grid grid-cols-12 gap-4 p-4 bg-white/10 backdrop-blur-sm border-b border-white/20 font-semibold text-[var(--color-text-primary)]">
                <div className="col-span-3">Titre</div>
                <div className="col-span-2">Auteur</div>
                <div className="col-span-2">Catégorie</div>
                <div className="col-span-1">Copies</div>
                <div className="col-span-1">Disponibles</div>
                <div className="col-span-1">Statut</div>
                <div className="col-span-2">Actions</div>
              </div>

              {/* Lignes des livres */}
              {books.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 
                           hover:bg-white/5 transition-colors"
                >
                  <div className="col-span-3">
                    <div className="font-semibold text-[var(--color-text-primary)] truncate">
                      {book.title}
                    </div>
                    {book.isbn && (
                      <div className="text-sm text-[var(--color-text-secondary)]">
                        ISBN: {book.isbn}
                      </div>
                    )}
                  </div>
                  <div className="col-span-2 text-[var(--color-text-primary)]">
                    {book.author}
                  </div>
                  <div className="col-span-2">
                    <span className="px-2 py-1 bg-[var(--color-accent-primary)]/20 
                                   text-[var(--color-accent-primary)] rounded-lg text-sm">
                      {book.category}
                    </span>
                  </div>
                  <div className="col-span-1 text-[var(--color-text-primary)]">
                    {book.total_copies}
                  </div>
                  <div className="col-span-1 text-[var(--color-text-primary)]">
                    {book.available_copies}
                  </div>
                  <div className="col-span-1">
                    <span className={`px-2 py-1 rounded-lg text-sm ${
                      book.status === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {book.status === 'available' ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <Link 
                      href={`/book/${book.id}`}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                               transition-colors"
                      title="Voir les détails"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link 
                      href={`/dashboard/books/${book.id}/edit`}
                      className="p-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 
                               transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleDeleteBook(book.id)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                               transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-[var(--color-accent-primary)] text-white'
                      : 'bg-white/20 text-[var(--color-text-primary)] hover:bg-white/30'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksManagementPage;
