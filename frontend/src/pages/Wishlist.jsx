import { useWishlist } from '../contexts/WishlistContext';
import ProductCard from '../components/product/ProductCard';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import './Wishlist.css';

export default function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <div className="wishlist-page animate-fadeIn">
      <div className="container">
        <header className="wishlist-header">
          <FiHeart size={32} className="header-icon" />
          <h1 className="page-title">Sản Phẩm Yêu Thích</h1>
          <p className="page-subtitle">Danh sách các sản phẩm bạn đã lưu để xem sau</p>
        </header>

        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon-wrapper">
              <FiHeart size={64} />
            </div>
            <h2>Chưa có sản phẩm nào</h2>
            <p>Hãy thêm những bộ Model Kit bạn yêu thích vào đây nhé!</p>
            <Link to="/san-pham" className="btn btn-primary btn-lg">Khám phá sản phẩm</Link>
          </div>
        ) : (
          <div className="products-grid">
            {wishlist.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
