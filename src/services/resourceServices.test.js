import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';
import authorService from './authorService';
import bookListService from './bookListService';
import bookService from './bookService';
import categoryService from './categoryService';
import chapterService from './chapterService';
import paymentService from './paymentService';
import planService from './planService';
import publisherService from './publisherService';
import ratingService from './ratingService';
import readingHistoryService from './readingHistoryService';
import recommendationService from './recommendationService';
import subscriptionService from './subscriptionService';
import userService from './userService';

vi.mock('./apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  getErrorMessage: vi.fn(),
}));

describe('resource services', () => {
  beforeEach(() => {
    apiClient.get.mockResolvedValue({ result: 'ok' });
    apiClient.post.mockResolvedValue({ result: 'ok' });
    apiClient.put.mockResolvedValue({ result: 'ok' });
    apiClient.delete.mockResolvedValue({ result: 'ok' });
  });

  describe('bookService', () => {
    it('creates, updates and deletes books', async () => {
      await bookService.createBook({ title: 'T' });
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.BOOKS.CREATE_BOOK, { title: 'T' });

      const formData = new FormData();
      await bookService.updateBook(3, formData);
      expect(apiClient.put).toHaveBeenCalledWith('/books/3', formData);

      await bookService.deleteBook(3);
      expect(apiClient.delete).toHaveBeenCalledWith('/books/3');

      await bookService.getBookById(3);
      expect(apiClient.get).toHaveBeenCalledWith('/books/3');
    });

    it('lists public and unrated books with pagination defaults', async () => {
      await bookService.getPublicBooks();
      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.BOOKS.GET_BOOKS_PUBLIC, {
        params: { page: 0, size: 12 },
      });

      await bookService.getUnratedFinishedBooks(2, 5);
      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.BOOKS.MY_UNRATED_FINISHED_BOOKS, {
        params: { page: 2, size: 5 },
      });
    });

    it('omits empty optional filters from my-upload-books params', async () => {
      await bookService.getMyUploadBooks('abc');

      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.BOOKS.MY_UPLOAD_BOOKS, {
        params: { keyword: 'abc', page: 0, size: 12 },
      });
    });

    it('includes provided filters and joins category ids', async () => {
      await bookService.getMyUploadBooks('abc', 'PUBLISHED', 'Ann', 'Pub', '2020', [1, 2], 1, 6);

      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.BOOKS.MY_UPLOAD_BOOKS, {
        params: {
          keyword: 'abc',
          page: 1,
          size: 6,
          status: 'PUBLISHED',
          author: 'Ann',
          publisher: 'Pub',
          year: '2020',
          categoryIds: '1,2',
        },
      });
    });

    it('builds search params, skipping empty filters and empty category lists', async () => {
      await bookService.searchBooks('sci-fi', '', '', '', []);
      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.BOOKS.SEARCH_BOOKS, {
        params: { keyword: 'sci-fi', page: 0, size: 12 },
      });

      await bookService.searchBooks('sci-fi', 'Ann', 'Pub', '2021', [7], 2, 4);
      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.BOOKS.SEARCH_BOOKS, {
        params: {
          keyword: 'sci-fi',
          page: 2,
          size: 4,
          author: 'Ann',
          publisher: 'Pub',
          year: '2021',
          categoryIds: '7',
        },
      });
    });

    it('wraps the epub file in form data', async () => {
      const file = new File(['data'], 'book.epub');

      await bookService.importEpub(5, file);

      const [endpoint, body] = apiClient.post.mock.calls[0];
      expect(endpoint).toBe('/books/5/import-epub');
      expect(body).toBeInstanceOf(FormData);
      expect(body.get('file')).toBe(file);
    });
  });

  describe('chapterService', () => {
    it('maps each method to its endpoint', async () => {
      await chapterService.getChaptersByBookId(5);
      expect(apiClient.get).toHaveBeenCalledWith('/chapters/book/5?page=0&size=50');

      await chapterService.getChapterById(7);
      expect(apiClient.get).toHaveBeenCalledWith('/chapters/7');

      await chapterService.updateChapter(7, { title: 'C' });
      expect(apiClient.put).toHaveBeenCalledWith('/chapters/7', { title: 'C' });

      await chapterService.deleteChapter(7);
      expect(apiClient.delete).toHaveBeenCalledWith('/chapters/7');

      await chapterService.unlockChapter(7);
      expect(apiClient.post).toHaveBeenCalledWith('/chapters/7/unlock');

      await chapterService.batchUpdateChapters(5, [{ id: 1 }]);
      expect(apiClient.put).toHaveBeenCalledWith('/chapters/book/5/batch', [{ id: 1 }]);

      await chapterService.deleteAllChapters(5);
      expect(apiClient.delete).toHaveBeenCalledWith('/chapters/book/5/all');

      await chapterService.getMyUnlocks(1, 3);
      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.CHAPTERS.MY_UNLOCKS, {
        params: { page: 1, size: 3 },
      });

      await chapterService.getAdminUserUnlocks(9);
      expect(apiClient.get).toHaveBeenCalledWith('/chapters/admin/user/9/unlocks', {
        params: { page: 0, size: 10 },
      });
    });
  });

  describe('categoryService', () => {
    it('maps each method to its endpoint', async () => {
      await categoryService.getAllCategories();
      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.CATEGORIES.GET_ALL, {
        params: { page: 0, size: 10 },
      });

      await categoryService.getAllCategoriesList();
      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.CATEGORIES.GET_LIST);

      await categoryService.getCategoryById(1);
      expect(apiClient.get).toHaveBeenCalledWith('/categories/1');

      await categoryService.createCategory({ name: 'N' });
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.CATEGORIES.CREATE, { name: 'N' });

      await categoryService.updateCategory(1, { name: 'N2' });
      expect(apiClient.put).toHaveBeenCalledWith('/categories/1', { name: 'N2' });

      await categoryService.deleteCategory(1);
      expect(apiClient.delete).toHaveBeenCalledWith('/categories/1');
    });
  });

  describe('authorService and publisherService', () => {
    it('map each method to its endpoint', async () => {
      await authorService.getAllAuthors(1, 5);
      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.AUTHORS.GET_ALL, {
        params: { page: 1, size: 5 },
      });
      await authorService.getAuthorById(2);
      expect(apiClient.get).toHaveBeenCalledWith('/authors/2');
      await authorService.createAuthor({ name: 'A' });
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTHORS.CREATE, { name: 'A' });
      await authorService.updateAuthor(2, { name: 'B' });
      expect(apiClient.put).toHaveBeenCalledWith('/authors/2', { name: 'B' });
      await authorService.deleteAuthor(2);
      expect(apiClient.delete).toHaveBeenCalledWith('/authors/2');
      await authorService.searchAuthors();
      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.AUTHORS.SEARCH, {
        params: { keyword: '', page: 0, size: 10 },
      });

      await publisherService.getAllPublishers();
      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.PUBLISHERS.GET_ALL, {
        params: { page: 0, size: 10 },
      });
      await publisherService.getPublisherById(4);
      expect(apiClient.get).toHaveBeenCalledWith('/publishers/4');
      await publisherService.createPublisher({ name: 'P' });
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.PUBLISHERS.CREATE, { name: 'P' });
      await publisherService.updatePublisher(4, { name: 'P2' });
      expect(apiClient.put).toHaveBeenCalledWith('/publishers/4', { name: 'P2' });
      await publisherService.deletePublisher(4);
      expect(apiClient.delete).toHaveBeenCalledWith('/publishers/4');
      await publisherService.searchPublishers('key', 2, 3);
      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.PUBLISHERS.SEARCH, {
        params: { keyword: 'key', page: 2, size: 3 },
      });
    });
  });

  describe('userService', () => {
    it('maps each method to its endpoint', async () => {
      await userService.searchUsers('an');
      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.USER.SEARCH, {
        params: { keyword: 'an', page: 1, size: 10 },
      });

      await userService.getUserById(9);
      expect(apiClient.get).toHaveBeenCalledWith('/user/9');

      await userService.updateUser(9, { name: 'N' });
      expect(apiClient.put).toHaveBeenCalledWith('/user/9', { name: 'N' });

      await userService.deleteUser(9);
      expect(apiClient.delete).toHaveBeenCalledWith('/user/9');

      await userService.upgradeToAuthor();
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.USER.UPGRADE_AUTHOR);
    });
  });

  describe('ratingService', () => {
    it('maps each method to its endpoint', async () => {
      await ratingService.createRating(5, { star: 4 });
      expect(apiClient.post).toHaveBeenCalledWith('/ratings/book/5', { star: 4 });

      await ratingService.updateRating(8, { star: 5 });
      expect(apiClient.put).toHaveBeenCalledWith('/ratings/8', { star: 5 });

      await ratingService.deleteRating(8);
      expect(apiClient.delete).toHaveBeenCalledWith('/ratings/8');

      await ratingService.getRatingsByBook(5, 1, 2);
      expect(apiClient.get).toHaveBeenCalledWith('/ratings/book/5?page=1&size=2');

      await ratingService.getMyRatings();
      expect(apiClient.get).toHaveBeenCalledWith('/ratings/my-ratings?page=0&size=10');
    });
  });

  describe('bookListService', () => {
    it('maps each method to its endpoint', async () => {
      await bookListService.createBookList({ name: 'L' });
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.BOOKLISTS.CREATE, { name: 'L' });

      await bookListService.getMyBookLists();
      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.BOOKLISTS.GET_MY, {
        params: { page: 0, size: 8 },
      });

      await bookListService.getBookListById(1);
      expect(apiClient.get).toHaveBeenCalledWith('/booklists/1');

      await bookListService.updateBookList(1, { name: 'L2' });
      expect(apiClient.put).toHaveBeenCalledWith('/booklists/1', { name: 'L2' });

      await bookListService.deleteBookList(1);
      expect(apiClient.delete).toHaveBeenCalledWith('/booklists/1');

      await bookListService.addBookToBookList(1, 2);
      expect(apiClient.post).toHaveBeenCalledWith('/booklists/1/books/2');

      await bookListService.removeBookFromBookList(1, 2);
      expect(apiClient.delete).toHaveBeenCalledWith('/booklists/1/books/2');

      await bookListService.getBooksInBookList(1, 3, 4);
      expect(apiClient.get).toHaveBeenCalledWith('/booklists/1/books?page=3&size=4');
    });
  });

  describe('readingHistoryService', () => {
    it('coerces ids to numbers and omits isCompleted when null', async () => {
      await readingHistoryService.saveOrUpdate('5', '7');

      expect(apiClient.put).toHaveBeenCalledWith(API_ENDPOINTS.READING_HISTORY.SAVE, {
        bookId: 5,
        chapterId: 7,
      });
    });

    it('includes isCompleted when provided', async () => {
      await readingHistoryService.saveOrUpdate(5, 7, false);

      expect(apiClient.put).toHaveBeenCalledWith(API_ENDPOINTS.READING_HISTORY.SAVE, {
        bookId: 5,
        chapterId: 7,
        isCompleted: false,
      });
    });

    it('fetches paginated history', async () => {
      await readingHistoryService.getMyReadingHistory(1, 2);
      expect(apiClient.get).toHaveBeenCalledWith('/reading-history?page=1&size=2');
    });
  });

  describe('payment, plan, subscription and recommendation services', () => {
    it('map each method to its endpoint', async () => {
      await paymentService.buyPackage(3);
      expect(apiClient.post).toHaveBeenCalledWith(`${API_ENDPOINTS.PAYMENT.BUY_PACKAGE}?planId=3`);

      await paymentService.getAdminUserPaymentHistory(9, 1, 5);
      expect(apiClient.get).toHaveBeenCalledWith('/api/payment/admin/user/9', {
        params: { page: 1, size: 5 },
      });

      await planService.getAllPlans();
      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.PLANS.GET_ALL);

      await subscriptionService.getMySubscriptions();
      expect(apiClient.get).toHaveBeenCalledWith(
        `${API_ENDPOINTS.SUBSCRIPTIONS.GET_MY}?page=0&size=10`
      );

      await recommendationService.getRecommendations();
      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.RECOMMENDATIONS.GET_RECOMMENDATIONS);

      await recommendationService.trainRecommender();
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.RECOMMENDATIONS.TRAIN);
    });
  });
});
