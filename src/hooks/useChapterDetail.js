import { useState, useEffect } from 'react';
import chapterService from '../services/chapterService';

export const useChapterDetail = (chapterId) => {
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChapter = async () => {
    if (!chapterId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await chapterService.getChapterById(chapterId);
      setChapter(res.result);
    } catch (err) {
      console.error("Failed to fetch chapter:", err);
      setError("Không thể tải thông tin chương.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapter();
  }, [chapterId]);

  return { chapter, loading, error, refreshChapter: fetchChapter };
};
