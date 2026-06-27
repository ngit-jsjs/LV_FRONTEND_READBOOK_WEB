import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

const paymentService = {
  buyPackage: (planId) => {
    return apiClient.post(`${API_ENDPOINTS.PAYMENT.BUY_PACKAGE}?planId=${planId}`);
  }
};

export default paymentService;
