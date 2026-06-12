import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

const userService = {
  searchUsers: (keyword, page = 1, size = 10) => {
    return apiClient.get(API_ENDPOINTS.USER.SEARCH, {
      params: { keyword, page, size }
    });
  },

  getUserById: (userId) => {
    return apiClient.get(API_ENDPOINTS.USER.GET_BY_ID(userId));
  },

  updateUser: (userId, data) => {
    return apiClient.put(API_ENDPOINTS.USER.UPDATE(userId), data);
  },

  deleteUser: (userId) => {
    return apiClient.delete(API_ENDPOINTS.USER.DELETE(userId));
  },

  upgradeToAuthor: () => {
    return apiClient.post(API_ENDPOINTS.USER.UPGRADE_AUTHOR);
  }
};

export default userService;
