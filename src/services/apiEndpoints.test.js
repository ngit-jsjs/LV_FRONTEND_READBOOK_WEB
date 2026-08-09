import { describe, it, expect } from 'vitest';
import { API_ENDPOINTS } from './apiEndpoints';

describe('API_ENDPOINTS builders', () => {
  it('builds resource paths from ids', () => {
    expect(API_ENDPOINTS.BOOKS.GET_BOOK(3)).toBe('/books/3');
    expect(API_ENDPOINTS.BOOKS.UPDATE_BOOK(3)).toBe('/books/3');
    expect(API_ENDPOINTS.BOOKS.DELETE_BOOK(3)).toBe('/books/3');
    expect(API_ENDPOINTS.BOOKS.IMPORT_EPUB(3)).toBe('/books/3/import-epub');
    expect(API_ENDPOINTS.USER.GET_BY_ID(9)).toBe('/user/9');
    expect(API_ENDPOINTS.USER.UPDATE(9)).toBe('/user/9');
    expect(API_ENDPOINTS.USER.DELETE(9)).toBe('/user/9');
    expect(API_ENDPOINTS.CATEGORIES.GET_ONE(1)).toBe('/categories/1');
    expect(API_ENDPOINTS.CATEGORIES.UPDATE(1)).toBe('/categories/1');
    expect(API_ENDPOINTS.CATEGORIES.DELETE(1)).toBe('/categories/1');
    expect(API_ENDPOINTS.AUTHORS.GET_ONE(2)).toBe('/authors/2');
    expect(API_ENDPOINTS.AUTHORS.UPDATE(2)).toBe('/authors/2');
    expect(API_ENDPOINTS.AUTHORS.DELETE(2)).toBe('/authors/2');
    expect(API_ENDPOINTS.PUBLISHERS.GET_ONE(4)).toBe('/publishers/4');
    expect(API_ENDPOINTS.PUBLISHERS.UPDATE(4)).toBe('/publishers/4');
    expect(API_ENDPOINTS.PUBLISHERS.DELETE(4)).toBe('/publishers/4');
    expect(API_ENDPOINTS.PAYMENT.ADMIN_USER_HISTORY(9)).toBe('/api/payment/admin/user/9');
  });

  it('builds chapter paths', () => {
    expect(API_ENDPOINTS.CHAPTERS.GET_CHAPTERS_BY_BOOK(5)).toBe('/chapters/book/5?page=0&size=100');
    expect(API_ENDPOINTS.CHAPTERS.GET_CHAPTERS_BY_BOOK(5, 2, 20)).toBe('/chapters/book/5?page=2&size=20');
    expect(API_ENDPOINTS.CHAPTERS.GET_CHAPTER(7)).toBe('/chapters/7');
    expect(API_ENDPOINTS.CHAPTERS.UPDATE_CHAPTER(7)).toBe('/chapters/7');
    expect(API_ENDPOINTS.CHAPTERS.DELETE_CHAPTER(7)).toBe('/chapters/7');
    expect(API_ENDPOINTS.CHAPTERS.UNLOCK_CHAPTER(7)).toBe('/chapters/7/unlock');
    expect(API_ENDPOINTS.CHAPTERS.BATCH_UPDATE(5)).toBe('/chapters/book/5/batch');
    expect(API_ENDPOINTS.CHAPTERS.DELETE_ALL(5)).toBe('/chapters/book/5/all');
    expect(API_ENDPOINTS.CHAPTERS.ADMIN_USER_UNLOCKS(9)).toBe('/chapters/admin/user/9/unlocks');
  });

  it('builds paginated paths with defaults', () => {
    expect(API_ENDPOINTS.RATINGS.GET_BY_BOOK(5)).toBe('/ratings/book/5?page=0&size=10');
    expect(API_ENDPOINTS.RATINGS.GET_BY_BOOK(5, 1, 5)).toBe('/ratings/book/5?page=1&size=5');
    expect(API_ENDPOINTS.RATINGS.MY_RATINGS()).toBe('/ratings/my-ratings?page=0&size=10');
    expect(API_ENDPOINTS.RATINGS.MY_RATINGS(3, 25)).toBe('/ratings/my-ratings?page=3&size=25');
    expect(API_ENDPOINTS.RATINGS.CREATE(5)).toBe('/ratings/book/5');
    expect(API_ENDPOINTS.RATINGS.UPDATE(8)).toBe('/ratings/8');
    expect(API_ENDPOINTS.RATINGS.DELETE(8)).toBe('/ratings/8');
    expect(API_ENDPOINTS.READING_HISTORY.GET_MY()).toBe('/reading-history?page=0&size=10');
    expect(API_ENDPOINTS.READING_HISTORY.GET_MY(2, 4)).toBe('/reading-history?page=2&size=4');
  });

  it('builds book list paths', () => {
    expect(API_ENDPOINTS.BOOKLISTS.GET_BY_ID(1)).toBe('/booklists/1');
    expect(API_ENDPOINTS.BOOKLISTS.UPDATE(1)).toBe('/booklists/1');
    expect(API_ENDPOINTS.BOOKLISTS.DELETE(1)).toBe('/booklists/1');
    expect(API_ENDPOINTS.BOOKLISTS.ADD_BOOK(1, 2)).toBe('/booklists/1/books/2');
    expect(API_ENDPOINTS.BOOKLISTS.REMOVE_BOOK(1, 2)).toBe('/booklists/1/books/2');
    expect(API_ENDPOINTS.BOOKLISTS.GET_BOOKS(1)).toBe('/booklists/1/books?page=0&size=10');
    expect(API_ENDPOINTS.BOOKLISTS.GET_BOOKS(1, 1, 3)).toBe('/booklists/1/books?page=1&size=3');
  });
});
