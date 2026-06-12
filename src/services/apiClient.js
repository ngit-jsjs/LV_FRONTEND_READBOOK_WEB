const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const getErrorMessage = (error) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'Đã xảy ra lỗi hệ thống';
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

  try {
    const response = await fetch(url, config);
    
    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = { message: text };
    }

    if (data && data.code === 1012) {
      console.error("Token lỗi hoặc hết hạn. Vui lòng đăng nhập lại.");
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(data);
    }

    if (!response.ok) {
      const error = new Error(data.message || 'HTTP Error');
      error.response = { data };
      throw error;
    }

    if (data.code !== undefined && data.code !== 200) {
      const error = new Error(data.message || 'Yêu cầu thất bại');
      error.response = { data };
      throw error;
    }

    return data;
  } catch (error) {
    if (error.response) {
      return Promise.reject(error);
    }
    
    const fallbackError = new Error('Lỗi mạng hoặc máy chủ không phản hồi');
    fallbackError.response = { data: { message: 'Đã xảy ra lỗi hệ thống' } };
    return Promise.reject(fallbackError);
  }
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
