import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useChapterDetail } from '../../hooks/useChapterDetail';
import { useChapters } from '../../hooks/useChapters';
import chapterService from '../../services/chapterService';
import readingHistoryService from '../../services/readingHistoryService';
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

  const sortedChapters = [...(chapters || [])].sort((a, b) => a.chapterNumber - b.chapterNumber);
  const currentIndex = sortedChapters.findIndex(c => String(c.id) === String(chapterId));
  
  const prevChapterId = currentIndex > 0 ? sortedChapters[currentIndex - 1].id : null;
  const nextChapterId = currentIndex !== -1 && currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1].id : null;

  useEffect(() => {
    if (user && chapter && !chapter.isLocked) {
      readingHistoryService.saveOrUpdate(bookId, chapterId)
        .catch(err => console.error("Không thể lưu lịch sử đọc:", err));
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
              <button 
                className="cr-nav-btn"
                disabled={nextChapterId === null}
                onClick={() => navigate(ROUTES.CHAPTER_READ.replace(':bookId', bookId).replace(':chapterId', nextChapterId))}
                title="Chương sau"
              >
                Chương sau &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChapterReadPage;
