import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { FaCrown, FaCoins, FaRegClock } from 'react-icons/fa';
import { MdOutlineMenuBook } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import ProfileSidebar from '../../components/ProfilePage/ProfileSidebar';
import StatBox from '../../components/ProfilePage/StatBox';
import ProfileSettings from '../../components/ProfilePage/ProfileSettings';
import UserManagement from '../../components/ProfilePage/UserManagement';
import { ROUTES } from '../../config/routes';
import './ProfilePage.css';

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Nếu chưa đăng nhập, chuyển hướng về login
  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN);
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  // Menu items and logic have been moved to ProfileSidebar

  return (
    <div className="profile-page">
      <div className="container profile-container">

        {/* SIDEBAR */}
        <ProfileSidebar
          user={user}
          handleLogout={handleLogout}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* MAIN CONTENT */}
        <main className="profile-content">

          {activeTab === 'overview' && (
            <>
              {/* TOP CARDS */}


              {/* STATS ROW */}
              <div className="profile-stats-row">
                <StatBox
                  icon={<MdOutlineMenuBook />}
                  iconColor="blue"
                  num="Chưa có API"
                  label="Books Read"
                  trend="Chưa có API"
                  trendType="positive"
                />
                <StatBox
                  icon={<FiHeart />}
                  iconColor="purple"
                  num="Chưa có API"
                  label="Favorites"
                  trend="Chưa có API"
                  trendType="positive"
                />
                <StatBox
                  icon={<FaRegClock />}
                  iconColor="green"
                  num="Chưa có API"
                  label="Chapters"
                  trend="Chưa có API"
                  trendType="neutral"
                />
              </div>

              {/* CONTINUE READING */}
              <div className="continue-reading-section">
                <div className="section-header">
                  <div>
                    <h3 className="section-title">Continue Reading</h3>
                    <p className="section-subtitle">Pick up where you left off</p>
                  </div>
                  <button className="view-all-btn">View All &gt;</button>
                </div>

                <div className="reading-cards-grid">
                  <div className="no-api-text">Chưa có API</div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'settings' && (
            <ProfileSettings />
          )}

          {activeTab === 'user-management' && (
            <UserManagement />
          )}

        </main>
      </div>
    </div>
  );
}

export default ProfilePage;
