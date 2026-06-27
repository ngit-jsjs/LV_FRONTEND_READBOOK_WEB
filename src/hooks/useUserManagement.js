import { useState, useEffect } from 'react';
import userService from '../services/userService';
import { getErrorMessage } from '../services/apiClient';

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
        const data = response.result;
        if (data) {
          setResults(data.content || []);
          setTotalPages(data.totalPages || (data.content?.length > 0 ? 1 : 0));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setResults([]);
          setTotalPages(0);
        }
      } catch (err) {
        setError(getErrorMessage(err));
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
        alert('Xóa thất bại: ' + getErrorMessage(err));
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

  const handleEditSubmit = async (formData) => {
    if (window.confirm(`Bạn có chắc chắn muốn cập nhật thông tin của người dùng này không?`)) {
      try {
        const payload = {
          name: formData.name,
          email: formData.email
        };
        if (formData.password) {
          payload.password = formData.password;
        }
        
        await userService.updateUser(editingUser.id, payload);
        alert("Cập nhật thông tin thành công!");
        setResults(results.map(u => u.id === editingUser.id ? { ...u, name: formData.name, email: formData.email } : u));
        handleCloseEdit();
      } catch (error) {
        alert('Cập nhật thất bại: ' + getErrorMessage(error));
        throw error;
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
