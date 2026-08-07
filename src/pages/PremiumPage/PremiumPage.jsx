import React from 'react';
import { FaCrown, FaCoins, FaHistory } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePremium } from '../../hooks/usePremium';
import { ROUTES } from '../../config/routes';

function PremiumPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    packages,
    loading,
    error,
    isProcessing,
    handleBuyClick
  } = usePremium(user);

  return (
    <div className="premium-page">
      <div className="container">
        
        <div className="premium-header">
          <button
            onClick={() => navigate(ROUTES.TRANSACTION_HISTORY)}
            className="premium-history-btn"
          >
            <FaHistory /> Lịch sử giao dịch
          </button>

          {user && !user.verified && (
            <div className="premium-warning-banner">
              ⚠️ Tài khoản của bạn chưa được xác thực email. Vui lòng 
              <Link to={`${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(user.email)}`}>
                xác thực ngay
              </Link> 
              để thực hiện mua các gói xu.
            </div>
          )}

          <div className="premium-badge">
            <FaCrown />
            Nạp xu an toàn qua VNPay
          </div>
          <h1 className="premium-title">
            Chọn Gói <span className="premium-title-highlight">Nạp Xu</span>
          </h1>
          <p className="premium-subtitle">
            Sử dụng xu để mở khóa các chương truyện VIP, ủng hộ các tác giả bạn yêu thích và mở rộng tủ sách cá nhân.
          </p>
        </div>

        {loading ? (
          <div className="premium-loading">Đang tải danh sách gói xu...</div>
        ) : error ? (
          <div className="premium-error">{error}</div>
        ) : (
          <div className="premium-cards-container">
            {packages.map(pkg => (
              <div key={pkg.id} className="premium-package-card">
                <div className="package-icon-wrapper">
                  <FaCoins />
                </div>
                <h3 className="package-name">{pkg.name}</h3>
                <p className="package-desc">{pkg.description || 'Nạp xu cực hời để mở khóa thế giới truyện.'}</p>
                
                <div className="package-coins-info">
                  <span>{pkg.coins}</span>
                  <FaCoins />
                </div>

                <div className="package-price">
                  {pkg.price}
                </div>

                <button 
                  className="package-buy-btn" 
                  disabled={isProcessing}
                  onClick={() => handleBuyClick(pkg)}
                >
                  {isProcessing ? "Đang xử lý..." : "MUA GÓI XU"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PremiumPage;

