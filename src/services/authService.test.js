import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from './apiClient';
import authService from './authService';
import { API_ENDPOINTS } from './apiEndpoints';

vi.mock('./apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  getErrorMessage: vi.fn(),
}));

describe('authService', () => {
  beforeEach(() => {
    apiClient.post.mockResolvedValue({});
    apiClient.get.mockResolvedValue({});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('registers a user', async () => {
    await authService.register('An', 'an@test.com', 'pw');
    expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.REGISTER, {
      name: 'An',
      email: 'an@test.com',
      password: 'pw',
    });
  });

  it('verifies email with an otp', async () => {
    await authService.verifyEmail('an@test.com', '123456');
    expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
      email: 'an@test.com',
      otp: '123456',
    });
  });

  it('url-encodes the email for otp resend and forgot password', async () => {
    await authService.resendOtp('a+b@test.com');
    expect(apiClient.post).toHaveBeenCalledWith(
      `${API_ENDPOINTS.AUTH.RESEND_OTP}?email=a%2Bb%40test.com`
    );

    await authService.forgotPassword('a+b@test.com');
    expect(apiClient.post).toHaveBeenCalledWith(
      `${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}?email=a%2Bb%40test.com`
    );
  });

  it('resets a password', async () => {
    await authService.resetPassword('an@test.com', '111', 'newpw');
    expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      email: 'an@test.com',
      otp: '111',
      newPassword: 'newpw',
    });
  });

  describe('introspect', () => {
    it('returns false without calling the api when no token is stored', async () => {
      await expect(authService.introspect()).resolves.toBe(false);
      expect(apiClient.post).not.toHaveBeenCalled();
    });

    it('returns true only when the api reports the token as valid', async () => {
      localStorage.setItem('token', 'tok');

      apiClient.post.mockResolvedValue({ result: { valid: true } });
      await expect(authService.introspect()).resolves.toBe(true);
      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.INTROSPECT, { token: 'tok' });

      apiClient.post.mockResolvedValue({ result: { valid: false } });
      await expect(authService.introspect()).resolves.toBe(false);

      apiClient.post.mockResolvedValue({});
      await expect(authService.introspect()).resolves.toBe(false);
    });

    it('returns false when the api call fails', async () => {
      localStorage.setItem('token', 'tok');
      apiClient.post.mockRejectedValue(new Error('boom'));

      await expect(authService.introspect()).resolves.toBe(false);
    });
  });

  describe('login', () => {
    it('stores the returned token', async () => {
      apiClient.post.mockResolvedValue({ result: { token: 'new-token' } });

      const res = await authService.login('an@test.com', 'pw');

      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.LOGIN, {
        email: 'an@test.com',
        password: 'pw',
      });
      expect(localStorage.getItem('token')).toBe('new-token');
      expect(res.result.token).toBe('new-token');
    });

    it('does not store anything when no token is returned', async () => {
      apiClient.post.mockResolvedValue({ result: {} });

      await authService.login('an@test.com', 'pw');

      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  it('fetches the current user info', async () => {
    await authService.getMyInfo();
    expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.USER.MY_INFO);
  });

  describe('logout', () => {
    it('notifies the server and clears the token', async () => {
      localStorage.setItem('token', 'tok');

      await authService.logout();

      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.LOGOUT, { token: 'tok' });
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('clears the token even when the server call fails', async () => {
      localStorage.setItem('token', 'tok');
      apiClient.post.mockRejectedValue(new Error('boom'));

      await authService.logout();

      expect(localStorage.getItem('token')).toBeNull();
    });

    it('skips the server call when no token is stored', async () => {
      await authService.logout();
      expect(apiClient.post).not.toHaveBeenCalled();
    });
  });

  it('exposes the stored token and login state', () => {
    expect(authService.getToken()).toBeNull();
    expect(authService.isLoggedIn()).toBe(false);

    localStorage.setItem('token', 'tok');

    expect(authService.getToken()).toBe('tok');
    expect(authService.isLoggedIn()).toBe(true);
  });

  describe('getUserFromToken', () => {
    it('returns null when no token is stored', () => {
      expect(authService.getUserFromToken()).toBeNull();
    });

    it('returns the decoded token payload', () => {
      const payload = { sub: '7', scope: 'ADMIN' };
      const encoded = btoa(JSON.stringify(payload)).replace(/=+$/, '');
      localStorage.setItem('token', `h.${encoded}.s`);

      expect(authService.getUserFromToken()).toEqual(payload);
    });
  });
});
