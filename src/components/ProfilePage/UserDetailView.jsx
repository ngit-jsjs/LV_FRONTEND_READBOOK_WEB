import React from 'react';
import { FiArrowLeft, FiBookOpen } from 'react-icons/fi';
import BookCard from '../BookCard/BookCard';
import { useUserDetailView } from '../../hooks/useUserDetailView';
import './UserDetailView.css';

function UserDetailView({ user, onBack }) {
  if (!user) return null;

  const {
    books,
    loading,
    page,
    setPage,
    totalPages
  } = useUserDetailView(user);

  return (
    <div className="user-detail-view">
      <div className="ud-header">
        <button className="ud-back-btn" onClick={onBack}>
          <FiArrowLeft /> Quay lại danh sách
        </button>
        <h2 className="ud-title">Chi tiết người dùng</h2>
      </div>

      <div className="ud-info-card">
        <div className="ud-avatar">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="ud-info-content">
          <h3 className="ud-name">{user.name}</h3>
          <p className="ud-email">{user.email || 'Chưa có email'}</p>
          <div className="ud-roles">
            {user.roles && user.roles.map(role => (
              <span key={role} className={`ud-badge role-${role.toLowerCase()}`}>
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="ud-books-section">
        <h3 className="ud-section-title">
          <FiBookOpen /> Danh sách Sách / Tác phẩm ({books.length})
        </h3>
        
        {loading ? (
          <div className="ud-loading">Đang tải danh sách sách...</div>
        ) : books.length > 0 ? (
          <>
            <div className="books-grid-minimal">
              {books.map(book => (
                <BookCard key={book.id} book={book} showActions={true} />
              ))}
            </div>

            {totalPages > 0 && (
              <div className="ud-pagination">
                <button disabled={page <= 0} onClick={() => setPage(0)}>&laquo; Đầu</button>
                <button disabled={page <= 0} onClick={() => setPage(p => p - 1)}>Trước</button>
                <span>Trang {page + 1} / {totalPages}</span>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Sau</button>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)}>Cuối &raquo;</button>
              </div>
            )}
          </>
        ) : (
          <div className="ud-empty">
            Người dùng này chưa có tác phẩm nào.
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDetailView;
