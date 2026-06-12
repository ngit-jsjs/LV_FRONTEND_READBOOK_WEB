import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/routes';

function ProfilePage() {
  const { user } = useAuth();
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
        </div>

        <div className="profile-actions">
          <button onClick={() => navigate(ROUTES.PREMIUM)} className="profile-btn primary">Nạp xu</button>
          <button onClick={() => navigate(ROUTES.PROFILE_EDIT)} className="profile-btn secondary">Sửa thông tin</button>
          <Link to={ROUTES.RECENTLY_READ} target="_blank" rel="noopener noreferrer" className="profile-btn info" style={{ textDecoration: 'none' }}>Sách đọc gần đây</Link>
          <Link to={ROUTES.FOLLOWED_BOOKS} target="_blank" rel="noopener noreferrer" className="profile-btn info" style={{ textDecoration: 'none' }}>Danh sách theo dõi</Link>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
