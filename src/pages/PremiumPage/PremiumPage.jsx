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
    <div className="premium-page" style={{ padding: '60px 20px', minHeight: 'calc(100vh - 120px)', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', color: '#fff' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div className="premium-header" style={{ textAlign: 'center', marginBottom: '50px', position: 'relative' }}>
          <button
            onClick={() => navigate(ROUTES.TRANSACTION_HISTORY)}
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '10px 18px',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'var(--accent-purple, #8b5cf6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <FaHistory /> Lịch sử giao dịch
          </button>

          {user && !user.verified && (
            <div 
              className="premium-warning-banner" 
              style={{ 
                background: 'rgba(239, 68, 68, 0.15)', 
                border: '1px solid #ef4444', 
                color: '#fca5a5', 
                padding: '16px 24px', 
                borderRadius: '16px', 
                marginBottom: '32px', 
                textAlign: 'center',
                fontSize: '1rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)'
              }}
            >
              ⚠️ Tài khoản của bạn chưa được xác thực email. Vui lòng 
              <Link 
                to={`${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(user.email)}`} 
                style={{ color: '#fff', textDecoration: 'underline', fontWeight: '700', marginLeft: '4px' }}
              >
                xác thực ngay
              </Link> 
              để thực hiện mua các gói xu.
            </div>
          )}

          <div className="premium-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '16px' }}>
            <FaCrown />
            Nạp xu an toàn qua VNPay
          </div>
          <h1 className="premium-title" style={{ fontSize: '2.8rem', fontWeight: '800', margin: '0 0 12px 0', letterSpacing: '-0.025em' }}>
            Chọn Gói <span className="premium-title-highlight" style={{ color: '#8b5cf6', background: 'linear-gradient(to right, #a78bfa, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Nạp Xu</span>
          </h1>
          <p className="premium-subtitle" style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Sử dụng xu để mở khóa các chương truyện VIP, ủng hộ các tác giả bạn yêu thích và mở rộng tủ sách cá nhân.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '60px 0', fontSize: '1.1rem' }}>Đang tải danh sách gói xu...</div>
        ) : error ? (
          <div style={{ color: '#ef4444', textAlign: 'center', padding: '20px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        ) : (
          <div className="premium-cards-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '20px' }}>
            {packages.map(pkg => (
              <div 
                key={pkg.id} 
                className="premium-package-card" 
                style={{ 
                  background: 'rgba(17, 19, 40, 0.6)', 
                  border: '1px solid rgba(255, 255, 255, 0.05)', 
                  borderRadius: '24px', 
                  padding: '40px 24px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center', 
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = '#8b5cf6';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
                }}
              >
                <div className="package-icon-wrapper" style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(251, 191, 36, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                  <FaCoins style={{ color: '#fbbf24', fontSize: '30px' }} />
                </div>
                <h3 className="package-name" style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '800', margin: '0 0 10px 0' }}>{pkg.name}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0 0 24px 0', minHeight: '44px', lineHeight: '1.5' }}>{pkg.description || 'Nạp xu cực hời để mở khóa thế giới truyện.'}</p>
                
                <div className="package-coins-info" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '2.2rem', fontWeight: '800', color: '#fbbf24', marginBottom: '24px' }}>
                  <span>{pkg.coins}</span>
                  <FaCoins style={{ fontSize: '1.8rem' }} />
                </div>

                <div className="package-price" style={{ fontSize: '1.6rem', fontWeight: '700', color: '#fff', marginBottom: '32px' }}>
                  {pkg.price}
                </div>

                <button 
                  className="package-buy-btn" 
                  disabled={isProcessing}
                  onClick={() => handleBuyClick(pkg)}
                  style={{ 
                    width: '100%', 
                    padding: '15px 20px', 
                    background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)', 
                    border: 'none', 
                    borderRadius: '14px', 
                    color: '#fff', 
                    fontWeight: '700', 
                    fontSize: '1rem', 
                    cursor: 'pointer', 
                    transition: 'all 0.2s', 
                    marginTop: 'auto',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
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
