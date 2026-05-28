/**
 * Formats a relative cover image URL from the backend into a fully qualified URL.
 * If the URL is already absolute (starts with http, blob, or data), it is returned as is.
 * 
 * @param {string} url - The image URL to format
 * @returns {string|null} The formatted absolute image URL
 */
export const getFormattedImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${baseURL}${cleanUrl}`;
};
