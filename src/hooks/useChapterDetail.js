import { useState, useEffect } from 'react';
import chapterService from '../services/chapterService';
import { getErrorMessage } from '../services/apiClient';

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
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapter();
  }, [chapterId]);

  return { chapter, loading, error, refreshChapter: fetchChapter };
};
