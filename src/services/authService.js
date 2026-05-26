import fetchApi from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';
import { parseJwt } from '../utils/jwtUtils';

export const authService = {
  // Đăng ký tài khoản
  register: async (name, email, password) => {
    return fetchApi.post(API_ENDPOINTS.AUTH.REGISTER, {
      name,
      email,
      password,
    });
  },

  // Đăng nhập
  login: async (email, password) => {
    const response = await fetchApi.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    
    // Lưu token nếu thành công
    if (response.code === 200 && response.result?.token) {
      localStorage.setItem('token', response.result.token);
    }
    
    return response;
  },

  // Lấy thông tin cá nhân hiện tại
  getMyInfo: async () => {
    return fetchApi.get(API_ENDPOINTS.USER.MY_INFO);
  },

  // Đăng xuất
  logout: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetchApi.post(API_ENDPOINTS.AUTH.LOGOUT, { token });
      } catch (error) {
        console.error("Lỗi khi đăng xuất từ server:", error);
      }
    }
    localStorage.removeItem('token');
  },

  // Lấy token từ local storage
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Kiểm tra user có đăng nhập hay chưa (có token)
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },

  // Lấy dữ liệu user từ token đã lưu
  getUserFromToken: () => {
    const token = localStorage.getItem('token');
    if (token) {
      return parseJwt(token);
    }
    return null;
  }
};
