import fetchApi from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

export const userService = {
  /**
   * Tìm kiếm người dùng / tác giả theo tên
   * @param {string} keyword Từ khóa tìm kiếm
   * @param {number} page Trang hiện tại (mặc định 1)
   * @param {number} size Số lượng hiển thị (mặc định 10)
   */
  searchUsers: async (keyword, page = 1, size = 10) => {
    try {
      const response = await fetchApi.get(API_ENDPOINTS.USER.SEARCH, {
        params: { 
          keyword, 
          page, 
          size 
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy thông tin người dùng theo ID
   * @param {number|string} userId ID của người dùng
   */
  getUserById: async (userId) => {
    try {
      const response = await fetchApi.get(API_ENDPOINTS.USER.GET_BY_ID(userId));
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cập nhật thông tin cá nhân
   * @param {number} userId ID người dùng
   * @param {object} data Dữ liệu cập nhật (vd: { name, email })
   */
  updateUser: async (userId, data) => {
    try {
      // API expects PUT /user/{id}
      const response = await fetchApi.put(API_ENDPOINTS.USER.UPDATE(userId), data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Xóa người dùng (Chỉ dành cho Admin)
   * @param {number} userId ID người dùng
   */
  deleteUser: async (userId) => {
    try {
      const response = await fetchApi.delete(API_ENDPOINTS.USER.DELETE(userId));
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Yêu cầu nâng cấp tài khoản thành tác giả
   */
  upgradeToAuthor: async () => {
    try {
      const response = await fetchApi.post(API_ENDPOINTS.USER.UPGRADE_AUTHOR);
      return response;
    } catch (error) {
      throw error;
    }
  }
};
