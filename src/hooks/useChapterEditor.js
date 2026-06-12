import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import chapterService from '../services/chapterService';
import bookService from '../services/bookService';
import { ROUTES } from '../config/routes';
import { getErrorMessage } from '../services/apiClient';

export const useChapterEditor = () => {
  const { bookId, chapterId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [chapterNumber, setChapterNumber] = useState(1);
  const [isFree, setIsFree] = useState(true);
  const [isPublished, setIsPublished] = useState(false);
  const [price, setPrice] = useState(0);

  const [isFocusMode, setIsFocusMode] = useState(true); 

  useEffect(() => {
    if (!bookId) {
      navigate(ROUTES.AUTHOR_DASHBOARD);
      return;
    }
    fetchData();
  }, [bookId, chapterId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const bookRes = await bookService.getBookById(bookId);
      setBook(bookRes.result);

      if (chapterId) {
        const chapRes = await chapterService.getChapterById(chapterId);
        const chapData = chapRes.result;
        
        if (chapData) {
          setSelectedChapter(chapData);
          setTitle(chapData.title || '');
          setContent(chapData.content || '');
          setChapterNumber(chapData.chapterNumber || 1);
          setIsFree(chapData.isFree !== false);
          setIsPublished(chapData.isPublished === true);
          setPrice(chapData.price || 0);
        }
      } else {
        const chapsRes = await chapterService.getChaptersByBookId(bookId);
        const raw = chapsRes.result;
        let chaps = [];
        if (Array.isArray(raw)) chaps = raw;
        else if (raw?.content) chaps = raw.content;
        
        setSelectedChapter(null);
        setTitle('');
        setContent('');
        setChapterNumber(chaps.length + 1);
        setIsFree(true);
        setIsPublished(false);
        setPrice(0);
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
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
      setError('Chương trả phí phải có giá lớn hơn 0 xu');
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

      alert('Lưu thành công!');
      navigate(ROUTES.AUTHOR_STUDIO.replace(':bookId', bookId));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (chapId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chương này?")) return;
    try {
      await chapterService.deleteChapter(chapId);
      alert("Xóa thành công!");
      navigate(ROUTES.AUTHOR_STUDIO.replace(':bookId', bookId));
    } catch (err) {
      alert("Xóa thất bại");
    }
  };

  const handleBack = () => {
    navigate(ROUTES.AUTHOR_STUDIO.replace(':bookId', bookId));
  };

  return {
    book,
    selectedChapter,
    loading,
    saving,
    error,
    title,
    setTitle,
    content,
    setContent,
    chapterNumber,
    isFree,
    setIsFree,
    isPublished,
    setIsPublished,
    price,
    setPrice,
    isFocusMode,
    setIsFocusMode,
    handleSave,
    handleDelete,
    handleBack
  };
};
