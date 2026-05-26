import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin user ngay khi ứng dụng khởi chạy
  useEffect(() => {
    const fetchUser = async () => {
      if (authService.isLoggedIn()) {
        try {
          const res = await authService.getMyInfo();
          if (res.code === 200) {
            const tokenData = authService.getUserFromToken();
            const roles = tokenData?.scope ? tokenData.scope.split(' ') : [];
            const isAdmin = roles.includes('ADMIN');
            setUser({ ...res.result, userId: tokenData?.userId || tokenData?.id, roles, isAdmin });
          } else {
            // Token lỗi hoặc hết hạn
            await authService.logout();
          }
        } catch (error) {
          console.error("Lỗi lấy thông tin user:", error);
          await authService.logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.code === 200) {
      // Đăng nhập thành công, fetch lại thông tin user
      const userRes = await authService.getMyInfo();
      if (userRes.code === 200) {
        const tokenData = authService.getUserFromToken();
        const roles = tokenData?.scope ? tokenData.scope.split(' ') : [];
        const isAdmin = roles.includes('ADMIN');
        setUser({ ...userRes.result, userId: tokenData?.userId || tokenData?.id, roles, isAdmin });
      }
    }
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  // Cập nhật state user (dùng khi vừa sửa thông tin xong)
  const refreshUser = async () => {
    if (authService.isLoggedIn()) {
      const res = await authService.getMyInfo();
      if (res.code === 200) {
        const tokenData = authService.getUserFromToken();
        const roles = tokenData?.scope ? tokenData.scope.split(' ') : [];
        const isAdmin = roles.includes('ADMIN');
        setUser({ ...res.result, userId: tokenData?.userId || tokenData?.id, roles, isAdmin });
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {/* Đợi tải xong thông tin khởi tạo mới render giao diện để tránh lỗi chớp UI */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
