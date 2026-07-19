import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MdMenuBook, MdOutlineEmail, MdOutlineLock } from 'react-icons/md';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/routes';
import { getErrorMessage } from '../../services/apiClient';


function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const redirect = searchParams.get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate(redirect || ROUTES.HOME);
    } catch (error) {
      const errCode = error?.response?.data?.code;
      if (errCode === 1080) {
        setErrorMessage('Tài khoản chưa được kích hoạt. Đang chuyển đến trang xác thực...');
        setTimeout(() => {
          navigate(`${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(email)}`);
        }, 1500);
      } else {
        setErrorMessage(getErrorMessage(error));
      }
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
          Chào mừng trở lại!
        </span>
      </div>

      <h1 className="auth-title">Đăng nhập tài khoản</h1>
      <p className="auth-subtitle">Tiếp tục hành trình đọc sách của bạn</p>

      <div className="auth-card">
        <form onSubmit={handleSubmit}>

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="auth-label" style={{ marginBottom: 0 }}>Mật khẩu</label>
              <Link to={ROUTES.FORGOT_PASSWORD} className="auth-forgot-link" style={{ fontSize: '0.85rem', color: '#8b5cf6', textDecoration: 'none', fontWeight: '600' }}>
                Quên mật khẩu?
              </Link>
            </div>
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

          {errorMessage && (
            <div className="auth-error-message">
              {errorMessage}
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="auth-switch">
          Chưa có tài khoản? <Link to={ROUTES.REGISTER}>Đăng ký</Link>
        </div>

      </div>

    </div>
  );
}

export default LoginPage;
