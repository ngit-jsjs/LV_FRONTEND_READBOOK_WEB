import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdMenuBook, MdOutlineEmail, MdOutlineLock } from 'react-icons/md';
import { FiEye, FiEyeOff, FiUser } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { authService } from '../../services/authService';
import { ROUTES } from '../../config/routes';
import './AuthPages.css';

function RegisterPage() {
  const navigate = useNavigate();

  // State quản lý form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // State quản lý UI
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName || !email || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin');
      return;
    }


    setIsLoading(true);
    try {
      const res = await authService.register(fullName, email, password);
      if (res.code === 200) {
        setSuccessMessage('Đăng ký thành công! Chuyển hướng đến đăng nhập...');
        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 1500);
      } else {
        setErrorMessage(res.result || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.result || 'Đã xảy ra lỗi hệ thống');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* Header: Logo + Badge */}
      <div className="auth-header">
        <Link to={ROUTES.HOME} className="auth-logo">
          <span className="auth-logo-icon">
            <MdMenuBook />
          </span>
          ReadVerse
        </Link>
        <span className="auth-badge">
          <HiSparkles className="auth-badge-icon" />
          Đăng kí để trải nghiệm 7 ngày dùng thử
        </span>
      </div>

      {/* Tiêu đề */}
      <h1 className="auth-title">Tạo tài khoản mới</h1>
      <p className="auth-subtitle">Bắt đầu hành trình đọc sách của bạn ngay hôm nay</p>

      {/* Form card */}
      <div className="auth-card">
        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="auth-form-group">
            <label className="auth-label">Họ và tên</label>
            <div className="auth-input-wrapper">
              <FiUser className="auth-input-icon" />
              <input
                type="text"
                className="auth-input"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="auth-form-group">
            <label className="auth-label">Email</label>
            <div className="auth-input-wrapper">
              <MdOutlineEmail className="auth-input-icon" />
              <input
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-form-group">
            <label className="auth-label">Mật khẩu</label>
            <div className="auth-input-wrapper">
              <MdOutlineLock className="auth-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <p className="auth-input-hint">Phải có ít nhất 8 ký tự, 1 chữ viết hoa, 1 chữ thường, 1 kí tự đặc biệt.</p>
          </div>



          {/* Error / Success Messages */}
          {errorMessage && (
            <div className="auth-error-message">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="auth-success-message">
              {successMessage}
            </div>
          )}

          {/* Nút submit */}
          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        {/* Link chuyển sang Login */}
        <div className="auth-switch">
          Đã có tài khoản? <Link to={ROUTES.LOGIN}>Đăng nhập</Link>
        </div>

      </div>

    </div>
  );
}

export default RegisterPage;
