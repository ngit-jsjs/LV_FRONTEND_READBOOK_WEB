import { describe, it, expect } from 'vitest';
import { getFormattedImageUrl } from './imageUtils';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

describe('getFormattedImageUrl', () => {
  it('returns null for empty values', () => {
    expect(getFormattedImageUrl(null)).toBeNull();
    expect(getFormattedImageUrl(undefined)).toBeNull();
    expect(getFormattedImageUrl('')).toBeNull();
  });

  it('returns absolute and inline urls unchanged', () => {
    expect(getFormattedImageUrl('http://cdn.test/a.png')).toBe('http://cdn.test/a.png');
    expect(getFormattedImageUrl('https://cdn.test/a.png')).toBe('https://cdn.test/a.png');
    expect(getFormattedImageUrl('blob:abc-123')).toBe('blob:abc-123');
    expect(getFormattedImageUrl('data:image/png;base64,AAA')).toBe('data:image/png;base64,AAA');
  });

  it('prefixes the api base url for rooted relative paths', () => {
    expect(getFormattedImageUrl('/uploads/cover.png')).toBe(`${baseURL}/uploads/cover.png`);
  });

  it('adds a missing leading slash to relative paths', () => {
    expect(getFormattedImageUrl('uploads/cover.png')).toBe(`${baseURL}/uploads/cover.png`);
  });
});
