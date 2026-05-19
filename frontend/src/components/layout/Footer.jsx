import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container footer-grid">
          {/* Brand */}
          <div className="footer-col footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-m">M</span>
              <span className="logo-text">-SHOP</span>
            </Link>
            <p className="footer-desc">
              Chuyên cung cấp mô hình lắp ráp Gunpla, Model Kit và phụ kiện chính hãng. 
              Đảm bảo chất lượng, giá cả cạnh tranh.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link" aria-label="Facebook"><FiFacebook size={20} /></a>
              <a href="#" className="social-link" aria-label="Instagram"><FiInstagram size={20} /></a>
              <a href="#" className="social-link" aria-label="YouTube"><FiYoutube size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-title">Liên kết nhanh</h4>
            <ul className="footer-links">
              <li><Link to="/san-pham">Tất cả sản phẩm</Link></li>
              <li><Link to="/danh-muc/gundam">Gundam</Link></li>
              <li><Link to="/danh-muc/model-kits">Model Kits</Link></li>
              <li><Link to="/danh-muc/dung-cu-vat-tu">Dụng cụ & Vật tư</Link></li>
              <li><Link to="/danh-muc/khuyen-mai">Khuyến mãi</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-col">
            <h4 className="footer-title">Hỗ trợ</h4>
            <ul className="footer-links">
              <li><Link to="/gioi-thieu">Giới thiệu</Link></li>
              <li><Link to="/faq">Câu hỏi thường gặp</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
              <li><Link to="/chinh-sach-doi-tra">Chính sách đổi trả</Link></li>
              <li><Link to="/chinh-sach-van-chuyen">Chính sách vận chuyển</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-title">Liên hệ</h4>
            <div className="footer-contact">
              <div className="contact-item">
                <FiPhone size={16} />
                <span>0901 234 567</span>
              </div>
              <div className="contact-item">
                <FiMail size={16} />
                <span>info@mshop.vn</span>
              </div>
              <div className="contact-item">
                <FiMapPin size={16} />
                <span>123 Nguyễn Huệ, Q.1, TP.HCM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© 2026 M-Shop. All rights reserved.</p>
          <div className="footer-payment">
            <span>Thanh toán:</span>
            <span className="payment-badge">COD</span>
            <span className="payment-badge">Bank</span>
            <span className="payment-badge">Momo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
