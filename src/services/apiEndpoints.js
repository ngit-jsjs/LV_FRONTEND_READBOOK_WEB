export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/user',
    LOGOUT: '/auth/logout',
  },
  BOOKS: {
    CREATE_BOOK: '/books',
    MY_BOOKS: '/books/my-books',
    SEARCH_BOOKS: '/books/search',
    GET_BOOKS_PUBLIC: '/books',
    GET_BOOK: (bookId) => `/books/${bookId}`,
    UPDATE_BOOK: (bookId) => `/books/${bookId}`,
    DELETE_BOOK: (bookId) => `/books/${bookId}`,
    GET_AUTHOR_BOOKS: (authorId) => `/books/authors/${authorId}`,
  },
  USER: {
    MY_INFO: '/user/myInfo',
    SEARCH: '/user/search',
    GET_BY_ID: (userId) => `/user/${userId}`,
    UPDATE: (userId) => `/user/${userId}`,
    DELETE: (userId) => `/user/${userId}`,
    UPGRADE_AUTHOR: '/user/upgrade-author',
  }
};
