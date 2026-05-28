import React, { useState, useEffect } from 'react';
import { FiSearch, FiFrown } from 'react-icons/fi';
import BookCard from '../../components/BookCard/BookCard';
import { useSearchPage } from '../../hooks/useSearchPage';
import './SearchPage.css';

/**
 * SearchPage
 */
function SearchPage() {
  const {
    keyword,
    setKeyword,
    books,
    loading,
    page,
    setPage,
    totalPages
  } = useSearchPage();

  const handleSearchChange = (e) => {
    setKeyword(e.target.value);
    setPage(0);
  };

  return (
    <div className="search-page container">
      <h1 className="search-page-title">
        Tìm kiếm tác phẩm <span className="highlight">"{keyword}"</span>
      </h1>



      <div className="search-results-section">
        {loading ? (
          <div className="search-empty">
            <p>Đang tìm kiếm...</p>
          </div>
        ) : books.length > 0 ? (
          <>
            <div className="books-grid-minimal search-books-grid">
              {books.map((book, index) => (
                <BookCard key={book.id || index} book={book} />
              ))}
            </div>

            {totalPages > 0 && (
              <div className="search-pagination">
                <button 
                  className="search-pagination-btn"
                  disabled={page <= 0} 
                  onClick={() => setPage(0)}
                >
                  &laquo; Đầu
                </button>
                <button 
                  className="search-pagination-btn"
                  disabled={page <= 0} 
                  onClick={() => setPage(p => p - 1)}
                >
                  Trước
                </button>
                
                <span className="search-pagination-info">Trang {page + 1} / {totalPages}</span>
                
                <button 
                  className="search-pagination-btn"
                  disabled={page >= totalPages - 1} 
                  onClick={() => setPage(p => p + 1)}
                >
                  Sau
                </button>
                <button 
                  className="search-pagination-btn"
                  disabled={page >= totalPages - 1} 
                  onClick={() => setPage(totalPages - 1)}
                >
                  Cuối &raquo;
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="search-empty">
            <FiFrown className="search-empty-icon" />
            <h3>Không tìm thấy tác phẩm</h3>
            <p>Vui lòng thử lại với từ khóa khác.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
