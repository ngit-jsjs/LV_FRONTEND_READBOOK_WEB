import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useChapterDetail } from '../../hooks/useChapterDetail';
import { useChapters } from '../../hooks/useChapters';
import chapterService from '../../services/chapterService';
import readingHistoryService from '../../services/readingHistoryService';
import ratingService from '../../services/ratingService';
import { ROUTES } from '../../config/routes';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../services/apiClient';
import { FiArrowLeft, FiUnlock, FiAlertCircle } from 'react-icons/fi';

function ChapterContent({ html }) {
  const hostRef = useRef(null);

  useEffect(() => {
    if (!hostRef.current) return;

    const shadow = hostRef.current.shadowRoot
      || hostRef.current.attachShadow({ mode: "open" });

    const overrideStyle = `
      <style>
        a, a:hover, a:active, a:focus { 
          color: inherit !important; 
          text-decoration: none !important; 
          cursor: text !important; 
          background: transparent !important;
          background-color: transparent !important;
        }
        img { 
          max-width: 100% !important; 
          height: auto !important; 
          display: block !important; 
          margin: 20px auto !important; 
        }
      </style>
    `;

    shadow.innerHTML = overrideStyle + html;
  }, [html]);

  return (
    <div
      ref={hostRef}
      className="cr-text-shadow cr-text-shadow-host"
    />
  );
}

function ChapterReadPage() {
  const { bookId, chapterId } = useParams();
  const navigate = useNavigate();
  const { chapter, loading, error, refreshChapter } = useChapterDetail(chapterId);
  const { chapters } = useChapters(bookId);
  const { user, refreshUser } = useAuth();

  const [unlocking, setUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState('');

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingError, setRatingError] = useState('');

  const sortedChapters = [...(chapters || [])].sort((a, b) => a.chapterNumber - b.chapterNumber);
  const currentIndex = sortedChapters.findIndex(c => String(c.id) === String(chapterId));

  const prevChapterId = currentIndex > 0 ? sortedChapters[currentIndex - 1].id : null;
  const nextChapterId = currentIndex !== -1 && currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1].id : null;

  useEffect(() => {
    if (user && chapter && !chapter.isLocked) {
      readingHistoryService.saveOrUpdate(bookId, chapterId)
        .catch(err => console.error("Không thể lưu lịch sử đọc:", err.response?.data || err));
    }
  }, [bookId, chapterId, chapter, user]);

  const handleUnlock = async () => {
    setUnlocking(true);
    setUnlockError('');
    try {
      await chapterService.unlockChapter(chapterId);
      await refreshChapter();
      if (refreshUser) {
        await refreshUser();
      }
    } catch (err) {
      console.error("Unlock failed", err);
      setUnlockError(getErrorMessage(err));
    } finally {
      setUnlocking(false);
    }
  };

  if (loading) {
    return <div className="chapter-read-page loading">Đang tải nội dung chương...</div>;
  }

  if (error || !chapter) {
    return (
      <div className="chapter-read-page error">
        <p>{error || "Không tìm thấy chương này."}</p>
        <Link to={ROUTES.BOOK_DETAIL.replace(':id', bookId)} className="btn-back">Quay lại tác phẩm</Link>
      </div>
    );
  }

  return (
    <div className="chapter-read-page">
      <div className="cr-header container">
        <button onClick={() => navigate(ROUTES.BOOK_DETAIL.replace(':id', bookId))} className="cr-back-btn">
          <FiArrowLeft /> Trở về
        </button>
        <div className="cr-title-group">
          <h2 className="cr-book-title">Thông tin tác phẩm</h2>
          <h1 className="cr-chapter-title">{chapter.title}</h1>
        </div>
      </div>

      <div className="cr-content-container container">
        {chapter.isLocked ? (
          <div className="cr-locked-content">
            <div className="cr-locked-card">
              <FiUnlock className="cr-locked-icon" />
              <h3>Chương này yêu cầu trả phí</h3>
              <p>Bạn cần thanh toán <strong>{chapter.price} xu</strong> để mở khóa và đọc chương này.</p>

              {unlockError && (
                <div className="cr-error-msg">
                  <FiAlertCircle /> {unlockError}
                </div>
              )}

              <button
                className="cr-unlock-btn"
                onClick={handleUnlock}
                disabled={unlocking}
              >
                {unlocking ? "Đang xử lý..." : `Mở khóa (${chapter.price} xu)`}
              </button>
            </div>
          </div>
        ) : (
          <div className="cr-content">
            {chapter.content ? (
              <ChapterContent html={chapter.content} />
            ) : (
              <p className="cr-empty">Chương này chưa có nội dung.</p>
            )}

            {/* Reusable reader nav buttons */}
            <div className="cr-nav-buttons">
              <button
                className="cr-nav-btn"
                disabled={prevChapterId === null}
                onClick={() => navigate(ROUTES.CHAPTER_READ.replace(':bookId', bookId).replace(':chapterId', prevChapterId))}
                title="Chương trước"
              >
                &larr; Chương trước
              </button>
              <button
                className="cr-nav-btn"
                onClick={() => navigate(ROUTES.BOOK_DETAIL.replace(':id', bookId))}
                title="Quay lại mục lục"
              >
                Mục lục
              </button>
              {nextChapterId === null ? (
                <button
                  className="cr-nav-btn"
                  onClick={() => {
                    readingHistoryService.saveOrUpdate(bookId, chapterId, true)
                      .then(() => {
                        setShowRatingModal(true);
                      })
                      .catch(err => {
                        console.error("Lỗi hoàn thành:", err);
                        alert("Lỗi: " + JSON.stringify(err.response?.data || err.message));
                      });
                  }}
                  title="Đánh dấu đã đọc xong & Đánh giá"
                  style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#facc15', border: '1px solid rgba(234, 179, 8, 0.3)' }}
                >
                  Đọc xong & Đánh giá
                </button>
              ) : (
                <button
                  className="cr-nav-btn"
                  onClick={() => navigate(ROUTES.CHAPTER_READ.replace(':bookId', bookId).replace(':chapterId', nextChapterId))}
                  title="Chương sau"
                >
                  Chương sau &rarr;
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {showRatingModal && (
        <div className="cr-modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }} onClick={() => navigate(ROUTES.BOOK_DETAIL.replace(':id', bookId))}>
          <div className="cr-modal" style={{
            background: 'var(--bg-secondary, #111328)',
            border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
            width: '100%',
            maxWidth: '450px',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '20px', textAlign: 'center', color: '#fff' }}>
              Đánh giá & Bình luận tác phẩm
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingScore(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '2.5rem',
                    color: star <= ratingScore ? '#ffb300' : 'var(--text-muted, #64748b)',
                    padding: '4px',
                    transition: 'transform 0.1s'
                  }}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              placeholder="Nhập cảm nhận của bạn về cuốn sách này..."
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              maxLength={500}
              style={{
                width: '100%',
                height: '120px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
                borderRadius: '8px',
                padding: '12px',
                color: 'var(--text-primary, #fff)',
                fontSize: '0.95rem',
                resize: 'none',
                outline: 'none',
                marginBottom: '20px',
                fontFamily: 'inherit'
              }}
            />

            {ratingError && (
              <div style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '16px', textAlign: 'center' }}>
                {ratingError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => navigate(ROUTES.BOOK_DETAIL.replace(':id', bookId))}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
                  color: 'var(--text-secondary, #94a3b8)',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Bỏ qua
              </button>
              <button
                type="button"
                disabled={submittingRating}
                onClick={async () => {
                  setSubmittingRating(true);
                  setRatingError('');
                  try {
                    await ratingService.createRating(bookId, {
                      ratings: ratingScore,
                      comment: ratingComment.trim()
                    });
                    alert("Đăng đánh giá thành công!");
                    navigate(ROUTES.BOOK_DETAIL.replace(':id', bookId));
                  } catch (err) {
                    console.error("Failed to submit rating:", err);
                    const msg = err.response?.data?.result || err.response?.data?.message || "Không thể gửi đánh giá.";
                    setRatingError(msg);
                  } finally {
                    setSubmittingRating(false);
                  }
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'var(--accent-gradient, linear-gradient(135deg, #8b5cf6, #ec4899))',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: '600',
                  opacity: submittingRating ? 0.6 : 1
                }}
              >
                {submittingRating ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChapterReadPage;
