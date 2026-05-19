import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiGrid, FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import './MobileTabNav.css';

export default function MobileTabNav() {
  const location = useLocation();
  const cartContext = useCart();
  const cartCount = cartContext ? cartContext.cartCount : 0;

  return (
    <nav className="mobile-tab-nav">
      <Link to="/" className={`tab-item ${location.pathname === '/' ? 'active' : ''}`}>
        <FiHome size={20} />
        <span>Trang chủ</span>
      </Link>
      <Link to="/san-pham" className={`tab-item ${location.pathname === '/san-pham' ? 'active' : ''}`}>
        <FiGrid size={20} />
        <span>Sản phẩm</span>
      </Link>
      <Link to="/gio-hang" className={`tab-item ${location.pathname === '/gio-hang' ? 'active' : ''}`}>
        <div className="cart-icon-wrapper">
          <FiShoppingCart size={20} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
        <span>Giỏ hàng</span>
      </Link>
      <Link to="/tai-khoan" className={`tab-item ${location.pathname === '/tai-khoan' ? 'active' : ''}`}>
        <FiUser size={20} />
        <span>Tài khoản</span>
      </Link>
    </nav>
  );
}
