import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import { getErrorMessage } from '../services/apiClient';
import { ROUTES } from '../config/routes';

export const useProfileEdit = (user, refreshUser) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN);
    }
  }, [user, navigate]);

  const handleEditSubmit = async (formData) => {
    setMessage(null);
    setError(null);
    try {
      const payload = {
        name: formData.name,
        email: formData.email
      };
      if (formData.password) {
        payload.password = formData.password;
      }
      const idToUpdate = user.userId || user.id;
      const res = await userService.updateUser(idToUpdate, payload);
      
      if (res?.result?.token) {
        localStorage.setItem('token', res.result.token);
      }
      
      setMessage('Cập nhật thông tin thành công!');
      if (refreshUser) {
        await refreshUser();
      }
      
      setTimeout(() => {
        navigate(ROUTES.PROFILE);
      }, 1500);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.PROFILE);
  };

  return {
    message,
    error,
    handleEditSubmit,
    handleCancel
  };
};
