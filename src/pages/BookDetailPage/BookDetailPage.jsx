import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiClock, FiHeart, FiShare2, FiBookOpen, FiUser, FiInfo, FiMessageSquare } from 'react-icons/fi';
import { useBookDetail } from '../../hooks/useBookDetail';
import { getFormattedImageUrl } from '../../utils/imageUtils';
import { ROUTES } from '../../config/routes';
import './BookDetailPage.css';

function BookDetailPage() {
  const { id } = useParams();
  const { book, loading, error } = useBookDetail(id);
  const [activeTab, setActiveTab] = useState('chapters');

  if (loading) {
    return (
      <div className="book-detail-page container">
        <div className="bd-loading">Đang tải thông tin tác phẩm...</div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="book-detail-page container">
        <div className="bd-error">
          <h3>Oops!</h3>
          <p>{error || "Không tìm thấy thông tin tác phẩm."}</p>
          <Link to={ROUTES.HOME} className="bd-btn secondary">Về trang chủ</Link>
        </div>
      </div>
    );
  }

  const imageUrl = getFormattedImageUrl(book.coverImage || book.coverImageUrl);
  const statusLabel = book.status === 'PUBLISHED' ? 'Đã xuất bản' : book.status === 'DRAFT' ? 'Bản nháp' : 'Đang cập nhật';
  const statusClass = book.status === 'PUBLISHED' ? 'status-published' : book.status === 'DRAFT' ? 'status-draft' : 'status-ongoing';

  return (
    <div className="book-detail-page">
      {/* Hero Section */}
      <div className="bd-hero">
        <div className="bd-hero-background" style={{ backgroundImage: `url(${imageUrl || '/default-cover.jpg'})` }}></div>
        <div className="bd-hero-overlay"></div>
        
        <div className="container bd-hero-content">
          <div className="bd-cover-wrapper">
            {imageUrl ? (
              <img src={imageUrl} alt={book.title} className="bd-cover-img" />
            ) : (
              <div className="bd-cover-placeholder">
                <FiBookOpen size={48} />
              </div>
            )}
          </div>
          
          <div className="bd-info">
            <h1 className="bd-title">{book.title || 'Đang cập nhật tiêu đề'}</h1>
            
            <div className="bd-meta">
              {book.userId ? (
                <Link to={ROUTES.AUTHOR_PROFILE.replace(':id', book.userId)} className="bd-author bd-author-link">
                  <FiUser /> {book.author || book.uploaderName || 'Đang cập nhật'}
                </Link>
              ) : (
                <span className="bd-author">
                  <FiUser /> {book.author || book.uploaderName || 'Đang cập nhật'}
                </span>
              )}
              <span className={`bd-status ${statusClass}`}>
                {statusLabel}
              </span>
              {book.year && (
                <span className="bd-year">
                  Năm SX: {book.year}
                </span>
              )}
            </div>

            <div className="bd-stats">
              <div className="bd-stat-item">
                <span className="bd-stat-value">N/A</span>
                <span className="bd-stat-label">Lượt đọc</span>
              </div>
              <div className="bd-stat-item">
                <span className="bd-stat-value">N/A</span>
                <span className="bd-stat-label">Đề cử</span>
              </div>
              <div className="bd-stat-item">
                <span className="bd-stat-value">N/A</span>
                <span className="bd-stat-label">Bình luận</span>
              </div>
            </div>

            <div className="bd-actions">
              <button className="bd-btn primary">
                <FiBookOpen /> Đọc Từ Đầu
              </button>
              <button className="bd-btn icon-btn" title="Thêm vào yêu thích">
                <FiHeart />
              </button>
              <button className="bd-btn icon-btn" title="Chia sẻ">
                <FiShare2 />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container bd-main">
        <div className="bd-layout">
          {/* Left Column: Details & Tabs */}
          <div className="bd-content-left">
            <div className="bd-synopsis card-panel">
              <h3 className="panel-title"><FiInfo /> Giới Thiệu</h3>
              <div className="synopsis-text">
                {book.description ? (
                  book.description.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))
                ) : (
                  <p className="no-data">Chưa có thông tin giới thiệu cho tác phẩm này.</p>
                )}
              </div>
            </div>

            <div className="bd-tabs-section card-panel">
              <div className="bd-tabs">
                <button 
                  className={`bd-tab ${activeTab === 'chapters' ? 'active' : ''}`}
                  onClick={() => setActiveTab('chapters')}
                >
                  Danh sách chương
                </button>
                <button 
                  className={`bd-tab ${activeTab === 'comments' ? 'active' : ''}`}
                  onClick={() => setActiveTab('comments')}
                >
                  Bình luận
                </button>
              </div>

              <div className="bd-tab-content">
                {activeTab === 'chapters' && (
                  <div className="chapters-tab">
                    <div className="empty-state">
                      Tác phẩm chưa có chương nào được đăng tải.
                    </div>
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div className="comments-tab">
                    <div className="empty-state">
                      <FiMessageSquare size={32} />
                      <p>Chưa có bình luận nào. Hãy là người đầu tiên nhận xét!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="bd-sidebar">
            <div className="card-panel">
              <h3 className="panel-title">Thông tin thêm</h3>
              <ul className="sidebar-info-list">
                <li>
                  <span className="label">Thể loại:</span>
                  <span className="value">Đang cập nhật</span>
                </li>
                <li>
                  <span className="label">Người đăng:</span>
                  {book.userId ? (
                    <Link to={ROUTES.AUTHOR_PROFILE.replace(':id', book.userId)} className="value uploader-link">
                      {book.uploaderName || 'Ẩn danh'}
                    </Link>
                  ) : (
                    <span className="value">{book.uploaderName || 'Ẩn danh'}</span>
                  )}
                </li>
                <li>
                  <span className="label">Ngày đăng:</span>
                  <span className="value">{book.createdAt ? new Date(book.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                </li>
                <li>
                  <span className="label">Cập nhật:</span>
                  <span className="value">{book.updatedAt ? new Date(book.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                </li>
                {book.publisher && (
                  <li>
                    <span className="label">NXB:</span>
                    <span className="value">{book.publisher}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetailPage;
