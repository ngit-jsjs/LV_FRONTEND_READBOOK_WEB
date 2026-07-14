import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCategories } from '../../hooks/useCategories';
import { FiTrash2, FiGrid, FiEdit, FiX } from 'react-icons/fi';
import Pagination from '../../components/Pagination/Pagination';

function CategoriesPage({ isSubComponent = false }) {
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
    closeEditModal,
    catName,
    setCatName,
    catDesc,
    setCatDesc,
    catSubmitting,
    handleSaveCategory,
    page,
    setPage,
    totalPages
  } = useCategories(true);

  return (
    <div className={isSubComponent ? '' : 'categories-page'}>
      {/* Header */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', color: '#fff', fontFamily: '"Noto Serif SC", serif' }}>
          Quản lý thể loại
        </h1>
        <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.95rem', margin: 0 }}>
          Thêm, sửa, xóa và cấu hình các danh mục thể loại tác phẩm.
        </p>
      </div>

      {user?.isAdmin && (
        <div className="admin-category-container" style={{ marginBottom: '40px' }}>
          <div className="admin-category-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="admin-category-title">Thêm thể loại mới</h2>
            <form onSubmit={handleSaveCategory}>
              <div className="admin-form-group">
                <label className="admin-label">
                  Tên thể loại <span className="admin-required">*</span>
                </label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="Ví dụ: Đô Thị, Tiên Hiệp, Huyền Huyễn..."
                  required
                  className="admin-input"
                />
              </div>
              <div className="admin-form-group-large">
                <label className="admin-label">
                  Mô tả thể loại
                </label>
                <textarea
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Mô tả tóm tắt nội dung/bối cảnh..."
                  rows={4}
                  className="admin-textarea"
                />
              </div>

              <button
                type="submit"
                className="um-search-btn admin-submit-btn"
                disabled={catSubmitting}
                style={{ width: '100%', marginTop: '16px' }}
              >
                {catSubmitting ? 'Đang thêm...' : 'Thêm thể loại'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="categories-loading">Đang tải danh sách thể loại...</div>
      ) : error ? (
        <div className="categories-error">
          {error}
        </div>
      ) : categories.length > 0 ? (
        <>
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

          {totalPages > 1 && (
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </>
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
