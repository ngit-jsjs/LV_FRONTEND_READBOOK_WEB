import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthorStudio } from '../../hooks/useAuthorStudio';
import { ROUTES } from '../../config/routes';
import { FiPlus, FiArrowLeft, FiLock, FiCheck, FiClock, FiX } from 'react-icons/fi';
import ActionButtons from '../../components/ActionButtons/ActionButtons';

function AuthorStudioPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const {
    loading,
    book,
    chapters,
    handleDelete,
    bookId,
    importing,
    handleImportEpub,
    // Quick Edit Popup exports
    editingChapter,
    editTitle,
    setEditTitle,
    editChapterNumber,
    setEditChapterNumber,
    editIsFree,
    setEditIsFree,
    editPrice,
    setEditPrice,
    editIsPublished,
    setEditIsPublished,
    editSubmitting,
    editError,
    handleEditClick,
    handleUpdateSubmit,
    closeEditModal
  } = useAuthorStudio();

  const handleAddNew = () => {
    navigate(ROUTES.AUTHOR_STUDIO_CHAPTER_NEW.replace(':bookId', bookId));
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImportEpub(file);
      e.target.value = null; // Reset file input
    }
  };

  if (loading) {
    return <div className="studio-page loading">Đang tải...</div>;
  }

  return (
    <div className="chapter-list-page">
      <div className="chapter-list-container">
        
        {/* Header Section */}
        <div className="chapter-list-header">
          <div className="header-left">
            <button className="btn-back-minimal" onClick={() => navigate(ROUTES.AUTHOR_DASHBOARD)}>
              <FiArrowLeft /> Quay lại Dashboard
            </button>
            <h1 className="header-title-author">Quản lý chương</h1>
            {book && <h2 className="header-subtitle">Tác phẩm: {book.title}</h2>}
          </div>
          
          <div className="header-right studio-header-right-actions">
            <input 
              type="file" 
              accept=".epub" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden-file-input" 
            />
            <button 
              className="btn-add-chapter btn-import-epub" 
              onClick={handleImportClick} 
              disabled={importing}
            >
              {importing ? "Đang import..." : "Import EPUB"}
            </button>
            <button className="btn-add-chapter" onClick={handleAddNew}>
              <FiPlus /> Thêm chương mới
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="chapter-table-wrapper">
          {chapters && chapters.length > 0 ? (
            <table className="chapter-table">
              <thead>
                <tr>
                  <th width="10%" className="col-center">Số chương</th>
                  <th width="40%">Tiêu đề</th>
                  <th width="15%" className="col-center">Trạng thái</th>
                  <th width="20%" className="col-center">Loại</th>
                  <th width="15%" className="col-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {chapters.map((chapter) => (
                  <tr key={chapter.id}>
                    <td className="col-center">
                      <span className="chapter-number-badge">Chương {chapter.chapterNumber}</span>
                    </td>
                    <td>
                      <span className="chapter-title">{chapter.title}</span>
                    </td>
                    <td className="col-center">
                      {chapter.isPublished ? (
                        <span className="status-badge published"><FiCheck /> Xuất bản</span>
                      ) : (
                        <span className="status-badge draft"><FiClock /> Bản nháp</span>
                      )}
                    </td>
                    <td className="col-center">
                      {chapter.isFree !== false ? (
                        <span className="type-badge free">Miễn phí</span>
                      ) : (
                        <span className="type-badge premium"><FiLock /> {chapter.price} Xu</span>
                      )}
                    </td>
                    <td className="col-center actions-cell">
                      <ActionButtons
                        onEdit={() => handleEditClick(chapter)}
                        onDelete={() => handleDelete(chapter.id)}
                        showText={false}
                        editTitle="Sửa chương"
                        deleteTitle="Xóa chương"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <h3>Chưa có chương nào</h3>
              <p>Tác phẩm của bạn hiện chưa có chương nào được thêm.</p>
              <button className="btn-add-chapter large" onClick={handleAddNew}>
                <FiPlus /> Thêm chương đầu tiên
              </button>
            </div>
          )}
        </div>
        
      </div>

      {/* Quick Edit Chapter Modal */}
      {editingChapter && (
        <div className="author-modal-overlay" onClick={closeEditModal}>
          <div className="auth-card modal-card-small" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeEditModal}
              title="Đóng"
              className="modal-close-btn"
            >
              <FiX />
            </button>
            
            <h3 className="auth-title modal-title-small">Chỉnh sửa chương</h3>
            <p className="auth-subtitle modal-subtitle-small">Cập nhật thông tin chi tiết của chương sách</p>

            {editError && (
              <div className="modal-error-banner">
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdateSubmit}>
              <div className="auth-form-group modal-form-group">
                <label className="auth-label modal-label-small">
                  Số chương <span className="modal-label-required">*</span>
                </label>
                <div className="auth-input-wrapper">
                  <input
                    type="number"
                    className="auth-input modal-input-inner"
                    value={editChapterNumber}
                    onChange={(e) => setEditChapterNumber(e.target.value)}
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="auth-form-group modal-form-group">
                <label className="auth-label modal-label-small">
                  Tiêu đề chương <span className="modal-label-required">*</span>
                </label>
                <div className="auth-input-wrapper">
                  <input
                    type="text"
                    className="auth-input modal-input-inner"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Nhập tiêu đề chương"
                    required
                  />
                </div>
              </div>

              <div className="auth-form-group modal-form-group">
                <label className="auth-label modal-label-small">
                  Loại chương <span className="modal-label-required">*</span>
                </label>
                <div className="modal-textarea-wrapper modal-select-wrapper">
                  <select
                    value={editIsFree ? 'free' : 'premium'}
                    onChange={(e) => setEditIsFree(e.target.value === 'free')}
                    className="modal-select-inner"
                  >
                    <option value="free" className="modal-select-option">Miễn phí</option>
                    <option value="premium" className="modal-select-option">Thu phí (Premium)</option>
                  </select>
                </div>
              </div>

              {!editIsFree && (
                <div className="auth-form-group modal-form-group">
                  <label className="auth-label modal-label-small">
                    Giá chương (Xu) <span className="modal-label-required">*</span>
                  </label>
                  <div className="auth-input-wrapper">
                    <input
                      type="number"
                      className="auth-input modal-input-inner"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      required
                      min="1"
                      placeholder="Nhập giá xu (ví dụ: 10)"
                    />
                  </div>
                </div>
              )}

              <div 
                className="auth-form-group modal-checkbox-row" 
                onClick={() => setEditIsPublished(!editIsPublished)}
              >
                <input
                  type="checkbox"
                  checked={editIsPublished}
                  onChange={(e) => setEditIsPublished(e.target.checked)}
                  className="modal-checkbox-input"
                />
                <label className="modal-checkbox-label">
                  Xuất bản ngay lập tức
                </label>
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
                  disabled={editSubmitting}
                >
                  {editSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuthorStudioPage;
