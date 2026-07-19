import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import chapterService from '../services/chapterService';
import bookService from '../services/bookService';
import { ROUTES } from '../config/routes';
import { getErrorMessage } from '../services/apiClient';

export const useChapterManagement = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
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

  // States for Batch Update modal
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);
  const [batchTarget, setBatchTarget] = useState('all'); // 'all' or 'selected'
  const [batchIds, setBatchIds] = useState([]); // Selected chapter IDs
  const [batchIsFreeMode, setBatchIsFreeMode] = useState('keep'); // 'keep', 'free', 'premium'
  const [batchPrice, setBatchPrice] = useState('');
  const [batchSubmitting, setBatchSubmitting] = useState(false);
  const [batchError, setBatchError] = useState('');

  const handleSelectChapter = useCallback((chapter) => {
    setSelectedChapter(chapter);
    setTitle(chapter.title || '');
    setContent(chapter.content || '');
    setChapterNumber(chapter.chapterNumber || (chapters ? chapters.length + 1 : 1));
    setIsFree(chapter.isFree !== false);
    setIsPublished(chapter.isPublished === true);
    setPrice(chapter.price || 0);
  }, [chapters]);

  const handleCreateNewChapter = useCallback((nextNumber) => {
    setSelectedChapter(null);
    setTitle('');
    setContent('');
    setChapterNumber(nextNumber || (chapters ? chapters.length + 1 : 1));
    setIsFree(true);
    setIsPublished(false);
    setPrice(0);
  }, [chapters]);

  const fetchData = useCallback(async (pageToFetch) => {
    setLoading(true);
    try {
      const bookRes = await bookService.getBookById(bookId);
      setBook(bookRes.result);

      const chapRes = await chapterService.getChaptersByBookId(bookId, pageToFetch, 12);
      const raw = chapRes.result;
      let chapData = [];
      let totalP = 0;
      if (Array.isArray(raw)) {
        chapData = raw;
        totalP = 1;
      } else if (raw?.content) {
        chapData = raw.content;
        totalP = raw.totalPages || 0;
      }
      
      setChapters(chapData);
      setTotalPages(totalP);
      setPage(pageToFetch);

      if (chapData.length > 0) {
        handleSelectChapter(chapData[0]);
      } else {
        handleCreateNewChapter(1);
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu: ' + getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [bookId, handleSelectChapter, handleCreateNewChapter]);

  useEffect(() => {
    if (!bookId) {
      navigate(ROUTES.BOOK_MANAGEMENT);
      return;
    }
    fetchData(0);
  }, [bookId, fetchData]);

  const handlePageChange = (newPage) => {
    const zeroBasedPage = newPage - 1;
    fetchData(zeroBasedPage);
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
        await fetchData(page);
        alert('Lưu thành công!');
      } else {
        alert('Chức năng thêm chương thủ công không khả dụng. Vui lòng import file EPUB.');
      }
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
      fetchData(page);
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
      await fetchData(page);
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
      fetchData(page);
    } catch (err) {
      setEditError(getErrorMessage(err));
    } finally {
      setEditSubmitting(false);
    }
  };

  const closeEditModal = () => {
    setEditingChapter(null);
  };

  const openBatchModal = (initialSelectedIds = []) => {
    setIsBatchUpdating(true);
    if (initialSelectedIds && initialSelectedIds.length > 0) {
      setBatchTarget('selected');
      setBatchIds(initialSelectedIds);
    } else {
      setBatchTarget('all');
      setBatchIds([]);
    }
    setBatchIsFreeMode('keep');
    setBatchPrice('');
    setBatchError('');
  };

  const closeBatchModal = () => {
    setIsBatchUpdating(false);
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    setBatchSubmitting(true);
    setBatchError('');

    const payload = {};

    if (batchTarget === 'selected') {
      if (batchIds.length === 0) {
        setBatchError('Vui lòng chọn ít nhất một chương');
        setBatchSubmitting(false);
        return;
      }
      payload.chapterIds = batchIds;
    }

    if (batchIsFreeMode !== 'keep') {
      const free = batchIsFreeMode === 'free';
      payload.isFree = free;
      
      if (!free) {
        if (!batchPrice || Number(batchPrice) <= 0) {
          setBatchError('Chương trả phí phải có giá lớn hơn 0 xu');
          setBatchSubmitting(false);
          return;
        }
        payload.price = Number(batchPrice);
      }
    } else {
      if (batchPrice !== '') {
        if (Number(batchPrice) <= 0) {
          setBatchError('Giá chương phải lớn hơn 0 xu');
          setBatchSubmitting(false);
          return;
        }
        payload.price = Number(batchPrice);
      }
    }

    if (
      payload.isFree === undefined &&
      payload.price === undefined
    ) {
      setBatchError('Vui lòng chọn ít nhất một trường cần cập nhật (Loại chương)');
      setBatchSubmitting(false);
      return;
    }

    try {
      await chapterService.batchUpdateChapters(bookId, payload);
      alert('Cập nhật hàng loạt thành công!');
      setIsBatchUpdating(false);
      await fetchData(page);
    } catch (err) {
      setBatchError(getErrorMessage(err));
    } finally {
      setBatchSubmitting(false);
    }
  };


  const handleDeleteAll = async () => {
    if (!window.confirm("CẢNH BÁO: Bạn có chắc chắn muốn xóa TOÀN BỘ chương của cuốn sách này? Hành động này không thể hoàn tác!")) return;
    try {
      await chapterService.deleteAllChapters(bookId);
      alert("Đã xóa toàn bộ chương thành công!");
      fetchData(page);
    } catch (err) {
      alert("Xóa thất bại: " + getErrorMessage(err));
    }
  };

  return {
    handleDeleteAll,
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
    page,
    totalPages,
    handlePageChange,
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
    closeEditModal,
    // Batch Update exports
    isBatchUpdating,
    setIsBatchUpdating,
    batchTarget,
    setBatchTarget,
    batchIds,
    setBatchIds,
    batchIsFreeMode,
    setBatchIsFreeMode,
    batchPrice,
    setBatchPrice,
    batchSubmitting,
    batchError,
    openBatchModal,
    closeBatchModal,
    handleBatchSubmit
  };
};
