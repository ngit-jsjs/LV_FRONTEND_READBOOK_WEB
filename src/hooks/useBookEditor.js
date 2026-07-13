import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import { useAuth } from '../context/AuthContext';
import bookService from '../services/bookService';
import categoryService from '../services/categoryService';
import authorService from '../services/authorService';
import publisherService from '../services/publisherService';
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
  const [allAuthors, setAllAuthors] = useState([]);
  const [allPublishers, setAllPublishers] = useState([]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Load all categories first
        const catRes = await categoryService.getAllCategoriesList();
        const cats = catRes.result || catRes || [];
        setAllCategories(cats);

        // Load all authors
        const authRes = await authorService.getAllAuthors(0, 1000);
        const authors = authRes.result?.content || authRes.content || [];
        setAllAuthors(authors);

        // Load all publishers
        const pubRes = await publisherService.getAllPublishers(0, 1000);
        const publishers = pubRes.result?.content || pubRes.content || [];
        setAllPublishers(publishers);

        if (id) {
          const res = await bookService.getBookById(id);
          const book = res.result;
          if (book) {
            setTitle(book.title || '');
            setDescription(book.description || '');
            setAuthor(book.author || '');
            setPublisher(book.publisher || '');
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
    if (!status) newErrors.status = "Vui lòng chọn trạng thái";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const matchedAuthor = allAuthors.find(a => a.name && a.name.trim().toLowerCase() === author.trim().toLowerCase());
      const matchedPublisher = allPublishers.find(p => p.name && p.name.trim().toLowerCase() === publisher.trim().toLowerCase());

      const bookData = {
        title: title.trim(),
        author: author.trim(),
        authorId: matchedAuthor ? matchedAuthor.id : null,
        status,
        description: description.trim(),
        publisher: publisher.trim(),
        publisherId: matchedPublisher ? matchedPublisher.id : null,
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
    allAuthors,
    allPublishers,
    errors,
    isSubmitting,
    isLoading,
    handleImageUpload,
    handleSave,
    navigate
  };
};
