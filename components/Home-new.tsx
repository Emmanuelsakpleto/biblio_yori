'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  Star, 
  Users, 
  Award,
  Sparkles,
  ArrowRight,
  Grid,
  List,
  Eye,
  Heart,
  Plus
} from 'lucide-react';
import BookCard from './BookCard';
import Header from './Header';
import { bookService, utils, type Book } from '../lib/api';
import { useConfig } from '../contexts/ConfigContext';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

const Home = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const config = useConfig();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const searchFromUrl = searchParams?.get('search');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, [searchTerm, selectedCategory, currentPage]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page: currentPage,
        limit: config.ITEMS_PER_PAGE,
      };
      
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      
      if (selectedCategory) {
        params.category = selectedCategory;
      }

      const response = await bookService.getBooks(params);
      if (response.success && response.data) {
        setBooks(response.data.books);
        setTotalBooks(response.data.total || response.data.books.length);
      } else {
        setError(response.message || 'Erreur lors du chargement des livres');
        setBooks([]);
      }
    } catch (e: any) {
      setBooks([]);
      setError('Erreur lors du chargement des livres');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await bookService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalBooks / config.ITEMS_PER_PAGE);

  const getBookImageUrl = (book: Book) => {
    if (book.cover_image) {
      return utils.getImageUrl(book.cover_image);
    }
    return `https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&q=80`;
  };

  const statsCards = [
    {
      title: "Livres disponibles",
      value: totalBooks.toLocaleString(),
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50"
    },
    {
      title: "Catégories",
      value: categories.length.toString(),
      icon: Filter,
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50"
    },
    {
      title: "Mes emprunts",
      value: "3", // À connecter avec les vraies données
      icon: Clock,
      color: "from-orange-500 to-amber-500",
      bg: "bg-orange-50"
    },
    {
      title: "Favoris",
      value: "12", // À connecter avec les vraies données
      icon: Heart,
      color: "from-rose-500 to-pink-500",
      bg: "bg-rose-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <Header />
      
      {/* Texture de fond */}
      <div className="fixed inset-0 bg-pattern opacity-[0.015] pointer-events-none z-0"></div>
      
      <div className="relative z-10 pt-6">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-slate-900">Bonjour </span>
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {user?.first_name}
              </span>
              <span className="text-slate-900"> 👋</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Découvrez votre bibliothèque universitaire numérique. Explorez, empruntez et gérez vos ressources académiques avec une expérience moderne et intuitive.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-slate-600 text-sm font-medium">{stat.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Barre de recherche et filtres */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 p-8 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Recherche */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un livre, un auteur, un sujet..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50/80 border border-slate-200/60 rounded-2xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-300 shadow-sm focus:shadow-lg font-medium text-lg"
                />
              </div>
              
              {/* Filtres */}
              <div className="flex gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="px-6 py-4 bg-slate-50/80 border border-slate-200/60 rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-300 shadow-sm focus:shadow-lg font-medium min-w-[200px]"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                
                {/* Toggle vue */}
                <div className="flex items-center gap-2 bg-slate-100/80 rounded-2xl p-1.5 shadow-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-white shadow-md text-slate-900' 
                        : 'hover:bg-white/60 text-slate-600'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-white shadow-md text-slate-900' 
                        : 'hover:bg-white/60 text-slate-600'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Résumé des filtres */}
            {(searchTerm || selectedCategory) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 pt-6 border-t border-slate-200/60 flex items-center gap-4 text-slate-600"
              >
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">
                  {totalBooks} résultat{totalBooks !== 1 ? 's' : ''} trouvé{totalBooks !== 1 ? 's' : ''}
                  {searchTerm && ` pour "${searchTerm}"`}
                  {selectedCategory && ` dans "${selectedCategory}"`}
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
              />
            </div>
          ) : error ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
            >
              <p className="text-red-700 font-medium">{error}</p>
            </motion.div>
          ) : books.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-16 text-center border border-white/50"
            >
              <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Aucun livre trouvé</h3>
              <p className="text-slate-600 text-lg">
                Essayez de modifier vos critères de recherche ou explorez d'autres catégories.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`grid gap-6 mb-12 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}
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

          {/* Navigation rapide */}
          {!loading && !error && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-8 mb-12 border border-white/50"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                Accès rapide
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/books" className="group">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 border border-blue-100">
                    <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Catalogue complet</h4>
                    <p className="text-slate-600 mb-4">Explorez toute notre collection</p>
                    <div className="flex items-center text-blue-600 font-medium">
                      <span>Découvrir</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
                
                <Link href="/dashboard/loans" className="group">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 border border-emerald-100">
                    <Clock className="w-12 h-12 text-emerald-600 mb-4" />
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Mes emprunts</h4>
                    <p className="text-slate-600 mb-4">Gérez vos livres empruntés</p>
                    <div className="flex items-center text-emerald-600 font-medium">
                      <span>Voir</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
                
                <Link href="/dashboard/profile" className="group">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 border border-purple-100">
                    <Users className="w-12 h-12 text-purple-600 mb-4" />
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Mon profil</h4>
                    <p className="text-slate-600 mb-4">Paramètres et préférences</p>
                    <div className="flex items-center text-purple-600 font-medium">
                      <span>Accéder</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
