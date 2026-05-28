import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
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
        // Fetch Author Profile
        const userRes = await userService.getUserById(userId);
        let userData = null;
        if (userRes.code === 200 || userRes.code === 1000 || !userRes.code) {
          userData = userRes.result || userRes.data || userRes;
        } else {
          userData = userRes;
        }
        setAuthor(userData);

        // Fetch Author's Books
        const booksRes = await bookService.getAuthorBooks(userId, page, 10);
        const booksSuccess = booksRes.code === 200 || booksRes.code === 1000 || !booksRes.code;
        if (booksSuccess && booksRes.result && booksRes.result.content) {
          setBooks(booksRes.result.content);
          setTotalPages(booksRes.result.totalPages || 0);
        } else if (booksRes.content) {
          setBooks(booksRes.content);
          setTotalPages(booksRes.totalPages || 0);
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
