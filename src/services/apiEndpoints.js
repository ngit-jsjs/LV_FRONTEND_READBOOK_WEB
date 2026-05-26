export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/user',
    LOGOUT: '/auth/logout',
  },
  USER: {
    MY_INFO: '/user/myInfo',
    SEARCH: '/user/search',
    UPDATE: (userId) => `/user/${userId}`,
    DELETE: (userId) => `/user/${userId}`,
  }
};
