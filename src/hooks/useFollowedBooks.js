import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bookListService from '../services/bookListService';
import { ROUTES } from '../config/routes';

export const useFollowedBooks = (user) => {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [bookLists, setBookLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN);
      return;
    }
    fetchFollowedBooks();
  }, [user, page, selectedListId]);

  const fetchFollowedBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const listsRes = await bookListService.getMyBookLists();
      const lists = listsRes.result || listsRes || [];
      setBookLists(lists);

      const activeListId = selectedListId || lists[0]?.id || null;
      if (!selectedListId && activeListId) {
        setSelectedListId(activeListId);
      }

      if (activeListId) {
        const booksRes = await bookListService.getBooksInBookList(activeListId, page, 8);
        if (booksRes.result) {
          setBooks(booksRes.result.content || []);
          setTotalPages(booksRes.result.totalPages || 0);
        }
      } else {
        setBooks([]);
        setTotalPages(0);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách theo dõi:", err);
      setError("Không thể tải danh sách tác phẩm đang theo dõi.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (bookId, bookTitle) => {
    if (!selectedListId) return;
    if (!window.confirm(`Bạn có chắc chắn muốn hủy theo dõi tác phẩm "${bookTitle}"?`)) {
      return;
    }
    try {
      await bookListService.removeBookFromBookList(selectedListId, bookId);
      alert("Đã hủy theo dõi tác phẩm.");
      if (books.length === 1 && page > 0) {
        setPage(prev => prev - 1);
      } else {
        fetchFollowedBooks();
      }
    } catch (err) {
      console.error("Hủy theo dõi thất bại:", err);
      alert("Không thể hủy theo dõi lúc này. Vui lòng thử lại.");
    }
  };

  return {
    books,
    bookLists,
    loading,
    error,
    page,
    setPage,
    totalPages,
    selectedListId,
    setSelectedListId,
    handleUnfollow,
    fetchFollowedBooks
  };
};
