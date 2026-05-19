import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch } from 'react-icons/fi';
import { adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct, adminGetCategories, uploadImage } from '../../services/api';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import Swal from 'sweetalert2';

// Helper to generate slug from name
const toSlug = (str) => {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(getEmptyForm());
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // general, details, inventory, media

  function getEmptyForm() {
    return { name:'', slug:'', description:'', price:0, originalPrice:null, imageUrl:'', images:[], categoryId:0, brand:'', series:'', grade:'', scale:'', condition:'Mô hình lắp ráp', stockStatus:'InStock', quantity:10, isFeatured:false, isNewArrival:false, isPreorder:false, isSale:false };
  }

  const load = useCallback(() => {
    adminGetProducts({ search, page, pageSize: 15 }).then(res => { setProducts(res.data.items); setTotal(res.data.totalCount); }).catch(() => {});
  }, [page, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { adminGetCategories().then(res => setCategories(res.data)).catch(() => {}); }, []);

  const openCreate = () => { setEditing(null); setForm(getEmptyForm()); setActiveTab('general'); setModalOpen(true); };
  const openEdit = (p) => {
    let gallery = [];
    try { gallery = p.images ? JSON.parse(p.images) : []; if(!Array.isArray(gallery)) gallery = []; } catch(e) { gallery = []; }
    setEditing(p.id);
    setForm({ name: p.name, slug: p.slug, description: p.description || '', price: p.price, originalPrice: p.originalPrice, imageUrl: p.imageUrl, images: gallery, categoryId: p.categoryId, brand: p.brand || '', series: p.series || '', grade: p.grade || '', scale: p.scale || '', condition: p.condition || '', stockStatus: p.stockStatus, quantity: p.quantity, isFeatured: p.isFeatured, isNewArrival: p.isNewArrival, isPreorder: p.isPreorder, isSale: p.isSale });
    setActiveTab('general');
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      setField('imageUrl', res.data.url);
    } catch (err) {
      Swal.fire('Lỗi', 'Lỗi tải ảnh đại diện', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const uploads = await Promise.all(files.map(f => uploadImage(f)));
      const newUrls = uploads.map(r => r.data.url);
      setField('images', [...form.images, ...newUrls]);
    } catch (err) {
      Swal.fire('Lỗi', 'Lỗi tải ảnh gallery', 'error');
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index) => {
    const newImages = form.images.filter((_, i) => i !== index);
    setField('images', newImages);
  };

  const handleSave = async () => {
    try {
      const payload = { ...form, images: JSON.stringify(form.images) };
      if (editing) await adminUpdateProduct(editing, payload);
      else await adminCreateProduct(payload);
      setModalOpen(false); load();
    } catch (err) { Swal.fire('Lỗi', err.response?.data?.message || 'Lỗi', 'error'); }
  };

  const handleDelete = async (id) => {
    const confirmResult = await Swal.fire({
      title: 'Xác nhận xóa?',
      text: 'Bạn có chắc muốn xóa sản phẩm này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });
    if (!confirmResult.isConfirmed) return;
    await adminDeleteProduct(id); load();
  };

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <div className="animate-fadeIn">
        <div className="admin-toolbar">
        <div className="admin-search-wrapper">
          <FiSearch className="admin-search-icon" />
          <input className="admin-search" placeholder="Tìm kiếm sản phẩm theo tên, thương hiệu..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <button className="btn btn-primary" onClick={openCreate} style={{ padding: '12px 24px', borderRadius: '12px' }}>
          <FiPlus /> Thêm sản phẩm mới
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
           <h3 className="admin-card-title">Danh sách sản phẩm ({total})</h3>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá bán</th>
                <th>Phân loại</th>
                <th>Kho hàng</th>
                <th>Trạng thái</th>
                <th style={{ textAlign:'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              ) : products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="product-cell">
                      <img src={getImageUrl(p.imageUrl)} alt="" />
                      <div>
                        <span style={{ display:'block', fontWeight:700, color:'#1e293b' }}>{p.name}</span>
                        <span style={{ fontSize:'0.75rem', color:'#64748b' }}>{p.brand} • {p.series}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{formatPrice(p.price)}</div>
                    {p.originalPrice && <div style={{ fontSize:'0.75rem', textDecoration:'line-through', color:'#94a3b8' }}>{formatPrice(p.originalPrice)}</div>}
                  </td>
                  <td>
                    <div style={{ fontSize:'0.85rem', fontWeight: 600 }}>{p.grade || '—'}</div>
                    <div style={{ fontSize:'0.75rem', color:'#64748b' }}>Tỉ lệ: {p.scale}</div>
                  </td>
                  <td>
                    <div style={{ 
                      fontWeight: 800, 
                      color: p.quantity <= 5 ? 'var(--color-danger)' : (p.quantity <= 10 ? 'var(--color-warning)' : '#1e293b'),
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      {p.quantity} 
                      {p.quantity <= 5 && <span style={{ fontSize:'0.6rem', color:'var(--color-danger)', letterSpacing:'0.5px' }}>SẮP HẾT</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${p.stockStatus.toLowerCase()}`} style={{
                       background: p.stockStatus === 'InStock' ? 'rgba(16,185,129,0.1)' : (p.stockStatus === 'OutOfStock' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)'),
                       color: p.stockStatus === 'InStock' ? 'var(--color-success)' : (p.stockStatus === 'OutOfStock' ? 'var(--color-danger)' : 'var(--color-warning)')
                    }}>
                      {p.stockStatus === 'InStock' ? 'Còn hàng' : (p.stockStatus === 'OutOfStock' ? 'Hết hàng' : 'Đặt trước')}
                    </span>
                    <div style={{ marginTop: 6, display:'flex', gap:4 }}>
                      {p.isFeatured && <span className="badge badge-hot" style={{fontSize:'0.6rem', padding:'2px 6px'}}>HOT</span>}
                      {p.isSale && <span className="badge badge-sale" style={{fontSize:'0.6rem', padding:'2px 6px'}}>SALE</span>}
                      {p.isNewArrival && <span className="badge badge-new" style={{fontSize:'0.6rem', padding:'2px 6px'}}>NEW</span>}
                    </div>
                  </td>
                  <td style={{ textAlign:'right' }}>
                    <div className="action-btns" style={{ justifyContent:'flex-end' }}>
                      <button className="action-btn-sm edit" onClick={() => openEdit(p)} title="Sửa"><FiEdit2 size={14} /></button>
                      <button className="action-btn-sm delete" onClick={() => handleDelete(p.id)} title="Xóa"><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {total > 15 && (
        <div className="pagination" style={{ display: 'flex', gap: 6, marginTop: 24, justifyContent: 'center' }}>
          {[...Array(Math.ceil(total / 15))].map((_, i) => (
            <button key={i} className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-outline'}`} onClick={() => setPage(i + 1)} style={{ minWidth:'40px' }}>{i + 1}</button>
          ))}
        </div>
      )}

      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}><FiX /></button>
            </div>
            
            <div className="form-tabs" style={{ padding: '0 32px' }}>
              <div className={`form-tab ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>Thông tin chung</div>
              <div className={`form-tab ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>Phân loại</div>
              <div className={`form-tab ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>Kho & Trạng thái</div>
              <div className={`form-tab ${activeTab === 'media' ? 'active' : ''}`} onClick={() => setActiveTab('media')}>Hình ảnh</div>
            </div>

            <div className="modal-body">
              {activeTab === 'general' && (
                <div className="animate-fadeIn">
                  <div className="form-group">
                    <label className="form-label">Tên sản phẩm</label>
                    <input className="form-input" value={form.name} onChange={e => { setField('name', e.target.value); if(!editing) setField('slug', toSlug(e.target.value)); }} placeholder="VD: Gundam Aerial (HG)" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Slug (Đường dẫn)</label>
                    <input className="form-input" value={form.slug} onChange={e => setField('slug', e.target.value)} placeholder="gundam-aerial-hg" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mô tả sản phẩm</label>
                    <textarea className="form-input" rows={5} value={form.description} onChange={e => setField('description', e.target.value)} placeholder="Nhập mô tả chi tiết..." />
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="animate-fadeIn">
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                    <div className="form-group">
                      <label className="form-label">Danh mục</label>
                      <select className="form-input" value={form.categoryId} onChange={e => setField('categoryId', +e.target.value)}>
                        <option value={0}>Chọn danh mục</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.parentId ? '  — ' : ''}{c.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Thương hiệu</label>
                      <input className="form-input" value={form.brand} onChange={e => setField('brand', e.target.value)} placeholder="VD: Bandai" />
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:20 }}>
                    <div className="form-group"><label className="form-label">Grade</label><input className="form-input" value={form.grade} onChange={e => setField('grade', e.target.value)} placeholder="VD: HG" /></div>
                    <div className="form-group"><label className="form-label">Scale</label><input className="form-input" value={form.scale} onChange={e => setField('scale', e.target.value)} placeholder="VD: 1/144" /></div>
                    <div className="form-group"><label className="form-label">Series</label><input className="form-input" value={form.series} onChange={e => setField('series', e.target.value)} placeholder="VD: The Witch from Mercury" /></div>
                  </div>
                </div>
              )}

              {activeTab === 'inventory' && (
                <div className="animate-fadeIn">
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                    <div className="form-group"><label className="form-label">Giá bán (₫)</label><input className="form-input" type="number" value={form.price} onChange={e => setField('price', +e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Giá gốc (₫)</label><input className="form-input" type="number" value={form.originalPrice || ''} onChange={e => setField('originalPrice', +e.target.value || null)} /></div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                    <div className="form-group"><label className="form-label">Số lượng trong kho</label><input className="form-input" type="number" value={form.quantity} onChange={e => setField('quantity', +e.target.value)} /></div>
                    <div className="form-group">
                      <label className="form-label">Tình trạng</label>
                      <select className="form-input" value={form.stockStatus} onChange={e => setField('stockStatus', e.target.value)}>
                        <option value="InStock">Còn hàng</option>
                        <option value="OutOfStock">Hết hàng</option>
                        <option value="PreOrder">Đặt trước</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Đánh dấu</label>
                    <div style={{ display:'flex', gap:20, flexWrap:'wrap', background:'#f8fafc', padding:'16px', borderRadius:'12px' }}>
                      {[['isFeatured','Nổi bật'],['isNewArrival','Hàng mới'],['isPreorder','Đặt trước'],['isSale','Giảm giá']].map(([k,l]) => (
                        <label key={k} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontWeight: 600, fontSize:'0.9rem' }}>
                          <input type="checkbox" checked={form[k]} onChange={e => setField(k, e.target.checked)} style={{ width:'18px', height:'18px', accentColor:'var(--color-primary)' }} /> {l}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div className="animate-fadeIn">
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:32 }}>
                    {/* Main Image Section */}
                    <div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight:800, color:'var(--color-primary)' }}>1. Ảnh hiển thị bên ngoài (Grid)</label>
                        <p style={{ fontSize:'0.75rem', color:'#64748b', marginBottom:12 }}>Tấm ảnh duy nhất dùng để hiển thị ở danh sách sản phẩm.</p>
                        <div className="image-upload-wrapper" onClick={() => document.getElementById('product-image-upload').click()} style={{ minHeight:180 }}>
                          <input type="file" id="product-image-upload" hidden onChange={handleImageUpload} accept="image/*" />
                          {form.imageUrl ? (
                            <div className="image-upload-preview" style={{ height:140 }}>
                              <img src={getImageUrl(form.imageUrl)} alt="Preview" />
                            </div>
                          ) : (
                            <div style={{ padding:'20px 0', color:'#94a3b8' }}>
                                <FiPlus size={28} />
                                <p style={{ fontSize:'0.8rem' }}>Tải ảnh đại diện</p>
                            </div>
                          )}
                          {uploading && <div className="upload-overlay">...</div>}
                        </div>
                      </div>
                    </div>

                    {/* Gallery Section */}
                    <div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight:800, color:'var(--color-primary)' }}>2. Chùm ảnh thực tế (Gallery)</label>
                        <p style={{ fontSize:'0.75rem', color:'#64748b', marginBottom:12 }}>Bộ sưu tập ảnh chi tiết, thực tế của sản phẩm khi nhấn vào xem.</p>
                        <div className="gallery-upload-container">
                          <div className="gallery-grid-admin">
                            {form.images.map((img, idx) => (
                              <div key={idx} className="gallery-item-admin">
                                <img src={getImageUrl(img)} alt="" />
                                <button className="remove-img" onClick={(e) => { e.stopPropagation(); removeGalleryImage(idx); }}>×</button>
                              </div>
                            ))}
                            <div className="gallery-add-btn" onClick={() => document.getElementById('product-gallery-upload').click()}>
                              <input type="file" id="product-gallery-upload" hidden multiple onChange={handleGalleryUpload} accept="image/*" />
                              <FiPlus size={24} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModalOpen(false)} style={{ borderRadius:'12px' }}>Hủy bỏ</button>
              <button className="btn btn-primary" onClick={handleSave} style={{ borderRadius:'12px', minWidth:'120px' }}>
                {editing ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

