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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)', padding: '20px', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}>
      <div style={{ background: 'rgba(17, 19, 40, 0.85)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '24px', padding: '40px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)' }}>
        {isSuccess ? (
          <>
            <FiCheckCircle size={64} style={{ color: '#10b981', marginBottom: '24px' }} />
            <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: '800', margin: '0 0 12px 0' }}>Thanh toán thành công!</h2>
            <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 30px 0' }}>
              Giao dịch đã được xác nhận hoàn tất. Số xu đã được cộng trực tiếp vào tài khoản của bạn.
            </p>
          </>
        ) : (
          <>
            <FiXCircle size={64} style={{ color: '#ef4444', marginBottom: '24px' }} />
            <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: '800', margin: '0 0 12px 0' }}>Giao dịch thất bại!</h2>
            <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 30px 0' }}>
              Đã có lỗi xảy ra trong quá trình thanh toán (Mã lỗi: {errorCode || 'UNKNOWN'}). Vui lòng thử lại hoặc liên hệ quản trị viên.
            </p>
          </>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            onClick={() => navigate(ROUTES.PROFILE)}
            className="bd-btn primary"
            style={{ 
              width: '100%', 
              padding: '14px', 
              background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)', 
              border: 'none', 
              borderRadius: '12px', 
              color: '#fff', 
              fontWeight: '700', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <FiHome /> Về trang cá nhân
          </button>
          <button 
            onClick={() => navigate(ROUTES.TRANSACTION_HISTORY)}
            style={{ 
              width: '100%', 
              padding: '14px', 
              background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              borderRadius: '12px', 
              color: '#fff', 
              fontWeight: '600', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = '#8b5cf6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <FiClock /> Xem lịch sử giao dịch
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentResultPage;
