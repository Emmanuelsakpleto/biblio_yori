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
  Filter,
  SortAsc,
  SortDesc,
  Home,
  Calendar,
  User as UserIcon,
  Tag,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [borrowingBooks, setBorrowingBooks] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Charger les livres
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await bookService.getBooks({ limit: 50 });
        
        if (response?.success && response.data?.books) {
          setBooks(response.data.books);
          setFilteredBooks(response.data.books);
          
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

    if (selectedCategory) {
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
      <div className="max-w-7xl mx-auto">
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
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                Catalogue de la Bibliothèque
              </h1>
              <p className="text-slate-600 text-lg">
                Découvrez notre collection de {books.length} livres
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-lg"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-lg"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="flex flex-col lg:flex-row gap-4 mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Rechercher par titre, auteur ou catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-colors duration-200"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-64 h-12 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Catégories populaires */}
        {categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Catégories populaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.slice(0, 6).map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <motion.div
                    key={category.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card 
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:shadow-lg",
                        selectedCategory === category.name ? "ring-2 ring-blue-500" : ""
                      )}
                      onClick={() => setSelectedCategory(selectedCategory === category.name ? '' : category.name)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} mb-3`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-medium text-slate-900 text-sm">{category.name}</h3>
                        <p className="text-xs text-slate-600">{category.count} livres</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Résultats */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-slate-600">
            {filteredBooks.length} livre{filteredBooks.length !== 1 ? 's' : ''} trouvé{filteredBooks.length !== 1 ? 's' : ''}
            {searchTerm && ` pour "${searchTerm}"`}
            {selectedCategory && ` dans "${selectedCategory}"`}
          </p>
        </div>

        {/* Liste des livres */}
        {filteredBooks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucun livre trouvé</h3>
            <p className="text-slate-600">
              {searchTerm || selectedCategory 
                ? "Essayez de modifier vos critères de recherche"
                : "Aucun livre n'est disponible pour le moment"
              }
            </p>
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
                {viewMode === 'grid' ? (
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                    <div className="relative">
                      {book.cover_image ? (
                        <div className="aspect-[3/4] relative overflow-hidden">
                          <Image
                            src={book.cover_image}
                            alt={book.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-slate-400" />
                        </div>
                      )}
                      
                      <div className="absolute top-4 right-4">
                        <Badge 
                          variant={book.available_copies > 0 ? "default" : "secondary"}
                          className={cn(
                            "shadow-lg",
                            book.available_copies > 0 
                              ? "bg-green-500 hover:bg-green-600" 
                              : "bg-red-500"
                          )}
                        >
                          {book.available_copies > 0 ? `${book.available_copies} dispo` : "Indisponible"}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                            {book.title}
                          </h3>
                          <p className="text-slate-600 text-sm">{book.author}</p>
                        </div>
                        
                        {book.category && (
                          <Badge variant="outline" className="text-xs">
                            {book.category}
                          </Badge>
                        )}
                        
                        <div className="flex items-center justify-between pt-4">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/book/${book.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Détails
                            </Link>
                          </Button>
                          
                          {!isAdmin && book.available_copies > 0 && (
                            <Button 
                              size="sm"
                              onClick={() => handleBorrow(book)}
                              disabled={borrowingBooks.has(book.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {borrowingBooks.has(book.id) ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              ) : (
                                <Plus className="w-4 h-4 mr-2" />
                              )}
                              Emprunter
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <div className="flex-shrink-0">
                          {book.cover_image ? (
                            <div className="w-20 h-28 relative overflow-hidden rounded-lg">
                              <Image
                                src={book.cover_image}
                                alt={book.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-28 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-8 h-8 text-slate-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div>
                            <h3 className="font-bold text-slate-900 text-xl hover:text-blue-600 transition-colors duration-200">
                              {book.title}
                            </h3>
                            <p className="text-slate-600">{book.author}</p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {book.category && (
                              <Badge variant="outline">
                                {book.category}
                              </Badge>
                            )}
                            <Badge 
                              variant={book.available_copies > 0 ? "default" : "secondary"}
                              className={book.available_copies > 0 ? "bg-green-500" : "bg-red-500"}
                            >
                              {book.available_copies > 0 ? `${book.available_copies} disponible(s)` : "Indisponible"}
                            </Badge>
                          </div>
                          
                          <p className="text-slate-600 text-sm line-clamp-2">
                            {book.description || "Aucune description disponible."}
                          </p>
                        </div>
                        
                        <div className="flex-shrink-0 flex items-center gap-3">
                          <Button variant="outline" asChild>
                            <Link href={`/book/${book.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Détails
                            </Link>
                          </Button>
                          
                          {!isAdmin && book.available_copies > 0 && (
                            <Button 
                              onClick={() => handleBorrow(book)}
                              disabled={borrowingBooks.has(book.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {borrowingBooks.has(book.id) ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              ) : (
                                <Plus className="w-4 h-4 mr-2" />
                              )}
                              Emprunter
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
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
