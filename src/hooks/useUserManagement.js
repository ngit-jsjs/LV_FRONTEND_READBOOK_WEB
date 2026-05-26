import { useState, useEffect } from 'react';
import { userService } from '../services/userService';

export const useUserManagement = () => {
  const [keyword, setKeyword] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(0); 
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '' });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await userService.searchUsers(keyword, page - 1, size);
        if (response.code === 200 && response.result) {
          setResults(response.result.content || []);
          setTotalPages(response.result.totalPages || (response.result.content?.length > 0 ? 1 : 0));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setResults([]);
          setTotalPages(0);
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi lấy danh sách người dùng. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [page, searchTrigger]);

  const handleDelete = async (userToDelete) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${userToDelete.name}" không?`)) {
      try {
        await userService.deleteUser(userToDelete.id);
        alert(`Đã xóa tài khoản ${userToDelete.name} thành công!`);
        setResults(results.filter(u => u.id !== userToDelete.id));
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.response?.data?.result || err.message || 'Lỗi không xác định';
        alert('Xóa thất bại: ' + errorMsg);
      }
    }
  };

  const handleEditClick = (userToEdit) => {
    setEditingUser(userToEdit);
    setEditForm({ name: userToEdit.name || '', email: userToEdit.email || '', password: '' });
  };

  const handleCloseEdit = () => {
    setEditingUser(null);
    setEditForm({ name: '', email: '', password: '' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (window.confirm(`Bạn có chắc chắn muốn cập nhật thông tin của người dùng này không?`)) {
      try {
        const payload = {
          name: editForm.name,
          email: editForm.email
        };
        if (editForm.password) {
          payload.password = editForm.password;
        }
        
        await userService.updateUser(editingUser.id, payload);
        alert("Cập nhật thông tin thành công!");
        setResults(results.map(u => u.id === editingUser.id ? { ...u, name: editForm.name, email: editForm.email } : u));
        handleCloseEdit();
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.response?.data?.result || error.message || 'Lỗi không xác định';
        alert('Cập nhật thất bại: ' + errorMsg);
      }
    }
  };

  return {
    keyword, setKeyword,
    results, loading, error,
    page, setPage, totalPages,
    editingUser, editForm, setEditForm,
    handleSearchSubmit, handleDelete, 
    handleEditClick, handleCloseEdit, handleEditSubmit
  };
};
