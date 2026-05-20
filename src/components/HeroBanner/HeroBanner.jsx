import { Link } from 'react-router-dom';
import { HiSparkles } from 'react-icons/hi';
import { MdMenuBook } from 'react-icons/md';
import { FaCrown } from 'react-icons/fa';
import './HeroBanner.css';

/**
 * HeroBanner - Banner chính trên trang chủ
 * 
 * Hiển thị tiêu đề lớn, mô tả, và 2 nút kêu gọi hành động.
 * Không cần props - nội dung cố định.
 */
function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="container">

        {/* Badge nhỏ */}
        <div className="hero-badge">
          <HiSparkles className="hero-badge-icon" />
          100+ triệu sách có sẵn
        </div>

        {/* Tiêu đề chính */}
        <h1 className="hero-title">
          Your story, 
          <span className="hero-title-highlight">anywhere</span>
        </h1>

        {/* Mô tả phụ */}
        <p className="hero-subtitle">
          Khám phá hàng triệu ebook và truyện. Đọc nội dung cao cấp từ các tác giả bán chạy và tài năng mới nổi.
        </p>

        {/* 2 nút CTA */}
        <div className="hero-buttons">
          <Link to="/browse" className="hero-btn-primary">
            <MdMenuBook />
            Bắt đầu đọc miễn phí →
          </Link>
          <Link to="/premium" className="hero-btn-secondary">
            <FaCrown />
            Khám phá các gói xu
          </Link>
        </div>

      </div>
    </section>
  );
}

export default HeroBanner;
