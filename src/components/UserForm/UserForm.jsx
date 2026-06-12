import React, { useState, useEffect } from 'react';
import { FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdOutlineEmail, MdOutlineLock } from 'react-icons/md';


function UserForm({
  initialData,
  onSubmit,
  onCancel
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        password: ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      {/* Họ & Tên */}
      <div className="auth-form-group">
        <label className="auth-label">Họ và Tên</label>
        <div className="auth-input-wrapper">
          <FiUser className="auth-input-icon" />
          <input
            type="text"
            name="name"
            className="auth-input"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div className="auth-form-group">
        <label className="auth-label">Email</label>
        <div className="auth-input-wrapper">
          <MdOutlineEmail className="auth-input-icon" />
          <input
            type="email"
            name="email"
            className="auth-input"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      {/* Password */}
      <div className="auth-form-group">
        <label className="auth-label">Mật khẩu mới (tùy chọn)</label>
        <div className="auth-input-wrapper">
          <MdOutlineLock className="auth-input-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            className="auth-input"
            value={formData.password}
            onChange={handleChange}
            placeholder="Để trống nếu không muốn đổi"
          />
          <button
            type="button"
            className="auth-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="auth-form-group user-form-actions">
        {onCancel && (
          <button
            type="button"
            className="auth-social-btn user-form-cancel-btn"
            onClick={onCancel}
          >
            Hủy
          </button>
        )}
        <button
          type="submit"
          className="auth-submit-btn user-form-submit-btn"
          disabled={submitting || (!formData.name && !formData.email)}
        >
          {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>
    </form>
  );
}

export default UserForm;
