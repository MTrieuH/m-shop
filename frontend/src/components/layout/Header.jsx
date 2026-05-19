import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingCart, FiMenu, FiX, FiChevronDown, FiLogOut, FiPackage, FiGrid, FiClock, FiTrash2, FiHeart } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { getCategories, getSearchSuggestions } from '../../services/api';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlist = [] } = useWishlist() || {};
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mshop_search_history')) || [];
    } catch { return []; }
  });
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    getCategories().then(res => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) { setSearchOpen(false); setSuggestions([]); }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    clearTimeout(debounceRef.current);
    if (q.length < 2) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await getSearchSuggestions(q);
        setSuggestions(res.data);
      } catch { 
        setSuggestions([]); 
      }
    }, 300);
  };


  const saveToHistory = (query) => {
    if (!query) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== query.toLowerCase());
      const newHistory = [query, ...filtered].slice(0, 6); // Keep last 6 searches
      localStorage.setItem('mshop_search_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const removeHistoryItem = (query, e) => {
    e.stopPropagation();
    e.preventDefault();
    setSearchHistory(prev => {
      const newHistory = prev.filter(item => item !== query);
      localStorage.setItem('mshop_search_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('mshop_search_history');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      saveToHistory(q);
      navigate(`/san-pham?search=${encodeURIComponent(q)}`);
      setSearchOpen(false); setSearchQuery(''); setSuggestions([]);
    }
  };

  const executeSearch = (query) => {
    saveToHistory(query);
    navigate(`/san-pham?search=${encodeURIComponent(query)}`);
    setSearchOpen(false); setSearchQuery(''); setSuggestions([]);
  };

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${escapeRegex(highlight)})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <strong key={i} className="text-highlight">{part}</strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <header className="header">
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="container">
          <p>🚀 Miễn phí vận chuyển cho đơn hàng từ 500.000₫ | Đảm bảo chính hãng 100%</p>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="container header-inner">
          {/* Mobile menu toggle */}
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="logo">
            <span className="logo-m">M</span>
            <span className="logo-text">-SHOP</span>
            <span className="logo-sub">Mô Hình Lắp Ráp</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="main-nav desktop-only">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="nav-item"
                onMouseEnter={() => setActiveMenu(cat.id)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link to={`/danh-muc/${cat.slug}`} className="nav-link">
                  {cat.name}
                  {cat.children?.length > 0 && <FiChevronDown size={14} />}
                </Link>
                {cat.children?.length > 0 && activeMenu === cat.id && (
                  <div className="mega-menu">
                    <div className="mega-menu-inner">
                      {cat.children.map(child => (
                        <Link key={child.id} to={`/danh-muc/${child.slug}`} className="mega-menu-item">
                          {child.name}
                        </Link>
                      ))}
                      <Link to={`/danh-muc/${cat.slug}`} className="mega-menu-item mega-menu-all">
                        Xem tất cả {cat.name} →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Đặc Biệt — hardcoded */}
            <div
              className="nav-item"
              onMouseEnter={() => setActiveMenu('special')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <span className="nav-link" style={{ cursor: 'pointer' }}>
                Đặc Biệt <FiChevronDown size={14} />
              </span>
              {activeMenu === 'special' && (
                <div className="mega-menu">
                  <div className="mega-menu-inner">
                    <Link to="/su-kien-sale" className="mega-menu-item">🏷️ Sự Kiện Sale</Link>
                    <Link to="/lich-hang-ve" className="mega-menu-item">📅 Lịch Hàng Về</Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Actions */}
          <div className="header-actions">
            {/* Search */}
            <div className="search-wrapper" ref={searchRef}>
              <button className="action-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Tìm kiếm">
                <FiSearch size={20} />
              </button>
              {searchOpen && (
                <div className="search-panel">
                  <form className="search-dropdown" onSubmit={handleSearch}>
                    <input
                      type="text"
                      placeholder="Tìm kiếm sản phẩm..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() => { if (!searchQuery) setSuggestions([]); }}
                      autoFocus
                    />
                    <button type="submit"><FiSearch size={18} /></button>
                  </form>
                  {searchQuery && suggestions.length > 0 && (
                    <div className="search-suggestions">
                      {suggestions.map(s => (
                        <Link key={s.id} to={`/san-pham/${s.slug}`} className="suggestion-item" onClick={() => executeSearch(searchQuery)}>
                          <img src={getImageUrl(s.imageUrl)} alt="" className="suggestion-img" />
                          <div className="suggestion-info">
                            <p className="suggestion-name">{highlightText(s.name, searchQuery)}</p>
                            <p className="suggestion-meta">{s.categoryName} • {s.grade} • {formatPrice(s.price)}</p>
                          </div>


                        </Link>
                      ))}
                      <button className="suggestion-all" onClick={() => executeSearch(searchQuery)}>
                        Xem tất cả kết quả →
                      </button>
                    </div>
                  )}

                  {!searchQuery && searchHistory.length > 0 && (
                    <div className="search-history">
                      <div className="search-history-header">
                        <span>Lịch sử tìm kiếm</span>
                        <button type="button" onClick={clearHistory} className="clear-history-btn">
                          <FiTrash2 size={14} /> Xóa lịch sử
                        </button>
                      </div>
                      <div className="search-history-list">
                        {searchHistory.map((item, index) => (
                          <div key={index} className="history-item">
                            <button type="button" className="history-item-link" onClick={() => executeSearch(item)}>
                              <FiClock size={14} className="history-icon" />
                              <span>{item}</span>
                            </button>
                            <button type="button" className="history-delete-btn" onClick={(e) => removeHistoryItem(item, e)} aria-label="Xóa">
                              <FiX size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User */}
            <div className="user-wrapper" ref={userMenuRef}>
              <button className="action-btn" onClick={() => user ? setUserMenuOpen(!userMenuOpen) : navigate('/dang-nhap')} aria-label="Tài khoản">
                <FiUser size={20} />
              </button>
              {user && userMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <p className="user-name">{user.fullName}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                  {user.role === 'Admin' && (
                    <Link to="/admin" className="user-dropdown-item admin-link" onClick={() => setUserMenuOpen(false)}>
                      <FiGrid size={16} /> Quản trị Admin
                    </Link>
                  )}
                  <Link to="/tai-khoan" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <FiUser size={16} /> Tài khoản
                  </Link>
                  <Link to="/don-hang" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <FiPackage size={16} /> Đơn hàng
                  </Link>
                  <button className="user-dropdown-item logout" onClick={() => { logout(); setUserMenuOpen(false); }}>
                    <FiLogOut size={16} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link to="/yeu-thich" className="action-btn" aria-label="Yêu thích">
              <FiHeart size={20} />
              {wishlist?.length > 0 && <span className="cart-badge">{wishlist.length}</span>}
            </Link>

            {/* Cart */}
            <Link to="/gio-hang" className="action-btn cart-btn" aria-label="Giỏ hàng">
              <FiShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="mobile-nav">
          <div className="mobile-nav-pane">
            {categories.map(cat => (
              <div key={cat.id} className="mobile-nav-group-collapsible">
                {cat.children?.length > 0 ? (
                  <>
                    <button 
                      className="mobile-nav-link" 
                      onClick={() => setActiveSubMenu(activeSubMenu === cat.id ? null : cat.id)}
                    >
                      {cat.name}
                      <FiChevronDown className={`arrow ${activeSubMenu === cat.id ? 'up' : 'down'}`} size={20} />
                    </button>
                    {activeSubMenu === cat.id && (
                      <div className="mobile-nav-submenu">
                        <Link 
                          to={`/danh-muc/${cat.slug}`} 
                          className="mobile-nav-sublink all-link" 
                          onClick={() => setMobileOpen(false)}
                        >
                          Xem tất cả {cat.name}
                        </Link>
                        {cat.children.map(child => (
                          <Link 
                            key={child.id} 
                            to={`/danh-muc/${child.slug}`} 
                            className="mobile-nav-sublink" 
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link to={`/danh-muc/${cat.slug}`} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                    {cat.name}
                  </Link>
                )}
              </div>
            ))}

            {/* Đặc Biệt — Mobile */}
            <div className="mobile-nav-group-collapsible">
              <button
                className="mobile-nav-link"
                onClick={() => setActiveSubMenu(activeSubMenu === 'special' ? null : 'special')}
              >
                Đặc Biệt
                <FiChevronDown className={`arrow ${activeSubMenu === 'special' ? 'up' : 'down'}`} size={20} />
              </button>
              {activeSubMenu === 'special' && (
                <div className="mobile-nav-submenu">
                  <Link to="/su-kien-sale" className="mobile-nav-sublink" onClick={() => setMobileOpen(false)}>🏷️ Sự Kiện Sale</Link>
                  <Link to="/lich-hang-ve" className="mobile-nav-sublink" onClick={() => setMobileOpen(false)}>📅 Lịch Hàng Về</Link>
                </div>
              )}
            </div>

            {!user && (
              <div className="mobile-nav-auth">
                <Link to="/dang-nhap" className="btn btn-primary btn-full" onClick={() => setMobileOpen(false)}>Đăng nhập</Link>
                <Link to="/dang-ky" className="btn btn-outline btn-full" onClick={() => setMobileOpen(false)}>Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
