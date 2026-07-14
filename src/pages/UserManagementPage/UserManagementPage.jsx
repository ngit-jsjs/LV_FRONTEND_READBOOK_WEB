import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBookOpen } from 'react-icons/fi';
import { FaCoins } from 'react-icons/fa';
import { useUserManagement } from '../../hooks/useUserManagement';
import Pagination from '../../components/Pagination/Pagination';
import ActionButtons from '../../components/ActionButtons/ActionButtons';
import UserForm from '../../components/UserForm/UserForm';
import { ROUTES } from '../../config/routes';

function UserManagementPage({ isSubComponent = false }) {
  const {
    keyword, setKeyword,
    results, loading, error,
    page, setPage, totalPages,
    editingUser,
    handleSearchSubmit, handleDelete,
    handleEditClick, handleCloseEdit, handleEditSubmit
  } = useUserManagement();
  const navigate = useNavigate();

  return (
    <div className={isSubComponent ? '' : 'admin-page-wrapper'}>
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
              <h1 style={{ fontSize: '2.2rem', fontWeight: '800', margin: 0, color: '#fff', fontFamily: '"Noto Serif SC", serif' }}>
                Quản lý người dùng
              </h1>
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
                          <th>Trạng thái</th>
                          <th>Lịch sử</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map(user => (
                          <tr key={user.id}>
                            <td>{user.email || 'Chưa có email'}</td>
                            <td className="user-name-cell">{user.name}</td>
                            <td>
                              <span className={`ud-badge ${user.active !== false ? 'role-user' : 'role-admin'}`} style={{ textTransform: 'none' }}>
                                {user.active !== false ? 'Hoạt động' : 'Bị khóa'}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                <button
                                  onClick={() => navigate(ROUTES.ADMIN_USER_PAYMENT_HISTORY.replace(':userId', user.id))}
                                  style={{
                                    background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)',
                                    color: '#fbbf24', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
                                    fontSize: '0.8rem', fontWeight: '600', transition: 'all 0.2s', whiteSpace: 'nowrap',
                                    display: 'inline-flex', alignItems: 'center', gap: '6px'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(251, 191, 36, 0.2)'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(251, 191, 36, 0.1)'}
                                  title="Xem lịch sử nạp xu"
                                >
                                  <FaCoins /> Nạp xu
                                </button>
                                <button
                                  onClick={() => navigate(ROUTES.ADMIN_USER_CHAPTER_PURCHASES.replace(':userId', user.id))}
                                  style={{
                                    background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)',
                                    color: '#d8b4fe', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
                                    fontSize: '0.8rem', fontWeight: '600', transition: 'all 0.2s', whiteSpace: 'nowrap',
                                    display: 'inline-flex', alignItems: 'center', gap: '6px'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'}
                                  title="Xem lịch sử mua chương"
                                >
                                  <FiBookOpen /> Mua chương
                                </button>
                              </div>
                            </td>
                            <td>
                              <ActionButtons
                                onEdit={() => handleEditClick(user)}
                                onDelete={() => handleDelete(user)}
                                deleteTitle={user.active !== false ? 'Khóa' : 'Mở khóa'}
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

export default UserManagementPage;
