'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SortAsc, 
  BookOpen, 
  Users, 
  Calendar,
  Tag,
  X,
  ChevronDown
} from 'lucide-react';
import { bookService } from '../../lib/api';
import BookCard from '../../components/BookCard';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

interface Book {
  id: number;
  title: string;
  author: string;
  cover_image?: string;
  category?: string;
  available_copies: number;
  total_copies?: number;
  status?: string;
  description?: string;
  rating?: number;
  reviews_count?: number;
  publication_year?: number;
}

interface SearchFilters {
  search: string;
  category: string;
  author: string;
  sortBy: 'title' | 'author' | 'publication_year' | 'rating';
  sortOrder: 'asc' | 'desc';
  availableOnly: boolean;
}

const CATEGORIES = [
  'Fiction', 'Science-Fiction', 'Romance', 'Mystère', 'Thriller',
  'Fantasy', 'Histoire', 'Biographie', 'Science', 'Philosophie',
  'Art', 'Cuisine', 'Voyage', 'Santé', 'Business'
];

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  
  const [filters, setFilters] = useState<SearchFilters>({
    search: searchParams?.get('q') || '',
    category: '',
    author: '',
    sortBy: 'title',
    sortOrder: 'asc',
    availableOnly: false
  });

  // Recherche avec debounce
  const debouncedSearch = useMemo(() => {
    const timer = setTimeout(() => {
      if (filters.search || filters.category || filters.author) {
        performSearch();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    return debouncedSearch;
  }, [debouncedSearch]);

  useEffect(() => {
    // Charger la recherche initiale si il y a des paramètres
    const initialQuery = searchParams?.get('q');
    if (initialQuery) {
      performSearch();
    }
  }, []);

  const performSearch = async () => {
    setLoading(true);
    try {
      const response = await bookService.searchBooks({
        search: filters.search,
        category: filters.category,
        author: filters.author,
        available_only: filters.availableOnly,
        sort_by: filters.sortBy,
        sort_order: filters.sortOrder.toUpperCase(),
        page: 1,
        limit: 50
      });

      if (response.success && response.data) {
        setBooks(response.data.books || []);
        setTotalResults(response.data.total || 0);
      } else {
        setBooks([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setBooks([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Mettre à jour l'URL pour la recherche
    if (key === 'search' && value) {
      const params = new URLSearchParams(window.location.search);
      params.set('q', value);
      router.replace(`/search?${params.toString()}`);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      author: '',
      sortBy: 'title',
      sortOrder: 'asc',
      availableOnly: false
    });
    router.replace('/search');
  };

  const activeFiltersCount = [
    filters.category,
    filters.author,
    filters.availableOnly
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête de recherche */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Recherche de livres
            </h1>
            <p className="text-slate-600 text-lg">
              Découvrez votre prochaine lecture parmi notre collection
            </p>
          </motion.div>

          {/* Barre de recherche principale */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-2xl mx-auto mb-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par titre, auteur, ISBN..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          </motion.div>

          {/* Contrôles de vue et filtres */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtres
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
              
              {activeFiltersCount > 0 && (
                <Button variant="ghost" onClick={clearFilters} size="sm">
                  <X className="w-4 h-4 mr-1" />
                  Effacer
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">
                {totalResults} résultat{totalResults > 1 ? 's' : ''}
              </span>
              
              <div className="flex items-center border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Panneau de filtres */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-6 mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Tag className="w-4 h-4 inline mr-1" />
                    Catégorie
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Toutes les catégories</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Auteur */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Auteur
                  </label>
                  <input
                    type="text"
                    placeholder="Nom de l'auteur"
                    value={filters.author}
                    onChange={(e) => updateFilter('author', e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tri */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <SortAsc className="w-4 h-4 inline mr-1" />
                    Trier par
                  </label>
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-');
                      updateFilter('sortBy', sortBy);
                      updateFilter('sortOrder', sortOrder);
                    }}
                    className="w-full p-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="title-asc">Titre (A-Z)</option>
                    <option value="title-desc">Titre (Z-A)</option>
                    <option value="author-asc">Auteur (A-Z)</option>
                    <option value="author-desc">Auteur (Z-A)</option>
                    <option value="publication_year-desc">Plus récent</option>
                    <option value="publication_year-asc">Plus ancien</option>
                    <option value="rating-desc">Mieux noté</option>
                  </select>
                </div>

                {/* Disponibilité */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <BookOpen className="w-4 h-4 inline mr-1" />
                    Disponibilité
                  </label>
                  <label className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg bg-white cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={filters.availableOnly}
                      onChange={(e) => updateFilter('availableOnly', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span>Disponibles uniquement</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Résultats */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-slate-600">Recherche en cours...</span>
              </div>
            </div>
          )}

          {books.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                Aucun livre trouvé
              </h3>
              <p className="text-slate-500">
                Essayez de modifier vos critères de recherche
              </p>
            </motion.div>
          )}

          {books.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }
            >
              {books.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <BookCard book={book} viewMode={viewMode} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
