import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdMenuBook } from 'react-icons/md';
import { FaCrown, FaCoins } from 'react-icons/fa';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/routes';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthorClick = () => {
    navigate(ROUTES.BOOK_MANAGEMENT);
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
                <button className={`navbar-link ${location.pathname.startsWith('/admin/books') ? 'active' : ''}`} onClick={handleAuthorClick}>Quản lý sách</button>
              )}
              {user?.roles?.includes('ADMIN') && (
                <Link
                  to={ROUTES.ADMIN}
                  className={`navbar-link ${location.pathname === ROUTES.ADMIN ? 'active' : ''}`}
                >
                  Quản lí user
                </Link>
              )}
            </div>

            <div className="navbar-right">
              {user ? (
                <div className="navbar-user-actions">
                  <div className="navbar-coin-badge-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="navbar-coin-badge" title="Số xu của bạn">
                      <FaCoins className="coin-icon" />
                      <span>{user.amount || 0}</span>
                    </div>
                    <Link 
                      to={ROUTES.PREMIUM} 
                      className="navbar-recharge-btn"
                      style={{
                        padding: '4px 10px',
                        background: 'rgba(234, 179, 8, 0.1)',
                        border: '1px solid rgba(234, 179, 8, 0.3)',
                        borderRadius: '20px',
                        color: '#eab308',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(234, 179, 8, 0.2)';
                        e.currentTarget.style.borderColor = '#eab308';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(234, 179, 8, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(234, 179, 8, 0.3)';
                      }}
                    >
                      Nạp xu
                    </Link>
                  </div>
                  <Link to={ROUTES.PROFILE} className="navbar-user-profile">
                    <FiUser style={{ fontSize: '1.2rem' }} />
                    <span className="navbar-username">{user.name}</span>
                  </Link>
                  <button 
                    onClick={async () => {
                      await logout();
                      navigate(ROUTES.HOME);
                    }} 
                    className="navbar-logout-btn" 
                    title="Đăng xuất"
                  >
                    <FiLogOut />
                    <span>Đăng xuất</span>
                  </button>
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
