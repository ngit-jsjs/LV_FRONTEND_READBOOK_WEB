import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import authService from '../services/authService';
import { AuthProvider, useAuth } from './AuthContext';

vi.mock('../services/authService', () => ({
  default: {
    isLoggedIn: vi.fn(),
    introspect: vi.fn(),
    getMyInfo: vi.fn(),
    getUserFromToken: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
  },
}));

let auth;

const Consumer = () => {
  auth = useAuth();
  return (
    <div>
      <span data-testid="name">{auth.user ? auth.user.name : 'anonymous'}</span>
      <span data-testid="admin">{String(!!auth.user?.isAdmin)}</span>
      <span data-testid="amount">{String(auth.user?.amount)}</span>
    </div>
  );
};

const renderProvider = () =>
  render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>
  );

describe('AuthProvider', () => {
  beforeEach(() => {
    auth = undefined;
    vi.spyOn(console, 'error').mockImplementation(() => {});
    authService.isLoggedIn.mockReturnValue(false);
    authService.introspect.mockResolvedValue(true);
    authService.getMyInfo.mockResolvedValue({ result: { name: 'An', amount: 100 } });
    authService.getUserFromToken.mockReturnValue({ sub: '7', scope: 'USER ADMIN' });
    authService.logout.mockResolvedValue(undefined);
  });

  it('renders children with no user when not logged in', async () => {
    renderProvider();

    expect(await screen.findByTestId('name')).toHaveTextContent('anonymous');
    expect(authService.introspect).not.toHaveBeenCalled();
  });

  it('loads the user from the token scope on mount', async () => {
    authService.isLoggedIn.mockReturnValue(true);

    renderProvider();

    await waitFor(() => expect(screen.getByTestId('name')).toHaveTextContent('An'));
    expect(auth.user).toEqual({
      name: 'An',
      amount: 100,
      userId: 7,
      roles: ['USER', 'ADMIN'],
      isAdmin: true,
    });
  });

  it('treats a user without the ADMIN scope as non-admin', async () => {
    authService.isLoggedIn.mockReturnValue(true);
    authService.getUserFromToken.mockReturnValue({ sub: '7', scope: 'USER' });

    renderProvider();

    await waitFor(() => expect(screen.getByTestId('admin')).toHaveTextContent('false'));
    expect(auth.user.roles).toEqual(['USER']);
  });

  it('defaults roles to an empty list when the token has no scope', async () => {
    authService.isLoggedIn.mockReturnValue(true);
    authService.getUserFromToken.mockReturnValue({ sub: '7' });

    renderProvider();

    await waitFor(() => expect(screen.getByTestId('name')).toHaveTextContent('An'));
    expect(auth.user.roles).toEqual([]);
    expect(auth.user.isAdmin).toBe(false);
  });

  it('logs out when the stored token is no longer valid', async () => {
    authService.isLoggedIn.mockReturnValue(true);
    authService.introspect.mockResolvedValue(false);

    renderProvider();

    await waitFor(() => expect(authService.logout).toHaveBeenCalled());
    expect(screen.getByTestId('name')).toHaveTextContent('anonymous');
    expect(authService.getMyInfo).not.toHaveBeenCalled();
  });

  it('logs out when fetching the user info fails', async () => {
    authService.isLoggedIn.mockReturnValue(true);
    authService.getMyInfo.mockRejectedValue(new Error('boom'));

    renderProvider();

    await waitFor(() => expect(authService.logout).toHaveBeenCalled());
    expect(screen.getByTestId('name')).toHaveTextContent('anonymous');
  });

  it('sets the user after a successful login', async () => {
    renderProvider();
    await screen.findByTestId('name');

    authService.login.mockResolvedValue({ result: { token: 'tok' } });

    let res;
    await act(async () => {
      res = await auth.login('an@test.com', 'pw');
    });

    expect(authService.login).toHaveBeenCalledWith('an@test.com', 'pw');
    expect(res).toEqual({ result: { token: 'tok' } });
    expect(screen.getByTestId('name')).toHaveTextContent('An');
  });

  it('clears the user on logout', async () => {
    authService.isLoggedIn.mockReturnValue(true);
    renderProvider();
    await waitFor(() => expect(screen.getByTestId('name')).toHaveTextContent('An'));

    await act(async () => {
      await auth.logout();
    });

    expect(authService.logout).toHaveBeenCalled();
    expect(screen.getByTestId('name')).toHaveTextContent('anonymous');
  });

  describe('refreshUser', () => {
    it('re-fetches the user when logged in', async () => {
      authService.isLoggedIn.mockReturnValue(true);
      renderProvider();
      await waitFor(() => expect(screen.getByTestId('name')).toHaveTextContent('An'));

      authService.getMyInfo.mockResolvedValue({ result: { name: 'Binh', amount: 5 } });
      await act(async () => {
        await auth.refreshUser();
      });

      expect(screen.getByTestId('name')).toHaveTextContent('Binh');
    });

    it('does nothing when not logged in', async () => {
      renderProvider();
      await screen.findByTestId('name');

      await act(async () => {
        await auth.refreshUser();
      });

      expect(authService.getMyInfo).not.toHaveBeenCalled();
      expect(screen.getByTestId('name')).toHaveTextContent('anonymous');
    });

    it('keeps the current user when the refresh fails', async () => {
      authService.isLoggedIn.mockReturnValue(true);
      renderProvider();
      await waitFor(() => expect(screen.getByTestId('name')).toHaveTextContent('An'));

      authService.getMyInfo.mockRejectedValue(new Error('boom'));
      await act(async () => {
        await auth.refreshUser();
      });

      expect(screen.getByTestId('name')).toHaveTextContent('An');
    });
  });

  describe('addCoins', () => {
    it('adds the charged amount to the current balance', async () => {
      authService.isLoggedIn.mockReturnValue(true);
      renderProvider();
      await waitFor(() => expect(screen.getByTestId('amount')).toHaveTextContent('100'));

      act(() => auth.addCoins('50'));

      expect(screen.getByTestId('amount')).toHaveTextContent('150');
    });

    it('treats a missing balance as zero', async () => {
      authService.isLoggedIn.mockReturnValue(true);
      authService.getMyInfo.mockResolvedValue({ result: { name: 'An' } });
      renderProvider();
      await waitFor(() => expect(screen.getByTestId('name')).toHaveTextContent('An'));

      act(() => auth.addCoins(20));

      expect(screen.getByTestId('amount')).toHaveTextContent('20');
    });

    it('does nothing when there is no user', async () => {
      renderProvider();
      await screen.findByTestId('name');

      act(() => auth.addCoins(20));

      expect(auth.user).toBeNull();
    });
  });
});
