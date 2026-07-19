import { useState, useEffect, useCallback } from 'react';
import chapterService from '../services/chapterService';
import { getErrorMessage } from '../services/apiClient';

export const useChapters = (bookId, pageSize = 20) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchChapters = useCallback(async (pageToFetch = 0) => {
    if (!bookId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await chapterService.getChaptersByBookId(bookId, pageToFetch, pageSize);
      const raw = res.result;
      if (Array.isArray(raw)) {
        setChapters(raw);
        setTotalPages(1);
        setTotalElements(raw.length);
      } else if (raw && Array.isArray(raw.content)) {
        setChapters(raw.content);
        setTotalPages(raw.totalPages || 1);
        setTotalElements(raw.totalElements || raw.content.length);
      } else {
        setChapters([]);
        setTotalPages(0);
        setTotalElements(0);
      }
      setPage(pageToFetch);
    } catch (err) {
      console.error("Failed to fetch chapters:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [bookId, pageSize]);

  useEffect(() => {
    setPage(0);
    fetchChapters(0);
  }, [fetchChapters]);

  const handlePageChange = (newPage) => {
    const zeroBasedPage = newPage - 1;
    fetchChapters(zeroBasedPage);
  };

  return { chapters, loading, error, refreshChapters: fetchChapters, page, totalPages, totalElements, handlePageChange };
};
