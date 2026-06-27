import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

const planService = {
  getAllPlans: () => {
    return apiClient.get(API_ENDPOINTS.PLANS.GET_ALL);
  }
};

export default planService;
