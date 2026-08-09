import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import recommendationService from '../services/recommendationService';
import { useAuth } from '../context/AuthContext';
import { useRecommendations } from './useRecommendations';

vi.mock('../services/recommendationService', () => ({
  default: { getRecommendations: vi.fn() },
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('useRecommendations', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    useAuth.mockReturnValue({ user: { id: 1 } });
  });

  it('skips fetching for anonymous visitors', async () => {
    useAuth.mockReturnValue({ user: null });

    const { result } = renderHook(() => useRecommendations());

    await waitFor(() => expect(result.current.recsLoading).toBe(false));
    expect(recommendationService.getRecommendations).not.toHaveBeenCalled();
    expect(result.current.recs).toEqual([]);
  });

  it('loads recommendations for a signed-in user', async () => {
    recommendationService.getRecommendations.mockResolvedValue({ result: [{ id: 1 }] });

    const { result } = renderHook(() => useRecommendations());

    await waitFor(() => expect(result.current.recs).toEqual([{ id: 1 }]));
    expect(result.current.recsLoading).toBe(false);
  });

  it('keeps the list empty when the response has no result', async () => {
    recommendationService.getRecommendations.mockResolvedValue({});

    const { result } = renderHook(() => useRecommendations());

    await waitFor(() => expect(result.current.recsLoading).toBe(false));
    expect(result.current.recs).toEqual([]);
  });

  it('resets the list when the request fails', async () => {
    recommendationService.getRecommendations.mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useRecommendations());

    await waitFor(() => expect(result.current.recsLoading).toBe(false));
    expect(result.current.recs).toEqual([]);
  });
});
