import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdMenuBook } from 'react-icons/md';
import { FaCrown, FaPenFancy } from 'react-icons/fa';
import { FiUser, FiSearch, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { ROUTES } from '../../config/routes';
import './Navbar.css';


function Navbar() {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const isAuthorStudio = location.pathname.startsWith(ROUTES.AUTHOR_STUDIO);
  const isAuthor = user?.roles?.includes('AUTHOR');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`${ROUTES.SEARCH}?keyword=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleAuthorClick = () => {
    if (!user) {
      navigate(ROUTES.LOGIN);
      return;
    }
    if (isAuthor) {
      navigate(ROUTES.AUTHOR_DASHBOARD);
    } else {
      setShowAuthorModal(true);
    }
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await userService.upgradeToAuthor();
      if (res.code === 200 || res.result) {
        alert('Đăng ký tác giả thành công! Vui lòng đăng nhập lại để cập nhật quyền truy cập.');
        await logout();
        setShowAuthorModal(false);
        navigate(ROUTES.LOGIN);
      } else {
        alert('Có lỗi xảy ra, vui lòng thử lại.');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.result || 'Có lỗi xảy ra, vui lòng thử lại.';
      alert(errorMsg);
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <>
      <header className="header-wrapper">
        <nav className="navbar">
          <div className="container navbar-inner">

            {/* Logo */}
            <Link to={ROUTES.HOME} className="navbar-logo">
              <MdMenuBook className="navbar-logo-icon" />
              ReadVerse
            </Link>

            {/* Menu giữa */}
            <div className="navbar-menu">
              <Link to={ROUTES.HOME} className={`navbar-link ${location.pathname === ROUTES.HOME ? 'active' : ''}`}>Trang chủ</Link>
              <Link to={ROUTES.CATEGORIES} className={`navbar-link ${location.pathname === ROUTES.CATEGORIES ? 'active' : ''}`}>Thể loại</Link>
              <Link to={ROUTES.PREMIUM} className={`navbar-link ${location.pathname === ROUTES.PREMIUM ? 'active' : ''}`}>Gói xu</Link>
              <button className={`navbar-link ${location.pathname.startsWith('/author') ? 'active' : ''}`} onClick={handleAuthorClick}>Sáng tác</button>
            </div>

            {/* Bên phải: avatar + nút premium */}
            <div className="navbar-right">
              {user ? (
                <Link to={ROUTES.PROFILE} className="navbar-user-profile">
                  <FiUser style={{ fontSize: '1.2rem' }} />
                  <span className="navbar-username">{user.name}</span>
                </Link>
              ) : (
                <Link to={ROUTES.LOGIN} className="navbar-login-btn">
                  <FiUser /> Đăng nhập
                </Link>
              )}

              <Link to={ROUTES.PREMIUM} className="navbar-premium-btn">
                <FaCrown />
                Khám phá gói xu
              </Link>
            </div>

          </div>
        </nav>

        {/* Thanh tìm kiếm bên dưới - Ẩn ở trang Author Studio */}
        {!isAuthorStudio && (
          <div className="navbar-sub-search">
            <div className="container sub-search-container">
              <form className="navbar-search" onSubmit={handleSearch}>
                <FiSearch className="navbar-search-icon" />
                <input
                  type="text"
                  className="navbar-search-input"
                  placeholder="Tìm kiếm sách, tác giả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Modal yêu cầu trở thành tác giả */}
      {showAuthorModal && (
        <div className="author-modal-overlay" onClick={() => setShowAuthorModal(false)}>
          <div className="author-modal" onClick={(e) => e.stopPropagation()}>
            <button className="author-modal-close" onClick={() => setShowAuthorModal(false)}>
              <FiX />
            </button>
            <div className="author-modal-icon">
              <FaPenFancy />
            </div>
            <h3 className="author-modal-title">Trở thành Tác giả</h3>
            <p className="author-modal-desc">
              Bạn cần đăng ký trở thành tác giả để có thể sáng tác và xuất bản truyện trên ReadVerse.
            </p>
            <div className="author-modal-actions">
              <button className="author-modal-btn cancel" onClick={() => setShowAuthorModal(false)}>
                Để sau
              </button>
              <button className="author-modal-btn confirm" disabled={upgrading} onClick={handleUpgrade}>
                {upgrading ? 'Đang xử lý...' : 'Đăng ký ngay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
