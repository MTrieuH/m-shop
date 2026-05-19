import { memo } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiHeart } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { formatPrice, calcDiscount, getImageUrl } from '../../utils/helpers';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const discount = calcDiscount(product.price, product.originalPrice);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link to={product.slug ? `/san-pham/${product.slug}` : '#'} className="product-card" id={`product-${product.id}`} onClick={(e) => !product.slug && e.preventDefault()}>
      <div className="product-card-image">
        <img 
          src={getImageUrl(product.imageUrl)} 
          alt={product.name} 
          loading="lazy" 
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = `https://placehold.co/600x600/1e293b/cbd5e1?text=${encodeURIComponent(product.name)}`;
          }}
          style={{ objectFit: 'contain', padding: '15px' }}
        />

        
        {/* Badges */}
        <div className="product-badges">
          {product.isPreorder && <span className="badge badge-preorder">Đặt trước</span>}
          {product.quantity > 0 && product.quantity <= 5 && <span className="badge badge-lowstock" style={{backgroundColor: '#eab308', color: '#fff'}}>Sắp hết ({product.quantity})</span>}
          {product.isNewArrival && <span className="badge badge-new">Mới</span>}
          {product.isSale && discount > 0 && <span className="badge badge-sale">-{discount}%</span>}
        </div>

        {/* Action Buttons */}
        <div className="product-card-actions">
          <button 
            className={`product-wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`} 
            onClick={handleWishlist} 
            aria-label="Yêu thích"
          >
            <FiHeart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
          </button>
          <button className="product-quick-add" onClick={handleAddToCart} aria-label="Thêm vào giỏ">
            <FiShoppingCart size={18} />
          </button>
        </div>
      </div>

      <div className="product-card-info">
        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="product-rating">
            <FiStar size={14} className="star-icon" />
            <span className="rating-value">{Number(product.rating).toFixed(1)}</span>
            <span className="rating-count">({product.reviewCount})</span>
          </div>
        )}

        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-meta-tags">
          {product.grade && product.grade !== 'N/A' && <span className="product-grade">{product.grade}</span>}
          {product.scale && product.scale !== 'N/A' && <span className="product-scale">{product.scale}</span>}
        </div>

        <div className="product-price">
          <span className="price-current">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="price-original">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default memo(ProductCard);
