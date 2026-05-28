import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import bookService from '../services/bookService';
import { getFormattedImageUrl } from '../utils/imageUtils';

export const useEditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [status, setStatus] = useState('DRAFT');

  const [coverImage, setCoverImage] = useState(null); // Preview URL
  const [rawFile, setRawFile] = useState(null); // Actual File object

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const displayTitle = title.trim() || 'Truyện Chưa Có Tiêu Đề';

  // Fetch book details on mount
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const res = await bookService.getBookById(id);
        const book = res.result || res;
        if (book) {
          setTitle(book.title || '');
          setDescription(book.description || '');
          setAuthor(book.author || '');
          setPublisher(book.publisher || '');
          setYear(book.year || new Date().getFullYear());
          setStatus(book.status || 'DRAFT');
          if (book.coverImageUrl) {
            setCoverImage(getFormattedImageUrl(book.coverImageUrl));
          }
        }
      } catch (err) {
        console.error("Failed to fetch book details", err);
        const errorDetail = err.response?.data?.message || err.response?.data?.result || err.message || "Unknown error";
        alert(`Không thể tải thông tin tác phẩm. Chi tiết: ${errorDetail}`);
        navigate(ROUTES.AUTHOR_DASHBOARD);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBookDetails();
    }
  }, [id, navigate]);

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
        categoryIds: [] // Đã cho phép để trống ở Backend
      };

      const formData = new FormData();
      
      // Chỉ gửi file nếu có tải lên ảnh mới
      if (rawFile) {
        formData.append("file", rawFile);
      }
      
      formData.append(
        "request", 
        new Blob([JSON.stringify(bookData)], { type: "application/json" })
      );

      const res = await bookService.updateBook(id, formData);
      
      if (res.code === 200 || res.code === 1000 || res.id || res.result) { 
        alert('Cập nhật tác phẩm thành công!');
        navigate(ROUTES.AUTHOR_DASHBOARD);
      } else {
        alert('Có lỗi xảy ra: ' + (res.message || 'Không rõ nguyên nhân'));
      }
    } catch (err) {
      console.error(err);
      const errorDetail = err.response?.data?.message || err.response?.data?.result || err.message || "Lỗi mạng hoặc máy chủ không phản hồi";
      alert(`Lỗi lưu thông tin: ${errorDetail}`);
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
    isLoading,
    displayTitle,
    handleImageUpload,
    handleSave,
    navigate
  };
};
