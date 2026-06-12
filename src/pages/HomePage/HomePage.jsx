import React, { useState, useEffect } from 'react';
import { FiSearch, FiFrown } from 'react-icons/fi';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import PremiumBanner from '../../components/PremiumBanner/PremiumBanner';
import BookCard from '../../components/BookCard/BookCard';
import Pagination from '../../components/Pagination/Pagination';
import { useSearchPage } from '../../hooks/useSearchPage';

function HomePage() {
  const {
    keyword,
    setKeyword,
    books,
    loading,
    page,
    setPage,
    totalPages
  } = useSearchPage();

  const [localKeyword, setLocalKeyword] = useState(keyword);

  useEffect(() => {
    setLocalKeyword(keyword);
  }, [keyword]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setKeyword(localKeyword);
    setPage(0);
  };

  const handleClear = () => {
    setLocalKeyword('');
    setKeyword('');
    setPage(0);
  };

  return (
    <div className="home-page">
      <HeroBanner />

      <div className="container home-page-container">
        <h2 className="section-title home-section-title">
          {keyword ? (
            <>Kết quả tìm kiếm cho <span className="highlight home-search-highlight">"{keyword}"</span></>
          ) : (
            "Khám phá tác phẩm"
          )}
        </h2>

        {/* Local Search Bar */}
        <form className="search-bar-container" onSubmit={handleSearchSubmit}>
          <FiSearch className="search-bar-icon" />
          <input
            type="text"
            className="search-bar-input"
            placeholder="Tìm tên tác phẩm, tác giả..."
            value={localKeyword}
            onChange={(e) => setLocalKeyword(e.target.value)}
          />
          {localKeyword && (
            <button 
              type="button" 
              className="search-bar-clear" 
              onClick={handleClear}
              title="Xóa tìm kiếm"
            >
              &times;
            </button>
          )}
        </form>

        {/* Results grid */}
        <div className="search-results-section home-search-results">
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

              <Pagination
                currentPage={page + 1}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p - 1)}
              />
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

      <PremiumBanner />
    </div>
  );
}

export default HomePage;
