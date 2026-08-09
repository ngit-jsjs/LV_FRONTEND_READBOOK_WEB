const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const EXPIRED_TOKEN_CODE = 1012;

export const getErrorMessage = (error) => {
  const data = error?.response?.data;
  if (data) {
    if (typeof data.result === 'string' && data.result) return data.result;
    if (data.message) return data.message;
  }
  if (error?.message) return error.message;
  return 'Đã xảy ra lỗi hệ thống';
};

// Lỗi do không kết nối được máy chủ (khác với lỗi máy chủ trả về)
export const isNetworkError = (error) => Boolean(error?.isNetworkError);

// Lỗi xác thực: token hết hạn, không hợp lệ hoặc không đủ quyền
export const isAuthError = (error) => {
  if (error?.response?.data?.code === EXPIRED_TOKEN_CODE) return true;
  const status = error?.status ?? error?.response?.status;
  return status === 401 || status === 403;
};

const createApiError = (message, { status, data, cause, isNetworkError: network } = {}) => {
  const error = new Error(message);
  error.status = status;
  error.response = { status, data };
  if (cause !== undefined) error.cause = cause;
  if (network) error.isNetworkError = true;
  return error;
};

const parseBody = (text) => {
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const redirectToLogin = () => {
  const currentPath = window.location.pathname + window.location.search;
  if (window.location.pathname === '/login') return;
  window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
};

const fetchClient = async (endpoint, options = {}) => {
  const url = `${baseURL}${endpoint}`;

  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
  };

  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  let response;
  let text;
  try {
    response = await fetch(url, config);
    text = await response.text();
  } catch (error) {
    // Chỉ lỗi mạng/máy chủ không phản hồi mới đi vào nhánh này,
    // các lỗi khác được ném lên nguyên vẹn để không che giấu bug.
    throw createApiError('Lỗi mạng hoặc máy chủ không phản hồi', {
      data: { message: 'Lỗi mạng hoặc máy chủ không phản hồi' },
      cause: error,
      isNetworkError: true,
    });
  }

  const data = parseBody(text);

  if (data && data.code === EXPIRED_TOKEN_CODE) {
    localStorage.removeItem('token');
    redirectToLogin();
    throw createApiError(data.message || 'Phiên đăng nhập đã hết hạn', {
      status: response.status,
      data,
    });
  }

  if (!response.ok) {
    throw createApiError(data.message || `HTTP ${response.status}`, {
      status: response.status,
      data,
    });
  }

  return data;
};

const apiClient = {
  get: (endpoint, options) => {
    let url = endpoint;
    if (options && options.params) {
      const queryString = new URLSearchParams(options.params).toString();
      url = `${endpoint}?${queryString}`;
    }
    return fetchClient(url, { ...options, method: 'GET' });
  },
  post: (endpoint, body, options) => {
    const isFormData = body instanceof FormData;
    return fetchClient(endpoint, { ...options, method: 'POST', body: isFormData ? body : JSON.stringify(body) });
  },
  put: (endpoint, body, options) => {
    const isFormData = body instanceof FormData;
    return fetchClient(endpoint, { ...options, method: 'PUT', body: isFormData ? body : JSON.stringify(body) });
  },
  delete: (endpoint, options) =>
    fetchClient(endpoint, { ...options, method: 'DELETE' }),
};

export default apiClient;
