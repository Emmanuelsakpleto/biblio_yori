'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Search,
  GraduationCap,
  Quote,
  ArrowRight,
  Users
} from 'lucide-react';
import Header from './Header';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

const quotes = [
  {
    text: "Une bibliothèque n'est pas un luxe, mais l'une des nécessités de la vie.",
    author: "Henry Ward Beecher"
  },
  {
    text: "Les livres sont les abeilles qui transportent le pollen de la sagesse d'un esprit à l'autre.",
    author: "James Russell Lowell"
  },
  {
    text: "Celui qui ouvre un livre, ouvre un monde.",
    author: "Chinois proverbe"
  },
  {
    text: "Les bibliothèques seront toujours importantes. Si vous avez une bibliothèque avec un jardin, vous avez tout ce dont vous avez besoin.",
    author: "Cicéron"
  },
  {
    text: "Une université est juste un groupe de bâtiments rassemblés autour d'une bibliothèque.",
    author: "Shelby Foote"
  }
];

const Home = () => {
  const { user } = useAuth();
  const [randomQuote, setRandomQuote] = useState(quotes[0]);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    // Initialiser avec une citation aléatoire
    const initialIndex = Math.floor(Math.random() * quotes.length);
    setQuoteIndex(initialIndex);
    setRandomQuote(quotes[initialIndex]);
    
    // Changer la citation toutes les 10 secondes
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % quotes.length;
        setRandomQuote(quotes[newIndex]);
        return newIndex;
      });
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-main)] via-[var(--color-bg-alt)] to-[var(--color-bg-main)]">
      <Header />
      
      {/* Texture de fond */}
      <div className="fixed inset-0 bg-pattern opacity-[0.015] pointer-events-none z-0"></div>
      
      <div className="relative z-10 pt-16">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-[var(--color-text-primary)]">Bonjour </span>
              <span className="bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] bg-clip-text text-transparent">
                {user?.first_name}
              </span>
              <span className="text-[var(--color-text-primary)]"> 👋</span>
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed">
              Découvrez votre bibliothèque universitaire numérique. Explorez, empruntez et gérez vos ressources académiques avec une expérience moderne et intuitive.
            </p>
          </motion.div>

          {/* Citation inspirante */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-20 relative overflow-hidden rounded-3xl shadow-2xl max-w-5xl mx-auto"
          >
            <div className="relative h-[400px] w-full bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] flex items-center justify-center">
              {/* Citation avec animation */}
              <div className="text-center p-8 md:p-12 text-white max-w-4xl">
                <Quote className="w-16 h-16 text-white/80 mb-6 mx-auto" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={quoteIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                      {randomQuote.text}
                    </h2>
                    <p className="text-white/90 text-xl md:text-2xl font-medium">— {randomQuote.author}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Accès rapides */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          >
            <Link href="/books" className="block">
              <div className="glass-effect-strong rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-hover-primary)]"></div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-hover-primary)] flex items-center justify-center mb-6 shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">Catalogue</h3>
                <p className="text-[var(--color-text-secondary)] mb-6">Explorez notre vaste collection de livres académiques et de ressources</p>
                <div className="flex items-center text-[var(--color-accent-primary)] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  Explorer <ArrowRight className="ml-2 w-5 h-5" />
                </div>
              </div>
            </Link>
            
            <Link href="/dashboard" className="block">
              <div className="glass-effect-strong rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-accent-secondary)] to-[var(--color-hover-secondary)]"></div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-accent-secondary)] to-[var(--color-hover-secondary)] flex items-center justify-center mb-6 shadow-lg">
                  {user?.role === 'admin' ? <Users className="w-8 h-8 text-white" /> : <GraduationCap className="w-8 h-8 text-white" />}
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">{user?.role === 'admin' ? 'Administration' : 'Mon Espace'}</h3>
                <p className="text-[var(--color-text-secondary)] mb-6">{user?.role === 'admin' ? 'Gérez les utilisateurs, les livres et les emprunts' : 'Accédez à vos emprunts, réservations et profil'}</p>
                <div className="flex items-center text-[var(--color-accent-primary)] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  Explorer <ArrowRight className="ml-2 w-5 h-5" />
                </div>
              </div>
            </Link>
            
            <Link href="/search" className="block">
              <div className="glass-effect-strong rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-accent-tertiary)] to-[var(--color-hover-tertiary)]"></div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-accent-tertiary)] to-[var(--color-hover-tertiary)] flex items-center justify-center mb-6 shadow-lg">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">Recherche</h3>
                <p className="text-[var(--color-text-secondary)] mb-6">Trouvez rapidement les ressources dont vous avez besoin</p>
                <div className="flex items-center text-[var(--color-accent-primary)] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  Explorer <ArrowRight className="ml-2 w-5 h-5" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
