import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import bookService from '../services/bookService';

export const useAuthorDashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const res = await bookService.getMyBooks(page, 10);
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
        console.error("Failed to fetch published books", error);
        setBooks([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBooks();
  }, [page]);

  const handleDeleteBook = async (id, title) => {
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa tác phẩm "${title}" không? Hành động này không thể hoàn tác.`);
    if (!confirmDelete) return;

    try {
      const res = await bookService.deleteBook(id);
      if (res.code === 200 || res.code === 1000 || res.result) {
        alert('Xóa tác phẩm thành công!');
        setBooks(prev => prev.filter(book => book.id !== id));
      } else {
        alert('Có lỗi xảy ra khi xóa: ' + (res.message || 'Không rõ nguyên nhân'));
      }
    } catch (error) {
      console.error("Failed to delete book", error);
      const errorDetail = error.response?.data?.message || error.response?.data?.result || error.message || "Lỗi mạng hoặc máy chủ không phản hồi";
      alert(`Không thể xóa tác phẩm. Chi tiết: ${errorDetail}`);
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
    ROUTES
  };
};
