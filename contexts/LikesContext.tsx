// Context pour gérer le cache des likes des livres
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LikesData {
  likes: number;
  isLiked: boolean;
  timestamp: number;
}

interface LikesCache {
  [bookId: string]: LikesData;
}

interface LikesContextType {
  getLikes: (bookId: number) => LikesData | null;
  setLikes: (bookId: number, data: Omit<LikesData, 'timestamp'>) => void;
  isStale: (bookId: number) => boolean;
}

const LikesContext = createContext<LikesContextType | undefined>(undefined);

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const LikesProvider = ({ children }: { children: ReactNode }) => {
  const [cache, setCache] = useState<LikesCache>({});

  const getLikes = (bookId: number): LikesData | null => {
    const key = bookId.toString();
    const data = cache[key];
    
    if (!data) return null;
    
    // Vérifier si les données sont encore fraîches
    const isExpired = Date.now() - data.timestamp > CACHE_DURATION;
    if (isExpired) {
      // Supprimer les données expirées
      setCache(prev => {
        const newCache = { ...prev };
        delete newCache[key];
        return newCache;
      });
      return null;
    }
    
    return data;
  };

  const setLikes = (bookId: number, data: Omit<LikesData, 'timestamp'>) => {
    const key = bookId.toString();
    setCache(prev => ({
      ...prev,
      [key]: {
        ...data,
        timestamp: Date.now()
      }
    }));
  };

  const isStale = (bookId: number): boolean => {
    const data = getLikes(bookId);
    return !data;
  };

  return (
    <LikesContext.Provider value={{ getLikes, setLikes, isStale }}>
      {children}
    </LikesContext.Provider>
  );
};

export const useLikes = () => {
  const context = useContext(LikesContext);
  if (context === undefined) {
    throw new Error('useLikes must be used within a LikesProvider');
  }
  return context;
};
