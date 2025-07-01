import BookContent from '@/components/BookContent';

interface BookPageProps {
  params: {
    id: string;
  };
}

export default function BookPage({ params }: BookPageProps) {
  return <BookContent bookId={params.id} />;
}

export function generateStaticParams() {
  // Génère les paramètres statiques pour toutes les pages de livres
  const books = Array.from({ length: 12 }, (_, i) => ({ id: String(i + 1) }));
  
  return books.map((book) => ({
    id: book.id,
  }));
}
