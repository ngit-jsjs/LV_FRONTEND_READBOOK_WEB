import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

const readingHistoryService = {
  saveOrUpdate: async (bookId, chapterId, isCompleted = null) => {
    const payload = {
      bookId: Number(bookId),
      chapterId: Number(chapterId)
    };
    if (isCompleted !== null) {
      payload.isCompleted = isCompleted;
    }
    return await apiClient.put(API_ENDPOINTS.READING_HISTORY.SAVE, payload);
  },

  getMyReadingHistory: async (page = 0, size = 10) => {
    return await apiClient.get(API_ENDPOINTS.READING_HISTORY.GET_MY(page, size));
  }
};

export default readingHistoryService;
