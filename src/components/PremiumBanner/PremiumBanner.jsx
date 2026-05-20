import { Link } from 'react-router-dom';
import { FaCrown } from 'react-icons/fa';
import { MdMenuBook } from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';
import './PremiumBanner.css';

/**
 * PremiumBanner - Banner quảng cáo gói Premium
 * 
 * Hiển thị thông tin về Premium membership.
 * Không cần props - nội dung cố định.
 */
function PremiumBanner() {
  return (
    <section className="premium-banner">
      <div className="container">
        <div className="premium-banner-inner">

          {/* Badge */}
          <div className="premium-badge">
            <FaCrown className="premium-badge-icon" />
            Các gói thanh toán giá rẻ
          </div>

          {/* Tiêu đề */}
          <h2 className="premium-title">Mở khóa những chương truyện hấp dẫn</h2>

          {/* Mô tả */}
          <p className="premium-subtitle">
            Nạp xu để mở khóa các chương truyện,
            đọc sớm nội dung mới và tận hưởng trải nghiệm đọc mượt mà hơn.
          </p>

          {/* Features */}
          <div className="premium-features">
            <div className="premium-feature">
              <div className="premium-feature-icon">
                <MdMenuBook />
              </div>
              <div className="premium-feature-text">
                <div className="premium-feature-title">Truy cập độc quyền</div>
                <div className="premium-feature-desc">Nội dung độc đáo</div>
              </div>
            </div>

            <div className="premium-feature">
              <div className="premium-feature-icon">
                <HiSparkles />
              </div>
              <div className="premium-feature-text">
                <div className="premium-feature-title">Đọc sớm truyện mới</div>
                <div className="premium-feature-desc">Nạp xu ngay</div>
              </div>
            </div>
          </div>

          {/* Nút CTA */}
          <Link to="/premium" className="premium-cta-btn">
            Khám phá các gói xu
          </Link>

        </div>
      </div>
    </section>
  );
}

export default PremiumBanner;
