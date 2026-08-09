const LOCALE = 'vi-VN';

const currencyFormatter = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'VND' });
const numberFormatter = new Intl.NumberFormat(LOCALE);

export const formatCurrency = (value) => currencyFormatter.format(value || 0);

export const formatNumber = (value) => numberFormatter.format(value || 0);

const toDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (value, fallback = '') => {
  const date = toDate(value);
  return date ? date.toLocaleDateString(LOCALE) : fallback;
};

export const formatTime = (value, fallback = '') => {
  const date = toDate(value);
  return date
    ? date.toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit' })
    : fallback;
};

export const formatDateTime = (value, fallback = '') => {
  const date = toDate(value);
  return date ? `${formatDate(date)} ${formatTime(date)}` : fallback;
};
