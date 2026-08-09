import { useState, useEffect, useCallback } from 'react';
import { getErrorMessage } from '../services/apiClient';
import { confirmAction, notifyError, notifySuccess, notifyWarning } from '../utils/feedback';

/**
 * Admin CRUD state for a paginated, searchable resource whose only editable
 * field is its name (authors, publishers).
 *
 * @param {object} service CRUD service built by createCrudService
 * @param {string} label lowercase entity label used in user-facing messages
 * @param {number} pageSize items per page
 */
export const useNamedEntityAdmin = (service, label, pageSize = 12) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [newName, setNewName] = useState('');
  const [createSubmitting, setCreateSubmitting] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const keyword = activeSearch.trim();
      const res = keyword
        ? await service.search(keyword, page - 1, pageSize)
        : await service.getAll(page - 1, pageSize);
      if (res.result) {
        setItems(res.result.content || []);
        setTotalPages(res.result.totalPages || 0);
      }
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [service, activeSearch, page, pageSize]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setActiveSearch(searchKeyword);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setEditName(item.name || '');
  };

  const closeEditModal = () => setEditingItem(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      notifyWarning(`Vui lòng điền tên ${label}!`);
      return;
    }
    setEditSubmitting(true);
    try {
      await service.update(editingItem.id, { name: editName.trim() });
      notifySuccess(`Cập nhật ${label} thành công!`);
      setEditingItem(null);
      fetchItems();
    } catch (err) {
      notifyError(err, `Lỗi khi cập nhật ${label}`);
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      notifyWarning(`Vui lòng điền tên ${label}!`);
      return;
    }
    setCreateSubmitting(true);
    try {
      await service.create({ name: newName.trim() });
      notifySuccess(`Thêm ${label} thành công!`);
      setNewName('');
      fetchItems();
    } catch (err) {
      notifyError(err, `Lỗi khi lưu ${label}`);
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirmAction(`Bạn có chắc chắn muốn xóa ${label} "${name}" không?`)) return;
    try {
      await service.remove(id);
      notifySuccess(`Xóa ${label} thành công!`);
      fetchItems();
    } catch (err) {
      notifyError(err, `Lỗi khi xóa ${label}`);
    }
  };

  return {
    items,
    loading,
    error,
    page,
    setPage,
    totalPages,
    searchKeyword,
    setSearchKeyword,
    handleSearchSubmit,
    editingItem,
    editName,
    setEditName,
    editSubmitting,
    handleEditClick,
    handleUpdate,
    closeEditModal,
    newName,
    setNewName,
    createSubmitting,
    handleCreate,
    handleDelete,
    refetch: fetchItems,
  };
};
