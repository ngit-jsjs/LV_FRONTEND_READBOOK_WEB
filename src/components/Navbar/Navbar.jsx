import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdMenuBook } from 'react-icons/md';
import { FaCrown } from 'react-icons/fa';
import { FiUser, FiLogOut, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/routes';
import './Navbar.css';


function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  const isAuthorStudio = location.pathname.startsWith(ROUTES.AUTHOR_STUDIO);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`${ROUTES.SEARCH}?keyword=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
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
            <Link to={ROUTES.HOME} className="navbar-link active">Trang chủ</Link>
            <Link to={ROUTES.CATEGORIES} className="navbar-link">Thể loại</Link>
            <Link to={ROUTES.PREMIUM} className="navbar-link">Gói xu</Link>
            {user?.roles?.includes('AUTHOR') && (
              <Link to={ROUTES.AUTHOR_DASHBOARD} className="navbar-link">Sáng tác</Link>
            )}
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
  );
}

export default Navbar;
