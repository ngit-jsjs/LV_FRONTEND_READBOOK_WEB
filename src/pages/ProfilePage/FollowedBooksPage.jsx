import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFollowedBooks } from '../../hooks/useFollowedBooks';
import { ROUTES } from '../../config/routes';
import { FiArrowLeft, FiHeart } from 'react-icons/fi';
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
    handleUnfollow
  } = useFollowedBooks(user);

  if (!user) return null;

  return (
    <div className="followed-books-page">
      {/* Header */}
      <div className="followed-books-header">
        <button 
          className="btn-back-profile" 
          onClick={() => navigate(ROUTES.PROFILE)}
        >
          <FiArrowLeft /> Quay lại trang cá nhân
        </button>
        
        <h1 className="followed-books-title">
          <FiHeart className="followed-books-title-icon" /> Danh sách theo dõi
        </h1>
        <p className="followed-books-subtitle">
          Theo dõi sát sao các tác phẩm yêu thích của bạn và nhận cập nhật mới nhất
        </p>

        {bookLists.length > 0 && (
          <div className="followed-books-list-tabs">
            {bookLists.map((list) => (
              <button
                key={list.id}
                type="button"
                className={`followed-books-list-tab ${selectedListId === list.id ? 'active' : ''}`}
                onClick={() => {
                  setPage(0);
                  setSelectedListId(list.id);
                }}
              >
                {list.name || 'Danh sach khong ten'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="followed-books-loading">Đang tải danh sách...</div>
      ) : error ? (
        <div className="followed-books-error">
          {error}
        </div>
      ) : books.length > 0 ? (
        <div>
          {/* Sách Grid */}
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
          {totalPages > 1 && (
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
          <p className="followed-books-empty-desc">Danh sách theo dõi của bạn hiện đang trống. Hãy thêm các tác phẩm bạn thích vào đây.</p>
          <Link to={ROUTES.HOME} className="bd-btn primary followed-books-discover-btn">Khám phá sách ngay</Link>
        </div>
      )}
    </div>
  );
}

export default FollowedBooksPage;
