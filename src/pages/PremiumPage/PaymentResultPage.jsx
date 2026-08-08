import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/routes';
import { FiCheckCircle, FiXCircle, FiHome, FiClock } from 'react-icons/fi';

function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  
  const status = searchParams.get('status');
  const errorCode = searchParams.get('error');

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const isSuccess = status === 'success';

  return (
    <div className="payment-result-wrapper">
      <div className="payment-result-card">
        {isSuccess ? (
          <>
            <FiCheckCircle size={64} className="success" />
            <h2>Thanh toán thành công!</h2>
            <p>
              Giao dịch đã được xác nhận hoàn tất. Số xu đã được cộng trực tiếp vào tài khoản của bạn.
            </p>
          </>
        ) : (
          <>
            <FiXCircle size={64} className="failed" />
            <h2>Giao dịch thất bại!</h2>
            <p>
              Đã có lỗi xảy ra trong quá trình thanh toán (Mã lỗi: {errorCode || 'UNKNOWN'}). Vui lòng thử lại hoặc liên hệ quản trị viên.
            </p>
          </>
        )}

        <div className="payment-result-actions">
          <button 
            onClick={() => navigate(ROUTES.PROFILE)}
            className="payment-btn-action primary"
          >
            Về trang cá nhân
          </button>
          <button 
            onClick={() => navigate(ROUTES.TRANSACTION_HISTORY)}
            className="payment-btn-action secondary"
          >
            Xem lịch sử giao dịch
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentResultPage;

