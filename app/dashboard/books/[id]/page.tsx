'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  User, 
  Building, 
  Tag, 
  Globe,
  FileText,
  MapPin,
  Edit,
  Trash2,
  Download,
  Heart,
  Share2,
  Copy,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { bookService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

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

export default function BookDetailsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await bookService.getBook(parseInt(bookId));
        
        if (response.success && response.data) {
          setBook(response.data);
        } else {
          setError(response.error || 'Livre introuvable');
        }
      } catch (err) {
        console.error('Erreur lors du chargement du livre:', err);
        setError('Erreur lors du chargement du livre');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'borrowed':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'reserved':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'maintenance':
        return <XCircle className="w-5 h-5 text-gray-500" />;
      case 'lost':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'borrowed':
        return 'Emprunté';
      case 'reserved':
        return 'Réservé';
      case 'maintenance':
        return 'En maintenance';
      case 'lost':
        return 'Perdu';
      default:
        return 'Inconnu';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'borrowed':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'reserved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'lost':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleReserveBook = async () => {
    if (!book) return;
    
    try {
      // Logique de réservation à implémenter
      setMessage({ text: 'Réservation effectuée avec succès', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Erreur lors de la réservation', type: 'error' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage({ text: 'Copié dans le presse-papiers', type: 'success' });
  };

  const handleDeleteBook = async () => {
    if (!book) return;
    
    // Double confirmation pour la suppression
    const confirmMessage = `Êtes-vous sûr de vouloir supprimer le livre "${book.title}" ?\n\nCette action est irréversible et supprimera définitivement le livre de la base de données.`;
    
    if (!confirm(confirmMessage)) {
      return;
    }
    
    // Deuxième confirmation
    const finalConfirm = confirm("Dernière confirmation : Supprimer définitivement ce livre ?");
    if (!finalConfirm) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await bookService.deleteBook(book.id);
      
      if (response.success) {
        setMessage({ text: 'Livre supprimé avec succès', type: 'success' });
        // Redirection après un court délai
        setTimeout(() => {
          router.push('/dashboard/books');
        }, 2000);
      } else {
        setMessage({ text: response.error || 'Erreur lors de la suppression', type: 'error' });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setMessage({ text: 'Erreur lors de la suppression du livre', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-main)] via-[var(--color-bg-alt)] to-[var(--color-bg-main)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--color-accent-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Chargement du livre...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-main)] via-[var(--color-bg-alt)] to-[var(--color-bg-main)]">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold text-gray-800 mb-2">Livre introuvable</h1>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button onClick={() => router.back()} variant="outline">
                  Retour
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin' || user?.role === 'librarian';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-main)] via-[var(--color-bg-alt)] to-[var(--color-bg-main)]">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          
          {isAdmin && (
            <div className="flex gap-2">
              <Link href={`/dashboard/books/${book.id}/edit`}>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                onClick={handleDeleteBook}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            </div>
          )}
        </div>

        {/* Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-2 p-4 rounded-lg border mb-6 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border-green-200'
                : 'bg-red-50 text-red-800 border-red-200'
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations principales */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Image de couverture */}
                  <div className="flex-shrink-0">
                    {book.cover_image ? (
                      <img 
                        src={book.cover_image}
                        alt={book.title}
                        className="w-32 h-44 object-cover rounded-lg shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-44 bg-gray-200 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Détails du livre */}
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                      {book.title}
                    </h1>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-lg text-[var(--color-text-secondary)]">{book.author}</span>
                    </div>

                    {/* Statut et disponibilité */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(book.status)}`}>
                        {getStatusIcon(book.status)}
                        <span className="text-sm font-medium">{getStatusText(book.status)}</span>
                      </div>
                      
                      <span className="text-sm text-gray-600">
                        {book.available_copies} sur {book.total_copies} disponible(s)
                      </span>
                    </div>

                    {/* Catégorie */}
                    {book.category && (
                      <div className="mb-4">
                        <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                          <Tag className="w-3 h-3" />
                          {book.category}
                        </Badge>
                      </div>
                    )}

                    {/* Description */}
                    {book.description && (
                      <div>
                        <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">Description</h3>
                        <p className="text-[var(--color-text-secondary)] leading-relaxed">
                          {book.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions étudiant */}
            {!isAdmin && book.available_copies > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button 
                      onClick={handleReserveBook}
                      className="flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4" />
                      Réserver ce livre
                    </Button>
                    
                    {/* Téléchargement PDF si disponible */}
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Aperçu PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Informations détaillées */}
            <Card>
              <CardHeader>
                <CardTitle>Informations détaillées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {book.isbn && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ISBN</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono">{book.isbn}</span>
                      <button 
                        onClick={() => copyToClipboard(book.isbn!)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                {book.publisher && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Éditeur</span>
                    <span className="text-sm flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {book.publisher}
                    </span>
                  </div>
                )}

                {book.publication_year && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Année</span>
                    <span className="text-sm flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {book.publication_year}
                    </span>
                  </div>
                )}

                {book.language && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Langue</span>
                    <span className="text-sm flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {book.language}
                    </span>
                  </div>
                )}

                {book.pages && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pages</span>
                    <span className="text-sm flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {book.pages}
                    </span>
                  </div>
                )}

                {book.location && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Localisation</span>
                    <span className="text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {book.location}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Partage */}
            <Card>
              <CardHeader>
                <CardTitle>Partager</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                  onClick={() => copyToClipboard(window.location.href)}
                >
                  <Share2 className="w-4 h-4" />
                  Copier le lien
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
