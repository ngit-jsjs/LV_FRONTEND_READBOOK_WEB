import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ratingService from '../../services/ratingService';
import bookService from '../../services/bookService';
import { ROUTES } from '../../config/routes';
import { FiStar, FiBook, FiMessageSquare, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getFormattedImageUrl } from '../../utils/imageUtils';
import { getErrorMessage } from '../../services/apiClient';

function ReviewedBooksPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(location.pathname === ROUTES.UNRATED_BOOKS ? 'unrated' : 'reviewed');

  // Sync activeTab if the URL changes
  useEffect(() => {
    setActiveTab(location.pathname === ROUTES.UNRATED_BOOKS ? 'unrated' : 'reviewed');
  }, [location.pathname]);

  // State for Reviewed Books
  const [ratings, setRatings] = useState([]);
  const [reviewedLoading, setReviewedLoading] = useState(true);
  const [reviewedError, setReviewedError] = useState('');
  const [reviewedPage, setReviewedPage] = useState(0);
  const [reviewedTotalPages, setReviewedTotalPages] = useState(0);

  // State for Unrated Books
  const [unratedBooks, setUnratedBooks] = useState([]);
  const [unratedLoading, setUnratedLoading] = useState(true);
  const [unratedError, setUnratedError] = useState('');
  const [unratedPage, setUnratedPage] = useState(0);
  const [unratedTotalPages, setUnratedTotalPages] = useState(0);

  // State for Inline Edit Rating
  const [editingRatingId, setEditingRatingId] = useState(null);
  const [editScore, setEditScore] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleStartEdit = (item) => {
    setEditingRatingId(item.id);
    setEditScore(item.ratings || 5);
    setEditComment(item.comment || '');
  };

  const handleCancelEdit = () => {
    setEditingRatingId(null);
    setEditScore(5);
    setEditComment('');
  };

  const handleSaveEdit = async (ratingId) => {
    setUpdating(true);
    try {
      await ratingService.updateRating(ratingId, {
        ratings: editScore,
        comment: editComment.trim()
      });
      alert("Cập nhật đánh giá thành công!");
      setEditingRatingId(null);
      fetchRatings();
    } catch (err) {
      console.error("Lỗi khi cập nhật đánh giá:", err);
      alert(getErrorMessage(err) || "Không thể cập nhật đánh giá.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteRating = async (ratingId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      return;
    }
    try {
      await ratingService.deleteRating(ratingId);
      alert("Xóa đánh giá thành công!");
      fetchRatings();
    } catch (err) {
      console.error("Lỗi khi xóa đánh giá:", err);
      alert(getErrorMessage(err) || "Không thể xóa đánh giá.");
    }
  };

  const fetchRatings = useCallback(async () => {
    setReviewedLoading(true);
    setReviewedError('');
    try {
      const res = await ratingService.getMyRatings(reviewedPage, 8);
      if (res.result) {
        setRatings(res.result.content || []);
        setReviewedTotalPages(res.result.totalPages || 0);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách sách đã đánh giá:", err);
      setReviewedError(getErrorMessage(err));
    } finally {
      setReviewedLoading(false);
    }
  }, [reviewedPage]);

  const fetchUnratedBooks = useCallback(async () => {
    setUnratedLoading(true);
    setUnratedError('');
    try {
      const res = await bookService.getUnratedFinishedBooks(unratedPage, 8);
      if (res.result) {
        setUnratedBooks(res.result.content || []);
        setUnratedTotalPages(res.result.totalPages || 0);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách sách chờ đánh giá:", err);
      setUnratedError(getErrorMessage(err));
    } finally {
      setUnratedLoading(false);
    }
  }, [unratedPage]);

  // Auth Redirect check
  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN);
    }
  }, [user, navigate]);

  // Fetch reviewed ratings
  useEffect(() => {
    if (user && activeTab === 'reviewed') {
      fetchRatings();
    }
  }, [user, activeTab, fetchRatings]);

  // Fetch unrated books
  useEffect(() => {
    if (user && activeTab === 'unrated') {
      fetchUnratedBooks();
    }
  }, [user, activeTab, fetchUnratedBooks]);

  if (!user) return null;

  return (
    <div className="transaction-page-container">
      {/* Header */}
      <div className="transaction-page-header">
        <h1>Đánh giá tác phẩm</h1>
        <p>Quản lý các nhận xét của bạn và đánh giá những tác phẩm đã đọc xong</p>
      </div>

      <div className="transaction-page-main">
        {/* Tabs Switcher */}
        <div className="admin-dashboard-tabs">
          <button
            onClick={() => navigate(ROUTES.REVIEWED_BOOKS)}
            className={`admin-tab-btn ${activeTab === 'reviewed' ? 'active' : ''}`}
          >
            <FiMessageSquare /> Đã đánh giá
          </button>
          <button
            onClick={() => navigate(ROUTES.UNRATED_BOOKS)}
            className={`admin-tab-btn ${activeTab === 'unrated' ? 'active' : ''}`}
          >
            <FiStar /> Chờ đánh giá
          </button>
        </div>

        {/* Main Content */}
        <div className="transaction-page-content">
          
          {/* Tab 1: Reviewed Books */}
          {activeTab === 'reviewed' && (
            <>
              {reviewedLoading ? (
                <div className="tx-loader-wrapper">Đang tải đánh giá...</div>
              ) : reviewedError ? (
                <div className="error-message">{reviewedError}</div>
              ) : ratings.length > 0 ? (
                <div className="profile-history-list">
                  <div className="profile-history-grid">
                    {ratings.map((item) => {
                      const coverUrl = getFormattedImageUrl(item.coverImageUrl);
                      const isEditingThisItem = editingRatingId === item.id;

                      return (
                        <div key={item.id} className="profile-history-card">
                          {/* Cover image */}
                          <Link to={ROUTES.BOOK_DETAIL.replace(':id', item.bookId)}>
                            <div className="profile-history-cover-wrapper">
                              {coverUrl ? (
                                <img src={coverUrl} alt={item.bookTitle} className="profile-history-cover-img" />
                              ) : (
                                <FiBook style={{ color: 'var(--text-muted)', fontSize: '24px' }} />
                              )}
                            </div>
                          </Link>

                          {/* Info */}
                          <div className="profile-history-info">
                            <Link 
                              to={ROUTES.BOOK_DETAIL.replace(':id', item.bookId)} 
                              className="profile-history-title-link"
                            >
                              {item.bookTitle || "Tác phẩm ẩn danh"}
                            </Link>
                            <span className="profile-history-author">Tác giả: {item.bookAuthor || "N/A"}</span>
                            
                            {isEditingThisItem ? (
                              <div className="profile-review-inline-edit" style={{ marginTop: '10px', background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--accent-purple, #8b5cf6)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Số sao:</span>
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => setEditScore(star)}
                                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                    >
                                      <FiStar
                                        fill={star <= editScore ? "#ffb300" : "none"}
                                        style={{ stroke: star <= editScore ? '#ffb300' : 'var(--text-muted)', fontSize: '18px' }}
                                      />
                                    </button>
                                  ))}
                                </div>
                                <textarea
                                  className="rating-comment-textarea"
                                  value={editComment}
                                  onChange={(e) => setEditComment(e.target.value)}
                                  maxLength={3000}
                                  placeholder="Nhập cảm nhận..."
                                  style={{ width: '100%', minHeight: '80px', marginBottom: '10px' }}
                                  autoFocus
                                />
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                  <button
                                    type="button"
                                    className="profile-action-btn secondary"
                                    onClick={handleCancelEdit}
                                    disabled={updating}
                                  >
                                    Hủy
                                  </button>
                                  <button
                                    type="button"
                                    className="profile-action-btn primary"
                                    onClick={() => handleSaveEdit(item.id)}
                                    disabled={updating}
                                  >
                                    {updating ? "Đang lưu..." : "Lưu thay đổi"}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                {/* Stars */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <FiStar
                                      key={star}
                                      fill={star <= item.ratings ? "#ffb300" : "none"}
                                      style={{ stroke: star <= item.ratings ? '#ffb300' : 'var(--text-muted)', width: '16px', height: '16px' }}
                                    />
                                  ))}
                                  <span style={{ marginLeft: '6px', fontSize: '0.9rem', color: '#fff', fontWeight: '600' }}>
                                    {item.ratings}/5
                                  </span>
                                </div>

                                {/* Comment */}
                                {item.comment && (
                                  <div className="profile-review-comment">
                                    "{item.comment}"
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                          {/* Time & Action Button */}
                          {!isEditingThisItem && (
                            <div className="profile-history-actions">
                              <span className="profile-history-time">
                                {item.createdAt ? `Đánh giá ngày: ${new Date(item.createdAt).toLocaleDateString('vi-VN')}` : ''}
                              </span>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                <button
                                  type="button"
                                  className="profile-action-btn secondary"
                                  onClick={() => handleStartEdit(item)}
                                >
                                  <FiEdit2 /> Sửa
                                </button>
                                <button
                                  type="button"
                                  className="profile-action-btn danger"
                                  onClick={() => handleDeleteRating(item.id)}
                                >
                                  <FiTrash2 /> Xóa
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {reviewedTotalPages > 0 && (
                    <div className="tx-pagination-container">
                      <button
                        className="ratings-pagination-btn"
                        disabled={reviewedPage === 0}
                        onClick={() => setReviewedPage(prev => prev - 1)}
                      >
                        Trang trước
                      </button>
                      <span className="tx-pagination-info">
                        Trang {reviewedPage + 1} / {reviewedTotalPages}
                      </span>
                      <button
                        className="ratings-pagination-btn"
                        disabled={reviewedPage === reviewedTotalPages - 1}
                        onClick={() => setReviewedPage(prev => prev + 1)}
                      >
                        Trang sau
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <FiMessageSquare size={48} />
                  <h3>Chưa có đánh giá nào</h3>
                  <p>Bạn chưa thực hiện đánh giá hay nhận xét tác phẩm nào.</p>
                  <Link to={ROUTES.HOME} className="profile-btn primary">Khám phá sách ngay</Link>
                </div>
              )}
            </>
          )}

          {/* Tab 2: Unrated Books */}
          {activeTab === 'unrated' && (
            <>
              {unratedLoading ? (
                <div className="tx-loader-wrapper">Đang tải danh sách...</div>
              ) : unratedError ? (
                <div className="error-message">{unratedError}</div>
              ) : unratedBooks.length > 0 ? (
                <div className="profile-history-list">
                  <div className="profile-history-grid">
                    {unratedBooks.map((book) => {
                      const coverUrl = getFormattedImageUrl(book.coverImageUrl);
                      return (
                        <div key={book.id} className="profile-history-card">
                          {/* Cover image */}
                          <Link to={ROUTES.BOOK_DETAIL.replace(':id', book.id)}>
                            <div className="profile-history-cover-wrapper">
                              {coverUrl ? (
                                <img src={coverUrl} alt={book.title} className="profile-history-cover-img" />
                              ) : (
                                <FiBook style={{ color: 'var(--text-muted)', fontSize: '24px' }} />
                              )}
                            </div>
                          </Link>

                          {/* Info */}
                          <div className="profile-history-info">
                            <Link 
                              to={ROUTES.BOOK_DETAIL.replace(':id', book.id)} 
                              className="profile-history-title-link"
                            >
                              {book.title || "Tác phẩm ẩn danh"}
                            </Link>
                            <span className="profile-history-author">Tác giả: {book.author || "N/A"}</span>
                          </div>

                          {/* Action Button */}
                          <div className="profile-history-actions">
                            <Link 
                              to={ROUTES.BOOK_DETAIL.replace(':id', book.id) + "#reviews"}
                              className="profile-action-btn warning"
                            >
                              <FiStar style={{fill: '#facc15'}} /> Đánh giá ngay
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {unratedTotalPages > 0 && (
                    <div className="tx-pagination-container">
                      <button
                        className="ratings-pagination-btn"
                        disabled={unratedPage === 0}
                        onClick={() => setUnratedPage(prev => prev - 1)}
                      >
                        Trang trước
                      </button>
                      <span className="tx-pagination-info">
                        Trang {unratedPage + 1} / {unratedTotalPages}
                      </span>
                      <button
                        className="ratings-pagination-btn"
                        disabled={unratedPage === unratedTotalPages - 1}
                        onClick={() => setUnratedPage(prev => prev + 1)}
                      >
                        Trang sau
                      </button>
                    </div>
                  )}
                </div>

              ) : (
                <div className="empty-state">
                  <FiStar size={48} />
                  <h3>Không có sách nào cần đánh giá</h3>
                  <p>Bạn đã đánh giá tất cả các sách mà bạn đã đọc xong.</p>
                  <Link to={ROUTES.HOME} className="profile-btn primary">Khám phá sách ngay</Link>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default ReviewedBooksPage;
