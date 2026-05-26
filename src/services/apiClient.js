// URL của backend được cấu hình trong file .env
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Fetch client thay thế cho Axios
 * Tự động gắn token và xử lý lỗi
 */
const fetchClient = async (endpoint, options = {}) => {
  const url = `${baseURL}${endpoint}`;
  
  // Tự động gắn token vào header Authorization
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    // Safely parse JSON since some endpoints (like DELETE) might return empty or plain text
    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = { message: text };
    }

    // Xử lý lỗi chung: Mã 1012 là token lỗi hoặc hết hạn
    if (data && data.code === 1012) {
      console.error("Token lỗi hoặc hết hạn. Vui lòng đăng nhập lại.");
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(data);
    }

    // Nếu response không thành công (HTTP status không phải 2xx)
    // Nhưng backend trả về code tự định nghĩa (như 1009), ta vẫn có thể muốn bắt nó.
    // Fetch chỉ ném lỗi mạng, nên ta tự quản lý lỗi HTTP ở đây.
    if (!response.ok) {
      // Ném dữ liệu trả về để catch block bên ngoài bắt được giống Axios
      const error = new Error('HTTP Error');
      error.response = { data }; 
      throw error;
    }

    // Trả thẳng data giống hệt axiosInstance
    return data;
  } catch (error) {
    // Nếu là lỗi cấu trúc giả lập của ta
    if (error.response) {
      return Promise.reject(error);
    }
    
    // Ném lỗi mạng (ví dụ mất mạng)
    const fallbackError = new Error('Lỗi mạng hoặc máy chủ không phản hồi');
    fallbackError.response = { data: { result: 'Đã xảy ra lỗi hệ thống' } };
    return Promise.reject(fallbackError);
  }
};

// Các phương thức tiện ích
export const fetchApi = {
  get: (endpoint, options) => {
    // Nếu có params, tự động nối vào URL
    let url = endpoint;
    if (options && options.params) {
      const queryString = new URLSearchParams(options.params).toString();
      url = `${endpoint}?${queryString}`;
    }
    return fetchClient(url, { ...options, method: 'GET' });
  },
  post: (endpoint, body, options) => 
    fetchClient(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options) => 
    fetchClient(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint, options) => 
    fetchClient(endpoint, { ...options, method: 'DELETE' }),
};

export default fetchApi;
