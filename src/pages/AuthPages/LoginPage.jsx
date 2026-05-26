import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdMenuBook, MdOutlineEmail, MdOutlineLock } from 'react-icons/md';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/routes';
import './AuthPages.css';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // State quản lý form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // State quản lý UI khi submit
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password);
      if (res.code === 200) {
        // Đăng nhập thành công
        navigate(ROUTES.HOME);
      } else {
        setErrorMessage(res.result || 'Đăng nhập thất bại. Vui lòng thử lại.');
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
          Chào mừng trở lại!
        </span>
      </div>

      {/* Tiêu đề */}
      <h1 className="auth-title">Đăng nhập tài khoản</h1>
      <p className="auth-subtitle">Tiếp tục hành trình đọc sách của bạn</p>

      {/* Form card */}
      <div className="auth-card">
        <form onSubmit={handleSubmit}>

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
                placeholder="Enter your password"
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
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="auth-error-message">
              {errorMessage}
            </div>
          )}

          {/* Forgot password */}
          <div className="auth-options-row" style={{ justifyContent: 'flex-end' }}>
            <Link to={ROUTES.FORGOT_PASSWORD} className="auth-forgot-link">
              Quên mật khẩu?
            </Link>
          </div>

          {/* Nút submit */}
          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        {/* Link chuyển sang Register */}
        <div className="auth-switch">
          Chưa có tài khoản? <Link to={ROUTES.REGISTER}>Đăng ký</Link>
        </div>

      </div>

    </div>
  );
}

export default LoginPage;
