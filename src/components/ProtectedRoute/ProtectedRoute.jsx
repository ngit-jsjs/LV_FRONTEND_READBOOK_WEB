import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/routes';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="login-prompt-wrapper">
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div className="spinner" style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(139, 92, 246, 0.2)',
            borderTopColor: '#8b5cf6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p>Đang tải...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    const redirectUrl = `${location.pathname}${location.search}`;
    const loginUrl = `${ROUTES.LOGIN}?redirect=${encodeURIComponent(redirectUrl)}`;
    
    return (
      <div className="login-prompt-wrapper">
        <p className="login-prompt-text">
          Hãy đăng nhập để xem nội dung. <Link to={loginUrl} className="login-prompt-link">Đăng nhập</Link>
        </p>
      </div>
    );
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.some(role => user.roles?.includes(role));
    if (!hasRole) {
      return (
        <div className="protected-route-error">
          <div className="error-card">
            <h2>Bạn không có quyền truy cập trang này</h2>
            <p>Yêu cầu quyền hạn tối thiểu: {allowedRoles.join(', ')}</p>
            <Link to={ROUTES.HOME} className="error-home-btn">
              Quay lại Trang chủ
            </Link>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
