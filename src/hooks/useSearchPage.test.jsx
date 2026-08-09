import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import bookService from '../services/bookService';
import { useSearchPage } from './useSearchPage';

vi.mock('../services/bookService', () => ({
  default: { searchBooks: vi.fn(), getPublicBooks: vi.fn() },
}));

const renderSearchPage = (query = '') => {
  const wrapper = ({ children }) => (
    <MemoryRouter initialEntries={[`/search${query}`]}>{children}</MemoryRouter>
  );
  return renderHook(() => useSearchPage(), { wrapper });
};

describe('useSearchPage', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    bookService.getPublicBooks.mockResolvedValue({ result: { content: [{ id: 1 }], totalPages: 2 } });
    bookService.searchBooks.mockResolvedValue({ result: { content: [{ id: 2 }], totalPages: 5 } });
  });

  it('lists public books when no filter is present', async () => {
    const { result } = renderSearchPage();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(bookService.getPublicBooks).toHaveBeenCalledWith(0, 12);
    expect(bookService.searchBooks).not.toHaveBeenCalled();
    expect(result.current.books).toEqual([{ id: 1 }]);
    expect(result.current.totalPages).toBe(2);
  });

  it('reads filters from the query string and searches', async () => {
    const { result } = renderSearchPage(
      '?keyword=sci&author=Ann&publisher=Pub&year=2020&categories=1,2'
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(bookService.searchBooks).toHaveBeenCalledWith('sci', 'Ann', 'Pub', '2020', [1, 2], 0, 12);
    expect(result.current.keyword).toBe('sci');
    expect(result.current.author).toBe('Ann');
    expect(result.current.publisher).toBe('Pub');
    expect(result.current.year).toBe('2020');
    expect(result.current.categoryIds).toEqual([1, 2]);
    expect(result.current.books).toEqual([{ id: 2 }]);
  });

  it('searches when only categories are selected', async () => {
    const { result } = renderSearchPage('?categories=7');

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(bookService.searchBooks).toHaveBeenCalledWith('', '', '', '', [7], 0, 12);
  });

  it('refetches when the page changes', async () => {
    const { result } = renderSearchPage();
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      result.current.setPage(1);
    });

    await waitFor(() => expect(bookService.getPublicBooks).toHaveBeenLastCalledWith(1, 12));
  });

  it('resets results for a response without page content', async () => {
    bookService.getPublicBooks.mockResolvedValue({ result: null });

    const { result } = renderSearchPage();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.books).toEqual([]);
    expect(result.current.totalPages).toBe(0);
  });

  it('defaults totalPages to 0 when the response omits it', async () => {
    bookService.getPublicBooks.mockResolvedValue({ result: { content: [{ id: 1 }] } });

    const { result } = renderSearchPage();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.totalPages).toBe(0);
  });

  it('resets results when the request fails', async () => {
    bookService.getPublicBooks.mockRejectedValue(new Error('boom'));

    const { result } = renderSearchPage();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.books).toEqual([]);
    expect(result.current.totalPages).toBe(0);
  });
});
