import { useState, useEffect } from 'react';
import bookService from '../services/bookService';

export const useUserDetailView = (user) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchUserBooks = async () => {
      setLoading(true);
      try {
        const res = await bookService.getAuthorBooks(user.id, page, 10);
        const success = res.code === 200 || res.code === 1000 || !res.code;
        if (success && res.result && res.result.content) {
          setBooks(res.result.content);
          setTotalPages(res.result.totalPages || 0);
        } else if (res.content) {
          setBooks(res.content);
          setTotalPages(res.totalPages || 0);
        } else {
          setBooks([]);
          setTotalPages(0);
        }
      } catch (error) {
        console.error("Failed to fetch user books:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserBooks();
    }
  }, [user, page]);

  return {
    books,
    loading,
    page,
    setPage,
    totalPages
  };
};
