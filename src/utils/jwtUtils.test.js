import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseJwt } from './jwtUtils';

const encodePayload = (payload) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(payload))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const makeToken = (payload) => `header.${encodePayload(payload)}.signature`;

describe('parseJwt', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('decodes the payload of a valid token', () => {
    const payload = { sub: '42', scope: 'ADMIN USER', exp: 1700000000 };
    expect(parseJwt(makeToken(payload))).toEqual(payload);
  });

  it('decodes payloads containing non-ASCII characters', () => {
    const payload = { name: 'Nguyễn Văn A' };
    expect(parseJwt(makeToken(payload))).toEqual(payload);
  });

  it('decodes base64url payloads using - and _ characters', () => {
    const payload = { data: '<<???>>ÿÿ' };
    const encoded = encodePayload(payload);
    expect(encoded).toMatch(/[-_]/);
    expect(parseJwt(`header.${encoded}.signature`)).toEqual(payload);
  });

  it('returns null when the token has no payload segment', () => {
    expect(parseJwt('header')).toBeNull();
    expect(parseJwt('header.')).toBeNull();
  });

  it('returns null when the payload is not valid base64 JSON', () => {
    expect(parseJwt('header.not-valid-json.signature')).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });

  it('returns null for non-string tokens', () => {
    expect(parseJwt(null)).toBeNull();
    expect(parseJwt(undefined)).toBeNull();
    expect(parseJwt(123)).toBeNull();
  });
});
