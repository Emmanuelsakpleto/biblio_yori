import { Review } from '../../../lib/api';
import { useEffect, useState } from 'react';

interface ReviewsTableProps {
  reviews?: Review[];
}

export default function ReviewsTable({ reviews }: ReviewsTableProps) {
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
        setLocalReviews((prev) => prev.map(r => r.id === id ? { ...r, is_approved: action === 'approve' } : r));
      } else {
        alert('Erreur lors de la modération');
      }
    } finally {
      setPending(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet avis ?')) return;
    setPending(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLocalReviews((prev) => prev.filter(r => r.id !== id));
      } else {
        alert('Erreur lors de la suppression');
      }
    } finally {
      setPending(null);
    }
  };

  return (
    <table className="min-w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-4 py-2">ID</th>
          <th className="border px-4 py-2">Livre</th>
          <th className="border px-4 py-2">Utilisateur</th>
          <th className="border px-4 py-2">Note</th>
          <th className="border px-4 py-2">Commentaire</th>
          <th className="border px-4 py-2">Statut</th>
          <th className="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {(Array.isArray(localReviews) ? localReviews : []).map((r) => (
          <tr key={r.id}>
            <td className="border px-4 py-2">{r.id}</td>
            <td className="border px-4 py-2">{r.book?.title || r.book_id}</td>
            <td className="border px-4 py-2">{r.user?.first_name} {r.user?.last_name} ({r.user_id})</td>
            <td className="border px-4 py-2 text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
            <td className="border px-4 py-2">{r.comment}</td>
            <td className="border px-4 py-2">{r.is_approved ? 'Approuvé' : 'En attente'}</td>
            <td className="border px-4 py-2 space-x-2">
              {!r.is_approved && (
                <button onClick={() => handleModerate(r.id, 'approve')} disabled={pending === r.id} className="text-green-600 underline">Approuver</button>
              )}
              {r.is_approved && (
                <button onClick={() => handleModerate(r.id, 'reject')} disabled={pending === r.id} className="text-orange-600 underline">Refuser</button>
              )}
              <button onClick={() => handleDelete(r.id)} disabled={pending === r.id} className="text-red-600 underline">Supprimer</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
