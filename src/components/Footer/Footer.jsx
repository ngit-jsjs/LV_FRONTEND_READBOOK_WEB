import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { ROUTES } from '../../config/routes';

/**
 * Footer - Chân trang tối giản
 * Bao gồm: Logo, mô tả và liên kết mạng xã hội (tất cả được căn giữa).
 */
function Footer() {
  return (
    <footer className="footer footer-custom">
      <div className="container">
        <div className="footer-brand footer-brand-custom">
          <Link to={ROUTES.HOME} className="footer-logo footer-logo-custom">
            ReadVerse
          </Link>
          <p className="footer-brand-desc footer-brand-desc-custom">
            Điểm đến hàng đầu của bạn cho việc đọc sách kỹ thuật số. Khám phá hàng triệu sách và truyện.
          </p>
          <div className="footer-social footer-social-custom">
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
    </footer>
  );
}

export default Footer;
