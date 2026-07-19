import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

const subscriptionService = {
  getMySubscriptions: (page = 0, size = 10) => {
    return apiClient.get(`${API_ENDPOINTS.SUBSCRIPTIONS.GET_MY}?page=${page}&size=${size}`);
  }
};

export default subscriptionService;
