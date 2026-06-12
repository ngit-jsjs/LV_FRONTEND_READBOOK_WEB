import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

const chapterService = {
  createChapter: async (bookId, chapterData) => {
    return await apiClient.post(API_ENDPOINTS.CHAPTERS.CREATE_CHAPTER(bookId), chapterData);
  },

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
  }
};

export default chapterService;
