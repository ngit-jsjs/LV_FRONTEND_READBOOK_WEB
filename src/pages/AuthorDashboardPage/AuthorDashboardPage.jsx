import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit3, FiClock, FiImage, FiTrash2 } from 'react-icons/fi';
import { useAuthorDashboard } from '../../hooks/useAuthorDashboard';
import BookCard from '../../components/BookCard/BookCard';
import './AuthorDashboardPage.css';

function AuthorDashboardPage() {
  const {
    books,
    isLoading,
    page,
    setPage,
    totalPages,
    handleDeleteBook,
    navigate,
    ROUTES
  } = useAuthorDashboard();

  return (
    <div className="author-dashboard-page container">
      <div className="dashboard-header-minimal">
        <h1 className="dashboard-title-minimal">
          Tác phẩm của tôi <span className="book-count">({books.length})</span>
        </h1>
        <button className="btn-create-minimal" onClick={() => navigate(ROUTES.CREATE_BOOK)}>
          <FiPlus /> Mới
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải dữ liệu...</div>
      ) : (
        <>
          <div className="books-grid-minimal">
            {books.length > 0 ? (
              books.map(book => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  onDelete={() => handleDeleteBook(book.id, book.title)} 
                />
              ))
            ) : (
              <div className="empty-state-minimal">
                Bạn chưa có tác phẩm nào. Hãy bấm nút "Mới" để tạo tiểu thuyết đầu tiên nhé!
              </div>
            )}
          </div>
          
          {totalPages > 0 && (
            <div className="dashboard-pagination">
              <button disabled={page <= 0} onClick={() => setPage(0)}>&laquo; Đầu</button>
              <button disabled={page <= 0} onClick={() => setPage(p => p - 1)}>Trước</button>
              <span>Trang {page + 1} / {totalPages}</span>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Sau</button>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)}>Cuối &raquo;</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AuthorDashboardPage;
