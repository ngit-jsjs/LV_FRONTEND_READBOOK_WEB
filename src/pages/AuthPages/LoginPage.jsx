import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdMenuBook, MdOutlineEmail, MdOutlineLock } from 'react-icons/md';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { FaGoogle, FaApple } from 'react-icons/fa';
import './AuthPages.css';

function LoginPage() {
  // State quản lý form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Gọi API đăng nhập ở đây
    console.log('Login:', { email, password, rememberMe });
  };

  return (
    <div className="auth-page">

      {/* Header: Logo + Badge */}
      <div className="auth-header">
        <Link to="/" className="auth-logo">
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

          {/* Remember me + Forgot password */}
          <div className="auth-options-row">
            <div className="auth-checkbox-row" style={{ marginBottom: 0 }}>
              <input
                type="checkbox"
                className="auth-checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="auth-checkbox-label">
                Ghi nhớ tài khoản
              </label>
            </div>
            <Link to="/forgot-password" className="auth-forgot-link">
              Quên mật khẩu?
            </Link>
          </div>

          {/* Nút submit */}
          <button type="submit" className="auth-submit-btn">
            Đăng nhập
          </button>

        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span className="auth-divider-text">Hoặc đăng nhập với</span>
        </div>

        {/* Social login */}
        <div className="auth-social-buttons">
          <button type="button" className="auth-social-btn">
            <FaGoogle className="auth-social-btn-icon" />
            Google
          </button>
        </div>

      </div>

      {/* Link chuyển sang Register */}
      <p className="auth-switch">
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </p>

    </div>
  );
}

export default LoginPage;
