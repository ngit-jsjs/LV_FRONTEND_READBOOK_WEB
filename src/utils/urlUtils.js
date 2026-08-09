/**
 * Chỉ cho phép redirect nội bộ: đường dẫn tương đối bắt đầu bằng một dấu "/".
 * Chặn "//host", "https://host", "javascript:" ... để tránh open redirect.
 */
export const getSafeRedirectPath = (path, fallback = '/') => {
  if (typeof path !== 'string' || !path) return fallback;
  if (!path.startsWith('/')) return fallback;
  if (path.startsWith('//') || path.startsWith('/\\')) return fallback;
  return path;
};

/**
 * Chỉ chấp nhận URL tuyệt đối dùng http/https (ví dụ link thanh toán từ backend),
 * loại bỏ các scheme nguy hiểm như javascript: hoặc data:.
 */
export const isSafeHttpUrl = (url) => {
  if (typeof url !== 'string' || !url) return false;
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};
