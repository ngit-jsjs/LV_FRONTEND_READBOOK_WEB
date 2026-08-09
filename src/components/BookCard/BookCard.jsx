import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiEdit3, FiClock, FiImage, FiBookOpen, FiUser, FiCalendar, FiTag, FiStar, FiEye, FiEyeOff } from 'react-icons/fi';
import { getFormattedImageUrl } from '../../utils/imageUtils';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/routes';
import { formatDate } from '../../utils/formatUtils';


function BookCard({
  book,
  onDelete,
  onEdit,
  rank,
  showActions = false,
  showEdit = true,
  showDelete = true,
  showManageChapters = true,
  deleteTitle,
  deleteIcon
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  if (!book) return null;

  const imageUrl = getFormattedImageUrl(book.coverImage || book.coverImageUrl);
  const isAdmin = user?.isAdmin;
  const isManageMode = showActions || location.pathname.startsWith('/author') || location.pathname.startsWith('/admin');

  const isHidden = book.status === 'UNAVAILABLE';
  const defaultTitle = deleteTitle || (isHidden ? 'Hiển thị sách' : 'Ẩn sách');
  const defaultIcon = deleteIcon || (isHidden ? <FiEye /> : <FiEyeOff />);

  const bookDetailUrl = ROUTES.BOOK_DETAIL.replace(':id', book.id);
  const editBookUrl = ROUTES.EDIT_BOOK.replace(':id', book.id);
  const manageChaptersUrl = ROUTES.CHAPTER_MANAGEMENT.replace(':bookId', book.id);

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onDelete) {
      onDelete();
    }
  };

  const handleCardClick = (e) => {
    if (e.target.closest('a, button')) {
      return;
    }
    navigate(bookDetailUrl);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`book-card-minimal status-${book.status ? book.status.toLowerCase() : ''}`}
      style={{ cursor: 'pointer' }}
    >
      <Link
        to={bookDetailUrl}
        className="book-card-cover-wrapper"
        onClick={(e) => e.stopPropagation()}
      >
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
      </Link>

      <div className="book-card-content">
        <div className="book-card-top">
          <Link
            to={bookDetailUrl}
            onClick={(e) => e.stopPropagation()}
            style={{ textDecoration: 'none', flex: 1, minWidth: 0 }}
          >
            <h3 className="book-title-minimal" title={book.title || 'Untitled'}>
              {book.title || 'Untitled'}
            </h3>
          </Link>

          {isManageMode && (showEdit || showDelete) && (
            <div className="book-card-actions" onClick={(e) => e.stopPropagation()}>
              {showEdit && (
                onEdit ? (
                  <button
                    className="btn-action-minimal edit"
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    title="Sửa sách"
                  >
                    <FiEdit3 />
                  </button>
                ) : (
                  <Link
                    to={editBookUrl}
                    className="btn-action-minimal edit"
                    title="Sửa sách"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiEdit3 />
                  </Link>
                )
              )}
              {showDelete && (
                <button
                  className={`btn-action-minimal ${isHidden ? 'unhide' : 'hide'}`}
                  onClick={handleDelete}
                  title={defaultTitle}
                >
                  {defaultIcon}
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
            <span className="book-time-minimal" title={`Ngày tạo: ${formatDate(book.createdAt)}`}>
              Tạo: {formatDate(book.createdAt)}
            </span>
          )}
          {book.updatedAt && (
            <span className="book-time-minimal" title={`Cập nhật gần nhất: ${formatDate(book.updatedAt)}`}>
              <FiClock /> {formatDate(book.updatedAt)}
            </span>
          )}
        </div>

        {isManageMode && showManageChapters && (
          <div className="book-card-bottom-actions" onClick={(e) => e.stopPropagation()}>
            <Link
              to={manageChaptersUrl}
              className="btn-manage-chapters"
              onClick={(e) => e.stopPropagation()}
            >
              <FiBookOpen /> Quản lý chương
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookCard;
