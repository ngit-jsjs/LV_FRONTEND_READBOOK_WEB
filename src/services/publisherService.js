import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

const publisherService = {
  getAllPublishers: (page = 0, size = 10) => {
    return apiClient.get(API_ENDPOINTS.PUBLISHERS.GET_ALL, {
      params: { page, size }
    });
  },
  getPublisherById: (id) => {
    return apiClient.get(API_ENDPOINTS.PUBLISHERS.GET_ONE(id));
  },
  createPublisher: (data) => {
    return apiClient.post(API_ENDPOINTS.PUBLISHERS.CREATE, data);
  },
  updatePublisher: (id, data) => {
    return apiClient.put(API_ENDPOINTS.PUBLISHERS.UPDATE(id), data);
  },
  deletePublisher: (id) => {
    return apiClient.delete(API_ENDPOINTS.PUBLISHERS.DELETE(id));
  },
  searchPublishers: (keyword = '', page = 0, size = 10) => {
    return apiClient.get(API_ENDPOINTS.PUBLISHERS.SEARCH, {
      params: { keyword, page, size }
    });
  }
};

export default publisherService;
