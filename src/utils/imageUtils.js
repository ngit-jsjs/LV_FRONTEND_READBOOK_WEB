
export const getFormattedImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${baseURL}${cleanUrl}`;
};
