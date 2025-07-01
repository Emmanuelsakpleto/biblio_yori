'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { books } from '../data/books';
import BookCard from './BookCard';
import Header from './Header';
import Sidebar from './Sidebar';

const Home = () => {
  return (
    <div style={{ width: "95%", margin: 'auto' }}>
      <div>
        <Header />
        
        <div style={containerStyle}>
          <section style={{ width: '30%' }}>
            <Sidebar />
          </section>
          <div style={{
            background: '#f8eadd',
            margin: '0 30px',
            padding: '10px 1px',
            borderRadius: '20px'
          }}>
            <h1 style={{ paddingLeft: '40px' }}>ALL BOOKS</h1>
            <ul style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              listStyle: 'none'
            }}>
              {books.map((book, i) => (
                <motion.li
                  key={book.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', damping: 50, mass: 0.75 }}
                  initial={{ opacity: 0, x: 200 * (i + 1) }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Link href={`/book/${book.id}`} style={{ textDecoration: 'none' }}>
                    <BookCard 
                      title={book.title} 
                      description={book.description} 
                      coverImage={book.image} 
                    />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

const containerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start'
};
