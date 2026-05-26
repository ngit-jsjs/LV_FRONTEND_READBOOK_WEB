import { Link } from 'react-router-dom';
import { MdMenuBook } from 'react-icons/md';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { ROUTES } from '../../config/routes';
import './Footer.css';

/**
 * Footer - Chân trang
 * 
 * Bao gồm: Logo + mô tả, social links, 3 cột links, copyright.
 * Không cần props - nội dung cố định.
 */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">

        {/* Nội dung chính: 4 cột */}
        <div className="footer-content">

          {/* Cột 1: Thương hiệu */}
          <div className="footer-brand">
            <Link to={ROUTES.HOME} className="footer-logo">
              <span className="footer-logo-icon">
                <MdMenuBook />
              </span>
              ReadVerse
            </Link>
            <p className="footer-brand-desc">
              Điểm đến hàng đầu của bạn cho việc đọc sách kỹ thuật số. Khám phá hàng triệu sách và truyện.
            </p>
            <div className="footer-social">
              <a href="#" className="footer-social-link" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="footer-social-link" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="footer-social-link" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="footer-social-link" aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>

         
         
         

        </div>

        {/* Copyright */}
        <div className="footer-bottom">
        </div>

      </div>
    </footer>
  );
}

export default Footer;
