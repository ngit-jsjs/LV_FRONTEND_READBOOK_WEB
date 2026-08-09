import { useState, useEffect, useCallback } from 'react';
import recommendationService from '../services/recommendationService';
import { getErrorMessage } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export const useRecommendations = () => {
  const { user } = useAuth();
  const [recs, setRecs] = useState([]);
  const [recsLoading, setRecsLoading] = useState(false);
  const [recsError, setRecsError] = useState('');

  const fetchRecommendations = useCallback(async () => {
    if (!user) {
      setRecs([]);
      setRecsError('');
      return;
    }
    setRecsLoading(true);
    setRecsError('');
    try {
      const res = await recommendationService.getRecommendations();
      setRecs(res?.result || []);
    } catch (error) {
      console.error("Lỗi khi tải sách gợi ý:", error);
      setRecs([]);
      setRecsError(getErrorMessage(error));
    } finally {
      setRecsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return { recs, recsLoading, recsError, refetch: fetchRecommendations };
};
