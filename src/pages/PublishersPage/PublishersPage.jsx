import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import publisherService from '../../services/publisherService';
import { FiBookmark, FiEdit, FiX, FiSearch } from 'react-icons/fi';
import Pagination from '../../components/Pagination/Pagination';
import { getErrorMessage } from '../../services/apiClient';

function PublishersPage({ isSubComponent = false }) {
  const { user } = useAuth();
  
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Search states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  // Edit Publisher Modal
  const [editingPublisher, setEditingPublisher] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Create Publisher Form
  const [pubName, setPubName] = useState('');
  const [pubSubmitting, setPubSubmitting] = useState(false);

  const fetchPublishers = async (searchVal = activeSearch, pageNum = page) => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (searchVal.trim()) {
        res = await publisherService.searchPublishers(searchVal.trim(), pageNum - 1, 12);
      } else {
        res = await publisherService.getAllPublishers(pageNum - 1, 12);
      }
      if (res.result) {
        setPublishers(res.result.content || []);
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
    fetchPublishers(activeSearch, page);
  }, [page, activeSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setActiveSearch(searchKeyword);
  };

  const handleEditPubClick = (pub) => {
    setEditingPublisher(pub);
    setEditName(pub.name || '');
  };

  const handleUpdatePublisher = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      alert("Vui lòng điền tên nhà xuất bản!");
      return;
    }
    setEditSubmitting(true);
    try {
      const payload = {
        name: editName.trim()
      };
      await publisherService.updatePublisher(editingPublisher.id, payload);
      alert('Cập nhật nhà xuất bản thành công!');
      setEditingPublisher(null);
      fetchPublishers(activeSearch, page);
    } catch (err) {
      console.error(err);
      alert(`Lỗi khi cập nhật nhà xuất bản: ${getErrorMessage(err)}`);
    } finally {
      setEditSubmitting(false);
    }
  };

  const closeEditModal = () => {
    setEditingPublisher(null);
  };

  const handleSavePublisher = async (e) => {
    e.preventDefault();
    if (!pubName.trim()) {
      alert("Vui lòng điền tên nhà xuất bản!");
      return;
    }
    setPubSubmitting(true);
    try {
      const payload = {
        name: pubName.trim()
      };
      await publisherService.createPublisher(payload);
      alert('Thêm nhà xuất bản thành công!');
      setPubName('');
      fetchPublishers(activeSearch, page);
    } catch (err) {
      console.error(err);
      alert(`Lỗi khi lưu nhà xuất bản: ${getErrorMessage(err)}`);
    } finally {
      setPubSubmitting(false);
    }
  };

  return (
    <div className={isSubComponent ? '' : 'categories-page'}>
      {/* Header */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', color: '#fff', fontFamily: '"Noto Serif SC", serif' }}>
            Quản lý nhà xuất bản
          </h1>
          <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.95rem', margin: 0 }}>
            Thêm, sửa, xóa và cấu hình các nhà xuất bản trong hệ thống.
          </p>
        </div>
        <form className="um-search-form admin-search-form" onSubmit={handleSearchSubmit}>
          <div className="um-search-input-wrapper">
            <FiSearch className="um-search-icon" />
            <input
              type="text"
              className="um-search-input"
              placeholder="Tìm kiếm nhà xuất bản..."
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
            <h2 className="admin-category-title">Thêm nhà xuất bản mới</h2>
            <form onSubmit={handleSavePublisher}>
              <div className="admin-form-group">
                <label className="admin-label">
                  Tên nhà xuất bản <span className="admin-required">*</span>
                </label>
                <input
                  type="text"
                  value={pubName}
                  onChange={(e) => setPubName(e.target.value)}
                  placeholder="Nhập tên nhà xuất bản..."
                  required
                  className="admin-input"
                />
              </div>

              <button 
                type="submit" 
                className="um-search-btn admin-submit-btn"
                disabled={pubSubmitting}
                style={{ width: '100%', marginTop: '16px' }}
              >
                {pubSubmitting ? 'Đang thêm...' : 'Thêm nhà xuất bản'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="categories-loading">Đang tải danh sách nhà xuất bản...</div>
      ) : error ? (
        <div className="categories-error">
          {error}
        </div>
      ) : publishers.length > 0 ? (
        <>
          <div className="categories-grid">
            {publishers.map(pub => (
              <div 
                key={pub.id} 
                className="category-card"
              >
                <h3 className={`category-title ${user?.isAdmin ? 'admin-padded' : ''}`}>
                  <FiBookmark style={{ marginRight: '8px', verticalAlign: 'middle', color: 'var(--accent-purple)' }} />
                  {pub.name}
                </h3>

                {user?.isAdmin && (
                  <div className="category-actions">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEditPubClick(pub); }}
                      className="category-action-btn edit"
                      title="Sửa nhà xuất bản"
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
          Hiện chưa có nhà xuất bản nào được tạo.
        </div>
      )}

      {/* Edit Publisher Modal */}
      {editingPublisher && (
        <div className="author-modal-overlay" onClick={closeEditModal}>
          <div className="auth-card modal-card-small" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeEditModal}
              className="modal-close-btn"
              title="Đóng"
            >
              <FiX />
            </button>
            
            <h3 className="auth-title modal-title-small">Sửa thông tin NXB</h3>
            <p className="auth-subtitle modal-subtitle-small">Chỉnh sửa tên của nhà xuất bản</p>

            <form onSubmit={handleUpdatePublisher}>
              <div className="auth-form-group modal-form-group-last">
                <label className="auth-label modal-label-small">
                  Tên nhà xuất bản <span className="modal-label-required">*</span>
                </label>
                <div className="auth-input-wrapper">
                  <input
                    type="text"
                    className="auth-input modal-input-inner"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nhập tên nhà xuất bản"
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

export default PublishersPage;
