import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFollowedBooks } from '../../hooks/useFollowedBooks';
import { ROUTES } from '../../config/routes';
import { FiArrowLeft, FiHeart, FiFolder, FiEdit, FiTrash2, FiPlus, FiFolderPlus } from 'react-icons/fi';
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

  if (!user) return null;

  const currentListName = bookLists.find(l => l.id === selectedListId)?.name || 'Chi tiết danh sách';

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
            style={{ marginBottom: '16px' }}
          >
            <FiArrowLeft /> Quay lại danh sách của tôi
          </button>
        )}
        
        {selectedListId ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <h1 className="followed-books-title">
                {currentListName}
              </h1>
              <p className="followed-books-subtitle">
                Xem các tác phẩm bạn đã lưu trong danh sách này
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleRenameList(selectedListId)}
                style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#a78bfa', cursor: 'pointer', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 14px', borderRadius: '8px', fontWeight: '600', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(167, 139, 250, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              >
                <FiEdit size={14} /> Sửa tên
              </button>
              <button
                onClick={() => handleDeleteList(selectedListId)}
                style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#f87171', cursor: 'pointer', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 14px', borderRadius: '8px', fontWeight: '600', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(248, 113, 113, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              >
                <FiTrash2 size={14} /> Xóa danh sách
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', width: '100%' }}>
            <div>
              <h1 className="followed-books-title">
                Danh sách theo dõi
              </h1>
              <p className="followed-books-subtitle">
                Theo dõi sát sao các tác phẩm yêu thích của bạn và nhận cập nhật mới nhất
              </p>
            </div>
            <button
              onClick={handleCreateList}
              style={{ 
                background: 'var(--accent-gradient, linear-gradient(135deg, #a78bfa, #7c3aed))', 
                border: 'none',
                color: '#fff', 
                padding: '10px 20px', 
                borderRadius: '12px', 
                fontWeight: '700', 
                fontSize: '0.95rem',
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)' 
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
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
          <div className="followed-books-empty">
            <FiHeart size={48} className="followed-books-empty-icon" />
            <h3 className="followed-books-empty-title">Chưa theo dõi tác phẩm nào</h3>
            <p className="followed-books-empty-desc">Danh sách theo dõi này của bạn hiện đang trống. Hãy thêm các tác phẩm bạn thích vào đây.</p>
            <Link to={ROUTES.HOME} className="bd-btn primary followed-books-discover-btn">Khám phá sách ngay</Link>
          </div>
        )
      ) : (
        /* View Booklists Grid Cards */
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
                    onClick={() => handleRenameList(list.id)} 
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
            <div className="followed-books-pagination" style={{ marginTop: '30px' }}>
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
      )}
    </div>
  );
}

export default FollowedBooksPage;
