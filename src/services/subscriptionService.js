import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

const subscriptionService = {
  getMySubscriptions: () => {
    return apiClient.get(API_ENDPOINTS.SUBSCRIPTIONS.GET_MY);
  }
};

export default subscriptionService;
