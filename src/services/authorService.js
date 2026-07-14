import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

const authorService = {
  getAllAuthors: (page = 0, size = 10) => {
    return apiClient.get(API_ENDPOINTS.AUTHORS.GET_ALL, {
      params: { page, size }
    });
  },
  getAuthorById: (id) => {
    return apiClient.get(API_ENDPOINTS.AUTHORS.GET_ONE(id));
  },
  createAuthor: (data) => {
    return apiClient.post(API_ENDPOINTS.AUTHORS.CREATE, data);
  },
  updateAuthor: (id, data) => {
    return apiClient.put(API_ENDPOINTS.AUTHORS.UPDATE(id), data);
  },
  deleteAuthor: (id) => {
    return apiClient.delete(API_ENDPOINTS.AUTHORS.DELETE(id));
  },
  searchAuthors: (keyword = '', page = 0, size = 10) => {
    return apiClient.get(API_ENDPOINTS.AUTHORS.SEARCH, {
      params: { keyword, page, size }
    });
  }
};

export default authorService;
