import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdMenuBook } from 'react-icons/md';
import { FaCrown, FaCoins } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/routes';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthorClick = () => {
    navigate(ROUTES.AUTHOR_DASHBOARD);
  };

  return (
    <>
      <header className="header-wrapper">
        <nav className="navbar">
          <div className="container navbar-inner">

            <Link to={ROUTES.HOME} className="navbar-logo">
              <MdMenuBook className="navbar-logo-icon" />
              ReadVerse
            </Link>

            <div className="navbar-menu">
              <Link to={ROUTES.HOME} className={`navbar-link ${location.pathname === ROUTES.HOME ? 'active' : ''}`}>Trang chủ</Link>
              <Link to={ROUTES.CATEGORIES} className={`navbar-link ${location.pathname === ROUTES.CATEGORIES ? 'active' : ''}`}>Thể loại</Link>
              {user?.roles?.includes('ADMIN') && (
                <button className={`navbar-link ${location.pathname.startsWith('/author') ? 'active' : ''}`} onClick={handleAuthorClick}>Quản lý sách</button>
              )}
              {user?.roles?.includes('ADMIN') && (
                <Link
                  to={ROUTES.ADMIN}
                  className={`navbar-link ${location.pathname === ROUTES.ADMIN ? 'active' : ''}`}
                >
                  Admin
                </Link>
              )}
            </div>

            <div className="navbar-right">
              {user ? (
                <div className="navbar-user-actions">
                  <div className="navbar-coin-badge" title="Số xu của bạn">
                    <FaCoins className="coin-icon" />
                    <span>{user.amount || 0}</span>
                  </div>
                  <Link to={ROUTES.PROFILE} className="navbar-user-profile">
                    <FiUser style={{ fontSize: '1.2rem' }} />
                    <span className="navbar-username">{user.name}</span>
                  </Link>
                </div>
              ) : (
                <Link to={ROUTES.LOGIN} className="navbar-login-btn">
                  <FiUser /> Đăng nhập
                </Link>
              )}
            </div>

          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
