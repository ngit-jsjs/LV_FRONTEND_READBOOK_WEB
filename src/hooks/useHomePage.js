import { useState, useEffect } from 'react';
import bookService from '../services/bookService';

export const useHomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await bookService.getPublicBooks(0, 10);
        const data = res.result;
        if (data && data.content) {
          setBooks(data.content);
        } else {
          setBooks([]);
        }
      } catch (error) {
        console.error("Failed to fetch public books:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const trendingBooks = books.slice(0, 3);
  const recommendedBooks = books.slice(3, 10);

  return {
    loading,
    trendingBooks,
    recommendedBooks
  };
};
