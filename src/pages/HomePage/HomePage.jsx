import React from 'react';
import { FiFrown, FiCompass, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import BookCard from '../../components/BookCard/BookCard';
import Pagination from '../../components/Pagination/Pagination';
import { useSearchPage } from '../../hooks/useSearchPage';
import { useAuth } from '../../context/AuthContext';
import { useRecommendations } from '../../hooks/useRecommendations';

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
      const scrollAmount = 550; // 420px card width + 20px gap
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="home-page" style={{ background: 'var(--bg-secondary, #111328)', minHeight: '100vh' }}>

      <div className="container home-page-container" style={{ padding: '40px 24px' }}>

        {/* Recommendations Section */}
        {user && (
          <div className="recommendations-container" style={{ marginBottom: '40px', padding: '10px 0' }}>
            <h2 className="section-title home-section-title" style={{ 
              color: '#fff', 
              fontSize: '1.6rem', 
              fontWeight: '800', 
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              Sách gợi ý dành riêng cho bạn
            </h2>
            
            {recsLoading ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <div style={{ width: '30px', height: '30px', border: '3px solid rgba(139, 92, 246, 0.2)', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
                <p style={{ color: 'var(--text-muted, #6b6f80)', fontSize: '0.9rem' }}>Đang tải sách gợi ý...</p>
              </div>
            ) : recs.length > 0 && (
              <div className="recommendations-slider-wrapper" style={{ position: 'relative' }}>
                <button 
                  onClick={() => scroll('left')} 
                  className="btn-scroll-nav nav-prev"
                  title="Trước"
                >
                  <FiChevronLeft size={30} />
                </button>
                
                <div 
                  ref={scrollRef}
                  style={{ 
                    display: 'flex', 
                    overflowX: 'auto', 
                    gap: '20px', 
                    paddingBottom: '5px',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }} className="horizontal-scroll-container">
                  {recs.map((book, index) => (
                    <div key={book.id || index} style={{ width: '550px', flexShrink: 0 }} className="scroll-item-card">
                      <BookCard book={book} />
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
            <p style={{ 
              color: 'var(--text-muted, #6b6f80)', 
              fontSize: '0.8rem', 
              margin: '12px 0 0', 
              fontStyle: 'italic',
              opacity: 0.7
            }}>
              💡 Hãy siêng năng đánh giá sách đã đọc để hệ thống gợi ý sách phù hợp hơn cho bạn nhé!
            </p>
            <hr style={{ borderColor: 'rgba(255, 255, 255, 0.08)', margin: '30px 0 10px' }} />
          </div>
        )}

        {/* Section Title */}
        <h2 className="section-title home-section-title" style={{ 
          color: '#fff', 
          fontSize: '1.6rem', 
          fontWeight: '800', 
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <FiCompass style={{ color: 'var(--accent-purple, #8b5cf6)' }} />
          {keyword || author || publisher || year || categoryIds.length > 0 ? (
            <>Kết quả tìm kiếm phù hợp</>
          ) : (
            "Khám phá tác phẩm"
          )}
        </h2>

        {/* Results grid */}
        <div className="search-results-section home-search-results">
          {loading ? (
            <div className="search-empty" style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid rgba(139, 92, 246, 0.2)', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--text-muted, #6b6f80)' }}>Đang tìm kiếm...</p>
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
            <div className="search-empty" style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed var(--border-color)', borderRadius: '16px' }}>
              <FiFrown className="search-empty-icon" style={{ fontSize: '3rem', color: 'var(--text-muted, #6b6f80)', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>Không tìm thấy tác phẩm</h3>
              <p style={{ color: 'var(--text-muted, #6b6f80)', margin: 0 }}>Vui lòng thử lại với bộ lọc hoặc từ khóa khác.</p>
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
