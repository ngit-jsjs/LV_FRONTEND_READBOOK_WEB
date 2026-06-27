import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';
import { parseJwt } from '../utils/jwtUtils';

const authService = {
  register: (name, email, password) => {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
      name,
      email,
      password,
    });
  },

  verifyEmail: (email, otp) => {
    return apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
      email,
      otp,
    });
  },

  resendOtp: (email) => {
    return apiClient.post(`${API_ENDPOINTS.AUTH.RESEND_OTP}?email=${encodeURIComponent(email)}`);
  },

  forgotPassword: (email) => {
    return apiClient.post(`${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}?email=${encodeURIComponent(email)}`);
  },

  resetPassword: (email, otp, newPassword) => {
    return apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      email,
      otp,
      newPassword,
    });
  },

  login: async (email, password) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    
    if (response.result?.token) {
      localStorage.setItem('token', response.result.token);
    }
    
    return response;
  },

  getMyInfo: () => {
    return apiClient.get(API_ENDPOINTS.USER.MY_INFO);
  },

  logout: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { token });
      } catch (error) {
        console.error("Lỗi khi đăng xuất từ server:", error);
      }
    }
    localStorage.removeItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },

  getUserFromToken: () => {
    const token = localStorage.getItem('token');
    if (token) {
      return parseJwt(token);
    }
    return null;
  }
};


export default authService;
