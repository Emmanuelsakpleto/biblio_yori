"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function AddReviewPage() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookId = searchParams.get('bookId');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!bookId) {
    // Redirige si pas d'id de livre
    if (typeof window !== 'undefined') router.replace('/books');
    return <div style={{ textAlign: 'center', marginTop: 40 }}>Aucun livre sélectionné.</div>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ book_id: bookId, rating, comment })
      });
      const data = await res.json();
      if (res.ok) setMessage('Avis envoyé, en attente de validation.');
      else setMessage(data.error || 'Erreur lors de l\'envoi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <main className="bookContainer">
        <aside>
          <h2 className="center">Ajouter un avis</h2>
          {message && <div style={{ color: 'green', marginBottom: 12 }}>{message}</div>}
          <form onSubmit={handleSubmit}>
            <label>
              Note :
              <select value={rating} onChange={e => setRating(Number(e.target.value))} style={{ marginLeft: 8 }}>
                {[1,2,3,4,5].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
            <br /><br />
            <label>
              Commentaire :<br />
              <textarea value={comment} onChange={e => setComment(e.target.value)} required rows={4} style={{ width: '100%' }} />
            </label>
            <br />
            <button type="submit" className="saveButton" disabled={loading}>
              {loading ? 'Envoi...' : 'Envoyer'}
            </button>
          </form>
        </aside>
      </main>
    </ProtectedRoute>
  );
}
