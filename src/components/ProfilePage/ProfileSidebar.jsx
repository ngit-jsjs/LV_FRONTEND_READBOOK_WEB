import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiHeart, FiUnlock, FiShoppingBag, FiSettings, FiLogOut, FiUsers } from 'react-icons/fi';
import { MdOutlineMenuBook } from 'react-icons/md';
import { FaCrown, FaCoins } from 'react-icons/fa';
import { ROUTES } from '../../config/routes';

function ProfileSidebar({ user, handleLogout, activeTab, setActiveTab }) {
  const navigate = useNavigate();
  let menuItems = [
    { id: 'overview', icon: <FiUser />, label: 'Tổng quan' },
    // { id: 'reading-history', icon: <MdOutlineMenuBook />, label: 'Lịch sử đọc' },
    // { id: 'favorites', icon: <FiHeart />, label: 'Yêu thích' },
    // { id: 'unlocked', icon: <FiUnlock />, label: 'Đã mở khóa' },
    // { id: 'purchase', icon: <FiShoppingBag />, label: 'Lịch sử giao dịch' },
    { id: 'settings', icon: <FiSettings />, label: 'Cài đặt tài khoản' },
  ];

  if (user?.isAdmin) {
    menuItems.push({ id: 'user-management', icon: <FiUsers />, label: 'Quản lý người dùng' });
  }

  return (
    <aside className="profile-sidebar">
      <div className="profile-user-card">
        <h2 className="profile-name">{user?.name}</h2>
        <p className="profile-email">{user?.email}</p>
        <div className="sidebar-coin-widget">
          <div className="sidebar-coin-left">
            <div className="icon-wrapper gold">
              <FaCoins />
            </div>
            <div className="sidebar-coin-info">
              <div className="sidebar-coin-label">Xu của tôi</div>
              <div className="sidebar-coin-value">{user.amount || 0}</div>
            </div>
          </div>
        </div>
        <button className="recharge-btn sidebar-btn-full" onClick={() => navigate(ROUTES.PREMIUM)}>Nạp xu</button>
      </div>

      <nav className="profile-menu">
        {menuItems.map(item => (
          <button 
            key={item.id} 
            className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="menu-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
        
        <button className="menu-item logout-btn" onClick={handleLogout}>
          <span className="menu-icon"><FiLogOut /></span>
          Sign Out
        </button>
      </nav>
    </aside>
  );
}

export default ProfileSidebar;
