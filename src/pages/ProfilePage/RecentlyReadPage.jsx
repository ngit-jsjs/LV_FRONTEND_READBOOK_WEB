import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import readingHistoryService from '../../services/readingHistoryService';
import { ROUTES } from '../../config/routes';
import { FiArrowLeft, FiClock, FiBookOpen, FiBook } from 'react-icons/fi';
import { getFormattedImageUrl } from '../../utils/imageUtils';

import { getErrorMessage } from '../../services/apiClient';
import { formatDateTime } from '../../utils/formatUtils';

function RecentlyReadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await readingHistoryService.getMyReadingHistory(page, 8);
      if (res.result) {
        setHistoryItems(res.result.content || []);
        setTotalPages(res.result.totalPages || 0);
      }
    } catch (err) {
      console.error("Lỗi khi tải lịch sử đọc:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN);
      return;
    }
    fetchHistory();
  }, [user, navigate, fetchHistory]);

  if (!user) return null;

  return (
    <div className="transaction-page-container">
      <div className="transaction-page-header">
        <h1>Lịch sử đọc sách</h1>
        <p>Xem các tác phẩm bạn đã mở đọc gần đây và tiếp tục hành trình của mình</p>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="tx-loader-wrapper">Đang tải lịch sử...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : historyItems.length > 0 ? (
        <div className="profile-history-list">
          <div className="profile-history-grid">
            {historyItems.map((item) => {
              const coverUrl = getFormattedImageUrl(item.coverImageUrl);
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
                    <div className="profile-history-last-read">
                      Đọc gần nhất: {item.lastChapterTitle ? `Chương ${item.lastChapterNumber}: ${item.lastChapterTitle}` : `Chương ${item.lastChapterNumber}`}
                    </div>
                  </div>

                  {/* Time & Action Button */}
                  <div className="profile-history-actions">
                    <span className="profile-history-time">
                      {item.updatedAt ? `Đọc lúc: ${formatDateTime(item.updatedAt)}` : ''}
                    </span>
                    {item.lastChapterId && (
                      <Link 
                        to={ROUTES.CHAPTER_READ.replace(':bookId', item.bookId).replace(':chapterId', item.lastChapterId)}
                        className="profile-action-btn primary"
                      >
                        <FiBookOpen /> Đọc tiếp
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="tx-pagination-container">
              <button
                className="ratings-pagination-btn"
                disabled={page === 0}
                onClick={() => setPage(prev => prev - 1)}
              >
                Trang trước
              </button>
              <span className="tx-pagination-info">
                Trang {page + 1} / {totalPages}
              </span>
              <button
                className="ratings-pagination-btn"
                disabled={page === totalPages - 1}
                onClick={() => setPage(prev => prev + 1)}
              >
                Trang sau
              </button>
            </div>
          )}
        </div>

      ) : (
        <div className="empty-state">
          <FiClock size={48} />
          <h3>Chưa có lịch sử đọc</h3>
          <p>Bạn chưa mở đọc tác phẩm nào trong thời gian gần đây.</p>
          <Link to={ROUTES.HOME} className="profile-btn primary">Khám phá sách ngay</Link>
        </div>
      )}

    </div>
  );
}

export default RecentlyReadPage;

