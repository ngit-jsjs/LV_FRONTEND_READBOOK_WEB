import React from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { useBookManagement } from '../../hooks/useBookManagement';
import BookCard from '../../components/BookCard/BookCard';
import Pagination from '../../components/Pagination/Pagination';


function BookManagementPage() {
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
    handleSearchSubmit
  } = useBookManagement();

  return (
    <div className="author-dashboard-page container">
      <div className="dashboard-header-minimal" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1 className="dashboard-title-minimal" style={{ margin: 0 }}>
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

          <button className="btn-create-minimal" onClick={() => navigate(ROUTES.CREATE_BOOK)}>
            <FiPlus /> Mới
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
