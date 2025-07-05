"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Star,
  Heart,
  Eye,
  Search,
  Sparkles,
  Library,
  Users,
  Grid,
  List,
  Calendar,
  TrendingUp,
  Award,
  ArrowLeft,
  Home,
  Tag,
  User as UserIcon,
  Plus
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import BookCard from '../../components/BookCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '../../lib/utils';
import { bookService, loanService } from '../../lib/api';
import type { Book } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import Toast from '@/components/Toast';

interface Category {
  name: string;
  icon: React.ElementType;
  count: number;
  color: string;
}

export default function BooksPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'librarian';
  
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [borrowingBooks, setBorrowingBooks] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [totalBooks, setTotalBooks] = useState(0);

  // Charger les livres
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await bookService.getBooks({ limit: 100 }); // Augmenter la limite pour récupérer tous les livres
        
        if (response?.success && response.data?.books) {
          setBooks(response.data.books);
          setFilteredBooks(response.data.books);
          
          // Sauvegarder le total réel depuis la pagination
          if (response.data.pagination?.total) {
            setTotalBooks(response.data.pagination.total);
          }
          
          // Générer les catégories avec compteurs
          const categoryMap = new Map();
          response.data.books.forEach(book => {
            if (book.category) {
              categoryMap.set(book.category, (categoryMap.get(book.category) || 0) + 1);
            }
          });
          
          const categoryIcons = [Library, BookOpen, Sparkles, Users, Tag, UserIcon];
          const categoryColors = [
            "from-blue-500 to-cyan-500",
            "from-emerald-500 to-teal-500", 
            "from-purple-500 to-pink-500",
            "from-orange-500 to-red-500",
            "from-indigo-500 to-blue-500",
            "from-green-500 to-emerald-500"
          ];
          
          const categoriesData = Array.from(categoryMap.entries()).map(([name, count], index) => ({
            name,
            count,
            icon: categoryIcons[index % categoryIcons.length],
            color: categoryColors[index % categoryColors.length]
          }));
          
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des livres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filtrage des livres
  useEffect(() => {
    let filtered = books;

    if (searchTerm) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    setFilteredBooks(filtered);
  }, [searchTerm, selectedCategory, books]);

  const handleBorrow = async (book: Book) => {
    if (!book || !book.id || borrowingBooks.has(book.id)) return;

    try {
      setBorrowingBooks(prev => {
        const newSet = new Set(prev);
        newSet.add(book.id);
        return newSet;
      });
      
      const response = await loanService.createLoan(book.id);
      
      if (response.success) {
        // Mettre à jour le livre dans la liste
        setBooks(prevBooks => 
          prevBooks.map(b => 
            b.id === book.id 
              ? { ...b, available_copies: b.available_copies - 1 }
              : b
          )
        );
        setFilteredBooks(prevBooks => 
          prevBooks.map(b => 
            b.id === book.id 
              ? { ...b, available_copies: b.available_copies - 1 }
              : b
          )
        );
        
        setToast({
          message: `📚 "${book.title}" emprunté avec succès!`,
          type: 'success'
        });
      } else {
        throw new Error(response.message || 'Erreur lors de l\'emprunt');
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'emprunt:', error);
      
      // Messages d'erreur spécifiques
      let errorMessage = '❌ Erreur lors de l\'emprunt du livre.';
      
      if (error.message?.includes('Limite d\'emprunts atteinte')) {
        errorMessage = '📚 Limite d\'emprunts atteinte (5 max). Veuillez retourner un livre avant d\'en emprunter un nouveau.';
      } else if (error.message?.includes('déjà emprunté')) {
        errorMessage = '📖 Ce livre est déjà dans vos emprunts en cours.';
      } else if (error.message?.includes('Aucune copie disponible') || error.message?.includes('non disponible')) {
        errorMessage = '😔 Ce livre n\'est plus disponible. Il a été emprunté par un autre utilisateur.';
      } else if (error.message?.includes('Livre non trouvé')) {
        errorMessage = '❓ Ce livre n\'existe plus ou a été supprimé.';
      } else if (error.message) {
        errorMessage = `❌ ${error.message}`;
      }
      
      setToast({
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setBorrowingBooks(prev => {
        const newSet = new Set(prev);
        newSet.delete(book.id);
        return newSet;
      });
    }
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-emerald-500 to-teal-500", 
      "from-purple-500 to-pink-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-blue-500",
      "from-green-500 to-emerald-500"
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-6 shadow-xl animate-pulse">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
            Chargement du catalogue
          </h2>
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Récupération des livres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      {/* Légère texture d'arrière-plan */}
      <div className="fixed inset-0 bg-pattern opacity-[0.015] pointer-events-none z-0"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 group"
          >
            <div className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200">
              <Home className="w-4 h-4" />
            </div>
            <span className="font-medium">Accueil</span>
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-medium">Catalogue</span>
        </div>

        {/* En-tête */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-10 border border-slate-200/50 relative overflow-hidden">
          {/* Effet de brillance subtil */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50"></div>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 bg-clip-text text-transparent mb-3">
                Catalogue de la Bibliothèque
              </h1>
              <p className="text-slate-600 text-xl font-medium">
                Découvrez notre collection de <span className="text-blue-600 font-semibold">{totalBooks}</span> livres
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-100/80 backdrop-blur-sm rounded-2xl p-1.5 shadow-lg border border-slate-200/50">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "rounded-xl transition-all duration-200",
                    viewMode === 'grid' 
                      ? "bg-white shadow-md text-slate-900" 
                      : "hover:bg-white/60"
                  )}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "rounded-xl transition-all duration-200",
                    viewMode === 'list' 
                      ? "bg-white shadow-md text-slate-900" 
                      : "hover:bg-white/60"
                  )}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="flex flex-col lg:flex-row gap-6 mt-8 relative">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Rechercher par titre, auteur ou catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 bg-slate-50/90 backdrop-blur-sm border-slate-200/60 focus:bg-white/95 transition-all duration-300 shadow-md focus:shadow-lg rounded-2xl text-base font-medium"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-72 h-14 bg-slate-50/90 backdrop-blur-sm border-slate-200/60 shadow-md rounded-2xl font-medium">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-200/60 shadow-xl">
                <SelectItem value="all" className="rounded-xl">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name} className="rounded-xl">
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Résultats */}
        <div className="mb-8 flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-lg">
          <div>
            <p className="text-slate-800 text-lg font-semibold">
              {filteredBooks.length} livre{filteredBooks.length !== 1 ? 's' : ''} trouvé{filteredBooks.length !== 1 ? 's' : ''}
            </p>
            <p className="text-slate-600 text-sm mt-1">
              {searchTerm && `Recherche : "${searchTerm}"`}
              {searchTerm && selectedCategory && selectedCategory !== 'all' && ' • '}
              {selectedCategory && selectedCategory !== 'all' && `Catégorie : "${selectedCategory}"`}
            </p>
          </div>
          
          {filteredBooks.length > 0 && (
            <div className="flex items-center gap-2 text-slate-600">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Résultats de qualité</span>
            </div>
          )}
        </div>

        {/* Liste des livres */}
        {filteredBooks.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-16 text-center border border-slate-200/50 relative overflow-hidden">
            {/* Effet de brillance */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30"></div>
            
            <div className="relative">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full mb-6 shadow-lg">
                <BookOpen className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Aucun livre trouvé</h3>
              <p className="text-slate-600 text-lg leading-relaxed max-w-md mx-auto">
                {searchTerm || (selectedCategory && selectedCategory !== 'all')
                  ? "Essayez de modifier vos critères de recherche pour découvrir notre vaste collection"
                  : "Aucun livre n'est disponible pour le moment"
                }
              </p>
            </div>
          </div>
        ) : (
          <div className={cn(
            "gap-6",
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "flex flex-col space-y-4"
          )}>
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <BookCard book={book} viewMode={viewMode} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
