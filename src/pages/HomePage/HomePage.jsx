import { FiTrendingUp } from 'react-icons/fi';
import { FaRegHeart } from 'react-icons/fa';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import BookSection from '../../components/BookSection/BookSection';
import PremiumBanner from '../../components/PremiumBanner/PremiumBanner';
import RecommendCard from '../../components/RecommendCard/RecommendCard';
import './HomePage.css';

/**
 * HomePage - Trang chủ
 * 
 * Ghép tất cả các section lại:
 *   1. HeroBanner
 *   2. Trending Now (BookSection)
 *   3. PremiumBanner
 *   4. Recommended For You (RecommendCard)
 * 
 * Props:
 *   - trendingBooks: array   // Mảng sách trending (truyền vào BookSection)
 *   - recommendedBooks: array // Mảng sách đề xuất (truyền vào RecommendCard)
 */
function HomePage({ trendingBooks = [], recommendedBooks = [] }) {
  return (
    <div className="home-page">

      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Trending Now */}
      <BookSection
        title="Xu hướng"
        icon={<FiTrendingUp />}
        books={trendingBooks}
        viewAllLink="/trending"
      />

      {/* 3. Premium Banner */}
      <PremiumBanner />

      {/* 4. Recommended For You */}
      <section className="recommend-section">
        <div className="container">

          {/* Header */}
          <div className="recommend-section-header">
            <FaRegHeart className="recommend-section-icon" />
            <h2 className="recommend-section-title">Đề xuất cho bạn</h2>
          </div>

          {/* Grid các card */}
          <div className="recommend-section-grid">
            {recommendedBooks.length > 0 ? (
              recommendedBooks.map((book, index) => (
                <RecommendCard key={book.id || index} book={book} />
              ))
            ) : (
              <div className="recommend-section-empty">
                Chưa có sách đề xuất. Dữ liệu sẽ được tải từ API.
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}

export default HomePage;
