import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import chapterService from '../services/chapterService';
import { useChapterDetail } from './useChapterDetail';

vi.mock('../services/chapterService', () => ({
  default: { getChapterById: vi.fn() },
}));

describe('useChapterDetail', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('does not fetch without a chapter id', () => {
    renderHook(() => useChapterDetail(undefined));
    expect(chapterService.getChapterById).not.toHaveBeenCalled();
  });

  it('loads the chapter', async () => {
    chapterService.getChapterById.mockResolvedValue({ result: { id: 7, title: 'C1' } });

    const { result } = renderHook(() => useChapterDetail(7));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.chapter).toEqual({ id: 7, title: 'C1' });
  });

  it('exposes a fallback error message when the failure has no details', async () => {
    chapterService.getChapterById.mockRejectedValue({});

    const { result } = renderHook(() => useChapterDetail(7));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Đã xảy ra lỗi hệ thống');
  });

  it('refreshes the chapter on demand', async () => {
    chapterService.getChapterById.mockResolvedValue({ result: { id: 7 } });
    const { result } = renderHook(() => useChapterDetail(7));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.refreshChapter();
    });

    expect(chapterService.getChapterById).toHaveBeenCalledTimes(2);
  });
});
