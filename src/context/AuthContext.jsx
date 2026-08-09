import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { getErrorMessage, isAuthError } from '../services/apiClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      if (authService.isLoggedIn()) {
        try {
          const isValid = await authService.introspect();
          if (!isValid) {
            await authService.logout();
            setUser(null);
            setLoading(false);
            return;
          }
          const res = await authService.getMyInfo();
          const tokenData = authService.getUserFromToken();
          const roles = tokenData?.scope ? tokenData.scope.split(' ') : [];
          const isAdmin = roles.includes('ADMIN');
          setUser({ ...res.result, userId: Number(tokenData?.sub), roles, isAdmin });
        } catch (error) {
          console.error("Lỗi lấy thông tin user:", error);
          setAuthError(getErrorMessage(error));
          // Chỉ đăng xuất khi máy chủ từ chối xác thực; lỗi mạng tạm thời không được xóa phiên.
          if (isAuthError(error)) {
            await authService.logout();
          }
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    setAuthError('');
    const res = await authService.login(email, password);
    const userRes = await authService.getMyInfo();
    const tokenData = authService.getUserFromToken();
    const roles = tokenData?.scope ? tokenData.scope.split(' ') : [];
    const isAdmin = roles.includes('ADMIN');
    setUser({ ...userRes.result, userId: Number(tokenData?.sub), roles, isAdmin });
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setAuthError('');
    setUser(null);
  };

  const refreshUser = async () => {
    if (authService.isLoggedIn()) {
      try {
        const res = await authService.getMyInfo();
        const tokenData = authService.getUserFromToken();
        const roles = tokenData?.scope ? tokenData.scope.split(' ') : [];
        const isAdmin = roles.includes('ADMIN');
        setUser({ ...res.result, userId: Number(tokenData?.sub), roles, isAdmin });
        setAuthError('');
      } catch (error) {
        console.error("Lỗi refresh user:", error);
        setAuthError(getErrorMessage(error));
        throw error;
      }
    }
  };

  const addCoins = (amountToCharge) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        amount: (prevUser.amount || 0) + Number(amountToCharge)
      };
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, authError, login, logout, refreshUser, addCoins }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
