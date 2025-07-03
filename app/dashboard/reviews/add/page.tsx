"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import { useConfig } from '../../../../contexts/ConfigContext';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { bookService, reviewService, type Book } from '../../../../lib/api';
import Link from 'next/link';

export default function AddReviewPage() {
  const { user } = useAuth();
  const config = useConfig();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [bookId, setBookId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await bookService.getBooks({ limit: 100 });
      if (response.success && response.data) {
        setBooks(response.data.books);
      } else {
        setError('Erreur lors du chargement des livres');
      }
    } catch (err) {
      setError('Erreur lors du chargement des livres');
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setBookId(book.id.toString());
    setSearchTerm('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    
    try {
      const response = await reviewService.createReview({
        book_id: parseInt(bookId),
        rating,
        comment: comment.trim()
      });
      
      if (response.success) {
        setMessage('Avis envoyé avec succès ! Il sera publié après modération.');
        // Réinitialiser le formulaire
        setSelectedBook(null);
        setBookId('');
        setRating(5);
        setComment('');
        
        // Rediriger vers la liste des avis après 2 secondes
        setTimeout(() => {
          router.push('/dashboard/reviews');
        }, 2000);
      } else {
        setError(response.message || 'Erreur lors de l\'envoi de l\'avis');
      }
    } catch (err) {
      setError('Erreur lors de l\'envoi de l\'avis');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (currentRating: number, onRatingChange: (rating: number) => void) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onRatingChange(i + 1)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: i < currentRating ? '#ffd700' : '#ddd',
              padding: '0',
              margin: '0'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffd700';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = i < currentRating ? '#ffd700' : '#ddd';
            }}
          >
            ★
          </button>
        ))}
        <span style={{ marginLeft: '10px', fontSize: '16px' }}>
          {currentRating}/5
        </span>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <main className="bookContainer">
        <aside>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="center" style={{ margin: 0 }}>Ajouter un avis</h2>
            <Link 
              href="/dashboard/reviews" 
              className="saveButton"
            >
              ← Retour à mes avis
            </Link>
          </div>
          
          <p className="small">
            Partagez votre opinion sur un livre de notre collection
          </p>
          
          {message && (
            <div style={{ 
              background: '#e8f5e8', 
              color: '#2e7d32', 
              padding: '10px', 
              borderRadius: '5px', 
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}
          
          {error && (
            <div style={{ 
              background: '#ffebee', 
              color: '#c62828', 
              padding: '10px', 
              borderRadius: '5px', 
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            {/* Sélection du livre */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Livre à évaluer *
              </label>
              
              {!selectedBook ? (
                <div>
                  <input
                    type="text"
                    placeholder="Rechercher un livre par titre ou auteur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      marginBottom: '10px'
                    }}
                  />
                  
                  {searchTerm && (
                    <div style={{
                      maxHeight: '200px',
                      overflowY: 'auto',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      background: 'white'
                    }}>
                      {filteredBooks.slice(0, 10).map(book => (
                        <div
                          key={book.id}
                          onClick={() => handleBookSelect(book)}
                          style={{
                            padding: '10px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #eee'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f5f5f5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                          }}
                        >
                          <strong>{book.title}</strong><br />
                          <small>par {book.author}</small>
                        </div>
                      ))}
                      {filteredBooks.length === 0 && (
                        <div style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
                          Aucun livre trouvé
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="hover-card" style={{ 
                  padding: '15px', 
                  borderRadius: '5px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong>{selectedBook.title}</strong><br />
                    <small>par {selectedBook.author}</small>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBook(null);
                      setBookId('');
                    }}
                    style={{
                      background: '#ff4444',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    Changer
                  </button>
                </div>
              )}
            </div>

            {/* Note */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Votre note *
              </label>
              {renderStars(rating, setRating)}
            </div>

            {/* Commentaire */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Votre commentaire *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={5}
                placeholder="Partagez votre opinion sur ce livre..."
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              <small style={{ color: '#666' }}>
                Minimum 10 caractères ({comment.length}/500)
              </small>
            </div>

            {/* Boutons */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="submit"
                disabled={loading || !selectedBook || comment.length < 10}
                className="saveButton"
                style={{
                  background: loading || !selectedBook || comment.length < 10 ? '#ccc' : '#44aa44',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  marginRight: '10px'
                }}
              >
                {loading ? 'Envoi en cours...' : 'Publier l\'avis'}
              </button>
              
              <Link 
                href="/dashboard/reviews"
                className="saveButton"
              >
                Annuler
              </Link>
            </div>
          </form>

          <div style={{ 
            marginTop: '30px', 
            paddingTop: '20px', 
            borderTop: '1px solid #ddd',
            fontSize: '14px',
            color: '#666',
            textAlign: 'center'
          }}>
            <p>
              📝 Votre avis sera modéré avant publication.<br />
              ⭐ Soyez constructif et respectueux dans vos commentaires.
            </p>
          </div>
        </aside>
      </main>
    </ProtectedRoute>
  );
}
