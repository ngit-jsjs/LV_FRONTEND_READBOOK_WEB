import { useState, useEffect } from 'react';
import userService from '../services/userService';
import bookService from '../services/bookService';

export const useAuthorProfile = (userId) => {
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchAuthorData = async () => {
      if (!userId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const userRes = await userService.getUserById(userId);
        setAuthor(userRes.result);

        const booksRes = await bookService.getAuthorBooks(userId, page, 12);
        const booksData = booksRes.result;
        if (booksData && booksData.content) {
          setBooks(booksData.content);
          setTotalPages(booksData.totalPages || 0);
        } else {
          setBooks([]);
          setTotalPages(0);
        }
        
      } catch (err) {
        console.error("Failed to fetch author profile:", err);
        setError("Không thể tải thông tin tác giả. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [userId, page]);

  return {
    author,
    books,
    loading,
    error,
    page,
    setPage,
    totalPages
  };
};
