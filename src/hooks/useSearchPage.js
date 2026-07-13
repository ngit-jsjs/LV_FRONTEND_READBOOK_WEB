import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import bookService from '../services/bookService';
import categoryService from '../services/categoryService';

export const useSearchPage = () => {
  const [searchParams] = useSearchParams();
  
  const keyword = searchParams.get('keyword') || '';
  const author = searchParams.get('author') || '';
  const publisher = searchParams.get('publisher') || '';
  const year = searchParams.get('year') || '';
  const categoryIds = searchParams.get('categories')
    ? searchParams.get('categories').split(',').map(Number)
    : [];

  const [books, setBooks] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch all categories once for the filter panel (if needed elsewhere)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAllCategoriesList();
        if (res.result) {
          setCategoriesList(res.result);
        } else if (Array.isArray(res)) {
          setCategoriesList(res);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // Reset page when search criteria change
  useEffect(() => {
    setPage(0);
  }, [keyword, author, publisher, year, searchParams.get('categories')]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await bookService.searchBooks(
          keyword,
          author,
          publisher,
          year,
          categoryIds,
          page,
          12
        );
        
        const data = res.result;
        if (data && data.content) {
          setBooks(data.content);
          setTotalPages(data.totalPages || 0);
        } else {
          setBooks([]);
          setTotalPages(0);
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm sách:", error);
        setBooks([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [keyword, author, publisher, year, searchParams.get('categories'), page]);

  return {
    keyword,
    author,
    publisher,
    year,
    categoryIds,
    categoriesList,
    books,
    loading,
    page,
    setPage,
    totalPages
  };
};
