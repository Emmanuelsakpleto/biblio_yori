'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { bookService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  category: string;
  description: string;
  publishedYear: number;
  totalCopies: number;
  availableCopies: number;
  publisher: string;
  language: string;
  tags: string;
}

const categories = [
  'Fiction',
  'Non-fiction',
  'Science',
  'Technologie',
  'Histoire',
  'Philosophie',
  'Art',
  'Littérature',
  'Sciences sociales',
  'Médecine',
  'Droit',
  'Économie',
  'Psychologie',
  'Éducation',
  'Autre'
];

const languages = [
  'Français',
  'Anglais',
  'Espagnol',
  'Allemand',
  'Italien',
  'Portugais',
  'Arabe',
  'Autre'
];

export default function EditBookPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    isbn: '',
    category: '',
    description: '',
    publishedYear: new Date().getFullYear(),
    totalCopies: 1,
    availableCopies: 1,
    publisher: '',
    language: 'Français',
    tags: ''
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBook, setIsLoadingBook] = useState(true);
  const [error, setError] = useState('');

  // Chargement du livre à éditer
  useEffect(() => {
    const loadBook = async () => {
      try {
        setIsLoadingBook(true);
        const response = await bookService.getBook(parseInt(bookId));
        
        if (response.success && response.data) {
          const bookData = response.data;
          setBook(bookData);
          
          // Remplissage du formulaire avec les données du livre
          setFormData({
            title: bookData.title || '',
            author: bookData.author || '',
            isbn: bookData.isbn || '',
            category: bookData.category || '',
            description: bookData.description || '',
            publishedYear: bookData.publication_year || new Date().getFullYear(),
            totalCopies: bookData.total_copies || 1,
            availableCopies: bookData.available_copies || 1,
            publisher: bookData.publisher || '',
            language: bookData.language || 'Français',
            tags: '' // Les tags ne sont pas encore supportés côté backend
          });
        } else {
          setError('Livre introuvable');
        }
      } catch (err) {
        console.error('Erreur lors du chargement du livre:', err);
        setError('Erreur lors du chargement du livre');
      } finally {
        setIsLoadingBook(false);
      }
    };

    if (bookId) {
      loadBook();
    }
  }, [bookId]);

  // Vérification des droits d'accès
  const isAuthorized = user && (user.role === 'admin' || user.role === 'librarian');

  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Accès non autorisé. Cette page est réservée aux administrateurs.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (field: keyof BookFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (type: 'cover' | 'pdf', file: File | null) => {
    if (type === 'cover') {
      setCoverFile(file);
    } else {
      setPdfFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validation basique
      if (!formData.title || !formData.author) {
        throw new Error('Les champs titre et auteur sont obligatoires');
      }

      // Préparation des données pour l'API
      const updateData = {
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn || undefined,
        category: formData.category || undefined,
        description: formData.description || undefined,
        publication_year: formData.publishedYear,
        total_copies: formData.totalCopies,
        available_copies: formData.availableCopies,
        publisher: formData.publisher || undefined,
        language: formData.language || 'fr'
      };

      const response = await bookService.updateBook(parseInt(bookId), updateData, coverFile, pdfFile);
      
      if (response.success) {
        // Redirection vers la page de gestion des livres
        router.push('/dashboard/books');
      } else {
        throw new Error(response.error || 'Erreur lors de la mise à jour du livre');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du livre:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du livre');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingBook) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Chargement du livre...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {error || 'Livre introuvable'}
            </p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => router.push('/dashboard/books')}>
                Retour à la liste
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
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
          <div>
            <h1 className="text-3xl font-bold">Modifier le livre</h1>
            <p className="text-muted-foreground">{book.title}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations principales */}
            <Card>
              <CardHeader>
                <CardTitle>Informations principales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Titre du livre"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="author">Auteur *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    placeholder="Nom de l'auteur"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    onChange={(e) => handleInputChange('isbn', e.target.value)}
                    placeholder="978-X-XXX-XXXXX-X"
                  />
                </div>

                <div>
                  <Label htmlFor="publisher">Éditeur</Label>
                  <Input
                    id="publisher"
                    value={formData.publisher}
                    onChange={(e) => handleInputChange('publisher', e.target.value)}
                    placeholder="Nom de l'éditeur"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="publishedYear">Année de publication</Label>
                    <Input
                      id="publishedYear"
                      type="number"
                      value={formData.publishedYear}
                      onChange={(e) => handleInputChange('publishedYear', parseInt(e.target.value))}
                      min="1000"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>

                  <div>
                    <Label htmlFor="language">Langue</Label>
                    <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map(lang => (
                          <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Classification et disponibilité */}
            <Card>
              <CardHeader>
                <CardTitle>Classification et disponibilité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags">Mots-clés (séparés par des virgules)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="science, recherche, université..."
                  />
                  {formData.tags && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.tags.split(',').map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="totalCopies">Nombre total d'exemplaires</Label>
                    <Input
                      id="totalCopies"
                      type="number"
                      value={formData.totalCopies}
                      onChange={(e) => handleInputChange('totalCopies', parseInt(e.target.value))}
                      min="1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="availableCopies">Exemplaires disponibles</Label>
                    <Input
                      id="availableCopies"
                      type="number"
                      value={formData.availableCopies}
                      onChange={(e) => handleInputChange('availableCopies', parseInt(e.target.value))}
                      min="0"
                      max={formData.totalCopies}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Description du livre..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Fichiers */}
          <Card>
            <CardHeader>
              <CardTitle>Fichiers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {book.cover_image && (
                <div className="mb-4">
                  <Label>Image de couverture actuelle</Label>
                  <div className="mt-2">
                    <img 
                      src={book.cover_image} 
                      alt="Couverture actuelle"
                      className="w-24 h-32 object-cover rounded"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="cover">Nouvelle image de couverture (optionnel)</Label>
                <div className="mt-1">
                  <Input
                    id="cover"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('cover', e.target.files?.[0] || null)}
                  />
                  {coverFile && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Nouveau fichier sélectionné: {coverFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="pdf">Nouveau fichier PDF (optionnel)</Label>
                <div className="mt-1">
                  <Input
                    id="pdf"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange('pdf', e.target.files?.[0] || null)}
                  />
                  {pdfFile && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Nouveau fichier sélectionné: {pdfFile.name}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Mise à jour en cours...' : 'Mettre à jour le livre'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
