import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import { useAuth } from '../context/AuthContext';
import bookService from '../services/bookService';

export const useCreateBook = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState(user?.name || '');
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [status, setStatus] = useState('DRAFT');

  const [coverImage, setCoverImage] = useState(null); // Preview URL
  const [rawFile, setRawFile] = useState(null); // Actual File object

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayTitle = title.trim() || 'Truyện Chưa Có Tiêu Đề';

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRawFile(file);
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Tiêu đề không được để trống";
    if (!author.trim()) newErrors.author = "Tác giả không được để trống";
    if (!description.trim()) newErrors.description = "Mô tả không được để trống";
    if (!status) newErrors.status = "Vui lòng chọn trạng thái";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const bookData = {
        title: title.trim(),
        author: author.trim(),
        status,
        description: description.trim(),
        publisher: publisher.trim(),
        year: parseInt(year) || new Date().getFullYear(),
        categoryIds: [] // Tạm thời để trống
      };

      // 1. Khởi tạo đối tượng FormData
      const formData = new FormData();

      // 2. Thêm file ảnh vào form nếu có (tên trường là "file" khớp với Backend)
      if (rawFile) {
        formData.append("file", rawFile);
      }

      // 3. Đóng gói thông tin sách thành chuỗi JSON và thêm vào form dạng Blob
      formData.append(
        "request",
        new Blob([JSON.stringify(bookData)], { type: "application/json" })
      );

      // Gửi formData qua service
      const res = await bookService.createBook(formData);

      if (res.code === 200 || res.id) {
        alert('Tạo truyện thành công!');
        navigate(ROUTES.AUTHOR_DASHBOARD);
      } else {
        alert('Có lỗi xảy ra: ' + (res.message || 'Không rõ nguyên nhân'));
      }
    } catch (err) {
      console.error(err);
      const errorDetail = err.response?.data?.message || err.response?.data?.result || err.message || "Lỗi mạng hoặc máy chủ không phản hồi";
      alert(`Lỗi tạo tác phẩm: ${errorDetail}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    title, setTitle,
    description, setDescription,
    author, setAuthor,
    publisher, setPublisher,
    year, setYear,
    status, setStatus,
    coverImage,
    rawFile,
    errors,
    isSubmitting,
    displayTitle,
    handleImageUpload,
    handleSave,
    navigate
  };
};
