import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { FiTruck, FiShield, FiHeadphones, FiCreditCard, FiArrowRight } from 'react-icons/fi';
import ProductCard from '../components/product/ProductCard';
import usePageMeta from '../hooks/usePageMeta';
import { getFeaturedProducts, getNewArrivals, getCategories, getEvents } from '../services/api';
import { getImageUrl } from '../utils/helpers';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [apiBanners, setApiBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  usePageMeta('Trang chủ', 'M-Shop - Thế giới mô hình Gunpla và đồ chơi lắp ráp chính hãng hàng đầu Việt Nam.');

  useEffect(() => {
    Promise.all([
      getFeaturedProducts(8),
      getNewArrivals(8),
      getCategories(),
      getEvents()
    ]).then(([featRes, newRes, catRes, eventRes]) => {
      setFeatured(featRes.data);
      setNewArrivals(newRes.data);
      setCategories(catRes.data);
      if (eventRes.data) {
        const activeBanners = eventRes.data.filter(e => e.type === 'Banner' && e.isPublished);
        setApiBanners(activeBanners);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const defaultBanners = [
    {
      title: 'Gundam Chính Hãng',
      subtitle: 'Bộ sưu tập Gunpla đầy đủ nhất',
      description: 'PG, MG, RG, HG — Tất cả các grade từ Bandai với giá tốt nhất.',
      cta: 'Khám Phá Ngay',
      linkUrl: '/danh-muc/gundam',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0891b2 100%)',
    },
    {
      title: 'Model Kit Season',
      subtitle: 'Hàng mới về liên tục',
      description: 'Cập nhật sản phẩm mới nhất từ Bandai, Kotobukiya, và nhiều hãng khác.',
      cta: 'Xem Hàng Mới',
      linkUrl: '/san-pham?sort=newest',
      gradient: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 50%, #8b5cf6 100%)',
    },
    {
      title: 'Dụng Cụ Mô Hình',
      subtitle: 'Nâng tầm kỹ năng của bạn',
      description: 'Kềm cắt, dao gọt, cọ vẽ và các vật tư cao cấp hàng đầu.',
      cta: 'Mua Dụng Cụ',
      linkUrl: '/danh-muc/dung-cu-vat-tu',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #1a3520 50%, #10b981 100%)',
    }
  ];

  const displayBanners = useMemo(() => {
    return apiBanners.length > 0 ? apiBanners : defaultBanners;
  }, [apiBanners]);

  const advantages = [
    { icon: <FiTruck size={28} />, title: 'Miễn phí vận chuyển', desc: 'Đơn từ 500.000₫' },
    { icon: <FiShield size={28} />, title: 'Chính hãng 100%', desc: 'Đảm bảo chất lượng' },
    { icon: <FiHeadphones size={28} />, title: 'Hỗ trợ 24/7', desc: 'Tư vấn tận tâm' },
    { icon: <FiCreditCard size={28} />, title: 'Thanh toán an toàn', desc: 'Đa dạng phương thức' },
  ];

  const categoryImages = {
    'gundam': '🤖', 'model-kits': '🔧', 'figures': '🎭',
    'dung-cu-vat-tu': '🛠️'
  };

  return (
    <div className="home-page animate-fadeIn">
      {/* Hero Slider */}
      <section className="hero-section">
        <Swiper
          key={displayBanners.length}
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="hero-swiper"
        >
          {displayBanners.map((banner, i) => (
            <SwiperSlide key={i}>
              <div className="hero-slide" style={{ 
                backgroundImage: banner.imageUrl 
                  ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${getImageUrl(banner.imageUrl)})` 
                  : (banner.gradient || 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'),
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                <div className="container hero-content">
                  <span className="hero-label">{banner.badgeText || banner.subtitle}</span>
                  <h1 className="hero-title">{banner.title}</h1>
                  <p className="hero-desc">{banner.description || banner.desc}</p>
                  <Link to={banner.linkUrl || banner.link} className="btn btn-accent btn-lg">
                    {banner.cta || 'Khám Phá Ngay'} <FiArrowRight />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Advantages Bar */}
      <section className="advantages-section">
        <div className="container">
          <div className="advantages-grid">
            {advantages.map((item, i) => (
              <div key={i} className="advantage-item">
                <div className="advantage-icon">{item.icon}</div>
                <div>
                  <h4 className="advantage-title">{item.title}</h4>
                  <p className="advantage-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Danh Mục Sản Phẩm</h2>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link key={cat.id} to={`/danh-muc/${cat.slug}`} className="category-card">
                <div className="category-emoji">{categoryImages[cat.slug] || '📦'}</div>
                <h3 className="category-name">{cat.name}</h3>
                {cat.children?.length > 0 && (
                  <p className="category-count">{cat.children.length} danh mục con</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {!loading && featured.length > 0 && (
        <section className="section" style={{ background: 'var(--color-bg-secondary)' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
              <Link to="/san-pham?featured=true" className="section-link">
                Xem tất cả <FiArrowRight />
              </Link>
            </div>
            <div className="products-grid">
              {featured.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {!loading && newArrivals.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Hàng Mới Về</h2>
              <Link to="/san-pham" className="section-link">
                Xem tất cả <FiArrowRight />
              </Link>
            </div>
            <div className="products-grid">
              {newArrivals.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-card">
            <h2 className="newsletter-title">Đăng ký nhận tin</h2>
            <p className="newsletter-desc">Nhận thông tin về sản phẩm mới, khuyến mãi và mẹo ráp mô hình mỗi tuần!</p>
            <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Email của bạn..." className="newsletter-input" />
              <button type="submit" className="btn btn-accent">Đăng ký</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

