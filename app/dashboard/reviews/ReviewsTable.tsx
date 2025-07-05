import { Review } from '../../../lib/api';
import { useEffect, useState } from 'react';

interface ReviewsTableProps {
  reviews?: Review[];
  onApprovalChange?: (reviewId: number, newStatus: boolean) => void;
  onDelete?: (reviewId: number) => void;
}

export default function ReviewsTable({ 
  reviews, 
  onApprovalChange, 
  onDelete 
}: ReviewsTableProps) {
  const [pending, setPending] = useState<number | null>(null);
  const [localReviews, setLocalReviews] = useState<Review[]>(Array.isArray(reviews) ? reviews : []);

  useEffect(() => {
    setLocalReviews(Array.isArray(reviews) ? reviews : []);
  }, [reviews]);

  const handleModerate = async (id: number, action: 'approve' | 'reject') => {
    setPending(id);
    try {
      const res = await fetch(`/api/reviews/${id}/moderate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      
      if (res.ok) {
        const newStatus = action === 'approve';
        setLocalReviews((prev) => prev.map(r => 
          r.id === id ? { ...r, is_approved: newStatus } : r
        ));
        onApprovalChange?.(id, newStatus);
      } else {
        alert('Erreur lors de la modération');
      }
    } catch (error) {
      alert('Erreur lors de la modération');
    } finally {
      setPending(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet avis ? Cette action est irréversible.')) return;
    setPending(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLocalReviews((prev) => prev.filter(r => r.id !== id));
        onDelete?.(id);
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      alert('Erreur lors de la suppression');
    } finally {
      setPending(null);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span 
        key={i} 
        style={{ 
          color: i < rating ? '#ffd700' : '#ddd',
          fontSize: '16px',
          textShadow: i < rating ? '0 0 2px rgba(255, 215, 0, 0.5)' : 'none'
        }}
      >
        ★
      </span>
    ));
  };

  const getStatusBadge = (isApproved: boolean) => {
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500',
        background: isApproved ? '#ecfdf5' : '#fffbeb',
        color: isApproved ? '#065f46' : '#92400e',
        border: `1px solid ${isApproved ? '#10b981' : '#f59e0b'}`
      }}>
        {isApproved ? '✅ Approuvé' : '⏳ En attente'}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  if (!Array.isArray(localReviews) || localReviews.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        background: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>📝</div>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Aucun avis à afficher
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        background: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            <th style={{ 
              border: '1px solid #e2e8f0', 
              padding: '12px 16px',
              textAlign: 'left',
              fontWeight: '600',
              color: '#374151'
            }}>
              ID
            </th>
            <th style={{ 
              border: '1px solid #e2e8f0', 
              padding: '12px 16px',
              textAlign: 'left',
              fontWeight: '600',
              color: '#374151'
            }}>
              📚 Livre
            </th>
            <th style={{ 
              border: '1px solid #e2e8f0', 
              padding: '12px 16px',
              textAlign: 'left',
              fontWeight: '600',
              color: '#374151'
            }}>
              👤 Utilisateur
            </th>
            <th style={{ 
              border: '1px solid #e2e8f0', 
              padding: '12px 16px',
              textAlign: 'center',
              fontWeight: '600',
              color: '#374151'
            }}>
              ⭐ Note
            </th>
            <th style={{ 
              border: '1px solid #e2e8f0', 
              padding: '12px 16px',
              textAlign: 'left',
              fontWeight: '600',
              color: '#374151',
              maxWidth: '300px'
            }}>
              💭 Commentaire
            </th>
            <th style={{ 
              border: '1px solid #e2e8f0', 
              padding: '12px 16px',
              textAlign: 'center',
              fontWeight: '600',
              color: '#374151'
            }}>
              📅 Date
            </th>
            <th style={{ 
              border: '1px solid #e2e8f0', 
              padding: '12px 16px',
              textAlign: 'center',
              fontWeight: '600',
              color: '#374151'
            }}>
              🔄 Statut
            </th>
            <th style={{ 
              border: '1px solid #e2e8f0', 
              padding: '12px 16px',
              textAlign: 'center',
              fontWeight: '600',
              color: '#374151'
            }}>
              ⚙️ Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {localReviews.map((r, index) => (
            <tr 
              key={r.id}
              style={{ 
                background: index % 2 === 0 ? 'white' : '#fafafa',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f0f9ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#fafafa';
              }}
            >
              <td style={{ 
                border: '1px solid #e2e8f0', 
                padding: '12px 16px',
                fontWeight: '500',
                color: '#6b7280'
              }}>
                #{r.id}
              </td>
              
              <td style={{ 
                border: '1px solid #e2e8f0', 
                padding: '12px 16px',
                maxWidth: '200px'
              }}>
                <div style={{ fontWeight: '500', color: '#374151' }}>
                  {r.book?.title || `Livre ID: ${r.book_id}`}
                </div>
                {r.book?.author && (
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    par {r.book.author}
                  </div>
                )}
              </td>
              
              <td style={{ 
                border: '1px solid #e2e8f0', 
                padding: '12px 16px'
              }}>
                <div style={{ fontWeight: '500', color: '#374151' }}>
                  {r.user ? `${r.user.first_name} ${r.user.last_name}` : 'Utilisateur inconnu'}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  ID: {r.user_id}
                </div>
              </td>
              
              <td style={{ 
                border: '1px solid #e2e8f0', 
                padding: '12px 16px',
                textAlign: 'center'
              }}>
                <div style={{ marginBottom: '4px' }}>
                  {renderStars(r.rating)}
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  {r.rating}/5
                </div>
              </td>
              
              <td style={{ 
                border: '1px solid #e2e8f0', 
                padding: '12px 16px',
                maxWidth: '300px'
              }}>
                {r.comment ? (
                  <div style={{
                    maxHeight: '60px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: '1.4',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    "{r.comment}"
                  </div>
                ) : (
                  <span style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '14px' }}>
                    Aucun commentaire
                  </span>
                )}
              </td>
              
              <td style={{ 
                border: '1px solid #e2e8f0', 
                padding: '12px 16px',
                textAlign: 'center',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                {formatDate(r.created_at)}
              </td>
              
              <td style={{ 
                border: '1px solid #e2e8f0', 
                padding: '12px 16px',
                textAlign: 'center'
              }}>
                {getStatusBadge(r.is_approved)}
              </td>
              
              <td style={{ 
                border: '1px solid #e2e8f0', 
                padding: '12px 16px',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  {!r.is_approved ? (
                    <button 
                      onClick={() => handleModerate(r.id, 'approve')} 
                      disabled={pending === r.id}
                      style={{
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: pending === r.id ? 'not-allowed' : 'pointer',
                        opacity: pending === r.id ? 0.5 : 1
                      }}
                    >
                      {pending === r.id ? '⟳' : '✅'} Approuver
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleModerate(r.id, 'reject')} 
                      disabled={pending === r.id}
                      style={{
                        background: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: pending === r.id ? 'not-allowed' : 'pointer',
                        opacity: pending === r.id ? 0.5 : 1
                      }}
                    >
                      {pending === r.id ? '⟳' : '❌'} Refuser
                    </button>
                  )}
                  
                  <button 
                    onClick={() => handleDelete(r.id)} 
                    disabled={pending === r.id}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: pending === r.id ? 'not-allowed' : 'pointer',
                      opacity: pending === r.id ? 0.5 : 1
                    }}
                  >
                    {pending === r.id ? '⟳' : '🗑️'} Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Résumé en bas du tableau */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <span>
            📊 Total : {localReviews.length} avis
          </span>
          <span>
            ✅ Approuvés : {localReviews.filter(r => r.is_approved).length} | 
            ⏳ En attente : {localReviews.filter(r => !r.is_approved).length}
          </span>
        </div>
      </div>
    </div>
  );
}
