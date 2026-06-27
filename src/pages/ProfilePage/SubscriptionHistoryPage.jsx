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
    <div style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', minHeight: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid var(--border-color, #1e293b)', paddingBottom: '20px' }}>
        <button 
          onClick={() => navigate(ROUTES.PROFILE)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-muted, #94a3b8)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '0.95rem', 
            padding: 0, 
            marginBottom: '16px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted, #94a3b8)'}
        >
          <FiArrowLeft /> Quay lại trang cá nhân
        </button>
        
        <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 8px 0', color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FiActivity style={{ color: 'var(--accent-purple, #8b5cf6)' }} /> Lịch sử mua gói xu
        </h1>
        <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.95rem', margin: 0 }}>
          Danh sách các gói xu bạn đã giao dịch qua cổng thanh toán VNPay
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Đang tải lịch sử...</div>
      ) : error ? (
        <div style={{ color: '#ef4444', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>
      ) : subscriptions.length > 0 ? (
        <div style={{ overflowX: 'auto', background: 'rgba(17, 19, 40, 0.6)', border: '1px solid var(--border-color, #1e293b)', borderRadius: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#fff' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color, #1e293b)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)' }}>Mã GD</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)' }}>Gói xu</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)' }}>Giá tiền</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)' }}>Số xu nhận</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)' }}>Thời gian</th>
                <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)' }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: 'var(--text-muted, #94a3b8)' }}>#{sub.id}</td>
                  <td style={{ padding: '16px 20px', fontWeight: '600' }}>{sub.planName}</td>
                  <td style={{ padding: '16px 20px' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sub.planPrice)}
                  </td>
                  <td style={{ padding: '16px 20px', color: '#fbbf24', fontWeight: '700' }}>
                    +{new Intl.NumberFormat('vi-VN').format(sub.planAmount)} <FaCoins style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.9rem' }}>
                    {new Date(sub.createdAt).toLocaleDateString('vi-VN')} {new Date(sub.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    {sub.status === 'COMPLETED' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600' }}>
                        <FiCheckCircle /> Thành công
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600' }}>
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
        <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed var(--border-color, #1e293b)', borderRadius: '16px' }}>
          <p style={{ color: 'var(--text-muted, #94a3b8)', margin: 0 }}>Bạn chưa thực hiện bất kỳ giao dịch mua gói xu nào.</p>
        </div>
      )}
    </div>
  );
}

export default SubscriptionHistoryPage;
