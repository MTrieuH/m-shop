import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag, FiLock } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice, getImageUrl } from '../utils/helpers';
import './Cart.css';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const shippingFee = cartTotal >= 500000 ? 0 : 30000;

  const handleCheckout = () => {
    if (!user) {
      navigate('/dang-nhap?return=/thanh-toan');
      return;
    }
    navigate('/thanh-toan');
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <FiShoppingBag size={64} />
            <h2>Giỏ hàng trống</h2>
            <p>Hãy khám phá và thêm sản phẩm yêu thích vào giỏ hàng!</p>
            <Link to="/san-pham" className="btn btn-primary btn-lg">Tiếp tục mua sắm</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Giỏ Hàng ({items.length} sản phẩm)</h1>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <Link to={`/san-pham/${item.slug}`} className="cart-item-image">
                  <img 
                    src={getImageUrl(item.imageUrl)} 
                    alt={item.name} 
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/1a1a2e/22d3ee?text=M-Shop'; }}
                  />
                </Link>
                <div className="cart-item-info">
                  <Link to={`/san-pham/${item.slug}`} className="cart-item-name">{item.name}</Link>
                  <p className="cart-item-price">{formatPrice(item.price)}</p>
                </div>
                <div className="cart-item-qty">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><FiMinus size={16} /></button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= (item.maxQuantity || 999)}
                    style={{ opacity: item.quantity >= (item.maxQuantity || 999) ? 0.3 : 1 }}
                  ><FiPlus size={16} /></button>
                </div>
                <div className="cart-item-subtotal">{formatPrice(item.price * item.quantity)}</div>
                <button className="cart-item-remove" onClick={() => removeFromCart(item.id)} aria-label="Xóa"><FiTrash2 size={18} /></button>
              </div>
            ))}
            <div className="cart-actions-row">
              <Link to="/san-pham" className="btn btn-outline"><FiArrowLeft /> Tiếp tục mua sắm</Link>
              <button className="btn btn-outline" onClick={clearCart} style={{color:'var(--color-danger)', borderColor:'var(--color-danger)'}}>Xóa tất cả</button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <div className="summary-card">
              <h3 className="summary-title">Tóm Tắt Đơn Hàng</h3>
              <div className="summary-row"><span>Tạm tính</span><span>{formatPrice(cartTotal)}</span></div>
              <div className="summary-row"><span>Phí vận chuyển</span><span>{shippingFee === 0 ? <span className="free-ship">Miễn phí</span> : formatPrice(shippingFee)}</span></div>
              {shippingFee > 0 && <p className="ship-note">Miễn phí vận chuyển cho đơn từ 500.000₫</p>}
              <div className="summary-divider"></div>
              <div className="summary-row summary-total"><span>Tổng cộng</span><span>{formatPrice(cartTotal + shippingFee)}</span></div>
              <button onClick={handleCheckout} className="btn btn-accent btn-full btn-lg">
                {user ? 'Tiến hành thanh toán' : <><FiLock size={16} /> Đăng nhập để thanh toán</>}
              </button>
              {!user && <p className="checkout-login-hint">Bạn cần đăng nhập để tiến hành thanh toán. Giỏ hàng sẽ được giữ nguyên.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
