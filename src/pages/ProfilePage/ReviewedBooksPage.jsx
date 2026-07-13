import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ratingService from '../../services/ratingService';
import bookService from '../../services/bookService';
import { ROUTES } from '../../config/routes';
import { FiStar, FiBook, FiMessageSquare } from 'react-icons/fi';
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

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN);
      return;
    }
    if (activeTab === 'reviewed') {
      fetchRatings();
    } else {
      fetchUnratedBooks();
    }
  }, [user, activeTab, reviewedPage, unratedPage]);

  const fetchRatings = async () => {
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
  };

  const fetchUnratedBooks = async () => {
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
  };

  if (!user) return null;

  return (
    <div className="transaction-page-container">
      {/* Header */}
      <div className="transaction-page-header">
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', color: '#fff', fontFamily: '"Noto Serif SC", serif' }}>
          Đánh giá tác phẩm
        </h1>
        <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.95rem', margin: 0 }}>
          Quản lý các nhận xét của bạn và đánh giá những tác phẩm đã đọc xong
        </p>
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
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Đang tải đánh giá...</div>
            ) : reviewedError ? (
              <div style={{ color: '#ef4444', padding: '20px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                {reviewedError}
              </div>
            ) : ratings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  {ratings.map((item) => {
                    const coverUrl = getFormattedImageUrl(item.coverImageUrl);
                    return (
                      <div 
                        key={item.id} 
                        style={{
                          background: 'rgba(17, 19, 40, 0.6)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '16px',
                          padding: '16px 24px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '20px',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--accent-purple)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-color)';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {/* Cover image */}
                        <Link to={ROUTES.BOOK_DETAIL.replace(':id', item.bookId)}>
                          <div style={{ 
                            width: '75px', 
                            height: '105px', 
                            borderRadius: '8px', 
                            overflow: 'hidden',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {coverUrl ? (
                              <img src={coverUrl} alt={item.bookTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <FiBook style={{ color: 'var(--text-muted)', fontSize: '24px' }} />
                            )}
                          </div>
                        </Link>

                        {/* Info */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <Link 
                            to={ROUTES.BOOK_DETAIL.replace(':id', item.bookId)} 
                            style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', textDecoration: 'none' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-purple)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
                          >
                            {item.bookTitle || "Tác phẩm ẩn danh"}
                          </Link>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Tác giả: {item.bookAuthor || "N/A"}</span>
                          
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
                            <div style={{ 
                              marginTop: '8px',
                              background: 'rgba(255, 255, 255, 0.03)',
                              borderLeft: '3px solid var(--accent-purple)',
                              padding: '10px 14px',
                              borderRadius: '0 8px 8px 0',
                              fontSize: '0.92rem',
                              color: 'var(--text-primary, #e2e8f0)',
                              fontStyle: 'italic',
                              lineHeight: '1.4'
                            }}>
                              "{item.comment}"
                            </div>
                          )}
                        </div>

                        {/* Time & Action Button */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', flexShrink: 0 }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {item.createdAt ? `Đánh giá ngày: ${new Date(item.createdAt).toLocaleDateString('vi-VN')}` : ''}
                          </span>
                          <Link 
                            to={ROUTES.BOOK_DETAIL.replace(':id', item.bookId)}
                            className="bd-btn primary"
                            style={{ padding: '8px 20px', fontSize: '0.9rem', borderRadius: '8px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          >
                            Chi tiết tác phẩm
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {reviewedTotalPages > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '30px' }}>
                    <button
                      className="ratings-pagination-btn"
                      disabled={reviewedPage === 0}
                      onClick={() => setReviewedPage(prev => prev - 1)}
                      style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'none', color: '#fff', cursor: 'pointer' }}
                    >
                      Trang trước
                    </button>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                      Trang {reviewedPage + 1} / {reviewedTotalPages}
                    </span>
                    <button
                      className="ratings-pagination-btn"
                      disabled={reviewedPage === reviewedTotalPages - 1}
                      onClick={() => setReviewedPage(prev => prev + 1)}
                      style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'none', color: '#fff', cursor: 'pointer' }}
                    >
                      Trang sau
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 20px', border: '1px dashed var(--border-color)', borderRadius: '20px' }}>
                <FiMessageSquare size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                <h3 style={{ color: '#fff', marginBottom: '8px' }}>Chưa có đánh giá nào</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Bạn chưa thực hiện đánh giá hay nhận xét tác phẩm nào.</p>
                <Link to={ROUTES.HOME} className="bd-btn primary" style={{ textDecoration: 'none', padding: '12px 24px', borderRadius: '12px' }}>Khám phá sách ngay</Link>
              </div>
            )}
          </>
        )}

        {/* Tab 2: Unrated Books */}
        {activeTab === 'unrated' && (
          <>
            {unratedLoading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Đang tải danh sách...</div>
            ) : unratedError ? (
              <div style={{ color: '#ef4444', padding: '20px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                {unratedError}
              </div>
            ) : unratedBooks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  {unratedBooks.map((book) => {
                    const coverUrl = getFormattedImageUrl(book.coverImageUrl);
                    return (
                      <div 
                        key={book.id} 
                        style={{
                          background: 'rgba(17, 19, 40, 0.6)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '16px',
                          padding: '16px 24px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '20px',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--accent-purple)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-color)';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {/* Cover image */}
                        <Link to={ROUTES.BOOK_DETAIL.replace(':id', book.id)}>
                          <div style={{ 
                            width: '70px', 
                            height: '100px', 
                            borderRadius: '8px', 
                            overflow: 'hidden',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {coverUrl ? (
                              <img src={coverUrl} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <FiBook style={{ color: 'var(--text-muted)', fontSize: '24px' }} />
                            )}
                          </div>
                        </Link>

                        {/* Info */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <Link 
                            to={ROUTES.BOOK_DETAIL.replace(':id', book.id)} 
                            style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', textDecoration: 'none' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-purple)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
                          >
                            {book.title || "Tác phẩm ẩn danh"}
                          </Link>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Tác giả: {book.author || "N/A"}</span>
                        </div>

                        {/* Action Button */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                            <Link 
                              to={ROUTES.BOOK_DETAIL.replace(':id', book.id) + "#reviews"}
                              style={{ 
                                padding: '8px 20px', 
                                fontSize: '0.9rem', 
                                borderRadius: '8px', 
                                textDecoration: 'none', 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '6px',
                                background: 'rgba(234, 179, 8, 0.15)',
                                color: '#facc15',
                                border: '1px solid rgba(234, 179, 8, 0.3)',
                                fontWeight: '600'
                              }}
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
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '30px' }}>
                    <button
                      className="ratings-pagination-btn"
                      disabled={unratedPage === 0}
                      onClick={() => setUnratedPage(prev => prev - 1)}
                      style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'none', color: '#fff', cursor: 'pointer' }}
                    >
                      Trang trước
                    </button>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                      Trang {unratedPage + 1} / {unratedTotalPages}
                    </span>
                    <button
                      className="ratings-pagination-btn"
                      disabled={unratedPage === unratedTotalPages - 1}
                      onClick={() => setUnratedPage(prev => prev + 1)}
                      style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'none', color: '#fff', cursor: 'pointer' }}
                    >
                      Trang sau
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 20px', border: '1px dashed var(--border-color)', borderRadius: '20px' }}>
                <FiStar size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                <h3 style={{ color: '#fff', marginBottom: '8px' }}>Không có sách nào cần đánh giá</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Bạn đã đánh giá tất cả các sách mà bạn đã đọc xong.</p>
                <Link to={ROUTES.HOME} className="bd-btn primary" style={{ textDecoration: 'none', padding: '12px 24px', borderRadius: '12px' }}>Khám phá sách ngay</Link>
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
