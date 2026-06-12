import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

const ratingService = {
  createRating: async (bookId, ratingData) => {
    return await apiClient.post(API_ENDPOINTS.RATINGS.CREATE(bookId), ratingData);
  },

  updateRating: async (ratingId, ratingData) => {
    return await apiClient.put(API_ENDPOINTS.RATINGS.UPDATE(ratingId), ratingData);
  },

  deleteRating: async (ratingId) => {
    return await apiClient.delete(API_ENDPOINTS.RATINGS.DELETE(ratingId));
  },

  getRatingsByBook: async (bookId, page = 0, size = 10) => {
    return await apiClient.get(API_ENDPOINTS.RATINGS.GET_BY_BOOK(bookId, page, size));
  }
};

export default ratingService;
