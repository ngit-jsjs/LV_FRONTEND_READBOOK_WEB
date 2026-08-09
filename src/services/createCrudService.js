import apiClient from './apiClient';

/**
 * Builds the standard CRUD calls shared by the simple catalog resources
 * (authors, publishers, categories) from an API_ENDPOINTS group.
 */
const createCrudService = (endpoints) => ({
  getAll: (page = 0, size = 10) => apiClient.get(endpoints.GET_ALL, { params: { page, size } }),
  getOne: (id) => apiClient.get(endpoints.GET_ONE(id)),
  create: (data) => apiClient.post(endpoints.CREATE, data),
  update: (id, data) => apiClient.put(endpoints.UPDATE(id), data),
  remove: (id) => apiClient.delete(endpoints.DELETE(id)),
  ...(endpoints.SEARCH
    ? {
        search: (keyword = '', page = 0, size = 10) =>
          apiClient.get(endpoints.SEARCH, { params: { keyword, page, size } }),
      }
    : {}),
});

export default createCrudService;
