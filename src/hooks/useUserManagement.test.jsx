import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import userService from '../services/userService';
import { useUserManagement } from './useUserManagement';

vi.mock('../services/userService', () => ({
  default: { searchUsers: vi.fn(), deleteUser: vi.fn(), updateUser: vi.fn() },
}));

const page = (content, totalPages) => ({ result: { content, totalPages } });

describe('useUserManagement', () => {
  beforeEach(() => {
    vi.stubGlobal('alert', vi.fn());
    vi.stubGlobal('confirm', vi.fn(() => true));
    window.scrollTo = vi.fn();
    userService.searchUsers.mockResolvedValue(page([{ id: 1, name: 'An', active: true }], 3));
    userService.deleteUser.mockResolvedValue({});
    userService.updateUser.mockResolvedValue({});
  });

  const setup = async () => {
    const hook = renderHook(() => useUserManagement());
    await waitFor(() => expect(hook.result.current.loading).toBe(false));
    return hook;
  };

  it('loads the first page on mount with a 0-based page index', async () => {
    const { result } = await setup();

    expect(userService.searchUsers).toHaveBeenCalledWith('', 0, 10);
    expect(result.current.results).toEqual([{ id: 1, name: 'An', active: true }]);
    expect(result.current.totalPages).toBe(3);
  });

  it('resets to the first page and refetches on search submit', async () => {
    const { result } = await setup();
    await act(async () => {
      result.current.setPage(3);
    });
    await waitFor(() => expect(userService.searchUsers).toHaveBeenLastCalledWith('', 2, 10));

    const event = { preventDefault: vi.fn() };
    await act(async () => {
      result.current.setKeyword('an');
      result.current.handleSearchSubmit(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
    await waitFor(() => expect(userService.searchUsers).toHaveBeenLastCalledWith('an', 0, 10));
    expect(result.current.page).toBe(1);
  });

  it('derives a single page when the response omits totalPages', async () => {
    userService.searchUsers.mockResolvedValue(page([{ id: 1 }], undefined));

    const { result } = await setup();

    expect(result.current.totalPages).toBe(1);
  });

  it('reports no pages for an empty result set', async () => {
    userService.searchUsers.mockResolvedValue(page([], undefined));

    const { result } = await setup();

    expect(result.current.results).toEqual([]);
    expect(result.current.totalPages).toBe(0);
  });

  it('clears results when the response has no payload', async () => {
    userService.searchUsers.mockResolvedValue({});

    const { result } = await setup();

    expect(result.current.results).toEqual([]);
    expect(result.current.totalPages).toBe(0);
  });

  it('exposes an error message when the search fails', async () => {
    userService.searchUsers.mockRejectedValue({ response: { data: { message: 'Lỗi tìm kiếm' } } });

    const { result } = await setup();

    expect(result.current.error).toBe('Lỗi tìm kiếm');
  });

  describe('lock / unlock', () => {
    it('toggles an active user to locked after confirmation', async () => {
      const { result } = await setup();

      await act(async () => {
        await result.current.handleDelete({ id: 1, name: 'An', active: true });
      });

      expect(userService.deleteUser).toHaveBeenCalledWith(1);
      expect(result.current.results[0].active).toBe(false);
      expect(alert).toHaveBeenCalledWith('Đã khóa tài khoản An thành công!');
    });

    it('unlocks a locked user', async () => {
      userService.searchUsers.mockResolvedValue(page([{ id: 1, name: 'An', active: false }], 1));
      const { result } = await setup();

      await act(async () => {
        await result.current.handleDelete({ id: 1, name: 'An', active: false });
      });

      expect(result.current.results[0].active).toBe(true);
      expect(alert).toHaveBeenCalledWith('Đã mở khóa tài khoản An thành công!');
    });

    it('does nothing when the confirmation is dismissed', async () => {
      confirm.mockReturnValue(false);
      const { result } = await setup();

      await act(async () => {
        await result.current.handleDelete({ id: 1, name: 'An', active: true });
      });

      expect(userService.deleteUser).not.toHaveBeenCalled();
      expect(result.current.results[0].active).toBe(true);
    });

    it('alerts when the request fails', async () => {
      userService.deleteUser.mockRejectedValue({ response: { data: { message: 'Không thể khóa' } } });
      const { result } = await setup();

      await act(async () => {
        await result.current.handleDelete({ id: 1, name: 'An', active: true });
      });

      expect(alert).toHaveBeenCalledWith('Khóa thất bại: Không thể khóa');
      expect(result.current.results[0].active).toBe(true);
    });
  });

  describe('editing', () => {
    it('prefills the edit form and clears it on close', async () => {
      const { result } = await setup();

      act(() => result.current.handleEditClick({ id: 1, name: 'An', email: 'an@test.com' }));
      expect(result.current.editingUser).toMatchObject({ id: 1 });
      expect(result.current.editForm).toEqual({ name: 'An', email: 'an@test.com', password: '' });

      act(() => result.current.handleCloseEdit());
      expect(result.current.editingUser).toBeNull();
      expect(result.current.editForm).toEqual({ name: '', email: '', password: '' });
    });

    it('defaults missing user fields to empty strings', async () => {
      const { result } = await setup();

      act(() => result.current.handleEditClick({ id: 1 }));

      expect(result.current.editForm).toEqual({ name: '', email: '', password: '' });
    });

    it('updates the user, patches the row and closes the form', async () => {
      const { result } = await setup();
      act(() => result.current.handleEditClick({ id: 1, name: 'An', email: 'an@test.com' }));

      await act(async () => {
        await result.current.handleEditSubmit({ name: 'An 2', email: 'an2@test.com', password: '' });
      });

      expect(userService.updateUser).toHaveBeenCalledWith(1, {
        name: 'An 2',
        email: 'an2@test.com',
      });
      expect(result.current.results[0]).toMatchObject({ name: 'An 2', email: 'an2@test.com' });
      expect(result.current.editingUser).toBeNull();
    });

    it('sends the password when one is provided', async () => {
      const { result } = await setup();
      act(() => result.current.handleEditClick({ id: 1, name: 'An', email: 'an@test.com' }));

      await act(async () => {
        await result.current.handleEditSubmit({ name: 'An', email: 'an@test.com', password: 'pw' });
      });

      expect(userService.updateUser).toHaveBeenCalledWith(1, {
        name: 'An',
        email: 'an@test.com',
        password: 'pw',
      });
    });

    it('skips the update when the confirmation is dismissed', async () => {
      confirm.mockReturnValue(false);
      const { result } = await setup();
      act(() => result.current.handleEditClick({ id: 1, name: 'An', email: 'an@test.com' }));

      await act(async () => {
        await result.current.handleEditSubmit({ name: 'An 2', email: 'an2@test.com' });
      });

      expect(userService.updateUser).not.toHaveBeenCalled();
      expect(result.current.editingUser).toMatchObject({ id: 1 });
    });

    it('alerts and rethrows when the update fails', async () => {
      userService.updateUser.mockRejectedValue({ response: { data: { message: 'Email trùng' } } });
      const { result } = await setup();
      act(() => result.current.handleEditClick({ id: 1, name: 'An', email: 'an@test.com' }));

      await act(async () => {
        await expect(
          result.current.handleEditSubmit({ name: 'An 2', email: 'an2@test.com' })
        ).rejects.toBeTruthy();
      });

      expect(alert).toHaveBeenCalledWith('Cập nhật thất bại: Email trùng');
      expect(result.current.editingUser).toMatchObject({ id: 1 });
    });
  });
});
