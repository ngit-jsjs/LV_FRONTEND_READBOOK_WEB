import React from 'react';
import { Link } from 'react-router-dom';
import { FiFrown, FiCompass, FiChevronLeft, FiChevronRight, FiImage, FiStar } from 'react-icons/fi';
import BookCard from '../../components/BookCard/BookCard';
import Pagination from '../../components/Pagination/Pagination';
import { useSearchPage } from '../../hooks/useSearchPage';
import { useAuth } from '../../context/AuthContext';
import { useRecommendations } from '../../hooks/useRecommendations';
import { getFormattedImageUrl } from '../../utils/imageUtils';
import { ROUTES } from '../../config/routes';

function HomePage() {
  const { user } = useAuth();
  const { recs, recsLoading } = useRecommendations();
  const scrollRef = React.useRef(null);
  const {
    keyword,
    author,
    publisher,
    year,
    categoryIds,
    books, loading,
    page, setPage, totalPages
  } = useSearchPage();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollAmount = 660; // scroll 3 vertical cards (200px each + 20px gap)
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="home-page">

      <div className="container home-page-container">

        {/* Recommendations Section */}
        {user && (
          <div className="recommendations-container">
            <h2 className="section-title home-section-title">
              Sách gợi ý dành riêng cho bạn
            </h2>
            
            {recsLoading ? (
              <div className="recs-loading-container">
                <div className="recs-loading-spinner" />
                <p className="recs-loading-text">Đang tải sách gợi ý...</p>
              </div>
            ) : recs.length > 0 && (
              <div className="recommendations-slider-wrapper">
                <button 
                  onClick={() => scroll('left')} 
                  className="btn-scroll-nav nav-prev"
                  title="Trước"
                >
                  <FiChevronLeft size={30} />
                </button>
                
                <div 
                  ref={scrollRef}
                  className="horizontal-scroll-container">
                  {recs.map((book, index) => (
                    <div key={book.id || index} className="rec-book-card-wrapper">
                      <Link to={ROUTES.BOOK_DETAIL.replace(':id', book.id)} className="rec-book-card">
                        <div className="rec-book-cover-container">
                          {getFormattedImageUrl(book.coverImage || book.coverImageUrl) ? (
                            <img 
                              src={getFormattedImageUrl(book.coverImage || book.coverImageUrl)} 
                              alt={book.title} 
                              className="rec-book-cover"
                            />
                          ) : (
                            <div className="rec-book-placeholder">
                              <FiImage size={36} />
                            </div>
                          )}
                        </div>
                        <div className="rec-book-info">
                          <h4 className="rec-book-title" title={book.title}>
                            {book.title}
                          </h4>
                          <p className="rec-book-author">
                            {book.author || 'Tác giả ẩn danh'}
                          </p>
                          <div className="rec-book-meta-row">
                            <span className="rec-book-rating">
                              <FiStar className="star-icon-filled" /> {Number(book.averageRating || 0) > 0 ? Number(book.averageRating).toFixed(1) : '4.5'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => scroll('right')} 
                  className="btn-scroll-nav nav-next"
                  title="Sau"
                >
                  <FiChevronRight size={24} />
                </button>
              </div>
            )}
            <p className="recommendations-hint">
              💡 Hãy siêng năng đánh giá sách đã đọc để hệ thống gợi ý sách phù hợp hơn cho bạn nhé!
            </p>
            <hr className="home-divider" />
          </div>
        )}

        {/* Section Title */}
        <h2 className="section-title home-section-title margin-bottom-24">
          <FiCompass className="home-section-icon" />
          {keyword || author || publisher || year || categoryIds.length > 0 ? (
            <>Kết quả tìm kiếm phù hợp</>
          ) : (
            "Khám phá tác phẩm"
          )}
        </h2>

        {/* Results grid */}
        <div className="search-results-section home-search-results">
          {loading ? (
            <div className="search-empty">
              <div className="search-loading-spinner" />
              <p className="search-loading-text">Đang tìm kiếm...</p>
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
            <div className="search-empty search-empty-dashed">
              <FiFrown className="search-empty-icon-custom" />
              <h3 className="search-empty-title">Không tìm thấy tác phẩm</h3>
              <p className="search-empty-desc">Vui lòng thử lại với bộ lọc hoặc từ khóa khác.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default HomePage;
