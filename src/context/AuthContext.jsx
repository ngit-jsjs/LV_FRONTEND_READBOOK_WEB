import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (authService.isLoggedIn()) {
        try {
          const res = await authService.getMyInfo();
          const tokenData = authService.getUserFromToken();
          const roles = tokenData?.scope ? tokenData.scope.split(' ') : [];
          const isAdmin = roles.includes('ADMIN');
          setUser({ ...res.result, userId: tokenData?.userId || tokenData?.id, roles, isAdmin });
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
    const userRes = await authService.getMyInfo();
    const tokenData = authService.getUserFromToken();
    const roles = tokenData?.scope ? tokenData.scope.split(' ') : [];
    const isAdmin = roles.includes('ADMIN');
    setUser({ ...userRes.result, userId: tokenData?.userId || tokenData?.id, roles, isAdmin });
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    if (authService.isLoggedIn()) {
      try {
        const res = await authService.getMyInfo();
        const tokenData = authService.getUserFromToken();
        const roles = tokenData?.scope ? tokenData.scope.split(' ') : [];
        const isAdmin = roles.includes('ADMIN');
        setUser({ ...res.result, userId: tokenData?.userId || tokenData?.id, roles, isAdmin });
      } catch (error) {
        console.error("Lỗi refresh user:", error);
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
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, addCoins }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
