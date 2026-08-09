import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import chapterService from '../services/chapterService';
import { useChapters } from './useChapters';

vi.mock('../services/chapterService', () => ({
  default: { getChaptersByBookId: vi.fn() },
}));

describe('useChapters', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('does not fetch without a book id', () => {
    const { result } = renderHook(() => useChapters(undefined));

    expect(chapterService.getChaptersByBookId).not.toHaveBeenCalled();
    expect(result.current.chapters).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it('handles a plain array result as a single page', async () => {
    chapterService.getChaptersByBookId.mockResolvedValue({ result: [{ id: 1 }, { id: 2 }] });

    const { result } = renderHook(() => useChapters(5));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(chapterService.getChaptersByBookId).toHaveBeenCalledWith(5, 0, 20);
    expect(result.current.chapters).toHaveLength(2);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.totalElements).toBe(2);
  });

  it('handles a paginated result', async () => {
    chapterService.getChaptersByBookId.mockResolvedValue({
      result: { content: [{ id: 1 }], totalPages: 3, totalElements: 42 },
    });

    const { result } = renderHook(() => useChapters(5, 10));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(chapterService.getChaptersByBookId).toHaveBeenCalledWith(5, 0, 10);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.totalElements).toBe(42);
  });

  it('falls back to defaults when the page metadata is missing', async () => {
    chapterService.getChaptersByBookId.mockResolvedValue({
      result: { content: [{ id: 1 }, { id: 2 }] },
    });

    const { result } = renderHook(() => useChapters(5));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.totalPages).toBe(1);
    expect(result.current.totalElements).toBe(2);
  });

  it('resets state for an unexpected result shape', async () => {
    chapterService.getChaptersByBookId.mockResolvedValue({ result: null });

    const { result } = renderHook(() => useChapters(5));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.chapters).toEqual([]);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.totalElements).toBe(0);
  });

  it('exposes an error message when the request fails', async () => {
    const err = new Error('nope');
    err.response = { data: { message: 'Không tải được chương' } };
    chapterService.getChaptersByBookId.mockRejectedValue(err);

    const { result } = renderHook(() => useChapters(5));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Không tải được chương');
  });

  it('converts 1-based page changes to 0-based fetches', async () => {
    chapterService.getChaptersByBookId.mockResolvedValue({ result: [] });
    const { result } = renderHook(() => useChapters(5));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      result.current.handlePageChange(3);
    });

    expect(chapterService.getChaptersByBookId).toHaveBeenLastCalledWith(5, 2, 20);
    expect(result.current.page).toBe(2);
  });
});
