import { Link } from 'react-router-dom';
import { MdMenuBook } from 'react-icons/md';
import { FaCrown } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import './Navbar.css';


function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-inner">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon">
            <MdMenuBook />
          </span>
          ReadVerse
        </Link>

        {/* Menu giữa */}
        <div className="navbar-menu">
          <Link to="/" className="navbar-link active">Trang chủ</Link>
          <Link to="/browse" className="navbar-link">Khám phá</Link>
          <Link to="/categories" className="navbar-link">Thể loại</Link>
          <Link to="/premium" className="navbar-link">Gói xu</Link>
        </div>

        {/* Bên phải: avatar + nút premium */}
        <div className="navbar-right">
          <div className="navbar-avatar">
            <FiUser />
          </div>
          <Link to="/premium" className="navbar-premium-btn">
            <FaCrown />
            Khám phá gói xu
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
