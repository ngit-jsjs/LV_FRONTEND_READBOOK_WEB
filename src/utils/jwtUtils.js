/**
 * Decode một chuỗi JWT lấy phần Payload (Data) mà không cần dùng thư viện ngoài
 * @param {string} token Chuỗi JWT
 * @returns {object|null} Object chứa dữ liệu payload, trả về null nếu decode thất bại
 */
export const parseJwt = (token) => {
  try {
    // JWT có 3 phần tách nhau bởi dấu chấm, ta lấy phần thứ 2 (payload)
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    // Xử lý base64 url-safe
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Lỗi khi giải mã JWT:", e);
    return null;
  }
};
