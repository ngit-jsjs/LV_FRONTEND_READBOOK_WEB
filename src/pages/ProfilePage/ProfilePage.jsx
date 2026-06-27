import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/routes';

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN);
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="profile-page-wrapper">
      <div className="profile-card">
        <h2>Thông tin tài khoản</h2>
        
        <div className="profile-grid">
          <div className="profile-field">
            <label>ID</label>
            <input type="text" value={user.userId || user.id || ''} readOnly />
          </div>
          
          <div className="profile-field">
            <label>Role</label>
            <input type="text" value={user.roles ? user.roles.join(', ') : (user.isAdmin ? 'ADMIN' : 'USER')} readOnly />
          </div>
          
          <div className="profile-field">
            <label>Username</label>
            <input type="text" value={user.username || user.name || ''} readOnly />
          </div>
          
          <div className="profile-field">
            <label>Email</label>
            <input type="text" value={user.email || ''} readOnly />
          </div>
          
          <div className="profile-field full-width">
            <label>Họ tên</label>
            <input type="text" value={user.name || ''} readOnly />
          </div>

          <div className="profile-field full-width">
            <label>Số xu hiện có</label>
            <input type="text" value={`${user.amount || 0} xu`} readOnly />
          </div>

          <div className="profile-field full-width">
            <label>Trạng thái tài khoản</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
              {user.verified ? (
                <span style={{ color: '#10b981', fontSize: '0.95rem', fontWeight: '600' }}>
                  Đã xác thực email
                </span>
              ) : (
                <>
                  <span style={{ color: '#ef4444', fontSize: '0.95rem', fontWeight: '600' }}>
                    Chưa xác thực email
                  </span>
                  <Link 
                    to={`${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(user.email)}`} 
                    style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '600', background: '#eff6ff', padding: '6px 12px', borderRadius: '8px', border: '1px solid #bfdbfe', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#dbeafe'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#eff6ff'; }}
                  >
                    Xác thực ngay
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={() => navigate(ROUTES.PREMIUM)} className="profile-btn primary">Nạp xu</button>
          <button onClick={() => navigate(ROUTES.PROFILE_EDIT)} className="profile-btn secondary">Sửa thông tin</button>
          <button onClick={() => navigate(ROUTES.SUBSCRIPTIONS)} className="profile-btn secondary">Lịch sử giao dịch</button>
          <button onClick={() => navigate(ROUTES.RECENTLY_READ)} className="profile-btn secondary">Sách đọc gần đây</button>
          <button onClick={() => navigate(ROUTES.FOLLOWED_BOOKS)} className="profile-btn secondary">Danh sách theo dõi</button>
          <button 
            onClick={async () => {
              await logout();
              navigate(ROUTES.HOME);
            }} 
            className="profile-btn danger"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
