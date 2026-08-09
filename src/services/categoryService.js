import apiClient from './apiClient';
import createCrudService from './createCrudService';
import { API_ENDPOINTS } from './apiEndpoints';

const crud = createCrudService(API_ENDPOINTS.CATEGORIES);

const categoryService = {
  ...crud,
  getAllCategories: crud.getAll,
  getAllCategoriesList: () => apiClient.get(API_ENDPOINTS.CATEGORIES.GET_LIST),
  getCategoryById: crud.getOne,
  createCategory: crud.create,
  updateCategory: crud.update,
  deleteCategory: crud.remove,
};

export default categoryService;
