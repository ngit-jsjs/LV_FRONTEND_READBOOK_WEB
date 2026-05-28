import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/routes';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.some(role => user.roles?.includes(role));
    if (!hasRole) {
      // User is authenticated but does not have the required role
      return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>Bạn không có quyền truy cập trang này.</h2>
          <p>Yêu cầu quyền: {allowedRoles.join(', ')}</p>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
