import { useState, useEffect } from 'react';
import chapterService from '../services/chapterService';

export const useChapters = (bookId) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChapters = async () => {
    if (!bookId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await chapterService.getChaptersByBookId(bookId);
      const raw = res.result;
      if (Array.isArray(raw)) {
        setChapters(raw);
      } else if (raw && Array.isArray(raw.content)) {
        setChapters(raw.content);
      } else {
        setChapters([]);
      }
    } catch (err) {
      console.error("Failed to fetch chapters:", err);
      setError("Không thể tải danh sách chương.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [bookId]);

  return { chapters, loading, error, refreshChapters: fetchChapters };
};
