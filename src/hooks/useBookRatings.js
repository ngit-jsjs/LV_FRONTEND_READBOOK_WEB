import { useState, useEffect, useCallback } from 'react';
import ratingService from '../services/ratingService';

export const useBookRatings = (bookId, user, refetchBook, activeTab) => {
  const [ratings, setRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [ratingsPage, setRatingsPage] = useState(0);
  const [ratingsTotalPages, setRatingsTotalPages] = useState(0);
  const [ratingsTotalElements, setRatingsTotalElements] = useState(0);
  
  // Form state for writing/editing rating
  const [userRatingScore, setUserRatingScore] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [editingRatingId, setEditingRatingId] = useState(null);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingError, setRatingError] = useState('');

  const fetchRatings = useCallback(async () => {
    if (!bookId) return;
    setRatingsLoading(true);
    setRatingError('');
    try {
      const res = await ratingService.getRatingsByBook(bookId, ratingsPage, 5);
      if (res.result) {
        setRatings(res.result.content || []);
        setRatingsTotalPages(res.result.totalPages || 0);
        setRatingsTotalElements(res.result.totalElements || 0);
      }
    } catch (err) {
      console.error("Lỗi khi tải đánh giá:", err);
      setRatingError("Không thể tải danh sách đánh giá.");
    } finally {
      setRatingsLoading(false);
    }
  }, [bookId, ratingsPage]);

  useEffect(() => {
    if (activeTab === 'ratings') {
      fetchRatings();
    }
  }, [activeTab, fetchRatings]);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Vui lòng đăng nhập để đánh giá.");
      return;
    }
    setSubmittingRating(true);
    try {
      if (editingRatingId) {
        await ratingService.updateRating(editingRatingId, {
          ratings: userRatingScore,
          comment: userComment.trim()
        });
        alert("Cập nhật đánh giá thành công!");
      } else {
        await ratingService.createRating(bookId, {
          ratings: userRatingScore,
          comment: userComment.trim()
        });
        alert("Đăng đánh giá thành công!");
      }
      setUserComment('');
      setEditingRatingId(null);
      setUserRatingScore(5);
      if (refetchBook) refetchBook();
      fetchRatings();
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá:", err);
      const errorMsg = err.response?.data?.result || err.response?.data?.message || "Đã xảy ra lỗi khi gửi đánh giá.";
      alert(errorMsg);
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleEditRating = (rating) => {
    setEditingRatingId(rating.id);
    setUserRatingScore(rating.ratings);
    setUserComment(rating.comment);
  };

  const handleDeleteRating = async (ratingId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      return;
    }
    try {
      await ratingService.deleteRating(ratingId);
      alert("Xóa đánh giá thành công!");
      if (refetchBook) refetchBook();
      if (ratingsPage === 0) {
        fetchRatings();
      } else {
        setRatingsPage(0);
      }
    } catch (err) {
      console.error("Lỗi khi xóa đánh giá:", err);
      alert("Không thể xóa đánh giá.");
    }
  };

  const cancelEdit = () => {
    setEditingRatingId(null);
    setUserRatingScore(5);
    setUserComment('');
  };

  return {
    ratings,
    ratingsLoading,
    ratingsPage,
    setRatingsPage,
    ratingsTotalPages,
    ratingsTotalElements,
    userRatingScore,
    setUserRatingScore,
    userComment,
    setUserComment,
    editingRatingId,
    submittingRating,
    ratingError,
    fetchRatings,
    handleRatingSubmit,
    handleEditRating,
    handleDeleteRating,
    cancelEdit
  };
};
