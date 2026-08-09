import React from 'react';
import { FiPlus, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { useBookManagement } from '../../hooks/useBookManagement';
import BookCard from '../../components/BookCard/BookCard';
import Pagination from '../../components/Pagination/Pagination';
import recommendationService from '../../services/recommendationService';
import { getErrorMessage } from '../../services/apiClient';


function BookManagementPage({ isSubComponent = false }) {
  const [isTraining, setIsTraining] = React.useState(false);
  const {
    books,
    isLoading,
    error,
    page,
    setPage,
    totalPages,
    handleDeleteBook,
    navigate,
    ROUTES,
    keyword,
    setKeyword,
    handleSearchSubmit,
    status,
    setStatus
  } = useBookManagement();

  const handleTrainRecommender = async () => {
    if (window.confirm("Bạn có chắc chắn muốn tính toán lại hệ thống gợi ý? Quá trình này sẽ cập nhật các sách gợi ý mới nhất cho toàn bộ người dùng.")) {
      setIsTraining(true);
      try {
        await recommendationService.trainRecommender();
        alert("Cập nhật hệ thống gợi ý thành công!");
      } catch (error) {
        console.error("Recommender training error:", error);
        alert("Lỗi khi cập nhật gợi ý: " + getErrorMessage(error));
      } finally {
        setIsTraining(false);
      }
    }
  };

  return (
    <div className={`author-dashboard-page ${isSubComponent ? 'admin-sub-page' : 'container'}`}>
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1 className="admin-page-title">
            Quản lý sách
          </h1>
          <p className="admin-page-subtitle">
            Danh sách và quản lý các tác phẩm trong hệ thống
          </p>
        </div>

        <div className="admin-header-actions">
          <form className="admin-search-form" onSubmit={handleSearchSubmit}>
            <div className="admin-search-input-wrapper">
              <FiSearch className="admin-search-icon" />
              <input
                type="text"
                className="admin-search-input"
                placeholder="Tìm kiếm sách..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <button type="submit" className="admin-search-btn">Tìm kiếm</button>
          </form>

          <select
            className="admin-select-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="AVAILABLE">Hiển thị (AVAILABLE)</option>
            <option value="UNAVAILABLE">Đã ẩn (UNAVAILABLE)</option>
          </select>

          <button className="admin-action-btn primary" onClick={() => navigate(ROUTES.CREATE_BOOK)}>
            <FiPlus /> Mới
          </button>

          <button 
            className="admin-action-btn warning" 
            onClick={handleTrainRecommender} 
            disabled={isTraining}
          >
            <FiRefreshCw className={isTraining ? 'spin' : ''} /> {isTraining ? 'Đang tính toán...' : 'Cập nhật gợi ý'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="error-message">Không thể tải danh sách sách: {error}</div>
      ) : (
        <>
          <div className="books-grid-minimal">
            {books.length > 0 ? (
              books.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  showActions={true}
                  onDelete={() => handleDeleteBook(book.id, book.title, book.status)}
                />
              ))
            ) : (
              <div className="empty-state-minimal">
                Hãy upload sách!
              </div>
            )}
          </div>

          <Pagination
            currentPage={page + 1}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p - 1)}
          />
        </>
      )}
    </div>
  );
}

export default BookManagementPage;
