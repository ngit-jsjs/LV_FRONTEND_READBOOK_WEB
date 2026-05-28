import React, { useState } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiFileText } from 'react-icons/fi';
import { useUserManagement } from '../../hooks/useUserManagement';
import UserDetailView from './UserDetailView';
import './UserManagement.css';

function UserManagement() {
  const {
    keyword, setKeyword,
    results, loading, error,
    page, setPage, totalPages,
    editingUser, editForm, setEditForm,
    handleSearchSubmit, handleDelete,
    handleEditClick, handleCloseEdit, handleEditSubmit
  } = useUserManagement();

  const [showPassword, setShowPassword] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);

  if (viewingUser) {
    return <UserDetailView user={viewingUser} onBack={() => setViewingUser(null)} />;
  }

  return (
    <div className="user-management">
      <div className="um-header">
        <h2 className="um-title">Quản lý người dùng</h2>
        <form className="um-search-form" onSubmit={handleSearchSubmit}>
          <div className="um-search-input-wrapper">
            <FiSearch className="um-search-icon" />
            <input
              type="text"
              className="um-search-input"
              placeholder="Tìm kiếm theo tên..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <button type="submit" className="um-search-btn">Tìm kiếm</button>
        </form>
      </div>

      <div className="um-content">
        {loading ? (
          <div className="um-loading">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="um-error">{error}</div>
        ) : results.length > 0 ? (
          <>
            <div className="table-responsive">
              <table className="um-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(user => (
                    <tr key={user.id}>
                      <td>{user.email || 'Chưa có email'}</td>
                      <td className="user-name-cell">{user.name}</td>
                      <td>
                        <div className="um-actions">
                          <button
                            className="um-action-btn detail-btn"
                            onClick={() => setViewingUser(user)}
                            title="Chi tiết"
                          >
                            <FiFileText /> Chi tiết
                          </button>
                          <button
                            className="um-action-btn edit-btn"
                            onClick={() => handleEditClick(user)}
                            title="Sửa"
                          >
                            <FiEdit2 /> Sửa
                          </button>
                          <button
                            className="um-action-btn delete-btn"
                            onClick={() => handleDelete(user)}
                            title="Xóa"
                          >
                            <FiTrash2 /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 0 && (
              <div className="um-pagination">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(1)}
                  title="Trang Đầu"
                >
                  &laquo; Đầu
                </button>
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Trước
                </button>

                <span>Trang {page} / {totalPages}</span>

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Sau
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(totalPages)}
                  title="Trang Cuối"
                >
                  Cuối &raquo;
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="um-empty">Không tìm thấy người dùng nào.</div>
        )}
      </div>

      {/* Modal Sửa User */}
      {editingUser && (
        <div className="um-modal-overlay">
          <div className="um-modal">
            <h3 className="um-modal-title">Cập nhật tài khoản</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="um-modal-group">
                <label>Họ và Tên</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="um-modal-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="um-modal-group">
                <label>Mật khẩu mới (Tùy chọn)</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Để trống nếu không muốn đổi"
                    value={editForm.password || ''}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    className="password-input-field"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
              <div className="um-modal-actions">
                <button type="button" className="um-btn cancel" onClick={handleCloseEdit}>Hủy bỏ</button>
                <button type="submit" className="um-btn save">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
