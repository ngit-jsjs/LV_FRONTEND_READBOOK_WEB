import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFollowedBooks } from '../../hooks/useFollowedBooks';
import { ROUTES } from '../../config/routes';
import { FiArrowLeft, FiHeart, FiFolder, FiEdit, FiTrash2, FiPlus, FiFolderPlus, FiX } from 'react-icons/fi';
import BookCard from '../../components/BookCard/BookCard';

function FollowedBooksPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    books,
    bookLists,
    loading,
    error,
    page,
    setPage,
    totalPages,
    selectedListId,
    setSelectedListId,
    handleUnfollow,
    handleCreateList,
    handleRenameList,
    handleDeleteList,
    bookListsPage,
    setBookListsPage,
    bookListsTotalPages
  } = useFollowedBooks(user);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' | 'rename'
  const [listIdToEdit, setListIdToEdit] = useState(null);
  const [listNameInput, setListNameInput] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);

  if (!user) return null;

  const currentListName = bookLists.find(l => l.id === selectedListId)?.name || 'Chi tiết danh sách';

  const openCreateModal = () => {
    setModalType('create');
    setListIdToEdit(null);
    setListNameInput('');
    setModalOpen(true);
  };

  const openRenameModal = (listId, currentName) => {
    setModalType('rename');
    setListIdToEdit(listId);
    setListNameInput(currentName || '');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setListNameInput('');
    setListIdToEdit(null);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!listNameInput.trim()) {
      alert("Vui lòng nhập tên danh sách!");
      return;
    }
    setModalSubmitting(true);
    try {
      let success = false;
      if (modalType === 'create') {
        success = await handleCreateList(listNameInput);
      } else {
        success = await handleRenameList(listIdToEdit, listNameInput);
      }
      if (success) {
        closeModal();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModalSubmitting(false);
    }
  };

  return (
    <div className="followed-books-page">
      {/* Header */}
      <div className="followed-books-header">
        {selectedListId && (
          <button 
            className="btn-back-profile" 
            onClick={() => {
              setSelectedListId(null);
              setPage(0);
            }}
          >
            <FiArrowLeft /> Quay lại danh sách của tôi
          </button>
        )}
        
        {selectedListId ? (
          <div className="followed-books-actions-row">
            <div>
              <h1 className="followed-books-title">
                {currentListName}
              </h1>
              <p className="followed-books-subtitle">
                Xem các tác phẩm bạn đã lưu trong danh sách này
              </p>
            </div>
            
            <div className="followed-books-btn-group">
              <button
                onClick={() => openRenameModal(selectedListId, currentListName)}
                className="followed-books-action-button rename"
              >
                <FiEdit size={14} /> Sửa tên
              </button>
              <button
                onClick={() => handleDeleteList(selectedListId)}
                className="followed-books-action-button delete"
              >
                <FiTrash2 size={14} /> Xóa danh sách
              </button>
            </div>
          </div>
        ) : (
          <div className="followed-books-actions-row">
            <div>
              <h1 className="followed-books-title">
                Danh sách theo dõi
              </h1>
              <p className="followed-books-subtitle">
                Theo dõi sát sao các tác phẩm yêu thích của bạn và nhận cập nhật mới nhất
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="btn-create-booklist"
            >
              <FiFolderPlus size={16} /> Tạo danh sách mới
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="followed-books-loading">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="followed-books-error">{error}</div>
      ) : selectedListId ? (
        /* View Books inside the selected list */
        books.length > 0 ? (
          <div>
            <div className="books-grid-minimal">
              {books.map((book) => (
                <BookCard 
                  key={book.id}
                  book={book}
                  showActions={true}
                  showEdit={false}
                  showManageChapters={false}
                  onDelete={() => handleUnfollow(book.id, book.title)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="followed-books-pagination">
                <button
                  className="followed-books-pagination-btn"
                  disabled={page === 0}
                  onClick={() => setPage(prev => prev - 1)}
                >
                  Trang trước
                </button>
                <span className="followed-books-pagination-info">
                  Trang {page + 1} / {totalPages}
                </span>
                <button
                  className="followed-books-pagination-btn"
                  disabled={page === totalPages - 1}
                  onClick={() => setPage(prev => prev + 1)}
                >
                  Trang sau
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <FiHeart size={48} />
            <h3>Chưa theo dõi tác phẩm nào</h3>
            <p>Danh sách theo dõi này của bạn hiện đang trống. Hãy thêm các tác phẩm bạn thích vào đây.</p>
            <Link to={ROUTES.HOME} className="profile-btn primary">Khám phá sách ngay</Link>
          </div>
        )
      ) : (
        /* View Booklists Grid Cards */
        bookLists.length > 0 ? (
          <div>
            <div className="booklists-grid">
              {bookLists.map((list) => (
                <div 
                  key={list.id} 
                  className="booklist-card" 
                  onClick={() => {
                    setPage(0);
                    setSelectedListId(list.id);
                  }}
                >
                  <div className="booklist-card-icon">
                    <FiFolder />
                  </div>
                  <h3 className="booklist-card-title">{list.name || 'Danh sách không tên'}</h3>
                  <p className="booklist-card-subtitle">Nhấp để mở xem danh sách</p>
                  
                  <div className="booklist-card-actions" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => openRenameModal(list.id, list.name)} 
                      className="booklist-action-btn edit"
                      title="Sửa tên danh sách"
                    >
                      <FiEdit size={13} /> Sửa
                    </button>
                    <button 
                      onClick={() => handleDeleteList(list.id)} 
                      className="booklist-action-btn delete"
                      title="Xóa danh sách"
                    >
                      <FiTrash2 size={13} /> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination for Book Lists */}
            {bookListsTotalPages > 0 && (
              <div className="followed-books-pagination booklists-grid-pagination">
                <button
                  className="followed-books-pagination-btn"
                  disabled={bookListsPage === 0}
                  onClick={() => setBookListsPage(prev => prev - 1)}
                >
                  Trang trước
                </button>
                <span className="followed-books-pagination-info">
                  Trang {bookListsPage + 1} / {bookListsTotalPages}
                </span>
                <button
                  className="followed-books-pagination-btn"
                  disabled={bookListsPage === bookListsTotalPages - 1}
                  onClick={() => setBookListsPage(prev => prev + 1)}
                >
                  Trang sau
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <FiFolder size={64} style={{ color: 'var(--accent-purple, #a78bfa)' }} />
            <h3>Chưa có danh sách theo dõi nào</h3>
            <p>
              Bạn chưa tạo danh sách theo dõi nào để lưu trữ tác phẩm. Hãy tạo một danh sách mới hoặc quay lại trang chủ để khám phá sách!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button 
                onClick={openCreateModal}
                className="profile-btn primary"
              >
                Tạo danh sách mới
              </button>
              <Link 
                to={ROUTES.HOME} 
                className="profile-btn secondary"
              >
                Khám phá sách ngay
              </Link>
            </div>
          </div>
        )
      )}

      {/* Modal tạo/đổi tên danh sách */}
      {modalOpen && (
        <div className="author-modal-overlay" onClick={closeModal}>
          <div className="auth-card modal-card-small" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="modal-close-btn"
              title="Đóng"
            >
              <FiX />
            </button>
            
            <h3 className="auth-title modal-title-small">
              {modalType === 'create' ? 'Tạo danh sách theo dõi mới' : 'Đổi tên danh sách'}
            </h3>
            <p className="auth-subtitle modal-subtitle-small">
              {modalType === 'create' ? 'Tạo danh sách để lưu các tác phẩm yêu thích của bạn' : 'Nhập tên mới cho danh sách này'}
            </p>

            <form onSubmit={handleModalSubmit}>
              <div className="auth-form-group modal-form-group-last">
                <label className="auth-label modal-label-small">
                  Tên danh sách <span className="modal-label-required">*</span>
                </label>
                <div className="auth-input-wrapper">
                  <input
                    type="text"
                    className="auth-input"
                    value={listNameInput}
                    onChange={(e) => setListNameInput(e.target.value)}
                    placeholder="Nhập tên danh sách..."
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="auth-form-group modal-actions-row">
                <button
                  type="button"
                  className="auth-social-btn modal-cancel-btn"
                  onClick={closeModal}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="auth-submit-btn modal-submit-btn"
                  disabled={modalSubmitting}
                >
                  {modalSubmitting ? 'Đang xử lý...' : (modalType === 'create' ? 'Tạo mới' : 'Lưu thay đổi')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FollowedBooksPage;

