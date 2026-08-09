import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import bookService from '../services/bookService';
import { useBookDetail } from './useBookDetail';

vi.mock('../services/bookService', () => ({
  default: { getBookById: vi.fn() },
}));

describe('useBookDetail', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('does not fetch without an id', () => {
    const { result } = renderHook(() => useBookDetail(null));

    expect(bookService.getBookById).not.toHaveBeenCalled();
    expect(result.current.book).toBeNull();
  });

  it('loads the book', async () => {
    bookService.getBookById.mockResolvedValue({ result: { id: 3, title: 'T' } });

    const { result } = renderHook(() => useBookDetail(3));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.book).toEqual({ id: 3, title: 'T' });
    expect(result.current.error).toBeNull();
  });

  it('exposes the error message on failure', async () => {
    bookService.getBookById.mockRejectedValue({ response: { data: { result: 'Sách không tồn tại' } } });

    const { result } = renderHook(() => useBookDetail(3));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Sách không tồn tại');
    expect(result.current.book).toBeNull();
  });

  it('refetches on demand', async () => {
    bookService.getBookById.mockResolvedValue({ result: { id: 3 } });
    const { result } = renderHook(() => useBookDetail(3));
    await waitFor(() => expect(result.current.loading).toBe(false));

    bookService.getBookById.mockResolvedValue({ result: { id: 3, title: 'updated' } });
    await act(async () => {
      await result.current.refetch();
    });

    expect(bookService.getBookById).toHaveBeenCalledTimes(2);
    expect(result.current.book.title).toBe('updated');
  });
});
