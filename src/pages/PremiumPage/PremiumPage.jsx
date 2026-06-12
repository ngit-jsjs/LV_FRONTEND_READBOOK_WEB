import React from 'react';
import { FaCrown, FaCoins } from 'react-icons/fa';
import { MdInfoOutline } from 'react-icons/md';
import { FiX, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { usePremium } from '../../hooks/usePremium';

function PremiumPage() {
  const { user, addCoins } = useAuth();
  
  const {
    packages,
    showPaymentModal,
    selectedPackage,
    isProcessing,
    isSuccess,
    handleBuyClick,
    handleConfirmPayment,
    closePaymentModal
  } = usePremium(user, addCoins);

  return (
    <div className="premium-page">
      <div className="container">
        
        <div className="premium-header">
          <div className="premium-badge">
            <FaCrown className="premium-badge-icon" />
            Unlock unlimited reading
          </div>
          <h1 className="premium-title">
            Choose Your <span className="premium-title-highlight">Reading Plan</span>
          </h1>
          <p className="premium-subtitle">
            Get access to premium content, exclusive features, and unlimited stories
          </p>
        </div>

        <h2 className="premium-section-title">Chọn gói xu muốn nạp</h2>
        
        <div className="premium-cards-container">
          {packages.map(pkg => (
            <div key={pkg.id} className="premium-package-card">
              <div className="package-icon-wrapper">
                <FaCoins className="package-icon" />
              </div>
              <h3 className="package-name">{pkg.name}</h3>
              <p className="package-promo-text">Khuyến mãi lên tới</p>
              
              <div className="package-coins-info">
                <span className="package-coins-main">
                  {pkg.coins} <FaCoins className="coin-icon-small" />
                </span>
                <span className="package-coins-bonus">
                  {pkg.bonus} <FaCrown className="coin-icon-small" />
                </span>
                <MdInfoOutline className="package-info-icon" />
              </div>

              <div className="package-price">
                {pkg.price}
              </div>

              <button className="package-buy-btn" onClick={() => handleBuyClick(pkg)}>
                MUA GÓI
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* Simulated Checkout Modal */}
      {showPaymentModal && selectedPackage && (
        <div className="payment-modal-overlay" onClick={closePaymentModal}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <button className="payment-modal-close" onClick={closePaymentModal}>
              <FiX />
            </button>

            {!isSuccess ? (
              <>
                <h3 className="payment-modal-title">Thanh toán chuyển khoản QR</h3>
                <p className="payment-modal-subtitle">
                  Quét mã QR bằng ứng dụng ngân hàng của bạn hoặc chuyển khoản thủ công để nạp <strong>{selectedPackage.coins} xu</strong>.
                </p>

                <div className="payment-modal-body">
                  <div className="payment-qr-section">
                    <div className="payment-qr-box">
                      <div className="payment-qr-mock">
                        <div className="qr-corner top-left"></div>
                        <div className="qr-corner top-right"></div>
                        <div className="qr-corner bottom-left"></div>
                        <div className="qr-corner bottom-right"></div>
                        <div className="qr-scanner-line"></div>
                        <FaCoins className="qr-mock-coin" />
                        <span className="qr-text-label">RV_QR_CODE</span>
                      </div>
                    </div>
                    <span className="payment-qr-hint">Hỗ trợ tất cả ngân hàng Việt Nam (NAPAS)</span>
                  </div>

                  <div className="payment-details-section">
                    <div className="detail-row">
                      <span className="detail-label">Số tiền:</span>
                      <span className="detail-value amount">{selectedPackage.price}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Ngân hàng:</span>
                      <span className="detail-value">Techcombank (TCB)</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Số tài khoản:</span>
                      <span className="detail-value highlighted">1903 5299 4820 12</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Tên tài khoản:</span>
                      <span className="detail-value">CONG TY CP READVERSE VIET NAM</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Nội dung CK:</span>
                      <span className="detail-value highlighted copyable">
                        RV_COIN_{user?.userId || user?.id || 'USER'}_{selectedPackage.id}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="payment-modal-actions">
                  <button 
                    className="payment-modal-btn cancel" 
                    onClick={closePaymentModal}
                    disabled={isProcessing}
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    className="payment-modal-btn confirm" 
                    onClick={handleConfirmPayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Đang xác nhận..." : "Tôi đã chuyển khoản"}
                  </button>
                </div>
              </>
            ) : (
              <div className="payment-success-view">
                <FiCheckCircle className="success-icon animate-bounce" />
                <h3 className="success-title">Nạp xu thành công!</h3>
                <p className="success-desc">
                  Tài khoản của bạn đã được cộng thêm <strong>{parseInt(selectedPackage.coins.replace(/\D/g, '')) + parseInt(selectedPackage.bonus.replace(/\D/g, ''))} xu</strong> (bao gồm cả khuyến mãi).
                </p>
                <div className="success-coins-badge">
                  <FaCoins className="coin-icon premium-coin-icon-success" /> 
                  <span>+{parseInt(selectedPackage.coins.replace(/\D/g, '')) + parseInt(selectedPackage.bonus.replace(/\D/g, ''))} Xu</span>
                </div>
                <button className="payment-modal-btn success-close" onClick={closePaymentModal}>
                  Hoàn thành
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PremiumPage;
