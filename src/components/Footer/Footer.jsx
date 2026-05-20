import { Link } from 'react-router-dom';
import { MdMenuBook } from 'react-icons/md';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
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
            <div className="footer-brand-logo">
              <span className="footer-brand-logo-icon">
                <MdMenuBook />
              </span>
              ReadVerse
            </div>
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

          {/* Cột 2: Company */}
          <div className="footer-column">
            <h4 className="footer-column-title">Company</h4>
            <div className="footer-column-links">
              <Link to="/about" className="footer-link">Giới thiệu</Link>
              <Link to="/careers" className="footer-link">Tuyển dụng</Link>
              <Link to="/press" className="footer-link">Truyền thông</Link>
              <Link to="/blog" className="footer-link">Blog</Link>
            </div>
          </div>

          {/* Cột 3: Support */}
          <div className="footer-column">
            <h4 className="footer-column-title">Support</h4>
            <div className="footer-column-links">
              <Link to="/help" className="footer-link">Trợ giúp</Link>
              <Link to="/contact" className="footer-link">Liên hệ</Link>
              <Link to="/privacy" className="footer-link">Chính sách quyền riêng tư</Link>
              <Link to="/terms" className="footer-link">Điều khoản dịch vụ</Link>
            </div>
          </div>

          {/* Cột 4: Features */}
          <div className="footer-column">
            <h4 className="footer-column-title">Features</h4>
            <div className="footer-column-links">
              <Link to="/premium" className="footer-link">Premium Subscription</Link>
              <Link to="/mobile" className="footer-link">Mobile App</Link>
              <Link to="/authors" className="footer-link">For Authors</Link>
              <Link to="/gift" className="footer-link">Gift Cards</Link>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          © 2026 ReadVerse. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;
