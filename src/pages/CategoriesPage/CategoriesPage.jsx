import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCategories } from '../../hooks/useCategories';
import { FiTrash2, FiGrid, FiEdit, FiX } from 'react-icons/fi';

function CategoriesPage() {
  const { user } = useAuth();
  const {
    categories,
    loading,
    error,
    editingCategory,
    editName,
    setEditName,
    editDesc,
    setEditDesc,
    editSubmitting,
    handleDeleteCat,
    handleEditCatClick,
    handleUpdateCategory,
    closeEditModal
  } = useCategories();

  return (
    <div className="categories-page">
      {/* Header */}
      <div className="categories-header">
        <h1 className="categories-title">
          <FiGrid /> Danh sách Thể loại
        </h1>
        <p className="categories-subtitle">
          Khám phá và phân loại các tác phẩm theo bối cảnh, chủ đề nội dung
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="categories-loading">Đang tải danh sách thể loại...</div>
      ) : error ? (
        <div className="categories-error">
          {error}
        </div>
      ) : categories.length > 0 ? (
        <div className="categories-grid">
          {categories.map(cat => (
            <div 
              key={cat.id} 
              className="category-card"
            >
              <h3 className={`category-title ${user?.isAdmin ? 'admin-padded' : ''}`}>
                {cat.name}
              </h3>
              <p className="category-description">
                {cat.description || 'Chưa có mô tả cho thể loại này.'}
              </p>

              {user?.isAdmin && (
                <div className="category-actions">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleEditCatClick(cat); }}
                    className="category-action-btn edit"
                    title="Sửa thể loại"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteCat(cat.id, cat.name); }}
                    className="category-action-btn delete"
                    title="Xóa thể loại"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="categories-empty">
          Hiện chưa có thể loại nào được tạo.
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="author-modal-overlay" onClick={closeEditModal}>
          <div className="auth-card modal-card-small" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeEditModal}
              className="modal-close-btn"
              title="Đóng"
            >
              <FiX />
            </button>
            
            <h3 className="auth-title modal-title-small">Sửa thông tin thể loại</h3>
            <p className="auth-subtitle modal-subtitle-small">Chỉnh sửa tên và mô tả của thể loại</p>

            <form onSubmit={handleUpdateCategory}>
              <div className="auth-form-group modal-form-group">
                <label className="auth-label modal-label-small">
                  Tên thể loại <span className="modal-label-required">*</span>
                </label>
                <div className="auth-input-wrapper">
                  <input
                    type="text"
                    className="auth-input modal-input-inner"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nhập tên thể loại"
                    required
                  />
                </div>
              </div>

              <div className="auth-form-group modal-form-group-last">
                <label className="auth-label modal-label-small">
                  Mô tả thể loại
                </label>
                <div className="modal-textarea-wrapper">
                  <textarea
                    className="auth-input modal-textarea-inner"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Mô tả tóm tắt..."
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

export default CategoriesPage;
