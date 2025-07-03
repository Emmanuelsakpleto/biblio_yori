'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Eye, Heart, Plus, Star, Users } from 'lucide-react';
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
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/book/${book.id}`);
    }
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
          </div>
          
          {/* Actions */}
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
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Overlay au survol */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
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
        
        {/* Actions flottantes au survol */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="secondary" 
              className="bg-white/90 hover:bg-white text-slate-900 backdrop-blur-sm flex-1"
              asChild
            >
              <Link href={`/book/${book.id}`} onClick={(e) => e.stopPropagation()}>
                <Eye className="w-4 h-4 mr-2" />
                Voir
              </Link>
            </Button>
            
            {book.available_copies > 0 && (
              <Button 
                size="sm" 
                className="bg-blue-600/90 hover:bg-blue-700/90 backdrop-blur-sm flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                Emprunter
              </Button>
            )}
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
