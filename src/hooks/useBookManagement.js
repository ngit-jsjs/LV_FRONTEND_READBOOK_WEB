import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import bookService from '../services/bookService';
import { getErrorMessage } from '../services/apiClient';

export const useBookManagement = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Trạng thái bộ lọc bổ sung cho Admin
  const [status, setStatus] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState('');
  const [categoryIds, setCategoryIds] = useState([]);

  // Reset trang về 0 khi có bất kỳ điều kiện tìm kiếm nào thay đổi
  useEffect(() => {
    setPage(0);
  }, [searchKeyword, status, author, publisher, year, categoryIds]);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await bookService.getMyUploadBooks(
          searchKeyword,
          status,
          author,
          publisher,
          year,
          categoryIds,
          page,
          12
        );
        const data = res.result;
        if (data && data.content) {
          setBooks(data.content);
          setTotalPages(data.totalPages || 0);
        } else {
          setBooks([]);
          setTotalPages(0);
        }
      } catch (err) {
        console.error("Failed to fetch published books", err);
        setBooks([]);
        setTotalPages(0);
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBooks();
  }, [page, searchKeyword, status, author, publisher, year, categoryIds, refreshTrigger]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setPage(0);
    setSearchKeyword(keyword);
  };

  const handleDeleteBook = async (id, title, status) => {
    if (status === 'UNAVAILABLE') {
      const confirmEdit = window.confirm(`Tác phẩm "${title}" hiện đang bị ẩn. Bạn có muốn đến trang chỉnh sửa để chuyển sang trạng thái "Hiển thị" không?`);
      if (confirmEdit) {
        navigate(ROUTES.EDIT_BOOK.replace(':id', id));
      }
      return;
    }

    const confirmHide = window.confirm(`Bạn có chắc chắn muốn ẩn tác phẩm "${title}" không? (Sách bị ẩn sẽ tạm dừng hiển thị đối với độc giả)`);
    if (!confirmHide) return;

    try {
      await bookService.deleteBook(id);
      alert('Ẩn tác phẩm thành công!');
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Failed to hide book", error);
      alert(`Không thể ẩn tác phẩm. Chi tiết: ${getErrorMessage(error)}`);
    }
  };

  return {
    books,
    isLoading,
    error,
    page,
    setPage,
    totalPages,
    handleDeleteBook,
    navigate,
    ROUTES,
    keyword,
    setKeyword,
    handleSearchSubmit,
    status,
    setStatus,
    author,
    setAuthor,
    publisher,
    setPublisher,
    year,
    setYear,
    categoryIds,
    setCategoryIds
  };
};
