import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdMenuBook, MdOutlineEmail, MdOutlineLock, MdVpnKey } from 'react-icons/md';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import authService from '../../services/authService';
import { ROUTES } from '../../config/routes';
import { getErrorMessage } from '../../services/apiClient';

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP & Mật khẩu mới
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Gửi OTP khôi phục mật khẩu
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email) {
      setErrorMessage('Vui lòng nhập địa chỉ email');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setSuccessMessage(res.result || 'Mã OTP khôi phục đã được gửi đến email.');
      setTimeout(() => {
        setStep(2);
        setErrorMessage('');
        setSuccessMessage('');
      }, 1500);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Đặt lại mật khẩu mới
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!otp || !newPassword || !confirmPassword) {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.resetPassword(email, otp, newPassword);
      setSuccessMessage(res.result || 'Khôi phục mật khẩu thành công! Đang chuyển hướng...');
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
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
          Khôi phục tài khoản
        </span>
      </div>

      <h1 className="auth-title">
        {step === 1 ? 'Quên mật khẩu?' : 'Đặt lại mật khẩu'}
      </h1>
      <p className="auth-subtitle">
        {step === 1 
          ? 'Nhập email của bạn để nhận mã xác thực OTP khôi phục tài khoản' 
          : 'Nhập mã OTP đã được gửi tới email của bạn và mật khẩu mới'
        }
      </p>

      <div className="auth-card">
        {step === 1 ? (
          // BƯỚC 1: NHẬP EMAIL
          <form onSubmit={handleSendOtp}>
            <div className="auth-form-group">
              <label className="auth-label">Địa chỉ Email</label>
              <div className="auth-input-wrapper">
                <MdOutlineEmail className="auth-input-icon" />
                <input
                  type="email"
                  className="auth-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {errorMessage && <div className="auth-error-message">{errorMessage}</div>}
            {successMessage && <div className="auth-success-message">{successMessage}</div>}

            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
              {isLoading ? 'Đang gửi mã...' : 'Gửi mã OTP'}
            </button>
          </form>
        ) : (
          // BƯỚC 2: NHẬP OTP & ĐẶT LẠI MẬT KHẨU
          <form onSubmit={handleResetPassword}>
            <div className="auth-form-group">
              <label className="auth-label">Email tài khoản</label>
              <div className="auth-input-wrapper" style={{ opacity: 0.7 }}>
                <MdOutlineEmail className="auth-input-icon" />
                <input
                  type="email"
                  className="auth-input"
                  value={email}
                  readOnly
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Mã OTP (6 chữ số)</label>
              <div className="auth-input-wrapper">
                <MdVpnKey className="auth-input-icon" />
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Nhập mã OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Mật khẩu mới</label>
              <div className="auth-input-wrapper">
                <MdOutlineLock className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  required
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

            <div className="auth-form-group">
              <label className="auth-label">Xác nhận mật khẩu mới</label>
              <div className="auth-input-wrapper">
                <MdOutlineLock className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {errorMessage && <div className="auth-error-message">{errorMessage}</div>}
            {successMessage && <div className="auth-success-message">{successMessage}</div>}

            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
              {isLoading ? 'Đang thực hiện...' : 'Đặt lại mật khẩu'}
            </button>

            <button
              type="button"
              className="auth-submit-btn"
              style={{
                marginTop: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff'
              }}
              onClick={() => {
                setStep(1);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              disabled={isLoading}
            >
              Quay lại 
            </button>
          </form>
        )}

        <div className="auth-switch">
           <Link to={ROUTES.LOGIN}>Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
