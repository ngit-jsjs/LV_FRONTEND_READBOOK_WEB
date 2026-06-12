import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiEdit3, FiClock, FiImage, FiTrash2, FiBookOpen } from 'react-icons/fi';
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
  const isManageMode = showActions || location.pathname.startsWith('/author');

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
      className={`book-card-minimal status-${book.status ? book.status.toLowerCase() : 'ongoing'}`}
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
          <h3 className="book-title-minimal">{book.title || 'Untitled'}</h3>
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
          {book.author && <span className="book-author-minimal">Tác giả: {book.author}</span>}
          {book.year && <span className="book-year-minimal">Năm: {book.year}</span>}
          {book.status && (
            <span className="book-status-minimal">
              Trạng thái: {book.status === 'PUBLISHED' ? 'Đã xuất bản' : book.status === 'DRAFT' ? 'Bản nháp' : book.status}
            </span>
          )}
          {book.totalChapters !== undefined && book.totalChapters !== null && (
            <span className="book-chapters-minimal">
              Số chương: {book.totalChapters}
            </span>
          )}
          {book.averageRating && Number(book.averageRating) > 0 && (
            <span className="book-rating-minimal-display" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffb300', fontWeight: 'bold', fontSize: '0.85rem', marginTop: '2px' }}>
              ★ {Number(book.averageRating).toFixed(1)}
            </span>
          )}
        </div>

        <div className="book-card-bottom">
          {book.createdAt && <span className="book-time-minimal">Tạo: {new Date(book.createdAt).toLocaleDateString('vi-VN')}</span>}
          {book.updatedAt && <span className="book-time-minimal"><FiClock /> Cập nhật: {new Date(book.updatedAt).toLocaleDateString('vi-VN')}</span>}
        </div>

        {isManageMode && showManageChapters && (
          <div className="book-card-bottom-actions" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
            <button
              className="btn-manage-chapters"
              onClick={() => navigate(ROUTES.AUTHOR_STUDIO.replace(':bookId', book.id))}
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
