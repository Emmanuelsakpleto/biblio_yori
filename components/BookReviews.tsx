import { useEffect, useState } from 'react';
import { reviewService } from '../lib/api';
import { Review } from '../lib/api';

interface BookReviewsProps {
  bookId: number;
}

export default function BookReviews({ bookId }: BookReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    reviewService.getBookReviews(bookId)
      .then(res => setReviews(res.data?.reviews || res.data || []))
      .catch(() => setError('Erreur lors du chargement des avis'))
      .finally(() => setLoading(false));
  }, [bookId]);

  if (loading) return <div>Chargement des avis...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!reviews.length) return <div>Aucun avis pour ce livre.</div>;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-2">Avis des lecteurs</h3>
      <ul className="space-y-4">
        {reviews.map((r) => (
          <li key={r.id} className="border rounded p-3 bg-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{r.user?.first_name} {r.user?.last_name}</span>
              <span className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              <span className="text-xs text-gray-400 ml-2">{new Date(r.created_at).toLocaleDateString('fr-FR')}</span>
              {!r.is_approved && <span className="ml-2 text-xs text-orange-600">(En attente modération)</span>}
            </div>
            <div>{r.comment}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
