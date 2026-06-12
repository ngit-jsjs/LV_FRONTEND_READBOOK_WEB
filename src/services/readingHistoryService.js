import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

const readingHistoryService = {
  saveOrUpdate: async (bookId, chapterId) => {
    return await apiClient.put(API_ENDPOINTS.READING_HISTORY.SAVE, {
      bookId: Number(bookId),
      chapterId: Number(chapterId)
    });
  },

  getMyReadingHistory: async (page = 0, size = 10) => {
    return await apiClient.get(API_ENDPOINTS.READING_HISTORY.GET_MY(page, size));
  }
};

export default readingHistoryService;
