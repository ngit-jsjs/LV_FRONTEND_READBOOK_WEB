import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import authorService from '../../services/authorService';
import { FiTrash2, FiUser, FiEdit, FiX, FiSearch } from 'react-icons/fi';
import Pagination from '../../components/Pagination/Pagination';
import { getErrorMessage } from '../../services/apiClient';

function AuthorsPage({ isSubComponent = false }) {
  const { user } = useAuth();
  
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Search states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  // Edit Author Modal
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Create Author Form
  const [authName, setAuthName] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const fetchAuthors = async (searchVal = activeSearch, pageNum = page) => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (searchVal.trim()) {
        res = await authorService.searchAuthors(searchVal.trim(), pageNum - 1, 12);
      } else {
        res = await authorService.getAllAuthors(pageNum - 1, 12);
      }
      if (res.result) {
        setAuthors(res.result.content || []);
        setTotalPages(res.result.totalPages || 0);
      }
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors(activeSearch, page);
  }, [page, activeSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setActiveSearch(searchKeyword);
  };

  const handleDeleteAuth = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tác giả "${name}" không?`)) {
      try {
        await authorService.deleteAuthor(id);
        alert('Xóa tác giả thành công!');
        fetchAuthors(activeSearch, page);
      } catch (err) {
        console.error(err);
        alert(`Lỗi khi xóa tác giả: ${getErrorMessage(err)}`);
      }
    }
  };

  const handleEditAuthClick = (auth) => {
    setEditingAuthor(auth);
    setEditName(auth.name || '');
  };

  const handleUpdateAuthor = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      alert("Vui lòng điền tên tác giả!");
      return;
    }
    setEditSubmitting(true);
    try {
      const payload = {
        name: editName.trim()
      };
      await authorService.updateAuthor(editingAuthor.id, payload);
      alert('Cập nhật tác giả thành công!');
      setEditingAuthor(null);
      fetchAuthors(activeSearch, page);
    } catch (err) {
      console.error(err);
      alert(`Lỗi khi cập nhật tác giả: ${getErrorMessage(err)}`);
    } finally {
      setEditSubmitting(false);
    }
  };

  const closeEditModal = () => {
    setEditingAuthor(null);
  };

  const handleSaveAuthor = async (e) => {
    e.preventDefault();
    if (!authName.trim()) {
      alert("Vui lòng điền tên tác giả!");
      return;
    }
    setAuthSubmitting(true);
    try {
      const payload = {
        name: authName.trim()
      };
      await authorService.createAuthor(payload);
      alert('Thêm tác giả thành công!');
      setAuthName('');
      fetchAuthors(activeSearch, page);
    } catch (err) {
      console.error(err);
      alert(`Lỗi khi lưu tác giả: ${getErrorMessage(err)}`);
    } finally {
      setAuthSubmitting(false);
    }
  };

  return (
    <div className={isSubComponent ? '' : 'categories-page'}>
      {/* Header */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', color: '#fff', fontFamily: '"Noto Serif SC", serif' }}>
            Quản lý tác giả
          </h1>
          <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.95rem', margin: 0 }}>
            Thêm, sửa, xóa và cấu hình các tác giả trong hệ thống.
          </p>
        </div>
        <form className="um-search-form admin-search-form" onSubmit={handleSearchSubmit}>
          <div className="um-search-input-wrapper">
            <FiSearch className="um-search-icon" />
            <input
              type="text"
              className="um-search-input"
              placeholder="Tìm kiếm tác giả..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <button type="submit" className="um-search-btn">Tìm kiếm</button>
        </form>
      </div>

      {user?.isAdmin && (
        <div className="admin-category-container" style={{ marginBottom: '40px' }}>
          <div className="admin-category-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="admin-category-title">Thêm tác giả mới</h2>
            <form onSubmit={handleSaveAuthor}>
              <div className="admin-form-group">
                <label className="admin-label">
                  Tên tác giả <span className="admin-required">*</span>
                </label>
                <input
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="Nhập tên tác giả..."
                  required
                  className="admin-input"
                />
              </div>

              <button 
                type="submit" 
                className="um-search-btn admin-submit-btn"
                disabled={authSubmitting}
                style={{ width: '100%', marginTop: '16px' }}
              >
                {authSubmitting ? 'Đang thêm...' : 'Thêm tác giả'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="categories-loading">Đang tải danh sách tác giả...</div>
      ) : error ? (
        <div className="categories-error">
          {error}
        </div>
      ) : authors.length > 0 ? (
        <>
          <div className="categories-grid">
            {authors.map(auth => (
              <div 
                key={auth.id} 
                className="category-card"
              >
                <h3 className={`category-title ${user?.isAdmin ? 'admin-padded' : ''}`}>
                  <FiUser style={{ marginRight: '8px', verticalAlign: 'middle', color: 'var(--accent-purple)' }} />
                  {auth.name}
                </h3>

                {user?.isAdmin && (
                  <div className="category-actions">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEditAuthClick(auth); }}
                      className="category-action-btn edit"
                      title="Sửa tác giả"
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
          Hiện chưa có tác giả nào được tạo.
        </div>
      )}

      {/* Edit Author Modal */}
      {editingAuthor && (
        <div className="author-modal-overlay" onClick={closeEditModal}>
          <div className="auth-card modal-card-small" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeEditModal}
              className="modal-close-btn"
              title="Đóng"
            >
              <FiX />
            </button>
            
            <h3 className="auth-title modal-title-small">Sửa thông tin tác giả</h3>
            <p className="auth-subtitle modal-subtitle-small">Chỉnh sửa tên của tác giả</p>

            <form onSubmit={handleUpdateAuthor}>
              <div className="auth-form-group modal-form-group-last">
                <label className="auth-label modal-label-small">
                  Tên tác giả <span className="modal-label-required">*</span>
                </label>
                <div className="auth-input-wrapper">
                  <input
                    type="text"
                    className="auth-input modal-input-inner"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nhập tên tác giả"
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

export default AuthorsPage;
