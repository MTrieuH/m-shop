import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiHeart, FiShare2, FiMinus, FiPlus, FiCheck, FiShield, FiTruck, FiRefreshCw } from 'react-icons/fi';
import ProductCard from '../components/product/ProductCard';
import Skeleton from '../components/common/Skeleton';
import { useCart } from '../contexts/CartContext';

import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import usePageMeta from '../hooks/usePageMeta';
import { getProductBySlug, getRelatedProducts, getReviews, createReview, deleteReview, getProductQuestions, postProductQuestion, deleteProductQuestion } from '../services/api';
import { formatPrice, getStockLabel, getImageUrl } from '../utils/helpers';
import Swal from 'sweetalert2';
import './ProductDetail.css';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  
  usePageMeta(
    product ? product.name : 'Đang tải...', 
    product ? `Mua ${product.name} chính hãng tại M-Shop với giá tốt nhất, miễn phí giao hàng toàn quốc.` : ''
  );
  
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' or 'qa'
  const [reviewFilter, setReviewFilter] = useState(0); // 0 = all
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loadedSlug, setLoadedSlug] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isSubmittingQ, setIsSubmittingQ] = useState(false);
  const loading = slug !== loadedSlug;
  const { user } = useAuth();

  useEffect(() => {
    setQuantity(1);
    setSelectedImage(0);
    setAddedToCart(false);
    setActiveTab('reviews');

    
    getProductBySlug(slug).then(res => {
      setProduct(res.data);
      setLoadedSlug(slug);
      getRelatedProducts(res.data.id, 4).then(r => setRelated(r.data)).catch(() => {});
      getReviews(res.data.id).then(r => setReviews(r.data)).catch(() => {});
      getProductQuestions(res.data.id).then(r => setQuestions(r.data)).catch(() => {});
    }).catch(() => {
      setLoadedSlug(slug); // Still stop loading if failed
    });

    window.scrollTo(0, 0);
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    const buyNowItem = { ...product, quantity };
    navigate('/thanh-toan', { state: { buyNowItem } });
  };

  const submitQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setIsSubmittingQ(true);
    try {
      await postProductQuestion(product.id, newQuestion);
      setNewQuestion('');
      getProductQuestions(product.id).then(r => setQuestions(r.data));
      setSuccessMsg('Đã gửi câu hỏi thành công!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      Swal.fire('Lỗi', err.response?.data?.message || 'Có lỗi xảy ra.', 'error');
    } finally {
      setIsSubmittingQ(false);
    }
  };

  const handleDeleteQuestion = async (qId) => {
    const confirmResult = await Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có chắc chắn muốn xóa câu hỏi này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });
    if (!confirmResult.isConfirmed) return;
    try {
      await deleteProductQuestion(product.id, qId);
      setQuestions(questions.filter(q => q.id !== qId));
    } catch (err) {
      Swal.fire('Lỗi', 'Không thể xóa câu hỏi.', 'error');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewContent.trim()) return;
    setIsSubmittingReview(true);
    try {
      await createReview({
        productId: product.id,
        rating: reviewRating,
        title: reviewTitle,
        content: reviewContent
      });
      setReviewTitle('');
      setReviewContent('');
      setReviewRating(5);
      
      const r = await getReviews(product.id);
      const newReviews = r.data;
      setReviews(newReviews);
      
      if (newReviews.length > 0) {
        const avg = newReviews.reduce((acc, curr) => acc + curr.rating, 0) / newReviews.length;
        setProduct(prev => ({ ...prev, rating: avg, reviewCount: newReviews.length }));
      }
      
      setSuccessMsg('Cảm ơn bạn đã gửi đánh giá!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      Swal.fire('Lỗi', err.response?.data?.message || 'Bạn đã đánh giá sản phẩm này rồi hoặc có lỗi xảy ra.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (rId) => {
    const confirmResult = await Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có muốn xóa đánh giá này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });
    if (!confirmResult.isConfirmed) return;
    try {
      await deleteReview(rId);
      const res = await getReviews(product.id);
      const newReviews = res.data;
      setReviews(newReviews);
      
      if (newReviews.length > 0) {
        const avg = newReviews.reduce((acc, curr) => acc + curr.rating, 0) / newReviews.length;
        setProduct(prev => ({ ...prev, rating: avg, reviewCount: newReviews.length }));
      } else {
        setProduct(prev => ({ ...prev, rating: 0, reviewCount: 0 }));
      }
    } catch (err) {
      Swal.fire('Lỗi', 'Không thể xóa đánh giá.', 'error');
    }
  };

  const filteredReviews = reviewFilter === 0 ? reviews : reviews.filter(r => Math.round(r.rating) === reviewFilter);

  if (loading) return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail-grid">
          <div className="product-gallery">
            <Skeleton variant="rectangular" height="500px" />
          </div>
          <div className="product-info">
            <Skeleton variant="text" width="70%" height="2.5rem" className="mb-4" />
            <Skeleton variant="text" width="40%" height="1.5rem" className="mb-4" />
            <Skeleton variant="text" width="30%" height="2rem" className="mb-8" />
            <Skeleton variant="text" count={4} />
            <div style={{ marginTop: '30px' }}>
              <Skeleton variant="rectangular" height="200px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );


  if (!product) return (
    <div className="product-detail-page">
      <div className="container"><div className="empty-state"><p>Không tìm thấy sản phẩm.</p><Link to="/san-pham" className="btn btn-primary">Quay lại</Link></div></div>
    </div>
  );

  let gallery = [];
  try { 
    gallery = typeof product.images === 'string' ? JSON.parse(product.images) : (product.images || []); 
    if (!Array.isArray(gallery)) gallery = [];
  } catch(e) { gallery = []; }
  
  const displayImages = gallery.length > 0 ? gallery : [product.imageUrl];

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span> / </span>
          <Link to={`/danh-muc/${product.categorySlug}`}>{product.categoryName}</Link>
          <span> / {product.name}</span>
        </nav>

        <div className="product-detail-grid">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="gallery-main">
              <img 
                src={getImageUrl(displayImages[selectedImage])} 
                alt={product.name} 
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/1a1a2e/22d3ee?text=M-Shop'; }}
              />
              {product.isPreorder && <span className="detail-badge badge-preorder">Đặt trước</span>}
              {product.isSale && <span className="detail-badge badge-sale">Giảm giá</span>}
            </div>
            {displayImages.length > 1 && (
              <div className="gallery-thumbs">
                {displayImages.map((img, i) => (
                  <button
                    key={i}
                    className={`thumb ${selectedImage === i ? 'active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={getImageUrl(img)} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="detail-name">{product.name}</h1>

            {/* Rating */}
            <div className="detail-rating">
              <div className="stars">
                {[1,2,3,4,5].map(s => (
                  <FiStar key={s} size={18} className={product.reviewCount > 0 && s <= Math.round(product.rating) ? 'star-filled' : 'star-empty'} />
                ))}
              </div>
              <span className="rating-text">
                {product.reviewCount > 0 ? `${Number(product.rating).toFixed(1)} (${product.reviewCount} đánh giá)` : 'Chưa có đánh giá'}
              </span>
            </div>

            {/* Price */}
            <div className="detail-price-section">
              {product.isPreorder && <span className="preorder-label">Giá đặt trước</span>}
              <span className="detail-price">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="detail-original-price">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            {/* Buy Actions */}
            <div className="main-buy-actions">
              <div className="stock-info" style={{ marginBottom: '15px' }}>
                <span className={`stock-dot ${product.stockStatus === 'InStock' ? 'in' : 'out'}`}></span>
                {getStockLabel(product.stockStatus)}
              </div>

              {product.stockStatus !== 'OutOfStock' && (
                <div className="action-buttons-row">
                  <div className="qty-selector">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><FiMinus /></button>
                    <span className="qty-value">{String(quantity).padStart(2, '0')}</span>
                    <button onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}><FiPlus /></button>
                  </div>

                  <button className={`btn btn-accent add-to-cart-btn ${addedToCart ? 'added' : ''}`} onClick={handleAddToCart}>
                    {addedToCart ? <><FiCheck /> Đã thêm!</> : <><FiShoppingCart /> {product.isPreorder ? 'Đặt Trước' : 'Thêm Vào Giỏ'}</>}
                  </button>

                  <button className="btn btn-primary buy-now-btn" onClick={handleBuyNow}>
                     Mua ngay
                  </button>
                </div>
              )}

              <div className="action-extras" style={{ marginTop: '15px' }}>
                <button 
                  className={`extra-btn ${isInWishlist(product.id) ? 'active' : ''}`} 
                  onClick={() => toggleWishlist(product)}
                >
                  <FiHeart fill={isInWishlist(product.id) ? 'currentColor' : 'none'} /> Yêu thích
                </button>
                <button className="extra-btn"><FiShare2 /> Chia sẻ</button>
              </div>
            </div>

            {/* Description */}
            {product.description && <p className="detail-desc">{product.description}</p>}

            {/* Trust Badges moved under description */}
            <div className="trust-badges horizontal-badges">
              <div className="trust-item"><FiShield /> <span>Chính hãng 100%</span></div>
              <div className="trust-item"><FiTruck /> <span>Giao nhanh</span></div>
              <div className="trust-item"><FiRefreshCw /> <span>Đổi trả 7 ngày</span></div>
            </div>

            {/* Specs Table */}
            {product.quantity > 0 && product.quantity <= 5 && (
              <div className="low-stock-alert" style={{backgroundColor: '#fef9c3', color: '#854d0e', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontWeight: '500'}}>
                <span style={{marginRight: '5px'}}>⚠️</span> Chỉ còn {product.quantity} sản phẩm trong kho!
              </div>
            )}
            <div className="specs-table">
              <h3 className="specs-title">Thông số kỹ thuật</h3>
              <table>
                <tbody>
                  {product.brand && <tr><td>Thương hiệu</td><td>{product.brand}</td></tr>}
                  {product.series && <tr><td>Series</td><td>{product.series}</td></tr>}
                  {product.grade && product.grade !== 'N/A' && <tr><td>Grade / Dòng</td><td>{product.grade}</td></tr>}
                  {product.scale && product.scale !== 'N/A' && <tr><td>Tỉ lệ (Scale)</td><td>{product.scale}</td></tr>}
                  {product.condition && <tr><td>Loại sản phẩm</td><td>{product.condition}</td></tr>}
                  <tr><td>Tình trạng</td><td><span className={`stock-label ${product.stockStatus.toLowerCase()}`}>{getStockLabel(product.stockStatus)}</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>



        {/* Community Engagement Section (Reviews & Q&A) */}
        <section className="community-section">
          <div className="community-tabs">
            <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
              Đánh Giá Của Khách Hàng ({reviews.length})
            </button>
            <button className={`tab-btn ${activeTab === 'qa' ? 'active' : ''}`} onClick={() => setActiveTab('qa')}>
              Hỏi & Đáp ({questions.length})
            </button>
          </div>

          <div className="community-content">
            {activeTab === 'reviews' && (
              <div className="reviews-panel">
                {user ? (
                  <form className="qa-form review-form" onSubmit={submitReview}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <span style={{ fontWeight: 600 }}>Đánh giá của bạn: </span>
                      <div className="stars">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <FiStar 
                            key={s} 
                            size={20} 
                            style={{ cursor: 'pointer' }}
                            className={s <= reviewRating ? 'star-filled' : 'star-empty'} 
                            onClick={() => setReviewRating(s)} 
                          />
                        ))}
                      </div>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Tiêu đề đánh giá (không bắt buộc)" 
                      value={reviewTitle} 
                      onChange={(e) => setReviewTitle(e.target.value)}
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                    />
                    <textarea 
                      placeholder="Nhận xét chi tiết về chất lượng sản phẩm..." 
                      value={reviewContent} 
                      onChange={e => setReviewContent(e.target.value)}
                      required
                    ></textarea>
                    <button type="submit" className="btn btn-accent" disabled={isSubmittingReview}>
                      {isSubmittingReview ? 'Đang gửi...' : 'Viết đánh giá'}
                    </button>
                    {successMsg && <p className="text-success mt-3 font-medium transition-all">{successMsg}</p>}
                  </form>
                ) : (
                  <div className="login-prompt">
                    <p>Vui lòng <Link to="/dang-nhap">Đăng nhập</Link> để viết đánh giá.</p>
                  </div>
                )}

                {reviews.length > 0 && (
                  <div className="review-filters">
                    <span>Lọc theo: </span>
                    <button className={`filter-btn ${reviewFilter === 0 ? 'active' : ''}`} onClick={() => setReviewFilter(0)}>Tất cả</button>
                    {[5,4,3,2,1].map(s => (
                      <button key={s} className={`filter-btn ${reviewFilter === s ? 'active' : ''}`} onClick={() => setReviewFilter(s)}>
                        {s} Sao
                      </button>
                    ))}
                  </div>
                )}
                
                {filteredReviews.length > 0 ? (
                  <div className="reviews-list">
                    {filteredReviews.map(review => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <div className="review-avatar">{review.userName?.charAt(0)?.toUpperCase() || 'U'}</div>
                          <div>
                            <p className="review-user">{review.userName}</p>
                            <div className="review-stars">
                              {[1,2,3,4,5].map(s => (
                                <FiStar key={s} size={14} className={s <= review.rating ? 'star-filled' : 'star-empty'} />
                              ))}
                            </div>
                          </div>
                        </div>
                        {review.title && <h4 className="review-title">{review.title}</h4>}
                        {review.content && <p className="review-content">{review.content}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-reviews">Chưa có đánh giá nào phù hợp.</p>
                )}
              </div>
            )}

            {activeTab === 'qa' && (
              <div className="qa-panel">
                {user ? (
                  <form className="qa-form" onSubmit={submitQuestion}>
                    <textarea 
                      placeholder="Bạn có câu hỏi gì về sản phẩm này?" 
                      value={newQuestion} 
                      onChange={e => setNewQuestion(e.target.value)}
                      required
                    ></textarea>
                    <button type="submit" className="btn btn-primary" disabled={isSubmittingQ}>
                      {isSubmittingQ ? 'Đang gửi...' : 'Gửi câu hỏi'}
                    </button>
                    {successMsg && <p className="text-success mt-3 font-medium transition-all">{successMsg}</p>}
                  </form>
                ) : (
                  <div className="login-prompt">
                    <p>Vui lòng <Link to="/dang-nhap">Đăng nhập</Link> để đặt câu hỏi.</p>
                  </div>
                )}

                <div className="qa-list">
                  {questions.length > 0 ? questions.map(q => (
                    <div key={q.id} className="qa-item">
                      <div className="q-block">
                        <span className="qa-badge user">Hỏi</span>
                        <div className="qa-body">
                          <p className="qa-text">{q.content}</p>
                          <span className="qa-meta">{new Date(q.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        {user && (user.id === q.userId || user.role === 'Admin') && (
                          <button onClick={() => handleDeleteQuestion(q.id)} className="btn btn-sm btn-outline btn-danger" style={{marginLeft: 'auto', alignSelf: 'flex-start'}}>Xóa</button>
                        )}
                      </div>
                      {q.answer && (
                        <div className="a-block">
                          <span className="qa-badge admin">Đáp</span>
                          <div className="qa-body">
                            <p className="qa-text">{q.answer}</p>
                            <span className="qa-meta admin">Trả lời bởi {q.answeredByName || 'Quản trị viên'} - {new Date(q.answeredAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )) : (
                    <p className="no-reviews">Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="section">
            <h2 className="section-title">Sản Phẩm Liên Quan</h2>
            <div className="related-products-grid">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
