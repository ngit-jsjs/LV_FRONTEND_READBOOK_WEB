import React from 'react';
import { FiBookOpen } from 'react-icons/fi';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import BookSection from '../../components/BookSection/BookSection';
import PremiumBanner from '../../components/PremiumBanner/PremiumBanner';
import { useHomePage } from '../../hooks/useHomePage';
import './HomePage.css';

/**
 * HomePage - Trang chủ
 */
function HomePage() {
  const { trendingBooks, loading } = useHomePage();

  return (
    <div className="home-page">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Trending Now */}
      {!loading && (
        <BookSection
          title="1 số tác phẩm"
          icon={<FiBookOpen />}
          books={trendingBooks}
          viewAllLink="/search"
        />
      )}

      {/* 3. Premium Banner */}
      <PremiumBanner />
    </div>
  );
}

export default HomePage;

