import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiEdit3, FiClock, FiImage, FiTrash2, FiBookOpen, FiUser, FiCalendar, FiTag, FiStar } from 'react-icons/fi';
import { getFormattedImageUrl } from '../../utils/imageUtils';
import { useAuth } from '../../context/AuthContext';
import bookService from '../../services/bookService';
import { ROUTES } from '../../config/routes';


function BookCard({
  book,
  onDelete,
  onEdit,
  rank,
  showActions = false,
  showEdit = true,
  showDelete = true,
  showManageChapters = true
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  if (!book) return null;

  const imageUrl = getFormattedImageUrl(book.coverImage || book.coverImageUrl);
  const isAdmin = user?.isAdmin;
  const isManageMode = showActions || location.pathname.startsWith('/author') || location.pathname.startsWith('/admin');

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onDelete) {
      onDelete();
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    } else {
      navigate(ROUTES.EDIT_BOOK.replace(':id', book.id));
    }
  };

  return (
    <Link
      to={ROUTES.BOOK_DETAIL.replace(':id', book.id)}
      className={`book-card-minimal status-${book.status ? book.status.toLowerCase() : ''}`}
    >
      <div className="book-card-cover-wrapper">
        {rank !== undefined && (
          <div className={`book-rank-badge rank-${rank}`}>
            {rank}
          </div>
        )}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={book.title}
            className="book-card-cover-image"
          />
        ) : (
          <div className="book-card-placeholder">
            <FiImage size={32} />
          </div>
        )}
      </div>
      <div className="book-card-content">
        <div className="book-card-top">
          <h3 className="book-title-minimal" title={book.title || 'Untitled'}>
            {book.title || 'Untitled'}
          </h3>
          {isManageMode && (showEdit || showDelete) && (
            <div className="book-card-actions" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              {showEdit && (
                <button
                  className="btn-action-minimal edit"
                  onClick={handleEdit}
                  title="Sửa sách"
                >
                  <FiEdit3 />
                </button>
              )}
              {showDelete && (
                <button
                  className="btn-action-minimal delete"
                  onClick={handleDelete}
                  title="Xóa sách"
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="book-card-meta">
          {book.author && (
            <span className="book-author-minimal" title={book.author}>
              <FiUser className="meta-icon" /> {book.author}
            </span>
          )}

          {book.categories && (Array.isArray(book.categories) ? book.categories : Array.from(book.categories)).length > 0 && (
            <div className="book-categories-badges">
              {(Array.isArray(book.categories) ? book.categories : Array.from(book.categories)).slice(0, 3).map((cat, idx) => (
                <span key={idx} className="book-category-badge" title={cat}>
                  <FiTag className="badge-icon" /> {cat}
                </span>
              ))}
            </div>
          )}

          <div className="book-meta-grid">
            {book.year && (
              <span className="book-meta-item year" title={`Năm xuất bản: ${book.year}`}>
                <FiCalendar className="meta-icon" /> {book.year}
              </span>
            )}
            {book.totalChapters !== undefined && book.totalChapters !== null && (
              <span className="book-meta-item chapters" title={`Số chương: ${book.totalChapters}`}>
                <FiBookOpen className="meta-icon" /> {book.totalChapters} chương
              </span>
            )}
            {book.averageRating && Number(book.averageRating) > 0 && (
              <span className="book-meta-item rating" title={`Đánh giá: ${Number(book.averageRating).toFixed(1)} sao`}>
                <FiStar className="meta-icon star-filled" /> {Number(book.averageRating).toFixed(1)}
              </span>
            )}
          </div>
        </div>

        <div className="book-card-middle-status">
          {book.status && (
            <span className={`book-status-badge-minimal ${book.status.toLowerCase()}`}>
              <span className="status-dot-minimal"></span>
              {book.status === 'AVAILABLE' ? 'Sẵn sàng' : 'Chưa sẵn sàng'}
            </span>
          )}
        </div>

        <div className="book-card-bottom">
          {book.createdAt && (
            <span className="book-time-minimal" title={`Ngày tạo: ${new Date(book.createdAt).toLocaleDateString('vi-VN')}`}>
              Tạo: {new Date(book.createdAt).toLocaleDateString('vi-VN')}
            </span>
          )}
          {book.updatedAt && (
            <span className="book-time-minimal" title={`Cập nhật gần nhất: ${new Date(book.updatedAt).toLocaleDateString('vi-VN')}`}>
              <FiClock /> {new Date(book.updatedAt).toLocaleDateString('vi-VN')}
            </span>
          )}
        </div>

        {isManageMode && showManageChapters && (
          <div className="book-card-bottom-actions" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
            <button
              className="btn-manage-chapters"
              onClick={() => navigate(ROUTES.CHAPTER_MANAGEMENT.replace(':bookId', book.id))}
            >
              <FiBookOpen /> Quản lý chương
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}

export default BookCard;
