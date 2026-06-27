import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MdMenuBook, MdOutlineEmail, MdVpnKey } from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';
import authService from '../../services/authService';
import { ROUTES } from '../../config/routes';
import { getErrorMessage } from '../../services/apiClient';

function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Lấy email từ query params (?email=...)
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Quản lý đếm ngược gửi lại OTP
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Nếu không có email trong URL, chuyển hướng về trang chủ
    if (!email) {
      navigate(ROUTES.HOME);
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!otp) {
      setErrorMessage('Vui lòng nhập mã xác thực OTP');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.verifyEmail(email, otp);
      setSuccessMessage(res.result || 'Xác thực tài khoản thành công! Đang chuyển hướng...');
      
      // Đợi chuyển hướng đến login
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || isLoading) return;

    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const res = await authService.resendOtp(email);
      setSuccessMessage(res.result || 'Đã gửi lại mã OTP mới vào hòm thư của bạn.');
      setCountdown(60); // Bắt đầu countdown 60 giây
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
          Kích hoạt tài khoản
        </span>
      </div>

      <h1 className="auth-title">Xác thực Email</h1>
      <p className="auth-subtitle">
        Chúng tôi đã gửi một mã OTP gồm 6 chữ số đến email: <br />
        <strong style={{ color: '#a78bfa' }}>{email}</strong>
      </p>

      <div className="auth-card">
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">Mã OTP xác thực</label>
            <div className="auth-input-wrapper">
              <MdVpnKey className="auth-input-icon" />
              <input
                type="text"
                className="auth-input"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={isLoading}
                maxLength={6}
                required
              />
            </div>
            <p className="auth-input-hint">Vui lòng kiểm tra hộp thư đến hoặc hộp thư rác (Spam) trong Gmail của bạn.</p>
          </div>

          {errorMessage && <div className="auth-error-message">{errorMessage}</div>}
          {successMessage && <div className="auth-success-message">{successMessage}</div>}

          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? 'Đang xác thực...' : 'Xác thực tài khoản'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={handleResendOtp}
            disabled={countdown > 0 || isLoading}
            style={{
              background: 'none',
              border: 'none',
              color: countdown > 0 ? '#64748b' : '#8b5cf6',
              cursor: countdown > 0 ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              textDecoration: countdown > 0 ? 'none' : 'underline',
              fontSize: '0.95rem',
              transition: 'color 0.2s'
            }}
          >
            {countdown > 0 ? `Gửi lại mã sau (${countdown}s)` : 'Gửi lại mã OTP'}
          </button>
        </div>

        <div className="auth-switch">
          Quay lại trang <Link to={ROUTES.LOGIN}>Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
