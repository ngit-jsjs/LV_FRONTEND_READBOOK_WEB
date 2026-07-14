import { useState, useEffect, useCallback } from 'react';
import recommendationService from '../services/recommendationService';
import { useAuth } from '../context/AuthContext';

export const useRecommendations = () => {
  const { user } = useAuth();
  const [recs, setRecs] = useState([]);
  const [recsLoading, setRecsLoading] = useState(false);

  const fetchRecommendations = useCallback(async () => {
    if (!user) {
      setRecs([]);
      return;
    }
    setRecsLoading(true);
    try {
      const res = await recommendationService.getRecommendations();
      if (res && res.result) {
        setRecs(res.result);
      }
    } catch (error) {
      console.error("Lỗi khi tải sách gợi ý:", error);
      setRecs([]);
    } finally {
      setRecsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return { recs, recsLoading, refetch: fetchRecommendations };
};
