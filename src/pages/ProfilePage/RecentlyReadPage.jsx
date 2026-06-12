import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import readingHistoryService from '../../services/readingHistoryService';
import { ROUTES } from '../../config/routes';
import { FiArrowLeft, FiClock, FiBookOpen, FiBook } from 'react-icons/fi';
import { getFormattedImageUrl } from '../../utils/imageUtils';

function RecentlyReadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN);
      return;
    }
    fetchHistory();
  }, [user, page]);

  const fetchHistory = async () => {
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
      setError("Không thể tải lịch sử đọc sách của bạn.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto', minHeight: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
        <button 
          className="btn-back-minimal" 
          onClick={() => navigate(ROUTES.PROFILE)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-muted)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '0.95rem',
            padding: 0,
            marginBottom: '16px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <FiArrowLeft /> Quay lại trang cá nhân
        </button>
        
        <h1 style={{ 
          fontSize: '2.2rem', 
          fontWeight: '800', 
          margin: '0 0 8px 0', 
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <FiClock style={{ color: 'var(--accent-purple)' }} /> Lịch sử đọc sách
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
          Xem các tác phẩm bạn đã mở đọc gần đây và tiếp tục hành trình của mình
        </p>
      </div>

      {/* Main Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Đang tải lịch sử...</div>
      ) : error ? (
        <div style={{ color: '#ef4444', padding: '20px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          {error}
        </div>
      ) : historyItems.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {historyItems.map((item) => {
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
                    <div style={{ fontSize: '0.9rem', color: 'var(--accent-purple)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiBookOpen size={14} />
                      Đọc gần nhất: {item.lastChapterTitle ? `Chương ${item.lastChapterNumber}: ${item.lastChapterTitle}` : `Chương ${item.lastChapterNumber}`}
                    </div>
                  </div>

                  {/* Time & Action Button */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {item.updatedAt ? `Đọc lúc: ${new Date(item.updatedAt).toLocaleDateString('vi-VN')} ${new Date(item.updatedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : ''}
                    </span>
                    {item.lastChapterId && (
                      <Link 
                        to={ROUTES.CHAPTER_READ.replace(':bookId', item.bookId).replace(':chapterId', item.lastChapterId)}
                        className="bd-btn primary"
                        style={{ padding: '8px 20px', fontSize: '0.9rem', borderRadius: '8px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
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
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '30px' }}>
              <button
                className="ratings-pagination-btn"
                disabled={page === 0}
                onClick={() => setPage(prev => prev - 1)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'none', color: '#fff', cursor: 'pointer' }}
              >
                Trang trước
              </button>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Trang {page + 1} / {totalPages}
              </span>
              <button
                className="ratings-pagination-btn"
                disabled={page === totalPages - 1}
                onClick={() => setPage(prev => prev + 1)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'none', color: '#fff', cursor: 'pointer' }}
              >
                Trang sau
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px', border: '1px dashed var(--border-color)', borderRadius: '20px' }}>
          <FiClock size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <h3 style={{ color: '#fff', marginBottom: '8px' }}>Chưa có lịch sử đọc</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Bạn chưa mở đọc tác phẩm nào trong thời gian gần đây.</p>
          <Link to={ROUTES.HOME} className="bd-btn primary" style={{ textDecoration: 'none', padding: '12px 24px', borderRadius: '12px' }}>Khám phá sách ngay</Link>
        </div>
      )}
    </div>
  );
}

export default RecentlyReadPage;
