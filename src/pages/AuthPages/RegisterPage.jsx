import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdMenuBook, MdOutlineEmail, MdOutlineLock } from 'react-icons/md';
import { FiEye, FiEyeOff, FiUser } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import authService from '../../services/authService';
import { ROUTES } from '../../config/routes';
import { getErrorMessage } from '../../services/apiClient';


function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
      await authService.register(fullName, email, password);
      setSuccessMessage('Đăng ký thành công! Đang chuyển hướng đến trang xác thực email...');
      setTimeout(() => {
        navigate(`${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-header">
        <Link to={ROUTES.HOME} className="auth-logo">
          <span className="auth-logo-icon">
            <MdMenuBook />
          </span>
          ReadVerse
        </Link>
        <span className="auth-badge">
          <HiSparkles className="auth-badge-icon" />
         Miễn phí tặng 100 xu cho người mới gia nhập
        </span>
      </div>

      <h1 className="auth-title">Tạo tài khoản mới</h1>
      <p className="auth-subtitle">Bắt đầu hành trình đọc sách của bạn ngay hôm nay</p>

      <div className="auth-card">
        <form onSubmit={handleSubmit}>

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

          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <div className="auth-switch">
          Đã có tài khoản? <Link to={ROUTES.LOGIN}>Đăng nhập</Link>
        </div>

      </div>

    </div>
  );
}

export default RegisterPage;
