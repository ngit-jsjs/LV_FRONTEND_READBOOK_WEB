import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

const bookService = {
  createBook: async (bookData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.BOOKS.CREATE_BOOK, bookData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  getMyBooks: async (page = 0, size = 10) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BOOKS.MY_BOOKS, {
        params: { page, size }
      });
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },

  getPublicBooks: async (page = 0, size = 10) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BOOKS.SEARCH_BOOKS, {
        params: { keyword: '', page, size }
      });
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },

  searchBooks: async (keyword, page = 0, size = 10) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BOOKS.SEARCH_BOOKS, {
        params: { keyword, page, size }
      });
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },

  getAuthorBooks: async (authorId, page = 0, size = 10) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BOOKS.GET_AUTHOR_BOOKS(authorId), {
        params: { page, size }
      });
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },

  getBookById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BOOKS.GET_BOOK(id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateBook: async (id, formData) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.BOOKS.UPDATE_BOOK(id), formData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteBook: async (id) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.BOOKS.DELETE_BOOK(id));
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default bookService;
