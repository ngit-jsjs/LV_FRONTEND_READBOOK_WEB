import { useState, useEffect } from 'react';
import categoryService from '../services/categoryService';
import { getErrorMessage } from '../services/apiClient';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit category states
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Create category states
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catSubmitting, setCatSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await categoryService.getAllCategories();
      setCategories(res.result || res || []);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCat = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa thể loại "${name}" không?`)) {
      try {
        await categoryService.deleteCategory(id);
        alert('Xóa thể loại thành công!');
        fetchCategories();
      } catch (err) {
        console.error(err);
        alert(`Lỗi khi xóa thể loại: ${getErrorMessage(err)}`);
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
      alert("Vui lòng điền tên thể loại!");
      return;
    }
    setEditSubmitting(true);
    try {
      const payload = {
        name: editName.trim(),
        description: editDesc.trim()
      };
      await categoryService.updateCategory(editingCategory.id, payload);
      alert('Cập nhật thể loại thành công!');
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert(`Lỗi khi cập nhật thể loại: ${getErrorMessage(err)}`);
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
      alert("Vui lòng điền tên thể loại!");
      return;
    }
    setCatSubmitting(true);
    try {
      const payload = {
        name: catName.trim(),
        description: catDesc.trim()
      };
      await categoryService.createCategory(payload);
      alert('Thêm thể loại thành công!');
      setCatName('');
      setCatDesc('');
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert(`Lỗi khi lưu thể loại: ${getErrorMessage(err)}`);
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
    handleSaveCategory
  };
};
