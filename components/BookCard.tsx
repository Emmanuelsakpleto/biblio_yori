'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Eye, Heart, Plus, Star, Users, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import Link from 'next/link';

interface BookCardProps {
  book: {
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
  };
  viewMode?: 'grid' | 'list';
  onClick?: () => void;
}

const BookCard = ({ book, viewMode = 'grid', onClick }: BookCardProps) => {
  const router = useRouter();
  // Système de likes réactivé avec authentification correcte
  const [likes, setLikes] = React.useState<number | null>(null);
  const [likeLoading, setLikeLoading] = React.useState(false);
  const [likeError, setLikeError] = React.useState<string | null>(null);
  const [isLiked, setIsLiked] = React.useState(false);

  // Utilitaire pour l'URL de l'API backend
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Charger les likes du livre
  React.useEffect(() => {
    const fetchLikes = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${API_URL}/books/${book.id}/likes`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setLikes(data.likes ?? 0);
            setIsLiked(data.isLiked ?? false);
          } else if (response.status === 401) {
            // Token expiré, nettoyer l'authentification
            console.log('Token expiré pour les likes');
            setLikes(0);
          } else {
            setLikes(0);
          }
        } catch (error) {
          console.error('Erreur lors du chargement des likes:', error);
          setLikes(0);
        }
      } else {
        // Pas connecté, pas de likes
        setLikes(0);
      }
    };

    fetchLikes();
  }, [book.id, API_URL]);
  //       .then(res => {
  //         if (res.ok) {
  //           return res.json();
  //         }
  //         // Si erreur d'auth, pas de likes
  //         return { likes: 0 };
  //       })
  //       .then(data => setLikes(data.likes ?? 0))
  //       .catch(() => setLikes(0));
  //   } else {
  //     // Pas connecté, pas de likes
  //     setLikes(0);
  //   }
  // }, [book.id, API_URL]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/book/${book.id}`);
    }
  };

  // Gérer le like d'un livre
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Pas de token, like impossible');
      return;
    }

    setLikeLoading(true);
    setLikeError(null);

    try {
      const response = await fetch(`${API_URL}/books/${book.id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes ?? 0);
        setIsLiked(data.isLiked ?? false);
      } else if (response.status === 401) {
        console.log('Token expiré pour le like');
        setLikeError('Authentification expirée');
      } else {
        setLikeError('Erreur lors du like');
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
      setLikeError('Erreur réseau');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddReview = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/reviews/add?bookId=${book.id}`);
  };

  const getImageUrl = () => {
    if (book.cover_image) {
      return book.cover_image;
    }
    return `https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&q=80&auto=format`;
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300"
        onClick={handleClick}
      >
        <div className="flex p-6 gap-6">
          {/* Image */}
          <div className="relative w-24 h-32 flex-shrink-0 overflow-hidden rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
            <Image
              src={getImageUrl()}
              alt={book.title}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          {/* Contenu */}
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                {book.title}
              </h3>
              <p className="text-slate-600 font-medium">{book.author}</p>
            </div>
            <div className="flex items-center gap-3">
              {book.category && (
                <Badge variant="outline" className="text-xs bg-slate-50/80">
                  {book.category}
                </Badge>
              )}
              <Badge 
                variant={book.available_copies > 0 ? "default" : "secondary"}
                className={`text-xs ${
                  book.available_copies > 0 
                    ? "bg-emerald-500 text-white" 
                    : "bg-red-500 text-white"
                }`}
              >
                {book.available_copies > 0 ? `${book.available_copies} disponible(s)` : "Indisponible"}
              </Badge>
            </div>
            {book.description && (
              <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                {book.description}
              </p>
            )}
            {book.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < Math.floor(book.rating!) 
                          ? "text-yellow-400 fill-current" 
                          : "text-slate-300"
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-slate-600 text-sm">
                  {book.rating.toFixed(1)} ({book.reviews_count || 0} avis)
                </span>
              </div>
            )}
            {/* Actions avis et like dans des cards blanches */}
            <div className="flex gap-3 mt-2">
              <div className="bg-white rounded-xl shadow border flex items-center justify-center px-3 py-2">
                <Button size="icon" variant="ghost" className="" onClick={handleAddReview} title="Laisser un avis">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                </Button>
              </div>
              <div className="bg-white rounded-xl shadow border flex items-center justify-center px-3 py-2">
                <Button size="icon" variant="ghost" className="" onClick={handleLike} disabled={likeLoading} title="Like">
                  <Heart className={`w-5 h-5 ${isLiked ? "text-red-500 fill-red-500" : "text-slate-400"}`}/>
                  <span className="ml-1 text-xs text-slate-700">{likes ?? 0}</span>
                </Button>
              </div>
            </div>
            {likeError && (
              <div className="text-xs text-red-500 mt-1">{likeError}</div>
            )}
          </div>
          {/* Actions classiques */}
          <div className="flex flex-col justify-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/book/${book.id}`} onClick={(e) => e.stopPropagation()}>
                <Eye className="w-4 h-4 mr-2" />
                Détails
              </Link>
            </Button>
            {book.available_copies > 0 && (
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Emprunter
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-500"
      onClick={handleClick}
    >
      {/* Image principale */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={getImageUrl()}
          alt={book.title}
          fill
          unoptimized
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {/* Badge de disponibilité */}
        <div className="absolute top-4 right-4">
          <Badge 
            variant={book.available_copies > 0 ? "default" : "secondary"}
            className={`shadow-lg backdrop-blur-sm font-semibold ${
              book.available_copies > 0 
                ? "bg-emerald-500/90 hover:bg-emerald-600/90 text-white" 
                : "bg-red-500/90 text-white"
            }`}
          >
            {book.available_copies > 0 ? `${book.available_copies} dispo` : "Indisponible"}
          </Badge>
        </div>
        {/* Actions flottantes toujours visibles en bas à droite */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-3 z-10">
          <div className="bg-white rounded-xl shadow border flex items-center justify-center px-3 py-2">
            <Button size="icon" variant="ghost" className="" onClick={handleAddReview} title="Laisser un avis">
              <MessageCircle className="w-5 h-5 text-blue-500" />
            </Button>
          </div>
          <div className="bg-white rounded-xl shadow border flex items-center justify-center px-3 py-2">
            <Button size="icon" variant="ghost" className="" onClick={handleLike} disabled={likeLoading} title="Like">
              <Heart className={`w-5 h-5 ${isLiked ? "text-red-500 fill-red-500" : "text-slate-400"}`}/>
              <span className="ml-1 text-xs text-slate-700">{likes ?? 0}</span>
            </Button>
          </div>
        </div>
      </div>
      {/* Contenu */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 leading-snug">
            {book.title}
          </h3>
          <p className="text-slate-600 font-medium mt-1">{book.author}</p>
        </div>
        <div className="flex items-center justify-between">
          {book.category && (
            <Badge variant="outline" className="text-xs bg-slate-50/80 border-slate-200">
              {book.category}
            </Badge>
          )}
          {book.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-slate-600 text-sm font-medium">
                {book.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        {book.description && (
          <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
            {book.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default BookCard;
