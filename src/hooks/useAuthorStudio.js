import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import chapterService from '../services/chapterService';
import bookService from '../services/bookService';
import { ROUTES } from '../config/routes';
import { getErrorMessage } from '../services/apiClient';

export const useAuthorStudio = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [chapterNumber, setChapterNumber] = useState(1);
  const [isFree, setIsFree] = useState(true);
  const [isPublished, setIsPublished] = useState(false);
  const [price, setPrice] = useState(0);

  // States for Quick Edit popup
  const [editingChapter, setEditingChapter] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editChapterNumber, setEditChapterNumber] = useState(1);
  const [editIsFree, setEditIsFree] = useState(true);
  const [editPrice, setEditPrice] = useState(0);
  const [editIsPublished, setEditIsPublished] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    if (!bookId) {
      navigate(ROUTES.AUTHOR_DASHBOARD);
      return;
    }
    fetchData();
  }, [bookId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const bookRes = await bookService.getBookById(bookId);
      setBook(bookRes.result);

      const chapRes = await chapterService.getChaptersByBookId(bookId);
      const raw = chapRes.result;
      let chapData = [];
      if (Array.isArray(raw)) chapData = raw;
      else if (raw?.content) chapData = raw.content;
      
      setChapters(chapData);
      if (chapData.length > 0) {
        handleSelectChapter(chapData[0]);
      } else {
        handleCreateNewChapter(1);
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChapter = (chapter) => {
    setSelectedChapter(chapter);
    setTitle(chapter.title || '');
    setContent(chapter.content || '');
    setChapterNumber(chapter.chapterNumber || chapters.length + 1);
    setIsFree(chapter.isFree !== false);
    setIsPublished(chapter.isPublished === true);
    setPrice(chapter.price || 0);
  };

  const handleCreateNewChapter = (nextNumber) => {
    setSelectedChapter(null);
    setTitle('');
    setContent('');
    setChapterNumber(nextNumber || chapters.length + 1);
    setIsFree(true);
    setIsPublished(false);
    setPrice(0);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề chương');
      setSaving(false);
      return;
    }

    if (!isFree && Number(price) <= 0) {
      setError('Chương trả phí phải có giá lớn hơn 0');
      setSaving(false);
      return;
    }

    const payload = {
      chapterNumber: Number(chapterNumber),
      title,
      content,
      isFree,
      isPublished,
      price: !isFree ? Number(price) : 0
    };

    try {
      if (selectedChapter) {
        await chapterService.updateChapter(selectedChapter.id, payload);
      } else {
        await chapterService.createChapter(bookId, payload);
      }

      await fetchData();
      alert('Lưu thành công!');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (chapterId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chương này?")) return;
    try {
      await chapterService.deleteChapter(chapterId);
      fetchData();
    } catch (err) {
      alert("Xóa thất bại");
    }
  };

  const handleImportEpub = async (file) => {
    if (!file) return;
    setImporting(true);
    try {
      await bookService.importEpub(bookId, file);
      alert('Import chương từ file EPUB thành công!');
      await fetchData();
    } catch (err) {
      console.error(err);
      alert(`Import thất bại: ${getErrorMessage(err)}`);
    } finally {
      setImporting(false);
    }
  };

  const handleEditClick = (chapter) => {
    setEditingChapter(chapter);
    setEditTitle(chapter.title || '');
    setEditChapterNumber(chapter.chapterNumber || 1);
    setEditIsFree(chapter.isFree !== false);
    setEditPrice(chapter.price || 0);
    setEditIsPublished(chapter.isPublished === true);
    setEditError('');
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      setEditError('Vui lòng nhập tiêu đề chương');
      return;
    }
    if (Number(editChapterNumber) <= 0) {
      setEditError('Số chương phải lớn hơn 0');
      return;
    }
    if (!editIsFree && Number(editPrice) <= 0) {
      setEditError('Chương trả phí phải có giá lớn hơn 0 xu');
      return;
    }
    setEditSubmitting(true);
    setEditError('');
    try {
      const payload = {
        chapterNumber: Number(editChapterNumber),
        title: editTitle.trim(),
        isFree: editIsFree,
        isPublished: editIsPublished,
        price: !editIsFree ? Number(editPrice) : 0,
        content: null
      };
      await chapterService.updateChapter(editingChapter.id, payload);
      alert('Cập nhật chương thành công!');
      setEditingChapter(null);
      fetchData();
    } catch (err) {
      setEditError(getErrorMessage(err));
    } finally {
      setEditSubmitting(false);
    }
  };

  const closeEditModal = () => {
    setEditingChapter(null);
  };

  return {
    book,
    bookId,
    chapters,
    selectedChapter,
    loading,
    saving,
    error,
    setError,
    title, setTitle,
    content, setContent,
    chapterNumber, setChapterNumber,
    isFree, setIsFree,
    isPublished, setIsPublished,
    price, setPrice,
    handleSelectChapter,
    handleCreateNewChapter,
    handleSave,
    handleDelete,
    importing,
    handleImportEpub,
    fetchData,
    // Quick Edit Popup exports
    editingChapter,
    setEditingChapter,
    editTitle,
    setEditTitle,
    editChapterNumber,
    setEditChapterNumber,
    editIsFree,
    setEditIsFree,
    editPrice,
    setEditPrice,
    editIsPublished,
    setEditIsPublished,
    editSubmitting,
    editError,
    handleEditClick,
    handleUpdateSubmit,
    closeEditModal
  };
};
