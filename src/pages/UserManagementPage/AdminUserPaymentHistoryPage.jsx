import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import paymentService from '../../services/paymentService';
import userService from '../../services/userService';
import { ROUTES } from '../../config/routes';
import { FiArrowLeft, FiActivity, FiCheckCircle, FiXCircle, FiUser, FiBookOpen } from 'react-icons/fi';
import { FaCoins } from 'react-icons/fa';
import { getErrorMessage } from '../../services/apiClient';
import Pagination from '../../components/Pagination/Pagination';

function AdminUserPaymentHistoryPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [allPayments, setAllPayments] = useState([]); // Used to calculate summary stats
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId, page]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [paymentRes, userRes, allPaymentRes] = await Promise.all([
        paymentService.getAdminUserPaymentHistory(userId, page - 1, 10),
        userService.getUserById(userId).catch(() => null),
        paymentService.getAdminUserPaymentHistory(userId, 0, 1000).catch(() => ({ result: { content: [] } }))
      ]);

      if (paymentRes.result) {
        setPayments(paymentRes.result.content || []);
        setTotalPages(paymentRes.result.totalPages || 0);
      }

      if (allPaymentRes?.result) {
        setAllPayments(allPaymentRes.result.content || []);
      }

      if (userRes?.result) {
        setUserInfo(userRes.result);
      }
    } catch (err) {
      console.error("Lỗi khi tải lịch sử nạp xu của user:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getPrice = (p) => p.amount ?? 0;
  const getCoins = (p) => {
    // Parse from planName, e.g. "GÓI XU 199K" -> 199
    if (p.planName) {
      const match = p.planName.match(/\d+/);
      if (match) return parseInt(match[0]);
    }
    // Fallback: amount / 1000
    if (p.amount) return p.amount / 1000;
    return 0;
  };

  // PaymentStatus is SUCCESS, FAILED, PENDING, REFUNDED
  const totalAmount = allPayments
    .filter(p => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + getPrice(p), 0);

  const totalCoins = allPayments
    .filter(p => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + getCoins(p), 0);

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto', minHeight: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid var(--border-color, #1e293b)', paddingBottom: '20px' }}>
        <button 
          onClick={() => navigate(ROUTES.USER_MANAGEMENT)}
          style={{ 
            background: 'none', border: 'none', color: 'var(--text-muted, #94a3b8)', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', 
            fontSize: '0.95rem', padding: 0, marginBottom: '16px', transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted, #94a3b8)'}
        >
          <FiArrowLeft /> Quay lại quản lý người dùng
        </button>
        
        <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 8px 0', color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FiActivity style={{ color: 'var(--accent-purple, #8b5cf6)' }} /> Lịch sử nạp xu
        </h1>

        {/* User Info Badge */}
        {userInfo && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.25)',
            borderRadius: '12px', padding: '8px 16px', marginTop: '8px'
          }}>
            <FiUser style={{ color: '#8b5cf6' }} />
            <span style={{ color: '#fff', fontWeight: '600' }}>{userInfo.name || userInfo.username}</span>
            <span style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem' }}>({userInfo.email})</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <button
            onClick={() => navigate(ROUTES.ADMIN_USER_CHAPTER_PURCHASES.replace(':userId', userId))}
            style={{
              background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)',
              color: '#d8b4fe', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer',
              fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'; }}
          >
            <FiBookOpen /> Xem lịch sử mua chương
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      {!loading && !error && allPayments.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))',
            border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '16px', padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: '16px'
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiActivity style={{ fontSize: '22px', color: '#10b981' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>{allPayments.length}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted, #94a3b8)' }}>Tổng giao dịch</div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))',
            border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '16px', padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: '16px'
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '20px' }}>₫</span>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#3b82f6' }}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted, #94a3b8)' }}>Tổng tiền nạp (thành công)</div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(251, 191, 36, 0.05))',
            border: '1px solid rgba(251, 191, 36, 0.25)', borderRadius: '16px', padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: '16px'
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaCoins style={{ fontSize: '20px', color: '#fbbf24' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fbbf24' }}>
                {new Intl.NumberFormat('vi-VN').format(totalCoins)}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted, #94a3b8)' }}>Tổng xu nhận (thành công)</div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(139, 92, 246, 0.2)', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          Đang tải lịch sử...
        </div>
      ) : error ? (
        <div style={{ color: '#ef4444', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>
      ) : payments.length > 0 ? (
        <>
          <div style={{ overflowX: 'auto', background: 'rgba(17, 19, 40, 0.6)', border: '1px solid var(--border-color, #1e293b)', borderRadius: '16px', marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#fff' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color, #1e293b)', background: 'rgba(255, 255, 255, 0.02)' }}>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mã GD</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gói xu</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Giá tiền</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Số xu nhận</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Thời gian</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((sub) => (
                  <tr 
                    key={sub.id} 
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.04)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: 'var(--text-muted, #94a3b8)' }}>#{sub.id}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '600' }}>{sub.planName}</td>
                    <td style={{ padding: '16px 20px' }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(getPrice(sub))}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#fbbf24', fontWeight: '700' }}>
                      +{new Intl.NumberFormat('vi-VN').format(getCoins(sub))} <FaCoins style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.9rem' }}>
                      {new Date(sub.createdAt).toLocaleDateString('vi-VN')} {new Date(sub.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {sub.status === 'SUCCESS' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600' }}>
                          <FiCheckCircle /> Thành công
                        </span>
                      ) : sub.status === 'PENDING' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600' }}>
                          ⚠️ Chờ xử lý
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

          <Pagination 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed var(--border-color, #1e293b)', borderRadius: '16px' }}>
          <FiActivity size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted, #94a3b8)', margin: 0 }}>Người dùng này chưa thực hiện bất kỳ giao dịch nạp xu nào.</p>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default AdminUserPaymentHistoryPage;
