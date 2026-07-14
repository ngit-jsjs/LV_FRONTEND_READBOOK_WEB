import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

const bookService = {
  createBook: (bookData) => {
    return apiClient.post(API_ENDPOINTS.BOOKS.CREATE_BOOK, bookData);
  },
  
  getMyUploadBooks: (keyword = '', status = '', author = '', publisher = '', year = '', categoryIds = [], page = 0, size = 12) => {
    const params = { keyword, page, size };
    if (status) params.status = status;
    if (author) params.author = author;
    if (publisher) params.publisher = publisher;
    if (year) params.year = year;
    if (categoryIds && categoryIds.length > 0) {
      params.categoryIds = categoryIds.join(',');
    }
    return apiClient.get(API_ENDPOINTS.BOOKS.MY_UPLOAD_BOOKS, { params });
  },

  getPublicBooks: (page = 0, size = 12) => {
    return apiClient.get(API_ENDPOINTS.BOOKS.GET_BOOKS_PUBLIC, {
      params: { page, size }
    });
  },

  searchBooks: (keyword, author = '', publisher = '', year = '', categoryIds = [], page = 0, size = 12) => {
    const params = { keyword, page, size };
    if (author) params.author = author;
    if (publisher) params.publisher = publisher;
    if (year) params.year = year;
    if (categoryIds && categoryIds.length > 0) {
      params.categoryIds = categoryIds.join(',');
    }
    return apiClient.get(API_ENDPOINTS.BOOKS.SEARCH_BOOKS, { params });
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
  },

  getUnratedFinishedBooks: (page = 0, size = 12) => {
    return apiClient.get(API_ENDPOINTS.BOOKS.MY_UNRATED_FINISHED_BOOKS, {
      params: { page, size }
    });
  }
};

export default bookService;
