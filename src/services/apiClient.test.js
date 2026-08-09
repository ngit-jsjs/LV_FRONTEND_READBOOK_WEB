import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import apiClient, { getErrorMessage } from './apiClient';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const jsonResponse = (body, { ok = true, status = 200 } = {}) => ({
  ok,
  status,
  text: () => Promise.resolve(typeof body === 'string' ? body : JSON.stringify(body)),
});

const lastCall = () => global.fetch.mock.calls[global.fetch.mock.calls.length - 1];

describe('getErrorMessage', () => {
  it('prefers a string result field from the response body', () => {
    expect(getErrorMessage({ response: { data: { result: 'Sai mật khẩu', message: 'ignored' } } }))
      .toBe('Sai mật khẩu');
  });

  it('falls back to the response message', () => {
    expect(getErrorMessage({ response: { data: { message: 'Not found' } } })).toBe('Not found');
  });

  it('ignores non-string or empty result fields', () => {
    expect(getErrorMessage({ response: { data: { result: { a: 1 }, message: 'Bad' } } })).toBe('Bad');
    expect(getErrorMessage({ response: { data: { result: '' } }, message: 'boom' })).toBe('boom');
  });

  it('falls back to the error message then a generic message', () => {
    expect(getErrorMessage(new Error('network down'))).toBe('network down');
    expect(getErrorMessage({})).toBe('Đã xảy ra lỗi hệ thống');
    expect(getErrorMessage(null)).toBe('Đã xảy ra lỗi hệ thống');
  });
});

describe('apiClient', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    delete global.fetch;
  });

  it('sends GET requests without a body or content type', async () => {
    global.fetch.mockResolvedValue(jsonResponse({ result: [1, 2] }));

    await expect(apiClient.get('/books')).resolves.toEqual({ result: [1, 2] });

    const [url, config] = lastCall();
    expect(url).toBe(`${baseURL}/books`);
    expect(config.method).toBe('GET');
    expect(config.headers['Content-Type']).toBeUndefined();
    expect(config.headers.Authorization).toBeUndefined();
  });

  it('serialises query params for GET requests', async () => {
    global.fetch.mockResolvedValue(jsonResponse({}));

    await apiClient.get('/books/search', { params: { keyword: 'a b', page: 0 } });

    expect(lastCall()[0]).toBe(`${baseURL}/books/search?keyword=a+b&page=0`);
  });

  it('attaches the bearer token when one is stored', async () => {
    localStorage.setItem('token', 'tok-123');
    global.fetch.mockResolvedValue(jsonResponse({}));

    await apiClient.get('/user/myInfo');

    expect(lastCall()[1].headers.Authorization).toBe('Bearer tok-123');
  });

  it('json-encodes plain object bodies for POST and PUT', async () => {
    global.fetch.mockResolvedValue(jsonResponse({}));

    await apiClient.post('/auth/login', { email: 'a@b.c' });
    let [, config] = lastCall();
    expect(config.method).toBe('POST');
    expect(config.headers['Content-Type']).toBe('application/json');
    expect(config.body).toBe('{"email":"a@b.c"}');

    await apiClient.put('/books/1', { title: 'T' });
    [, config] = lastCall();
    expect(config.method).toBe('PUT');
    expect(config.body).toBe('{"title":"T"}');
  });

  it('passes FormData bodies through without a content type', async () => {
    global.fetch.mockResolvedValue(jsonResponse({}));
    const formData = new FormData();
    formData.append('file', new Blob(['x']));

    await apiClient.post('/books/1/import-epub', formData);

    const [, config] = lastCall();
    expect(config.body).toBe(formData);
    expect(config.headers['Content-Type']).toBeUndefined();
  });

  it('does not override an explicitly provided content type', async () => {
    global.fetch.mockResolvedValue(jsonResponse({}));

    await apiClient.post('/books', { a: 1 }, { headers: { 'Content-Type': 'text/plain' } });

    expect(lastCall()[1].headers['Content-Type']).toBe('text/plain');
  });

  it('sends DELETE requests', async () => {
    global.fetch.mockResolvedValue(jsonResponse({}));

    await apiClient.delete('/books/9');

    const [url, config] = lastCall();
    expect(url).toBe(`${baseURL}/books/9`);
    expect(config.method).toBe('DELETE');
  });

  it('resolves to an empty object for empty response bodies', async () => {
    global.fetch.mockResolvedValue(jsonResponse(''));

    await expect(apiClient.delete('/books/9')).resolves.toEqual({});
  });

  it('wraps non-json response bodies in a message field', async () => {
    global.fetch.mockResolvedValue(jsonResponse('plain text'));

    await expect(apiClient.get('/books')).resolves.toEqual({ message: 'plain text' });
  });

  it('rejects with the parsed body and keeps it accessible for failed responses', async () => {
    global.fetch.mockResolvedValue(
      jsonResponse({ message: 'Không tìm thấy sách' }, { ok: false, status: 404 })
    );

    await expect(apiClient.get('/books/404')).rejects.toMatchObject({
      message: 'Không tìm thấy sách',
      response: { data: { message: 'Không tìm thấy sách' } },
    });
  });

  it('uses a default message when a failed response has no message', async () => {
    global.fetch.mockResolvedValue(jsonResponse({ code: 500 }, { ok: false, status: 500 }));

    await expect(apiClient.get('/books')).rejects.toThrow('HTTP Error');
  });

  it('rejects with a generic error when fetch itself fails', async () => {
    global.fetch.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(apiClient.get('/books')).rejects.toMatchObject({
      message: 'Lỗi mạng hoặc máy chủ không phản hồi',
      response: { data: { message: 'Đã xảy ra lỗi hệ thống' } },
    });
  });

  describe('expired token handling (code 1012)', () => {
    let originalLocation;

    beforeEach(() => {
      originalLocation = window.location;
      delete window.location;
      window.location = { href: '', pathname: '/book/5', search: '?tab=info' };
    });

    afterEach(() => {
      window.location = originalLocation;
    });

    it('clears the token and redirects to login with a redirect param', async () => {
      localStorage.setItem('token', 'expired');
      global.fetch.mockResolvedValue(jsonResponse({ code: 1012, message: 'expired' }));

      await expect(apiClient.get('/user/myInfo')).rejects.toEqual({ code: 1012, message: 'expired' });

      expect(localStorage.getItem('token')).toBeNull();
      expect(window.location.href).toBe(
        `/login?redirect=${encodeURIComponent('/book/5?tab=info')}`
      );
    });
  });
});
