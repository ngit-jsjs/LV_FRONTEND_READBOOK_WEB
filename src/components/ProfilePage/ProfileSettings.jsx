import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { FiSave, FiAlertCircle, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import './ProfileSettings.css';

function ProfileSettings() {
  const { user, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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

      const response = await userService.updateUser(user.userId, payload);

      // Based on the example, response directly returns the user object OR throws error
      // if it successfully returned the user object:
      if (response && response.email) {
        setMessage('Cập nhật thông tin thành công!');
        // Cập nhật lại thông tin user trong global state
        await refreshUser();
      } else if (response && response.code === 200) {
        setMessage('Cập nhật thông tin thành công!');
        await refreshUser();
      } else {
        setError('Có lỗi xảy ra, vui lòng thử lại.');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.result || 'Không thể cập nhật thông tin. Vui lòng thử lại.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-settings-container">
      <div className="section-header">
        <div>
          <h3 className="section-title">Cài đặt tài khoản</h3>
          <p className="section-subtitle">Cập nhật thông tin của bạn</p>
        </div>
      </div>

      <div className="settings-card">
        {message && (
          <div className="settings-alert success">
            <FiCheckCircle className="alert-icon" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="settings-alert error">
            <FiAlertCircle className="alert-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên của bạn"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu mới (tùy chọn)</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Để trống để giữ nguyên mật khẩu"
                className="password-input-field"
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="save-btn"
              disabled={loading || (!formData.name && !formData.email)}
            >
              {loading ? 'Đang lưu...' : (
                <>
                  <FiSave className="btn-icon" /> Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileSettings;
