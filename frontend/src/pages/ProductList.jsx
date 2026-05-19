import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import ProductCard from '../components/product/ProductCard';
import Skeleton from '../components/common/Skeleton';
import usePageMeta from '../hooks/usePageMeta';

import { getProducts, getCategoryBySlug } from '../services/api';
import './ProductList.css';

export default function ProductList() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loadedParamsKey, setLoadedParamsKey] = useState(null);
  
  const [filterOpen, setFilterOpen] = useState(false);
  const [expanded, setExpanded] = useState({ brand: true, grade: true, scale: true, series: true, stockStatus: true, price: true });
  const toggleExpand = (key) => setExpanded(prev => ({...prev, [key]: !prev[key]}));

  // Dynamic filter options based on current products
  const [availableGrades, setAvailableGrades] = useState([]);
  const [availableSeries, setAvailableSeries] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableScales, setAvailableScales] = useState([]);

  const page = parseInt(searchParams.get('page') || '1');
  const sort = searchParams.get('sort') || '';
  const search = searchParams.get('search') || '';
  const grade = searchParams.get('grade') || '';
  const series = searchParams.get('series') || '';
  const brand = searchParams.get('brand') || '';
  const scale = searchParams.get('scale') || '';
  const stockStatus = searchParams.get('stockStatus') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  
  const [tempMin, setTempMin] = useState(minPrice);
  const [tempMax, setTempMax] = useState(maxPrice);

  useEffect(() => {
    setTempMin(minPrice);
    setTempMax(maxPrice);
  }, [minPrice, maxPrice]);

  const currentParamsKey = JSON.stringify({ slug, page, sort, search, grade, series, brand, scale, stockStatus, minPrice, maxPrice });
  const loading = loadedParamsKey !== currentParamsKey;

  usePageMeta(
    category ? category.name : 'Sản phẩm', 
    category ? `Khám phá các sản phẩm nổi bật thuộc danh mục ${category.name} tại M-Shop.` : 'Danh sách tất cả các mô hình Gundam và phụ kiện tại M-Shop.'
  );

  useEffect(() => {
    const params = { page, pageSize: 12, sort };
    if (slug) params.category = slug;
    if (search) params.search = search;
    if (grade) params.grade = grade;
    if (series) params.series = series;
    if (brand) params.brand = brand;
    if (scale) params.scale = scale;
    if (stockStatus) params.stockStatus = stockStatus;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    getProducts(params).then(res => {
      const fetchedProducts = res.data.items || [];
      setProducts(fetchedProducts);
      setTotal(res.data.totalCount);
      setTotalPages(res.data.totalPages);

      // Use filter aggregation from backend
      if (res.data.availableFilters) {
        setAvailableGrades(res.data.availableFilters.grades?.sort() || []);
        setAvailableSeries(res.data.availableFilters.series?.sort() || []);
        setAvailableBrands(res.data.availableFilters.brands?.sort() || []);
        setAvailableScales(res.data.availableFilters.scales?.sort() || []);
      } else {
        setAvailableGrades([]);
        setAvailableSeries([]);
        setAvailableBrands([]);
        setAvailableScales([]);
      }
      setLoadedParamsKey(currentParamsKey);
    }).catch(() => {
      setLoadedParamsKey(currentParamsKey);
    });

    if (slug) {
      getCategoryBySlug(slug).then(res => setCategory(res.data)).catch(() => setCategory(null));
    } else {
      setCategory(null);
    }
  }, [slug, page, sort, search, grade, series, brand, stockStatus, minPrice, maxPrice, currentParamsKey]);

  useEffect(() => {
    if (filterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [filterOpen]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    // For multi-select fields: brand, grade, series, scale
    if (['brand', 'grade', 'series', 'scale'].includes(key)) {
      const current = newParams.get(key) ? newParams.get(key).split(',') : [];
      let updated;
      if (current.includes(value)) {
        updated = current.filter(v => v !== value);
      } else {
        updated = [...current, value];
      }
      
      if (updated.length > 0) newParams.set(key, updated.join(','));
      else newParams.delete(key);
    } else {
      // For single-select fields
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    }
    
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const applyPriceFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    if (tempMin) newParams.set('minPrice', tempMin);
    else newParams.delete('minPrice');
    
    if (tempMax) newParams.set('maxPrice', tempMax);
    else newParams.delete('maxPrice');
    
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const isSelected = (key, value) => {
    const current = searchParams.get(key);
    if (!current) return false;
    return current.split(',').includes(value);
  };

  const isFilterActive = (filterId) => {
    if (!category) return true;
    if (!category.filterConfig) return true;
    return category.filterConfig.split(',').includes(filterId);
  };


  const sortOptions = [
    { value: '', label: 'Mới nhất' },
    { value: 'price-asc', label: 'Giá tăng dần' },
    { value: 'price-desc', label: 'Giá giảm dần' },
    { value: 'rating', label: 'Đánh giá cao' },
    { value: 'popular', label: 'Bán chạy nhất' },
    { value: 'name-asc', label: 'A → Z' },
  ];

  const pageTitle = search ? `Kết quả tìm kiếm: "${search}"` : category?.name || 'Tất Cả Sản Phẩm';

  return (
    <div className="product-list-page animate-fadeIn">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Trang chủ</Link>
          {category?.parentId && <span> / <Link to={`/danh-muc/${category.slug}`}>{category.name}</Link></span>}
          <span> / {pageTitle}</span>
        </nav>

        <div className="product-list-header">
          <div>
            <h1 className="page-title">{pageTitle}</h1>
            <p className="result-count">{total} sản phẩm</p>
          </div>
          <div className="header-controls">
            <button className="filter-toggle-btn" onClick={() => setFilterOpen(!filterOpen)}>
              <FiFilter size={18} /> Bộ lọc
            </button>
            <select className="sort-select" value={sort} onChange={e => updateFilter('sort', e.target.value)}>
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="product-list-layout">
          {/* Sidebar Filters */}
          {filterOpen && <div className="filter-overlay open" onClick={() => setFilterOpen(false)}></div>}
          <aside className={`filter-sidebar ${filterOpen ? 'open' : ''}`}>
            <div className="filter-header-top">
              <div className="filter-title-row">
                <h3>BỘ LỌC</h3>
                <button className="filter-close-btn mobile-only" onClick={() => setFilterOpen(false)}><FiX size={24} /></button>
              </div>
              <div className="filter-actions-row">
                <button className="btn btn-primary btn-sm btn-full apply-btn mobile-only" onClick={() => setFilterOpen(false)}>Lọc {total} SP</button>
              </div>
            </div>

            <div className="filter-sidebar-content">

              {isFilterActive('brand') && availableBrands.length > 0 && (
                <div className="filter-group-collapsible">
                  <button className="filter-group-header" onClick={() => toggleExpand('brand')}>
                    <span>THƯƠNG HIỆU</span>
                    <FiChevronDown className={`arrow ${expanded.brand ? 'up' : 'down'}`} size={18} />
                  </button>
                  {expanded.brand && (
                    <div className="filter-group-content">
                      {availableBrands.map(b => (
                        <label key={b} className="filter-checkbox">
                          <input type="checkbox" checked={isSelected('brand', b)} onChange={() => updateFilter('brand', b)} />
                          <span>{b}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* GRADE Filter: Only for Gundam related categories */}
              {(category?.slug === 'gundam' || category?.parentId === 1 || (!category && availableGrades.length > 0)) && (
                <div className="filter-group-collapsible">
                  <button className="filter-group-header" onClick={() => toggleExpand('grade')}>
                    <span>GRADE / DÒNG SP</span>
                    <FiChevronDown className={`arrow ${expanded.grade ? 'up' : 'down'}`} size={18} />
                  </button>
                  {expanded.grade && (
                    <div className="filter-group-content">
                      {availableGrades.map(g => (
                        <label key={g} className="filter-checkbox">
                          <input type="checkbox" checked={isSelected('grade', g)} onChange={() => updateFilter('grade', g)} />
                          <span>{g}</span>
                        </label>
                      ))}
                      {availableGrades.length === 0 && <span className="no-filter-opt">Không có tùy chọn</span>}
                    </div>
                  )}
                </div>
              )}

              {/* SCALE Filter: For Model Kits, Figures and others */}
              {(category?.slug === 'model-kits' || category?.parentId === 2 || category?.slug === 'figures' || category?.parentId === 3 || (!category && availableScales.length > 0)) && (
                <div className="filter-group-collapsible">
                  <button className="filter-group-header" onClick={() => toggleExpand('scale')}>
                    <span>TỈ LỆ (SCALE)</span>
                    <FiChevronDown className={`arrow ${expanded.scale ? 'up' : 'down'}`} size={18} />
                  </button>
                  {expanded.scale && (
                    <div className="filter-group-content">
                      {availableScales.map(s => (
                        <label key={s} className="filter-checkbox">
                          <input type="checkbox" checked={isSelected('scale', s)} onChange={() => updateFilter('scale', s)} />
                          <span>{s}</span>
                        </label>
                      ))}
                      {availableScales.length === 0 && <span className="no-filter-opt">Không có tùy chọn</span>}
                    </div>
                  )}
                </div>
              )}

              {isFilterActive('series') && availableSeries.length > 0 && (
                <div className="filter-group-collapsible">
                  <button className="filter-group-header" onClick={() => toggleExpand('series')}>
                    <span>SERIES</span>
                    <FiChevronDown className={`arrow ${expanded.series ? 'up' : 'down'}`} size={18} />
                  </button>
                  {expanded.series && (
                    <div className="filter-group-content">
                      {availableSeries.map(s => (
                        <label key={s} className="filter-checkbox">
                          <input type="checkbox" checked={isSelected('series', s)} onChange={() => updateFilter('series', s)} />
                          <span>{s}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {isFilterActive('stockStatus') && (
                <div className="filter-group-collapsible">
                  <button className="filter-group-header" onClick={() => toggleExpand('stockStatus')}>
                    <span>TÌNH TRẠNG</span>
                    <FiChevronDown className={`arrow ${expanded.stockStatus ? 'up' : 'down'}`} size={18} />
                  </button>
                  {expanded.stockStatus && (
                    <div className="filter-group-content">
                      {[
                        { value: 'InStock', label: 'Còn hàng' },
                        { value: 'LowStock', label: 'Sắp hết hàng' },
                        { value: 'OutOfStock', label: 'Hết hàng' },
                        { value: 'PreOrder', label: 'Đặt trước' },
                      ].map(opt => (
                        <label key={opt.value} className="filter-checkbox">
                          <input type="checkbox" checked={stockStatus === opt.value} onChange={() => updateFilter('stockStatus', stockStatus === opt.value ? '' : opt.value)} />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {isFilterActive('price') && (
                <div className="filter-group-collapsible">
                  <button className="filter-group-header" onClick={() => toggleExpand('price')}>
                    <span>KHOẢNG GIÁ</span>
                    <FiChevronDown className={`arrow ${expanded.price ? 'up' : 'down'}`} size={18} />
                  </button>
                  {expanded.price && (
                    <div className="filter-group-content">
                      <div className="price-filter-container">
                        <div className="price-inputs-row">
                          <input 
                            type="number" 
                            placeholder="Từ" 
                            value={tempMin} 
                            onChange={e => setTempMin(e.target.value)} 
                            className="price-input-field" 
                          />
                          <span className="price-separator">-</span>
                          <input 
                            type="number" 
                            placeholder="Đến" 
                            value={tempMax} 
                            onChange={e => setTempMax(e.target.value)} 
                            className="price-input-field" 
                          />
                        </div>
                        <button className="btn btn-outline btn-sm apply-price-btn" onClick={applyPriceFilter}>
                          Áp dụng
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="product-list-main">
            <div className="products-grid">
              {loading ? (
                <Skeleton type="product-card" count={8} />
              ) : products.length === 0 ? (
                <div className="no-products">
                  <p>Không tìm thấy sản phẩm nào khớp với bộ lọc.</p>
                </div>
              ) : (
                products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="pagination">
                {page > 1 && (
                  <button className="page-btn" onClick={() => updateFilter('page', String(page - 1))}>← Trước</button>
                )}
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                    onClick={() => updateFilter('page', String(i + 1))}
                  >
                    {i + 1}
                  </button>
                ))}
                {page < totalPages && (
                  <button className="page-btn" onClick={() => updateFilter('page', String(page + 1))}>Sau →</button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
