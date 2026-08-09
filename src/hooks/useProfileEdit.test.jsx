import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import userService from '../services/userService';
import { ROUTES } from '../config/routes';
import { useProfileEdit } from './useProfileEdit';

const navigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigate,
}));

vi.mock('../services/userService', () => ({
  default: { updateUser: vi.fn() },
}));

describe('useProfileEdit', () => {
  const user = { userId: 7, name: 'An', email: 'an@test.com' };

  beforeEach(() => {
    vi.useFakeTimers();
    userService.updateUser.mockResolvedValue({});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('redirects to login when there is no user', () => {
    renderHook(() => useProfileEdit(null, undefined));

    expect(navigate).toHaveBeenCalledWith(ROUTES.LOGIN);
  });

  it('submits name and email only when no password is entered', async () => {
    const { result } = renderHook(() => useProfileEdit(user, undefined));

    await act(async () => {
      await result.current.handleEditSubmit({ name: 'An 2', email: 'an2@test.com', password: '' });
    });

    expect(userService.updateUser).toHaveBeenCalledWith(7, {
      name: 'An 2',
      email: 'an2@test.com',
    });
    expect(result.current.message).toBe('Cập nhật thông tin thành công!');
  });

  it('includes the password when provided and falls back to user.id', async () => {
    const { result } = renderHook(() => useProfileEdit({ id: 12 }, undefined));

    await act(async () => {
      await result.current.handleEditSubmit({ name: 'A', email: 'a@b.c', password: 'pw' });
    });

    expect(userService.updateUser).toHaveBeenCalledWith(12, {
      name: 'A',
      email: 'a@b.c',
      password: 'pw',
    });
  });

  it('stores a refreshed token, refreshes the user and navigates to the profile', async () => {
    userService.updateUser.mockResolvedValue({ result: { token: 'new-token' } });
    const refreshUser = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useProfileEdit(user, refreshUser));

    await act(async () => {
      await result.current.handleEditSubmit({ name: 'An', email: 'an@test.com' });
    });

    expect(localStorage.getItem('token')).toBe('new-token');
    expect(refreshUser).toHaveBeenCalled();

    expect(navigate).not.toHaveBeenCalledWith(ROUTES.PROFILE);
    act(() => vi.advanceTimersByTime(1500));
    expect(navigate).toHaveBeenCalledWith(ROUTES.PROFILE);
  });

  it('surfaces and rethrows update errors', async () => {
    userService.updateUser.mockRejectedValue({ response: { data: { message: 'Email đã tồn tại' } } });
    const { result } = renderHook(() => useProfileEdit(user, undefined));

    await act(async () => {
      await expect(
        result.current.handleEditSubmit({ name: 'An', email: 'an@test.com' })
      ).rejects.toBeTruthy();
    });

    expect(result.current.error).toBe('Email đã tồn tại');
    expect(result.current.message).toBeNull();
  });

  it('navigates back to the profile on cancel', () => {
    const { result } = renderHook(() => useProfileEdit(user, undefined));

    act(() => result.current.handleCancel());

    expect(navigate).toHaveBeenCalledWith(ROUTES.PROFILE);
  });
});
