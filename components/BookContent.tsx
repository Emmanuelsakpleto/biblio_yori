'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Editor, useDomValue } from 'reactjs-editor';
import { bookService, loanService, type Book } from '../lib/api';
import BookReviews from './BookReviews';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Home, Save } from 'lucide-react';
import '../app/styles/BookContent.css';

interface BookContentProps {
  bookId: string;
}

const BookContent = ({ bookId }: BookContentProps) => {
  const router = useRouter();
  const { dom, setDom } = useDomValue();
  const { user } = useAuth();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canBorrow, setCanBorrow] = useState(false);
  const [borrowing, setBorrowing] = useState(false);

  console.log('🔥 BookContent component is loading for bookId:', bookId);

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bookService.getBook(parseInt(bookId));
      if (response.success && response.data) {
        setSelectedBook(response.data);
        setCanBorrow(response.data.available_copies > 0 && user !== null);
      } else {
        setError(response.message || 'Livre introuvable');
      }
    } catch (e: any) {
      setError('Erreur lors du chargement du livre');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!selectedBook || !user) return;
    
    try {
      setBorrowing(true);
      const response = await loanService.createLoan(selectedBook.id);
      
      if (response.success) {
        toast.success('Livre emprunté avec succès !', {
          style: { background: "#22c55e", color: '#fff' },
          hideProgressBar: true
        });
        
        // Mettre à jour les informations du livre
        fetchBook();
      } else {
        toast.error(response.message || 'Erreur lors de l\'emprunt', {
          style: { background: "#ef4444", color: '#fff' },
          hideProgressBar: true
        });
      }
    } catch (error) {
      toast.error('Erreur lors de l\'emprunt', {
        style: { background: "#ef4444", color: '#fff' },
        hideProgressBar: true
      });
    } finally {
      setBorrowing(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const notify = () => toast("Contenu sauvegardé.", {
    style: { background: "#f2dfce", color: '#000' },
    hideProgressBar: true
  });

  const handleSave = () => {
    const updatedDomValue = {
      key: dom?.key,
      props: dom?.props,
      ref: dom?.ref,
      type: dom?.type,
    };

    if (selectedBook) {
      localStorage.setItem(`dom${selectedBook.id}`, JSON.stringify(updatedDomValue));
      notify();
    }
  };

  useEffect(() => {
    if (selectedBook) {
      const persistedDom = localStorage.getItem(`dom${selectedBook.id}`);
      if (persistedDom) {
        setDom(JSON.parse(persistedDom));
      }
    }
  }, [selectedBook, setDom]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '18px', marginBottom: '20px' }}>
          Chargement du livre...
        </div>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #daa4a4',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
      </div>
    );
  }

  if (error || !selectedBook) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3 style={{ color: '#ef4444' }}>❌ {error || 'Livre introuvable'}</h3>
        <button 
          onClick={() => router.back()}
          className="saveButton"
          style={{ marginTop: '20px' }}
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Boutons Retour & Accueil en haut à gauche, Sauvegarder en haut à droite */}
      <div style={{ position: 'fixed', top: 32, left: 32, zIndex: 20, display: 'flex', gap: 14 }}>
        <button onClick={handleGoBack} title="Retour" style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px #0001', cursor: 'pointer', transition: 'background 0.2s' }}>
          <ArrowLeft size={22} color="#64748b" />
        </button>
        <button onClick={handleGoHome} title="Accueil" style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px #0001', cursor: 'pointer', transition: 'background 0.2s' }}>
          <Home size={22} color="#22c55e" />
        </button>
      </div>
      <div style={{ position: 'fixed', top: 32, right: 32, zIndex: 20, display: 'flex', gap: 14 }}>
        <button onClick={handleSave} title="Sauvegarder" style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px #0001', cursor: 'pointer', transition: 'background 0.2s' }}>
          <Save size={22} color="#6366f1" />
        </button>
      </div>
      <motion.div 
        transition={{ type: 'spring', damping: 40, mass: 0.75 }}
        initial={{ opacity: 0, x: 1000 }} 
        animate={{ opacity: 1, x: 0 }}
        style={{ maxWidth: 900, margin: '40px auto', background: '#fff', borderRadius: 24, boxShadow: '0 4px 32px #0001', padding: 0 }}
      >
        {/* Header visuel */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', padding: 32, borderBottom: '1px solid #f3f3f3', background: 'linear-gradient(90deg,#f8eadd 60%,#fff 100%)', borderTopLeftRadius: 24, borderTopRightRadius: 24, position: 'relative' }}>
          {/* Image de couverture */}
          <div style={{ flex: '0 0 160px', marginRight: 32, marginBottom: 16 }}>
            <img src={selectedBook.cover_image || '/images/default-book.png'} alt={selectedBook.title} style={{ width: 160, height: 220, objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 8px #0002', background: '#eee' }} />
          </div>
          {/* Infos principales */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>{selectedBook.title}</h1>
            <div style={{ fontSize: 18, color: '#666', margin: '8px 0 16px 0' }}>par <b>{selectedBook.author}</b></div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', marginBottom: 12 }}>
              <span style={{ background: '#f3f3f3', borderRadius: 8, padding: '4px 12px', fontSize: 14 }}>{selectedBook.category || 'Sans catégorie'}</span>
              <span style={{ background: '#f3f3f3', borderRadius: 8, padding: '4px 12px', fontSize: 14 }}>Année : {selectedBook.publication_year || 'N/A'}</span>
              <span style={{ background: '#f3f3f3', borderRadius: 8, padding: '4px 12px', fontSize: 14 }}>ISBN : {selectedBook.isbn || 'N/A'}</span>
            </div>
            <div style={{ margin: '10px 0 18px 0', fontSize: 15 }}>
              <b>Disponibilité :</b> <span style={{ color: selectedBook.available_copies > 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>{selectedBook.available_copies} / {selectedBook.total_copies}</span> exemplaires
            </div>
          </div>
          {/* Bouton Emprunter dans la card */}
          {canBorrow && (
            <button className='saveButton' onClick={handleBorrow} disabled={borrowing} style={{ background: '#22c55e', color: '#fff', fontWeight: 600, borderRadius: 22, height: 44, padding: '0 22px', marginLeft: 32 }}>
              {borrowing ? 'Emprunt...' : 'Emprunter'}
            </button>
          )}
        </div>

        {/* Description et détails */}
        <div style={{ padding: '32px 32px 16px 32px', background: '#f8fafc', borderBottom: '1px solid #f3f3f3' }}>
          <h3 style={{ fontSize: 20, margin: '0 0 12px 0', color: '#222' }}>À propos du livre</h3>
          <p style={{ fontSize: 16, color: '#444', margin: 0 }}>{selectedBook.description || <span style={{ color: '#aaa' }}>Aucune description disponible.</span>}</p>
        </div>

        {/* Section avis lecteurs */}
        <div style={{ padding: '32px', background: '#fff', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
          <h3 style={{ fontSize: 20, margin: '0 0 18px 0', color: '#222' }}>Avis des lecteurs</h3>
          {selectedBook && (
            <BookReviews bookId={selectedBook.id} />
          )}
        </div>

        <ToastContainer />
      </motion.div>
    </div>
  );
};

export default BookContent;
console.log('FICHIER ACTUEL: BookContent.tsx - Page de détail livre');
