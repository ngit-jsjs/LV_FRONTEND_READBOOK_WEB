import { useState, useEffect } from 'react';
import bookService from '../services/bookService';

export const useBookDetail = (id) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await bookService.getBookById(id);
        const success = res.code === 200 || res.code === 1000 || !res.code;
        if (success && res.result) {
          setBook(res.result);
        } else if (res.data && res.data.result) {
          setBook(res.data.result);
        } else {
          setBook(res);
        }
      } catch (err) {
        console.error("Failed to fetch book detail:", err);
        setError("Không thể tải thông tin tác phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  return { book, loading, error };
};
