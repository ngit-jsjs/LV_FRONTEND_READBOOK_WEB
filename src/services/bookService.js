import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

const bookService = {
  createBook: (bookData) => {
    return apiClient.post(API_ENDPOINTS.BOOKS.CREATE_BOOK, bookData);
  },
  
  getMyUploadBooks: (keyword = '', page = 0, size = 12) => {
    return apiClient.get(API_ENDPOINTS.BOOKS.MY_UPLOAD_BOOKS, {
      params: { keyword, page, size }
    });
  },

  getPublicBooks: (page = 0, size = 12) => {
    return apiClient.get(API_ENDPOINTS.BOOKS.GET_BOOKS_PUBLIC, {
      params: { page, size }
    });
  },

  searchBooks: (keyword, page = 0, size = 12) => {
    return apiClient.get(API_ENDPOINTS.BOOKS.SEARCH_BOOKS, {
      params: { keyword, page, size }
    });
  },

  getAuthorBooks: (authorId, page = 0, size = 12) => {
    return apiClient.get(API_ENDPOINTS.BOOKS.GET_AUTHOR_BOOKS(authorId), {
      params: { page, size }
    });
  },

  getBookById: (id) => {
    return apiClient.get(API_ENDPOINTS.BOOKS.GET_BOOK(id));
  },

  updateBook: (id, formData) => {
    return apiClient.put(API_ENDPOINTS.BOOKS.UPDATE_BOOK(id), formData);
  },

  deleteBook: (id) => {
    return apiClient.delete(API_ENDPOINTS.BOOKS.DELETE_BOOK(id));
  },
  importEpub: (bookId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post(API_ENDPOINTS.BOOKS.IMPORT_EPUB(bookId), formData);
  }
};

export default bookService;
