import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import bookListService from '../services/bookListService';
import { ROUTES } from '../config/routes';
import { getErrorMessage } from '../services/apiClient';

export const useFollowedBooks = (user) => {
  const navigate = useNavigate();
  const { listId } = useParams();
  const selectedListId = listId ? Number(listId) : null;

  const setSelectedListId = (id) => {
    if (id === null) {
      navigate(ROUTES.FOLLOWED_BOOKS);
    } else {
      navigate(ROUTES.FOLLOWED_BOOKS_DETAIL.replace(':listId', id));
    }
  };

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [bookLists, setBookLists] = useState([]);
  const [bookListsPage, setBookListsPage] = useState(0);
  const [bookListsTotalPages, setBookListsTotalPages] = useState(0);

  const fetchFollowedBooks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const listsRes = await bookListService.getMyBookLists(bookListsPage, 8);
      const data = listsRes.result || listsRes;

      if (data && data.content && Array.isArray(data.content)) {
        setBookLists(data.content);
        setBookListsTotalPages(data.totalPages || 0);
      } else if (Array.isArray(data)) {
        setBookLists(data);
        setBookListsTotalPages(data.length > 0 ? 1 : 0);
      } else {
        setBookLists([]);
        setBookListsTotalPages(0);
      }

      if (selectedListId) {
        const booksRes = await bookListService.getBooksInBookList(selectedListId, page, 8);
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
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [user, page, selectedListId, bookListsPage]);

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN);
      return;
    }
    fetchFollowedBooks();
  }, [user, page, selectedListId, bookListsPage, fetchFollowedBooks, navigate]);

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
      alert(getErrorMessage(err));
    }
  };

  const handleCreateList = async (name) => {
    if (!name || !name.trim()) return false;
    try {
      setLoading(true);
      await bookListService.createBookList({ name: name.trim() });
      alert("Đã tạo danh sách mới thành công.");
      await fetchFollowedBooks();
      return true;
    } catch (err) {
      console.error("Tạo danh sách thất bại:", err);
      alert(getErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRenameList = async (listId, newName) => {
    const targetId = listId || selectedListId;
    if (!targetId) return false;
    if (!newName || !newName.trim()) return false;

    try {
      setLoading(true);
      await bookListService.updateBookList(targetId, { name: newName.trim() });
      alert("Đã đổi tên danh sách thành công.");
      await fetchFollowedBooks();
      return true;
    } catch (err) {
      console.error("Đổi tên thất bại:", err);
      alert(getErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteList = async (listId) => {
    const targetId = listId || selectedListId;
    if (!targetId) return;
    if (bookLists.length <= 1) {
      alert("Bạn phải giữ lại ít nhất một danh sách theo dõi.");
      return;
    }
    const currentList = bookLists.find(l => l.id === targetId);
    if (!window.confirm(`Bạn có chắc chắn muốn xóa toàn bộ danh sách "${currentList?.name}"? Các sách đang theo dõi trong danh sách này sẽ bị bỏ theo dõi.`)) {
      return;
    }

    try {
      setLoading(true);
      await bookListService.deleteBookList(targetId);
      alert("Đã xóa danh sách thành công.");
      if (targetId === selectedListId) {
        setSelectedListId(null);
      }
      await fetchFollowedBooks();
    } catch (err) {
      console.error("Xóa danh sách thất bại:", err);
      alert(getErrorMessage(err));
    } finally {
      setLoading(false);
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
    handleCreateList,
    handleRenameList,
    handleDeleteList,
    fetchFollowedBooks
  };
};
