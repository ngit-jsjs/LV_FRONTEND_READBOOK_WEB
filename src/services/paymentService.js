import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

const paymentService = {
  buyPackage: (planId) => {
    return apiClient.post(`${API_ENDPOINTS.PAYMENT.BUY_PACKAGE}?planId=${planId}`);
  },

  getAdminUserPaymentHistory: (userId, page = 0, size = 10) => {
    return apiClient.get(API_ENDPOINTS.PAYMENT.ADMIN_USER_HISTORY(userId), {
      params: { page, size }
    });
  }
};

export default paymentService;
