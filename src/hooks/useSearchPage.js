import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import bookService from '../services/bookService';

export const useSearchPage = () => {
  const [searchParams] = useSearchParams();
  const initialKeyword = searchParams.get('keyword') || '';
  
  const [keyword, setKeyword] = useState(initialKeyword);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      const queryKeyword = keyword || '';
      
      setLoading(true);
      try {
        const res = await bookService.searchBooks(queryKeyword, page, 10);
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
        console.error("Lỗi khi tìm kiếm sách:", error);
        setBooks([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [keyword, page]);

  return {
    keyword,
    setKeyword,
    books,
    loading,
    page,
    setPage,
    totalPages
  };
};
