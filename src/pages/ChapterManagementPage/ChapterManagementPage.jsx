import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChapterManagement } from '../../hooks/useChapterManagement';
import { ROUTES } from '../../config/routes';
import { FiPlus, FiArrowLeft, FiLock, FiCheck, FiClock, FiX } from 'react-icons/fi';
import ActionButtons from '../../components/ActionButtons/ActionButtons';
import Pagination from '../../components/Pagination/Pagination';

function ChapterManagementPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedIds, setSelectedIds] = React.useState([]);

  const {
    loading,
    book,
    chapters,
    page,
    totalPages,
    handlePageChange,
    handleDelete,
    handleDeleteAll,
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
    closeEditModal,
    // Batch Update hook exports
    isBatchUpdating,
    setIsBatchUpdating,
    batchTarget,
    setBatchTarget,
    batchIds,
    setBatchIds,
    batchIsFreeMode,
    setBatchIsFreeMode,
    batchPrice,
    setBatchPrice,
    batchSubmitting,
    batchError,
    openBatchModal,
    closeBatchModal,
    handleBatchSubmit
  } = useChapterManagement();

  React.useEffect(() => {
    setSelectedIds([]);
  }, [chapters]);

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
            <button className="btn-back-minimal" onClick={() => navigate(ROUTES.BOOK_MANAGEMENT)}>
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
            <button 
              className="btn-add-chapter btn-batch-update" 
              onClick={() => openBatchModal(selectedIds)}
              style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
            >
              Cập nhật hàng loạt
            </button>
            {chapters && chapters.length > 0 && (
              <button 
                className="btn-add-chapter btn-delete-all" 
                onClick={handleDeleteAll} 
                style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
              >
                Xóa tất cả
              </button>
            )}
          </div>
        </div>

        {/* Selection Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="selection-action-bar" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            border: '1px solid rgba(37, 99, 235, 0.2)',
            borderRadius: '8px',
            padding: '12px 20px',
            marginBottom: '16px',
            animation: 'fadeIn 0.2s ease-in-out'
          }}>
            <span style={{ color: '#1e3a8a', fontWeight: '600', fontSize: '14px' }}>
              Đã chọn {selectedIds.length} chương. Hãy bấm "Cập nhật hàng loạt" để sửa đổi.
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn-add-chapter" 
                onClick={() => setSelectedIds([])}
                style={{ backgroundColor: '#64748b', color: '#ffffff', padding: '6px 12px', fontSize: '14px' }}
              >
                Hủy chọn
              </button>
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className="chapter-table-wrapper">
          {chapters && chapters.length > 0 ? (
            <table className="chapter-table">
              <thead>
                <tr>
                  <th width="5%" className="col-center">
                    <input 
                      type="checkbox"
                      checked={chapters.length > 0 && selectedIds.length === chapters.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(chapters.map(c => c.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', verticalAlign: 'middle' }}
                    />
                  </th>
                  <th width="15%" className="col-center">Số chương</th>
                  <th width="35%">Tiêu đề</th>
                  <th width="20%" className="col-center">Trạng thái</th>
                  <th width="12%" className="col-center">Loại</th>
                  <th width="13%" className="col-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {chapters.map((chapter) => (
                  <tr key={chapter.id}>
                    <td className="col-center">
                      <input 
                        type="checkbox"
                        checked={selectedIds.includes(chapter.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds([...selectedIds, chapter.id]);
                          } else {
                            setSelectedIds(selectedIds.filter(id => id !== chapter.id));
                          }
                        }}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', verticalAlign: 'middle' }}
                      />
                    </td>
                    <td className="col-center">
                      <span className="chapter-number-badge" style={{ whiteSpace: 'nowrap' }}>Chương {chapter.chapterNumber}</span>
                    </td>
                    <td>
                      <span className="chapter-title">{chapter.title}</span>
                    </td>
                    <td className="col-center">
                      {chapter.isPublished ? (
                        <span className="status-badge published" style={{ whiteSpace: 'nowrap' }}><FiCheck /> Sẵn sàng</span>
                      ) : (
                        <span className="status-badge draft" style={{ whiteSpace: 'nowrap' }}><FiClock /> Chưa sẵn sàng</span>
                      )}
                    </td>
                    <td className="col-center">
                      {chapter.isFree !== false ? (
                        <span className="type-badge free" style={{ whiteSpace: 'nowrap' }}>Miễn phí</span>
                      ) : (
                        <span className="type-badge premium" style={{ whiteSpace: 'nowrap' }}><FiLock /> {chapter.price} Xu</span>
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
              <p>Tác phẩm của bạn hiện chưa có chương nào được thêm. Hãy import chương từ file EPUB để bắt đầu.</p>
              <button 
                className="btn-add-chapter large btn-import-epub" 
                onClick={handleImportClick} 
                disabled={importing}
              >
                {importing ? "Đang import..." : "Import EPUB"}
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={page + 1}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        
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
                  Sẵn sàng ngay lập tức
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

      {/* Batch Update Chapters Modal */}
      {isBatchUpdating && (
        <div className="author-modal-overlay" onClick={closeBatchModal}>
          <div className="auth-card modal-card-small" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <button
              onClick={closeBatchModal}
              title="Đóng"
              className="modal-close-btn"
            >
              <FiX />
            </button>
            
            <h3 className="auth-title modal-title-small">Cập nhật hàng loạt chương</h3>
            <p className="auth-subtitle modal-subtitle-small">Áp dụng thay đổi hàng loạt trạng thái, loại chương cho tác phẩm</p>

            {batchError && (
              <div className="modal-error-banner">
                {batchError}
              </div>
            )}

            <form onSubmit={handleBatchSubmit}>
              {/* Phạm vi áp dụng */}
              <div className="auth-form-group modal-form-group">
                <label className="auth-label modal-label-small">
                  Phạm vi áp dụng <span className="modal-label-required">*</span>
                </label>
                <div className="modal-textarea-wrapper modal-select-wrapper">
                  <select
                    value={batchTarget}
                    onChange={(e) => setBatchTarget(e.target.value)}
                    className="modal-select-inner"
                  >
                    <option value="all" className="modal-select-option">Tất cả các chương</option>
                    {batchIds && batchIds.length > 0 && (
                      <option value="selected" className="modal-select-option">Các chương được chọn ({batchIds.length})</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Danh sách chương (khi chọn 'selected') */}
              {batchTarget === 'selected' && (
                <div className="auth-form-group modal-form-group">
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: 'rgba(37, 99, 235, 0.06)',
                    border: '1px dashed rgba(37, 99, 235, 0.2)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: 'var(--text-secondary, #cbd5e1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '8px'
                  }}>
                    <FiCheck style={{ color: '#22c55e', fontSize: '18px', flexShrink: 0 }} />
                    <span>Đang áp dụng cho <strong>{batchIds.length} chương</strong> đã tích chọn trong bảng.</span>
                  </div>
                </div>
              )}

              {/* Cập nhật Loại chương */}
              <div className="auth-form-group modal-form-group">
                <label className="auth-label modal-label-small">
                  Cập nhật loại chương
                </label>
                <div className="modal-textarea-wrapper modal-select-wrapper">
                  <select
                    value={batchIsFreeMode}
                    onChange={(e) => setBatchIsFreeMode(e.target.value)}
                    className="modal-select-inner"
                  >
                    <option value="keep" className="modal-select-option">-- Giữ nguyên hiện tại --</option>
                    <option value="free" className="modal-select-option">Miễn phí</option>
                    <option value="premium" className="modal-select-option">Thu phí (Premium)</option>
                  </select>
                </div>
              </div>

              {/* Giá chương (Premium) */}
              {(batchIsFreeMode === 'premium' || batchIsFreeMode === 'keep') && (
                <div className="auth-form-group modal-form-group">
                  <label className="auth-label modal-label-small" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Giá chương (Xu)</span>
                    {batchIsFreeMode === 'keep' && (
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'normal' }}>
                        (Chỉ áp dụng cho chương Premium)
                      </span>
                    )}
                  </label>
                  <div className="auth-input-wrapper">
                    <input
                      type="number"
                      className="auth-input modal-input-inner"
                      value={batchPrice}
                      onChange={(e) => setBatchPrice(e.target.value)}
                      min="1"
                      placeholder="Nhập giá xu (ví dụ: 10, để trống nếu không đổi)"
                    />
                  </div>
                </div>
              )}

              <div className="auth-form-group modal-actions-row" style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="auth-social-btn modal-cancel-btn"
                  onClick={closeBatchModal}
                  disabled={batchSubmitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="auth-submit-btn modal-submit-btn"
                  disabled={batchSubmitting}
                  style={{ backgroundColor: '#2563eb', flex: 1 }}
                >
                  {batchSubmitting ? 'Đang thực hiện...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChapterManagementPage;
