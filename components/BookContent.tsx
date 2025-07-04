'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Editor, useDomValue } from 'reactjs-editor';
import { bookService, loanService, type Book } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
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
    <motion.div 
      transition={{ type: 'spring', damping: 40, mass: 0.75 }}
      initial={{ opacity: 0, x: 1000 }} 
      animate={{ opacity: 1, x: 0 }}
    >
      <motion.section 
        transition={{ type: 'spring', damping: 44, mass: 0.75 }}
        initial={{ opacity: 0, y: -1000 }} 
        animate={{ opacity: 1, y: 0 }} 
        className='appBar'
      >
        <div className="left-icons" style={{ 
          display: 'flex', 
          gap: '15px', 
          alignItems: 'center',
          padding: '5px'
        }}>
          <button 
            onClick={handleGoBack} 
            style={{ 
              cursor: 'pointer',
              padding: '10px 15px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              backgroundColor: '#daa4a4',
              color: '#fff',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#c89393';
              (e.target as HTMLElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#daa4a4';
              (e.target as HTMLElement).style.transform = 'translateY(0)';
            }}
            title="Retour à la page précédente"
          >
            <i style={{ fontSize: '16px' }} className="fas fa-chevron-left"></i>
            <span>Retour</span>
          </button>
          <button 
            onClick={handleGoHome} 
            style={{ 
              cursor: 'pointer',
              padding: '10px 15px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              backgroundColor: '#22c55e',
              color: '#fff',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#16a34a';
              (e.target as HTMLElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#22c55e';
              (e.target as HTMLElement).style.transform = 'translateY(0)';
            }}
            title="Retour à l'accueil"
          >
            <i style={{ fontSize: '16px' }} className="fas fa-home"></i>
            <span>Accueil</span>
          </button>
        </div>
        <div className="title">
          <h2 style={{
            textAlign: 'center',
            textTransform: 'uppercase',
            paddingLeft: '100px'
          }}>
            {selectedBook.title}
          </h2>
        </div>
        <div className="icons">
          {canBorrow && (
            <button 
              className='saveButton' 
              onClick={handleBorrow}
              disabled={borrowing}
              style={{ marginRight: '10px', background: '#22c55e' }}
            >
              {borrowing ? 'Emprunt...' : 'Emprunter'}
            </button>
          )}
          <button className='saveButton' onClick={handleSave}>Sauvegarder</button>
          <i style={{ marginRight: '20px', fontSize: '20px' }} className="fas fa-cog"></i>
          <i style={{ marginRight: '20px', fontSize: '20px' }} className="fas fa-share"></i>
          <i style={{ marginRight: '20px', fontSize: '20px' }} className="fas fa-search"></i>
        </div>
      </motion.section>

      <div style={{ padding: '20px', background: '#f8eadd', margin: '20px', borderRadius: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h1>{selectedBook.title}</h1>
          <p><strong>Auteur:</strong> {selectedBook.author}</p>
          <p><strong>Catégorie:</strong> {selectedBook.category}</p>
          <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
          <p><strong>Année de publication:</strong> {selectedBook.publication_year}</p>
          <p><strong>Disponibilité:</strong> {selectedBook.available_copies}/{selectedBook.total_copies} exemplaires</p>
          <p><strong>Description:</strong> {selectedBook.description}</p>
        </div>
      </div>

      <Editor
        htmlContent={`<main className='bookContainer'>
          <aside>
            <h1 className="center">${selectedBook.title}</h1>
            <span className='center small'> Par ${selectedBook.author}</span>
            <div style="margin-top: 20px;">
              <p><strong>Catégorie:</strong> ${selectedBook.category}</p>
              <p><strong>Description:</strong> ${selectedBook.description || 'Aucune description disponible'}</p>
              <br>
              <p>Contenu du livre à venir...</p>
            </div>
          </aside>
        </main>`}
      />

      <ToastContainer />
    </motion.div>
  );
};

export default BookContent;
console.log('��� FICHIER ACTUEL: BookContent.tsx - Page de détail livre');
