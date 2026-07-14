import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

const categoryService = {
  getAllCategories: (page = 0, size = 10) => {
    return apiClient.get(API_ENDPOINTS.CATEGORIES.GET_ALL, {
      params: { page, size }
    });
  },
  getAllCategoriesList: () => {
    return apiClient.get(API_ENDPOINTS.CATEGORIES.GET_LIST);
  },
  getCategoryById: (id) => {
    return apiClient.get(API_ENDPOINTS.CATEGORIES.GET_ONE(id));
  },
  createCategory: (data) => {
    return apiClient.post(API_ENDPOINTS.CATEGORIES.CREATE, data);
  },
  updateCategory: (id, data) => {
    return apiClient.put(API_ENDPOINTS.CATEGORIES.UPDATE(id), data);
  },
  deleteCategory: (id) => {
    return apiClient.delete(API_ENDPOINTS.CATEGORIES.DELETE(id));
  }
};

export default categoryService;
