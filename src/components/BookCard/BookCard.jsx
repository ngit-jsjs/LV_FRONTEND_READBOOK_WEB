import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiEdit3, FiClock, FiImage, FiTrash2 } from 'react-icons/fi';
import { getFormattedImageUrl } from '../../utils/imageUtils';
import { useAuth } from '../../context/AuthContext';
import bookService from '../../services/bookService';
import { ROUTES } from '../../config/routes';
import './BookCard.css';

function BookCard({ book, onDelete, rank, showActions = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  if (!book) return null;

  const imageUrl = getFormattedImageUrl(book.coverImage || book.coverImageUrl);
  const isAdmin = user?.isAdmin;
  const isManageMode = showActions || location.pathname.startsWith('/author');

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa tác phẩm "${book.title}" không? Hành động này không thể hoàn tác.`);
    if (!confirmDelete) return;

    try {
      const res = await bookService.deleteBook(book.id);
      if (res.code === 200 || res.code === 1000 || res.result) {
        alert('Xóa tác phẩm thành công!');
        if (onDelete) {
          onDelete(book.id);
        } else {
          window.location.reload();
        }
      } else {
        alert('Có lỗi xảy ra khi xóa: ' + (res.message || 'Không rõ nguyên nhân'));
      }
    } catch (error) {
      console.error("Failed to delete book", error);
      const errorDetail = error.response?.data?.message || error.response?.data?.result || error.message || "Lỗi mạng hoặc máy chủ không phản hồi";
      alert(`Không thể xóa tác phẩm. Chi tiết: ${errorDetail}`);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(ROUTES.EDIT_BOOK.replace(':id', book.id));
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
          {isManageMode && (
            <div className="book-card-actions" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              <button
                className="btn-action-minimal edit"
                onClick={handleEdit}
                title="Sửa sách"
              >
                <FiEdit3 />
              </button>
              <button
                className="btn-action-minimal delete"
                onClick={handleDelete}
                title="Xóa sách"
              >
                <FiTrash2 />
              </button>
            </div>
          )}
        </div>

        <div className="book-card-meta">
          {book.author && <span className="book-author-minimal">Tác giả: {book.author}</span>}
          {book.uploaderName && <span className="book-uploader-minimal">Người đăng: {book.uploaderName}</span>}
        </div>

        <div className="book-card-bottom">
          {book.createdAt && <span className="book-time-minimal">Tạo: {new Date(book.createdAt).toLocaleDateString('vi-VN')}</span>}
          {book.updatedAt && <span className="book-time-minimal"><FiClock /> Cập nhật: {new Date(book.updatedAt).toLocaleDateString('vi-VN')}</span>}
        </div>
      </div>
    </Link>
  );
}

export default BookCard;
