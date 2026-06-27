import React from 'react';
import { FiArrowLeft, FiBookOpen, FiX } from 'react-icons/fi';
import BookCard from '../BookCard/BookCard';
import { useUserDetailView } from '../../hooks/useUserDetailView';

function UserDetailView({ user, onBack }) {
  if (!user) return null;

  const {
    books,
    loading,
    page,
    setPage,
    totalPages,
    handleDeleteBook,
    // Edit Book states/handlers
    editingBook,
    title,
    setTitle,
    author,
    setAuthor,
    publisher,
    setPublisher,
    year,
    setYear,
    status,
    setStatus,
    description,
    setDescription,
    setCoverFile,
    isSubmitting,
    handleEditClick,
    closeEditModal,
    handleSaveBook
  } = useUserDetailView(user);

  return (
    <div className="user-detail-view user-detail-view-container">
      <div className="ud-header ud-header-row">
        <button
          className="ud-back-btn"
          onClick={onBack}
        >
          <FiArrowLeft /> Quay lại danh sách
        </button>
        <h2 className="ud-title ud-title-text">Chi tiết người dùng</h2>
      </div>

      <div className="ud-info-card ud-info-card-container">
        <div className="ud-info-content">
          <h3 className="ud-name ud-name-text">{user.name}</h3>
          <p className="ud-email ud-email-text">{user.email || 'Chưa có email'}</p>
          <div className="ud-roles ud-roles-container">
            {user.roles && user.roles.map(role => (
              <span 
                key={role} 
                className={`ud-badge ud-badge-custom role-${role.toLowerCase()}`}
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="ud-books-section">
        <h3 className="ud-section-title ud-section-title-container">
          <FiBookOpen /> Danh sách Sách / Tác phẩm ({books.length})
        </h3>
        
        {loading ? (
          <div className="ud-loading ud-loading-text">Đang tải danh sách sách...</div>
        ) : books.length > 0 ? (
          <>
            <div className="books-grid-minimal search-books-grid ud-books-grid">
              {books.map(book => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  showActions={true} 
                  onDelete={() => handleDeleteBook(book.id, book.title)} 
                  onEdit={() => handleEditClick(book)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="ud-pagination ud-pagination-container">
                <button disabled={page <= 0} onClick={() => setPage(0)}>&laquo; Đầu</button>
                <button disabled={page <= 0} onClick={() => setPage(p => p - 1)}>Trước</button>
                <span className="ud-pagination-text">Trang {page + 1} / {totalPages}</span>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Sau</button>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)}>Cuối &raquo;</button>
              </div>
            )}
          </>
        ) : (
          <div className="ud-empty ud-empty-container">
            Người dùng này chưa có tác phẩm nào.
          </div>
        )}
      </div>

      {/* Book Edit Modal */}
      {editingBook && (
        <div className="author-modal-overlay" onClick={closeEditModal}>
          <div className="auth-card modal-edit-book" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeEditModal}
              title="Đóng"
              className="modal-close-btn"
            >
              <FiX />
            </button>
            
            <h3 className="auth-title modal-title-small">Sửa thông tin sách</h3>
            <p className="auth-subtitle modal-subtitle-small">Chỉnh sửa thông tin cơ bản của tác phẩm</p>

            <form onSubmit={handleSaveBook}>
              <div className="auth-form-group">
                <label className="auth-label">Tiêu đề sách <span className="modal-label-required">*</span></label>
                <div className="auth-input-wrapper">
                  <input
                    type="text"
                    className="auth-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nhập tiêu đề sách"
                    required
                  />
                </div>
              </div>

              <div className="auth-form-group modal-flex-row">
                <div className="modal-flex-child">
                  <label className="auth-label">Tác giả <span className="modal-label-required">*</span></label>
                  <div className="auth-input-wrapper">
                    <input
                      type="text"
                      className="auth-input"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Tên tác giả"
                      required
                    />
                  </div>
                </div>

                <div className="modal-flex-child">
                  <label className="auth-label">Nhà xuất bản</label>
                  <div className="auth-input-wrapper">
                    <input
                      type="text"
                      className="auth-input"
                      value={publisher}
                      onChange={(e) => setPublisher(e.target.value)}
                      placeholder="Nhà xuất bản"
                    />
                  </div>
                </div>
              </div>

              <div className="auth-form-group modal-flex-row">
                <div className="modal-flex-child">
                  <label className="auth-label">Năm xuất bản</label>
                  <div className="auth-input-wrapper">
                    <input
                      type="number"
                      className="auth-input"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="Năm xuất bản"
                    />
                  </div>
                </div>

                <div className="modal-flex-child">
                  <label className="auth-label">Trạng thái <span className="modal-label-required">*</span></label>
                  <div className="auth-input-wrapper modal-select-wrapper">
                    <select
                      className="auth-input modal-select-inner"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="UNAVAILABLE" className="modal-select-option">Chưa sẵn sàng (UNAVAILABLE)</option>
                      <option value="AVAILABLE" className="modal-select-option">Sẵn sàng (AVAILABLE)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="auth-form-group">
                <label className="auth-label">Ảnh bìa (Tùy chọn)</label>
                <div className="auth-input-wrapper">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files[0])}
                    className="modal-file-text"
                  />
                </div>
              </div>

              <div className="auth-form-group">
                <label className="auth-label">Mô tả truyện</label>
                <div className="modal-textarea-wrapper">
                  <textarea
                    className="auth-input modal-textarea-inner-tall"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả tóm tắt tác phẩm..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="auth-form-group modal-actions-row">
                <button
                  type="button"
                  className="auth-social-btn modal-cancel-btn"
                  onClick={closeEditModal}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="auth-submit-btn modal-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDetailView;
