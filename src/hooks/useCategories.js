import { useState, useEffect, useCallback } from 'react';
import categoryService from '../services/categoryService';
import { getErrorMessage } from '../services/apiClient';
import { confirmAction, notifyError, notifySuccess, notifyWarning } from '../utils/feedback';

export const useCategories = (paged = false) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Edit category states
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Create category states
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catSubmitting, setCatSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (paged) {
        const res = await categoryService.getAllCategories(page - 1, 12);
        if (res.result) {
          setCategories(res.result.content || []);
          setTotalPages(res.result.totalPages || 0);
        }
      } else {
        // Fetch all categories without pagination using the correct list endpoint
        const res = await categoryService.getAllCategoriesList();
        setCategories(res.result || res || []);
      }
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [paged, page]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDeleteCat = async (id, name) => {
    if (confirmAction(`Bạn có chắc chắn muốn xóa thể loại "${name}" không?`)) {
      try {
        await categoryService.deleteCategory(id);
        notifySuccess('Xóa thể loại thành công!');
        fetchCategories();
      } catch (err) {
        notifyError(err, 'Lỗi khi xóa thể loại');
      }
    }
  };

  const handleEditCatClick = (cat) => {
    setEditingCategory(cat);
    setEditName(cat.name || '');
    setEditDesc(cat.description || '');
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      notifyWarning("Vui lòng điền tên thể loại!");
      return;
    }
    setEditSubmitting(true);
    try {
      const payload = {
        name: editName.trim(),
        description: editDesc.trim()
      };
      await categoryService.updateCategory(editingCategory.id, payload);
      notifySuccess('Cập nhật thể loại thành công!');
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      notifyError(err, 'Lỗi khi cập nhật thể loại');
    } finally {
      setEditSubmitting(false);
    }
  };

  const closeEditModal = () => {
    setEditingCategory(null);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) {
      notifyWarning("Vui lòng điền tên thể loại!");
      return;
    }
    setCatSubmitting(true);
    try {
      const payload = {
        name: catName.trim(),
        description: catDesc.trim()
      };
      await categoryService.createCategory(payload);
      notifySuccess('Thêm thể loại thành công!');
      setCatName('');
      setCatDesc('');
      fetchCategories();
    } catch (err) {
      notifyError(err, 'Lỗi khi lưu thể loại');
    } finally {
      setCatSubmitting(false);
    }
  };

  return {
    categories,
    loading,
    error,
    editingCategory,
    editName,
    setEditName,
    editDesc,
    setEditDesc,
    editSubmitting,
    fetchCategories,
    handleDeleteCat,
    handleEditCatClick,
    handleUpdateCategory,
    closeEditModal,
    catName,
    setCatName,
    catDesc,
    setCatDesc,
    catSubmitting,
    handleSaveCategory,
    page,
    setPage,
    totalPages
  };
};
