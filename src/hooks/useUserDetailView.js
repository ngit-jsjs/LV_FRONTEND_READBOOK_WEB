import { useState, useEffect } from 'react';
import bookService from '../services/bookService';
import { getErrorMessage } from '../services/apiClient';

export const useUserDetailView = (user) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Book Edit Modal State
  const [editingBook, setEditingBook] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserBooks = async () => {
      setLoading(true);
      try {
        const res = await bookService.getAuthorBooks(user.id, page, 12);
        const data = res.result;
        if (data && data.content) {
          setBooks(data.content);
          setTotalPages(data.totalPages || 0);
        } else {
          setBooks([]);
          setTotalPages(0);
        }
      } catch (error) {
        console.error("Failed to fetch user books:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserBooks();
    }
  }, [user, page]);

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

  const handleEditClick = (book) => {
    setEditingBook(book);
    setTitle(book.title || '');
    setAuthor(book.author || '');
    setPublisher(book.publisher || '');
    setYear(book.year || new Date().getFullYear());
    setStatus(book.status || 'DRAFT');
    setDescription(book.description || '');
    setCoverFile(null);
  };

  const closeEditModal = () => {
    setEditingBook(null);
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      alert("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    setIsSubmitting(true);
    try {
      const bookData = {
        title: title.trim(),
        author: author.trim(),
        status,
        description: description.trim(),
        publisher: publisher.trim(),
        year: parseInt(year) || new Date().getFullYear(),
        categoryIds: editingBook.categoryIds || []
      };

      const formData = new FormData();
      if (coverFile) {
        formData.append("file", coverFile);
      }
      formData.append(
        "request",
        new Blob([JSON.stringify(bookData)], { type: "application/json" })
      );

      await bookService.updateBook(editingBook.id, formData);
      alert('Cập nhật thông tin sách thành công!');

      // Update state locally
      setBooks(prev =>
        prev.map(b =>
          b.id === editingBook.id
            ? {
                ...b,
                ...bookData,
                coverImageUrl: coverFile ? URL.createObjectURL(coverFile) : b.coverImageUrl
              }
            : b
        )
      );

      setEditingBook(null);
    } catch (err) {
      console.error(err);
      alert(`Không thể cập nhật sách. Chi tiết: ${getErrorMessage(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    books,
    setBooks,
    loading,
    page,
    setPage,
    totalPages,
    handleDeleteBook,
    // Edit Book exports
    editingBook,
    title,
    setTitle,
    author,
    setAuthor,
    publisher,
    setPublisher,
    year,
    setYear,
    status,
    setStatus,
    description,
    setDescription,
    coverFile,
    setCoverFile,
    isSubmitting,
    handleEditClick,
    closeEditModal,
    handleSaveBook
  };
};
