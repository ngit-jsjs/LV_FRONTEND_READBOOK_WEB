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
    const urlKeyword = searchParams.get('keyword') || '';
    if (urlKeyword !== keyword) {
      setKeyword(urlKeyword);
      setPage(0);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchBooks = async () => {
      const queryKeyword = keyword || '';
      
      setLoading(true);
      try {
        let res;
        if (!queryKeyword) {
          res = await bookService.getPublicBooks(page, 12);
        } else {
          res = await bookService.searchBooks(queryKeyword, page, 12);
        }
        
        const data = res.result;
        if (data && data.content) {
          setBooks(data.content);
          setTotalPages(data.totalPages || 0);
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
