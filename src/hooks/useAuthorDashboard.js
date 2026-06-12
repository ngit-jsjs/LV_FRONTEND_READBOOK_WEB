import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import bookService from '../services/bookService';
import { getErrorMessage } from '../services/apiClient';

export const useAuthorDashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      console.log(`[AuthorDashboard] Fetching books - Keyword: "${searchKeyword}", Page: ${page}`);
      try {
        const res = await bookService.getMyUploadBooks(searchKeyword, page, 12);
        const data = res.result;
        if (data && data.content) {
          setBooks(data.content);
          setTotalPages(data.totalPages || 0);
        } else {
          setBooks([]);
          setTotalPages(0);
        }
      } catch (error) {
        console.error("Failed to fetch published books", error);
        setBooks([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBooks();
  }, [page, searchKeyword]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setPage(0);
    setSearchKeyword(keyword);
  };

  const handleDeleteBook = async (id, title) => {
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa tác phẩm "${title}" không? Hành động này không thể hoàn tác.`);
    if (!confirmDelete) return;

    try {
      await bookService.deleteBook(id);
      alert('Xóa tác phẩm thành công!');
      setBooks(prev => prev.filter(book => book.id !== id));
    } catch (error) {
      console.error("Failed to delete book", error);
      alert(`Không thể xóa tác phẩm. Chi tiết: ${getErrorMessage(error)}`);
    }
  };

  return {
    books,
    isLoading,
    page,
    setPage,
    totalPages,
    handleDeleteBook,
    navigate,
    ROUTES,
    keyword,
    setKeyword,
    handleSearchSubmit
  };
};
