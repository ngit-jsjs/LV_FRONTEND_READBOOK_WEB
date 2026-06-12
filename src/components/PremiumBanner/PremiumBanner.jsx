import { Link } from 'react-router-dom';
import { FaCrown } from 'react-icons/fa';
import { MdMenuBook } from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';
import { ROUTES } from '../../config/routes';



function PremiumBanner() {
  return (
    <section className="premium-banner">
      <div className="container">
        <div className="premium-banner-inner">

          <div className="premium-badge">
            <FaCrown className="premium-badge-icon" />
            Các gói thanh toán giá rẻ
          </div>

          <h2 className="premium-title">Mở khóa chương truyện hấp dẫn</h2>

          <p className="premium-subtitle">
            Nạp xu để mở khóa các chương truyện,
            đọc sớm nội dung mới và tận hưởng trải nghiệm đọc mượt mà hơn.
          </p>

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

          <Link to="/premium" className="premium-cta-btn">
            Khám phá các gói xu
          </Link>

        </div>
      </div>
    </section>
  );
}

export default PremiumBanner;
