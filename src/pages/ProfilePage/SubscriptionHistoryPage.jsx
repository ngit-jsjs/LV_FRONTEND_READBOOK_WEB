import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import subscriptionService from '../../services/subscriptionService';
import { ROUTES } from '../../config/routes';
import { FiArrowLeft, FiActivity, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { FaCoins } from 'react-icons/fa';

import { getErrorMessage } from '../../services/apiClient';

function SubscriptionHistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN);
      return;
    }
    fetchSubscriptions();
  }, [user]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await subscriptionService.getMySubscriptions();
      if (res.result) {
        setSubscriptions(res.result);
      }
    } catch (err) {
      console.error("Lỗi khi tải lịch sử nạp xu:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="sub-history-container">
      {/* Header */}
      <div className="sub-history-header">
        <button 
          onClick={() => navigate(ROUTES.PROFILE)}
          className="sub-history-back-btn"
        >
          <FiArrowLeft /> Quay lại trang cá nhân
        </button>
        
        <h1 className="sub-history-title">
          <FiActivity style={{ color: 'var(--accent-purple, #8b5cf6)' }} /> Lịch sử mua gói xu
        </h1>
        <p className="sub-history-subtitle">
          Danh sách các gói xu bạn đã giao dịch qua cổng thanh toán VNPay
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="tx-loader-wrapper">Đang tải lịch sử...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : subscriptions.length > 0 ? (
        <div className="tx-table-responsive">
          <table className="tx-table">
            <thead>
              <tr>
                <th>Mã GD</th>
                <th>Gói xu</th>
                <th>Giá tiền</th>
                <th>Số xu nhận</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id}>
                  <td className="tx-id-cell">#{sub.id}</td>
                  <td className="tx-pkg-cell">{sub.planName}</td>
                  <td>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sub.planPrice)}
                  </td>
                  <td className="tx-coins-cell">
                    +{new Intl.NumberFormat('vi-VN').format(sub.planAmount)} <FaCoins style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
                  </td>
                  <td className="tx-date-cell">
                    {new Date(sub.createdAt).toLocaleDateString('vi-VN')} {new Date(sub.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>
                    {sub.status === 'COMPLETED' || sub.status === 'SUCCESS' ? (
                      <span className="tx-status-badge success">
                        <FiCheckCircle /> Thành công
                      </span>
                    ) : (
                      <span className="tx-status-badge failed">
                        <FiXCircle /> Thất bại
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p style={{ margin: 0 }}>Bạn chưa thực hiện bất kỳ giao dịch mua gói xu nào.</p>
        </div>
      )}

    </div>
  );
}

export default SubscriptionHistoryPage;

