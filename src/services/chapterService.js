import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

const chapterService = {
  getChaptersByBookId: async (bookId, page = 0, size = 50) => {
    return await apiClient.get(API_ENDPOINTS.CHAPTERS.GET_CHAPTERS_BY_BOOK(bookId, page, size));
  },

  getChapterById: async (chapterId) => {
    return await apiClient.get(API_ENDPOINTS.CHAPTERS.GET_CHAPTER(chapterId));
  },

  updateChapter: async (chapterId, chapterData) => {
    return await apiClient.put(API_ENDPOINTS.CHAPTERS.UPDATE_CHAPTER(chapterId), chapterData);
  },

  deleteChapter: async (chapterId) => {
    return await apiClient.delete(API_ENDPOINTS.CHAPTERS.DELETE_CHAPTER(chapterId));
  },

  unlockChapter: async (chapterId) => {
    return await apiClient.post(API_ENDPOINTS.CHAPTERS.UNLOCK_CHAPTER(chapterId));
  },

  batchUpdateChapters: async (bookId, batchData) => {
    return await apiClient.put(API_ENDPOINTS.CHAPTERS.BATCH_UPDATE(bookId), batchData);
  },

  deleteAllChapters: async (bookId) => {
    return await apiClient.delete(API_ENDPOINTS.CHAPTERS.DELETE_ALL(bookId));
  },

  getMyUnlocks: async (page = 0, size = 10) => {
    return await apiClient.get(API_ENDPOINTS.CHAPTERS.MY_UNLOCKS, {
      params: { page, size }
    });
  },

  getAdminUserUnlocks: async (userId, page = 0, size = 10) => {
    return await apiClient.get(API_ENDPOINTS.CHAPTERS.ADMIN_USER_UNLOCKS(userId), {
      params: { page, size }
    });
  }
};

export default chapterService;
