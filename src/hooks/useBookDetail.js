import { useState, useEffect, useCallback } from 'react';
import bookService from '../services/bookService';
import { getErrorMessage } from '../services/apiClient';

export const useBookDetail = (id) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBook = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await bookService.getBookById(id);
      setBook(res.result);
    } catch (err) {
      console.error("Failed to fetch book detail:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  return { book, loading, error, refetch: fetchBook };
};
