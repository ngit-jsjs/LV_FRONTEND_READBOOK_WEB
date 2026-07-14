import React from 'react';
import { FiPlus, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { useBookManagement } from '../../hooks/useBookManagement';
import BookCard from '../../components/BookCard/BookCard';
import Pagination from '../../components/Pagination/Pagination';
import recommendationService from '../../services/recommendationService';


function BookManagementPage({ isSubComponent = false }) {
  const [isTraining, setIsTraining] = React.useState(false);
  const {
    books,
    isLoading,
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
        // Bóc tách lỗi chi tiết từ apiClient hoặc response
        let errorMsg = "Không thể kết nối tới máy chủ";
        if (error.response?.data) {
          const data = error.response.data;
          errorMsg = data.message || data.result || JSON.stringify(data);
        } else if (error.message) {
          errorMsg = error.message;
        }
        alert("Lỗi khi cập nhật gợi ý: " + errorMsg);
      } finally {
        setIsTraining(false);
      }
    }
  };

  return (
    <div className={`author-dashboard-page ${isSubComponent ? '' : 'container'}`}>
      <div className="dashboard-header-minimal" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', margin: 0, color: '#fff', fontFamily: '"Noto Serif SC", serif' }}>
          Quản lý sách
        </h1>

        {/* Search bar inside header */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, justifyContent: 'flex-end', minWidth: '300px' }}>
          <form className="um-search-form admin-search-form" onSubmit={handleSearchSubmit} style={{ margin: 0, flex: 1, maxWidth: '400px' }}>
            <div className="um-search-input-wrapper">
              <FiSearch className="um-search-icon" />
              <input
                type="text"
                className="um-search-input"
                placeholder="Tìm kiếm sách..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <button type="submit" className="um-search-btn">Tìm kiếm</button>
          </form>

          {/* Trạng thái bộ lọc */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '8px 12px',
              borderRadius: '12px',
              color: '#fff',
              outline: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              height: '42px',
              boxSizing: 'border-box'
            }}
          >
            <option value="" style={{ background: '#1e1b4b', color: '#fff' }}>Tất cả trạng thái</option>
            <option value="AVAILABLE" style={{ background: '#1e1b4b', color: '#fff' }}>Hiển thị (AVAILABLE)</option>
            <option value="UNAVAILABLE" style={{ background: '#1e1b4b', color: '#fff' }}>Đã ẩn (UNAVAILABLE)</option>
          </select>

          <button className="btn-create-minimal" onClick={() => navigate(ROUTES.CREATE_BOOK)}>
            <FiPlus /> Mới
          </button>

          <button 
            className="btn-create-minimal" 
            onClick={handleTrainRecommender} 
            disabled={isTraining}
            style={{ 
              backgroundColor: '#e67e22', 
              borderColor: '#e67e22', 
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FiRefreshCw /> {isTraining ? 'Đang tính toán...' : 'Cập nhật gợi ý'}
          </button>
        </div>
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
                  showActions={true}
                  onDelete={() => handleDeleteBook(book.id, book.title)}
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
