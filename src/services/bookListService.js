import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

const bookListService = {
  createBookList: async (data) => {
    return await apiClient.post(API_ENDPOINTS.BOOKLISTS.CREATE, data);
  },

  getMyBookLists: async (page = 0, size = 8) => {
    return await apiClient.get(API_ENDPOINTS.BOOKLISTS.GET_MY, {
      params: { page, size }
    });
  },

  getBookListById: async (id) => {
    return await apiClient.get(API_ENDPOINTS.BOOKLISTS.GET_BY_ID(id));
  },

  updateBookList: async (id, data) => {
    return await apiClient.put(API_ENDPOINTS.BOOKLISTS.UPDATE(id), data);
  },

  deleteBookList: async (id) => {
    return await apiClient.delete(API_ENDPOINTS.BOOKLISTS.DELETE(id));
  },

  addBookToBookList: async (id, bookId) => {
    return await apiClient.post(API_ENDPOINTS.BOOKLISTS.ADD_BOOK(id, bookId));
  },

  removeBookFromBookList: async (id, bookId) => {
    return await apiClient.delete(API_ENDPOINTS.BOOKLISTS.REMOVE_BOOK(id, bookId));
  },

  getBooksInBookList: async (id, page = 0, size = 10) => {
    return await apiClient.get(API_ENDPOINTS.BOOKLISTS.GET_BOOKS(id, page, size));
  }
};

export default bookListService;
