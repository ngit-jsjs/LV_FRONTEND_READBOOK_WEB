import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

const recommendationService = {
  getRecommendations: () => {
    return apiClient.get(API_ENDPOINTS.RECOMMENDATIONS.GET_RECOMMENDATIONS);
  },
  
  trainRecommender: () => {
    return apiClient.post(API_ENDPOINTS.RECOMMENDATIONS.TRAIN);
  }
};

export default recommendationService;
