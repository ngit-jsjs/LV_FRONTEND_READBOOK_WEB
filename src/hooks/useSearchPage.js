import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import bookService from '../services/bookService';
import { getErrorMessage } from '../services/apiClient';

export const useSearchPage = () => {
  const [searchParams] = useSearchParams();
  
  const keyword = searchParams.get('keyword') || '';
  const author = searchParams.get('author') || '';
  const publisher = searchParams.get('publisher') || '';
  const year = searchParams.get('year') || '';
  const categoryIds = searchParams.get('categories')
    ? searchParams.get('categories').split(',').map(Number)
    : [];

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Reset page when search criteria change
  useEffect(() => {
    setPage(0);
  }, [keyword, author, publisher, year, searchParams.get('categories')]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError('');
      try {
        const hasFilter = Boolean(keyword || author || publisher || year || (categoryIds && categoryIds.length > 0));
        let res;
        if (hasFilter) {
          res = await bookService.searchBooks(
            keyword,
            author,
            publisher,
            year,
            categoryIds,
            page,
            12
          );
        } else {
          res = await bookService.getPublicBooks(page, 12);
        }
        
        const data = res.result;
        if (data && data.content) {
          setBooks(data.content);
          setTotalPages(data.totalPages || 0);
        } else {
          setBooks([]);
          setTotalPages(0);
        }
      } catch (err) {
        console.error("Lỗi khi tìm kiếm sách:", err);
        setBooks([]);
        setTotalPages(0);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [keyword, author, publisher, year, searchParams.get('categories'), page]);

  return {
    keyword,
    author,
    publisher,
    year,
    categoryIds,
    books,
    loading,
    error,
    page,
    setPage,
    totalPages
  };
};
