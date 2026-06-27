import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { useUserManagement } from '../../hooks/useUserManagement';
import Pagination from '../../components/Pagination/Pagination';
import ActionButtons from '../../components/ActionButtons/ActionButtons';
import UserForm from '../../components/UserForm/UserForm';

function AdminPage() {
  const {
    keyword, setKeyword,
    results, loading, error,
    page, setPage, totalPages,
    editingUser,
    handleSearchSubmit, handleDelete,
    handleEditClick, handleCloseEdit, handleEditSubmit
  } = useUserManagement();

  return (
    <div className="admin-page-wrapper">
      {editingUser ? (
        <div className="admin-edit-user-container">
          <h3 className="admin-heading-large">Cập nhật tài khoản</h3>
          <p className="admin-subheading-muted">Chỉnh sửa thông tin tài khoản người dùng</p>
          <UserForm
            initialData={editingUser}
            onSubmit={handleEditSubmit}
            onCancel={handleCloseEdit}
          />
        </div>
      ) : (
        <>
          {/* SECTION 1: USER MANAGEMENT */}
          <div className="admin-section">
            <div className="admin-section-header">
              <h1 className="admin-title">Quản lý người dùng</h1>
              <form className="um-search-form admin-search-form" onSubmit={handleSearchSubmit}>
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
                              <ActionButtons
                                onEdit={() => handleEditClick(user)}
                                onDelete={() => handleDelete(user)}
                                showText={true}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(p) => setPage(p)}
                  />
                </>
              ) : (
                <div className="um-empty">Không tìm thấy người dùng nào.</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminPage;
