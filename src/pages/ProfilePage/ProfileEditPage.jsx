import React from 'react';
import { useAuth } from '../../context/AuthContext';
import UserForm from '../../components/UserForm/UserForm';
import { useProfileEdit } from '../../hooks/useProfileEdit';

function ProfileEditPage() {
  const { user, refreshUser } = useAuth();
  
  const {
    message,
    error,
    handleEditSubmit,
    handleCancel
  } = useProfileEdit(user, refreshUser);

  if (!user) return null;

  return (
    <div className="profile-edit-wrapper">
      <h1 className="profile-edit-title">Sửa thông tin cá nhân</h1>
      <p className="profile-edit-subtitle">Cập nhật thông tin tài khoản của bạn</p>

      {message && <div className="profile-edit-success">{message}</div>}
      {error && <div className="profile-edit-error">{error}</div>}

      <div className="auth-card profile-edit-card">
        <UserForm
          initialData={user}
          onSubmit={handleEditSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

export default ProfileEditPage;
