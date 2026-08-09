import { getErrorMessage } from '../services/apiClient';

export const confirmAction = (message) => window.confirm(message);

export const notifySuccess = (message) => {
  alert(message);
};

export const notifyWarning = (message) => {
  alert(message);
};

export const notifyError = (error, prefix) => {
  console.error(error);
  const message = getErrorMessage(error);
  alert(prefix ? `${prefix}: ${message}` : message);
};
