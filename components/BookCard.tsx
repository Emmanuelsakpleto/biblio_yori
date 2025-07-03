'use client';

import { useRouter } from 'next/navigation';

interface BookCardProps {
  book: {
    id: number;
    title: string;
    author: string;
    cover: string;
    category: string;
    available_copies: number;
    total_copies: number;
    status: string;
    description: string;
  };
  onClick?: () => void;
}

const BookCard = ({ book, onClick }: BookCardProps) => {
  const router = useRouter();
  
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = `https://picsum.photos/200/300?random=${book.id}`;
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/book/${book.id}`);
    }
  };

  return (
    <div 
      style={cardStyle} 
      onClick={handleClick}
      onMouseEnter={(e) => {
        (e.target as HTMLElement).style.transform = 'translateY(-4px)';
        (e.target as HTMLElement).style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLElement).style.transform = 'translateY(0)';
        (e.target as HTMLElement).style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
      }}
    >
      <img 
        src={book.cover} 
        alt={book.title} 
        style={imageStyle}
        onError={handleError}
      />
      <div style={contentStyle}>
        <h3 style={titleStyle}>{book.title}</h3>
        <p style={authorStyle}>par {book.author}</p>
        <p style={categoryStyle}>📚 {book.category}</p>
        <p style={descriptionStyle}>{book.description}</p>
        <div style={availabilityStyle}>
          <span style={{ 
            color: book.available_copies > 0 ? '#22c55e' : '#ef4444',
            fontWeight: 'bold'
          }}>
            {book.available_copies > 0 ? '✅ Disponible' : '❌ Indisponible'}
          </span>
          <span style={{ fontSize: '12px', color: '#666' }}>
            ({book.available_copies}/{book.total_copies})
          </span>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  width: '200px',
  padding: '1rem',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  marginBottom: '1.5rem',
  marginRight: '1.6rem',
};

const imageStyle = {
  width: '100%',
  aspectRatio: 1,
  borderRadius: '8px',
  objectFit: 'cover' as const,
};

const contentStyle = {
  marginTop: '1rem',
};

const titleStyle = {
  fontSize: '1.2rem',
  marginBottom: '0.5rem',
  color: '#1e293b',
  fontWeight: '600'
};

const authorStyle = {
  fontSize: '0.9rem',
  color: '#64748b',
  marginBottom: '0.3rem',
  fontStyle: 'italic'
};

const categoryStyle = {
  fontSize: '0.8rem',
  color: '#64748b',
  marginBottom: '0.5rem'
};

const descriptionStyle = {
  fontSize: '0.8rem',
  color: '#64748b',
  lineHeight: '1.4',
  marginBottom: '0.5rem',
  display: '-webkit-box' as const,
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical' as const,
  overflow: 'hidden'
};

const availabilityStyle = {
  display: 'flex',
  justifyContent: 'space-between' as const,
  alignItems: 'center' as const,
  marginTop: '0.5rem',
  fontSize: '0.8rem'
};

export default BookCard;
