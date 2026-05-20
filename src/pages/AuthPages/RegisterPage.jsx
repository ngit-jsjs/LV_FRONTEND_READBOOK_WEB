import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdMenuBook, MdOutlineEmail, MdOutlineLock } from 'react-icons/md';
import { FiEye, FiEyeOff, FiUser } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { FaGoogle, FaApple } from 'react-icons/fa';
import './AuthPages.css';


function RegisterPage() {
  // State quản lý form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Gọi API đăng ký ở đây
    console.log('Register:', { fullName, email, password, agreeTerms });
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

          {/* Checkbox đồng ý điều khoản */}
          <div className="auth-checkbox-row">
            <input
              type="checkbox"
              className="auth-checkbox"
              id="agree-terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <label htmlFor="agree-terms" className="auth-checkbox-label">
              Tôi đồng ý với{' '}
              <Link to="/terms">Điều khoản dịch vụ</Link> và{' '}
              <Link to="/privacy">Chính sách bảo mật</Link>
            </label>
          </div>

          {/* Nút submit */}
          <button type="submit" className="auth-submit-btn">
            Đăng ký
          </button>

        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span className="auth-divider-text">Hoặc đăng ký với</span>
        </div>

        {/* Social login */}
        <div className="auth-social-buttons">
          <button type="button" className="auth-social-btn">
            <FaGoogle className="auth-social-btn-icon" />
            Google
          </button>
          <button type="button" className="auth-social-btn">
            <FaApple className="auth-social-btn-icon" />
            Apple
          </button>
        </div>

      </div>

      {/* Link chuyển sang Login */}
      <p className="auth-switch">
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>

    </div>
  );
}

export default RegisterPage;
