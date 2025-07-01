'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Editor, useDomValue } from 'reactjs-editor';
import { books, Book } from '../data/books';
import '../app/styles/BookContent.css';

interface BookContentProps {
  bookId: string;
}

const BookContent = ({ bookId }: BookContentProps) => {
  const router = useRouter();
  const { dom, setDom } = useDomValue();
  const [selectedBook, setSelectedBook] = useState<Book | undefined>(books.find((book: Book) => book.id === parseInt(bookId)));

  const handleGoBack = () => {
    router.back();
  };

  const notify = () => toast("HTML content saved.", {
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

  if (!selectedBook) {
    return <div>Book not found</div>;
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
        <div className="left-icons" onClick={handleGoBack}>
          <i style={{ fontSize: '20px', cursor: 'pointer' }} className="fas fa-chevron-left"></i>
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
          <button className='saveButton' onClick={handleSave}>Save</button>
          <i style={{ marginRight: '20px', fontSize: '20px' }} className="fas fa-cog"></i>
          <i style={{ marginRight: '20px', fontSize: '20px' }} className="fas fa-share"></i>
          <i style={{ marginRight: '20px', fontSize: '20px' }} className="fas fa-search"></i>
        </div>
      </motion.section>

      <Editor
        htmlContent={`<main className='bookContainer'>
          <aside>
            <h1 className="center">${selectedBook.title}</h1>
            <span className='center small'> By ${selectedBook.author}</span>
            ${selectedBook.content}
          </aside>
        </main>`}
      />

      <ToastContainer />
    </motion.div>
  );
};

export default BookContent;
