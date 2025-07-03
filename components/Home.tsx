'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import BookCard from './BookCard';
import Header from './Header';
import Sidebar from './Sidebar';
import { bookService, utils, type Book } from '../lib/api';
import { useConfig } from '../contexts/ConfigContext';

const Home = () => {
  const searchParams = useSearchParams();
  const config = useConfig();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  useEffect(() => {
    // Vérifier s'il y a un terme de recherche dans l'URL
    const searchFromUrl = searchParams?.get('search');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, [searchTerm, selectedCategory, currentPage]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page: currentPage,
        limit: config.ITEMS_PER_PAGE,
      };
      
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      
      if (selectedCategory) {
        params.category = selectedCategory;
      }

      const response = await bookService.getBooks(params);
      if (response.success && response.data) {
        setBooks(response.data.books);
        setTotalBooks(response.data.total || response.data.books.length);
      } else {
        setError(response.message || 'Erreur lors du chargement des livres');
        setBooks([]);
      }
    } catch (e: any) {
      setBooks([]);
      setError('Erreur lors du chargement des livres');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await bookService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalBooks / config.ITEMS_PER_PAGE);

  const getBookImageUrl = (book: Book) => {
    if (book.cover_image) {
      return utils.getImageUrl(book.cover_image);
    }
    // Fallback vers une image de placeholder
    return `https://picsum.photos/200/300?random=${book.id}`;
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <Header />
      
      <div style={containerStyle}>
        {/* Sidebar avec filtres */}
        <section style={{ width: '25%', minWidth: '250px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '24px',
            borderRadius: '16px',
            marginRight: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              marginTop: 0, 
              color: '#1e293b',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>🔍 Recherche</h3>
            <input
              type="text"
              placeholder="Rechercher un livre..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                marginBottom: '24px',
                fontSize: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
            
            <h3 style={{ 
              color: '#1e293b',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>📚 Catégories</h3>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                marginBottom: '24px',
                fontSize: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                outline: 'none'
              }}
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <div style={{ 
              fontSize: '14px', 
              color: '#64748b',
              backgroundColor: 'rgba(248, 250, 252, 0.8)',
              padding: '16px',
              borderRadius: '8px'
            }}>
              <p style={{ margin: '0 0 8px 0' }}><strong>Total :</strong> {totalBooks} livre(s)</p>
              {searchTerm && (
                <p style={{ margin: '0 0 8px 0' }}><strong>Recherche :</strong> "{searchTerm}"</p>
              )}
              {selectedCategory && (
                <p style={{ margin: '0' }}><strong>Catégorie :</strong> {selectedCategory}</p>
              )}
            </div>
          </div>
        </section>

        {/* Zone principale avec les livres */}
        <div style={{ flex: 1 }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '24px',
            borderRadius: '16px',
            minHeight: '80vh',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '24px' 
            }}>
              <h1 style={{ 
                margin: 0,
                color: '#1e293b',
                fontSize: '28px',
                fontWeight: '700'
              }}>
                {searchTerm ? `Résultats pour "${searchTerm}"` : 
                 selectedCategory ? `Catégorie: ${selectedCategory}` : 
                 'Tous les livres'}
              </h1>
              
              {(searchTerm || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setCurrentPage(1);
                  }}
                  style={{ 
                    background: '#ef4444', 
                    color: 'white', 
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = '#dc2626'}
                  onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = '#ef4444'}
                >
                  Réinitialiser
                </button>
              )}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <div style={{ 
                  fontSize: '18px', 
                  marginBottom: '20px',
                  color: '#1e293b',
                  fontWeight: '500'
                }}>
                  Chargement des livres...
                </div>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  border: '4px solid #e2e8f0',
                  borderTop: '4px solid #1e293b',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto'
                }}></div>
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '50px', color: '#ef4444' }}>
                <h3 style={{ color: '#ef4444', fontSize: '20px', fontWeight: '600' }}>❌ {error}</h3>
                <button 
                  onClick={fetchBooks}
                  style={{ 
                    marginTop: '20px',
                    background: '#1e293b',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Réessayer
                </button>
              </div>
            ) : books.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <h3 style={{ color: '#1e293b', fontSize: '20px', fontWeight: '600' }}>📚 Aucun livre trouvé</h3>
                <p style={{ color: '#64748b', fontSize: '16px' }}>
                  {searchTerm || selectedCategory 
                    ? 'Essayez de modifier vos critères de recherche.' 
                    : 'La bibliothèque est vide pour le moment.'}
                </p>
              </div>
            ) : (
              <>
                {/* Grille des livres */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '20px',
                  marginBottom: '30px'
                }}>
                  {books.map(book => (
                    <BookCard 
                      key={book.id} 
                      book={{
                        id: book.id,
                        title: book.title,
                        author: book.author || 'Auteur inconnu',
                        cover: getBookImageUrl(book) || `https://picsum.photos/200/300?random=${book.id}`,
                        category: book.category || 'Non catégorisé',
                        available_copies: book.available_copies,
                        total_copies: book.total_copies,
                        status: book.status,
                        description: book.description || 'Aucune description disponible'
                      }}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    gap: '12px',
                    marginTop: '32px' 
                  }}>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      style={{
                        background: currentPage === 1 ? '#e2e8f0' : '#1e293b',
                        color: currentPage === 1 ? '#94a3b8' : 'white',
                        border: 'none',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      ← Précédent
                    </button>
                    
                    <span style={{ 
                      margin: '0 20px', 
                      fontSize: '16px',
                      color: '#1e293b',
                      fontWeight: '500'
                    }}>
                      Page {currentPage} sur {totalPages}
                    </span>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      style={{
                        background: currentPage === totalPages ? '#e2e8f0' : '#1e293b',
                        color: currentPage === totalPages ? '#94a3b8' : 'white',
                        border: 'none',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Suivant →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  width: '95%',
  margin: '20px auto',
  gap: '20px',
  minHeight: 'calc(100vh - 100px)'
};

export default Home;
