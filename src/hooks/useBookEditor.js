import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import { useAuth } from '../context/AuthContext';
import bookService from '../services/bookService';
import categoryService from '../services/categoryService';
import { getFormattedImageUrl } from '../utils/imageUtils';
import { getErrorMessage } from '../services/apiClient';

export const useBookEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [status, setStatus] = useState('UNAVAILABLE');

  const [coverImage, setCoverImage] = useState(null);
  const [rawFile, setRawFile] = useState(null);

  const [categoryIds, setCategoryIds] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState(null);
  const [selectedPublisherId, setSelectedPublisherId] = useState(null);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Load all categories (small dataset, OK to load all)
        const catRes = await categoryService.getAllCategoriesList();
        const cats = catRes.result || catRes || [];
        setAllCategories(cats);

        if (id) {
          const res = await bookService.getBookById(id);
          const book = res.result;
          if (book) {
            setTitle(book.title || '');
            setDescription(book.description || '');
            setAuthor(book.author || '');
            setPublisher(book.publisher || '');
            setSelectedAuthorId(book.authorId || null);
            setSelectedPublisherId(book.publisherId || null);
            setYear(book.year || new Date().getFullYear());
            setStatus(book.status || 'UNAVAILABLE');
            
            // Map existing categories to IDs (matching by name since backend returns String list)
            const bookCatIds = book.categoryIds || (book.categories ? book.categories.map(c => {
              if (typeof c === 'string') {
                const found = cats.find(cat => cat.name === c);
                return found ? found.id : null;
              }
              return c.id || c.categoryId;
            }).filter(id => id !== null) : []);
            setCategoryIds(bookCatIds);

            if (book.coverImageUrl) {
              setCoverImage(getFormattedImageUrl(book.coverImageUrl));
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch book editor data", err);
        alert(`Không thể tải thông tin. Chi tiết: ${getErrorMessage(err)}`);
        navigate(ROUTES.BOOK_MANAGEMENT);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
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
    
    if (!year && year !== 0) {
      newErrors.year = "Năm xuất bản không được để trống";
    } else {
      const currentYear = new Date().getFullYear();
      if (parseInt(year) > currentYear) {
        newErrors.year = `Năm xuất bản không được lớn hơn năm hiện tại (${currentYear})`;
      }
    }

    if (!status) newErrors.status = "Vui lòng chọn trạng thái";
    if (!publisher.trim()) newErrors.publisher = "Nhà xuất bản không được để trống";
    if (!categoryIds || categoryIds.length === 0) newErrors.categoryIds = "Vui lòng chọn ít nhất một thể loại";
    if (!description.trim()) newErrors.description = "Mô tả không được để trống";

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
        authorId: selectedAuthorId || null,
        status,
        description: description.trim(),
        publisher: publisher.trim(),
        publisherId: selectedPublisherId || null,
        year: parseInt(year) || new Date().getFullYear(),
        categoryIds: categoryIds
      };

      const formData = new FormData();

      if (rawFile) {
        formData.append("file", rawFile);
      }

      formData.append(
        "request",
        new Blob([JSON.stringify(bookData)], { type: "application/json" })
      );

      if (id) {
        await bookService.updateBook(id, formData);
        alert('Cập nhật tác phẩm thành công!');
      } else {
        await bookService.createBook(formData);
        alert('Tạo truyện thành công!');
      }
      navigate(ROUTES.BOOK_MANAGEMENT);
    } catch (err) {
      console.error(err);
      alert(`Lỗi lưu thông tin: ${getErrorMessage(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    id,
    title, setTitle,
    description, setDescription,
    author, setAuthor,
    publisher, setPublisher,
    year, setYear,
    status, setStatus,
    coverImage,
    rawFile,
    categoryIds, setCategoryIds,
    allCategories,
    selectedAuthorId, setSelectedAuthorId,
    selectedPublisherId, setSelectedPublisherId,
    errors,
    isSubmitting,
    isLoading,
    handleImageUpload,
    handleSave,
    navigate
  };
};
