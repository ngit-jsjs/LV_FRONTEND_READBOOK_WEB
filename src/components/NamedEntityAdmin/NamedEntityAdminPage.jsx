import React from 'react';
import { FiEdit, FiX, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNamedEntityAdmin } from '../../hooks/useNamedEntityAdmin';
import Pagination from '../Pagination/Pagination';

/**
 * Admin screen for resources whose only editable field is a name
 * (authors, publishers). All labels are Vietnamese strings supplied by the
 * caller so the layout stays shared while the copy stays specific.
 */
function NamedEntityAdminPage({
  isSubComponent = false,
  service,
  label,
  icon: Icon,
  title,
  subtitle,
  editTitle,
  editSubtitle,
}) {
  const { user } = useAuth();
  const {
    items,
    loading,
    error,
    page,
    setPage,
    totalPages,
    searchKeyword,
    setSearchKeyword,
    handleSearchSubmit,
    editingItem,
    editName,
    setEditName,
    editSubmitting,
    handleEditClick,
    handleUpdate,
    closeEditModal,
    newName,
    setNewName,
    createSubmitting,
    handleCreate,
  } = useNamedEntityAdmin(service, label);

  return (
    <div className={isSubComponent ? 'admin-sub-page' : 'categories-page'}>
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1 className="admin-page-title">{title}</h1>
          <p className="admin-page-subtitle">{subtitle}</p>
        </div>
        <div className="admin-header-actions">
          <form className="admin-search-form" onSubmit={handleSearchSubmit}>
            <div className="admin-search-input-wrapper">
              <FiSearch className="admin-search-icon" />
              <input
                type="text"
                className="admin-search-input"
                placeholder={`Tìm kiếm ${label}...`}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <button type="submit" className="admin-search-btn">Tìm kiếm</button>
          </form>
        </div>
      </div>

      {user?.isAdmin && (
        <div className="admin-category-container" style={{ marginBottom: '40px' }}>
          <div className="admin-category-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="admin-category-title">Thêm {label} mới</h2>
            <form onSubmit={handleCreate}>
              <div className="admin-form-group">
                <label className="admin-label">
                  Tên {label} <span className="admin-required">*</span>
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={`Nhập tên ${label}...`}
                  required
                  className="admin-input"
                />
              </div>

              <button
                type="submit"
                className="um-search-btn admin-submit-btn"
                disabled={createSubmitting}
                style={{ width: '100%', marginTop: '16px' }}
              >
                {createSubmitting ? 'Đang thêm...' : `Thêm ${label}`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="categories-loading">Đang tải danh sách {label}...</div>
      ) : error ? (
        <div className="categories-error">
          {error}
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="categories-grid">
            {items.map(item => (
              <div key={item.id} className="category-card">
                <h3 className={`category-title ${user?.isAdmin ? 'admin-padded' : ''}`}>
                  <Icon style={{ marginRight: '8px', verticalAlign: 'middle', color: 'var(--accent-purple)' }} />
                  {item.name}
                </h3>

                {user?.isAdmin && (
                  <div className="category-actions">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}
                      className="category-action-btn edit"
                      title={`Sửa ${label}`}
                    >
                      <FiEdit size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages >= 1 && (
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
          Hiện chưa có {label} nào được tạo.
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="author-modal-overlay" onClick={closeEditModal}>
          <div className="auth-card modal-card-small" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeEditModal}
              className="modal-close-btn"
              title="Đóng"
            >
              <FiX />
            </button>

            <h3 className="auth-title modal-title-small">{editTitle}</h3>
            <p className="auth-subtitle modal-subtitle-small">{editSubtitle}</p>

            <form onSubmit={handleUpdate}>
              <div className="auth-form-group modal-form-group-last">
                <label className="auth-label modal-label-small">
                  Tên {label} <span className="modal-label-required">*</span>
                </label>
                <div className="auth-input-wrapper">
                  <input
                    type="text"
                    className="auth-input modal-input-inner"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder={`Nhập tên ${label}`}
                    required
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

export default NamedEntityAdminPage;
