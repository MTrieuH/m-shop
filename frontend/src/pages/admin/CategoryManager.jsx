import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '../../services/api';
import Swal from 'sweetalert2';

const filterOptions = [
  { id: 'brand', label: 'Thương hiệu' },
  { id: 'grade', label: 'Grade' },
  { id: 'series', label: 'Series' },
  { id: 'scale', label: 'Tỉ lệ' },
  { id: 'price', label: 'Khoảng giá' },
  { id: 'stockStatus', label: 'Tình trạng' },
];

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', slug:'', description:'', imageUrl:'', parentId:null, sortOrder:0, isActive:true, filterConfig: 'brand,grade,series,price,stockStatus' });

  const load = () => { adminGetCategories().then(res => setCategories(res.data)).catch(() => {}); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { 
    setEditing(null); 
    setForm({ name:'', slug:'', description:'', imageUrl:'', parentId:null, sortOrder:0, isActive:true, filterConfig: 'brand,grade,series,price,stockStatus' }); 
    setModalOpen(true); 
  };
  
  const openEdit = (c) => { 
    setEditing(c.id); 
    setForm({ 
      name:c.name, slug:c.slug, description:c.description || '', 
      imageUrl:c.imageUrl || '', parentId:c.parentId, sortOrder:c.sortOrder, 
      isActive:true, filterConfig: c.filterConfig || 'brand,grade,series,price,stockStatus' 
    }); 
    setModalOpen(true); 
  };

  const handleSave = async () => {
    try {
      if (editing) await adminUpdateCategory(editing, form);
      else await adminCreateCategory(form);
      setModalOpen(false); load();
    } catch (err) { Swal.fire('Lỗi', err.response?.data?.message || 'Lỗi', 'error'); }
  };

  const handleDelete = async (id) => {
    const confirmResult = await Swal.fire({
      title: 'Xác nhận',
      text: 'Xóa danh mục này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });
    if (!confirmResult.isConfirmed) return;
    await adminDeleteCategory(id); load();
  };

  const toggleFilter = (id) => {
    const filters = form.filterConfig ? form.filterConfig.split(',').filter(x => x) : [];
    let next;
    if (filters.includes(id)) next = filters.filter(x => x !== id);
    else next = [...filters, id];
    setForm({ ...form, filterConfig: next.join(',') });
  };

  const parents = categories.filter(c => !c.parentId);

  return (
    <>
      <div className="animate-fadeIn">
      <div className="admin-toolbar">
        <div style={{ display:'flex', alignItems:'baseline', gap:8, flex:1 }}>
           <h2 style={{ fontSize:'1.5rem', fontWeight:800, margin:0 }}>Phân loại sản phẩm</h2>
           <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight:600 }}>({categories.length} danh mục hiện có)</span>
        </div>
        <button className="btn btn-primary" onClick={openCreate} style={{ padding:'12px 24px', borderRadius:12 }}><FiPlus /> Thêm danh mục mới</button>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Tên danh mục</th>
                <th>Slug định dạng</th>
                <th>Cấp bậc</th>
                <th>Thứ tự</th>
                <th style={{ textAlign:'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id} className={c.parentId ? 'child-row' : 'parent-row'} style={{ background: c.parentId ? '#f8fafc' : 'transparent' }}>
                  <td style={{ paddingLeft: c.parentId ? 40 : 20, fontWeight: c.parentId ? 500 : 700, color: c.parentId ? '#475569' : '#1e293b' }}>
                    {c.parentId ? <span style={{ color:'#94a3b8', marginRight:8 }}>└</span> : null}
                    {c.name}
                  </td>
                  <td><code style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>{c.slug}</code></td>
                  <td>
                     {c.parentId ? (
                       <span className="status-badge" style={{ background:'rgba(59,130,246,0.1)', color:'var(--color-info)' }}>Cấp con</span>
                     ) : (
                       <span className="status-badge" style={{ background:'rgba(16,185,129,0.1)', color:'var(--color-success)' }}>Gốc (Cấp 1)</span>
                     )}
                  </td>
                  <td style={{ fontWeight: 600 }}>{c.sortOrder}</td>
                  <td style={{ textAlign:'right' }}>
                    <div className="action-btns" style={{ justifyContent:'flex-end' }}>
                      <button className="action-btn-sm edit" onClick={() => openEdit(c)}><FiEdit2 size={14} /></button>
                      <button className="action-btn-sm delete" onClick={() => handleDelete(c.id)}><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 550 }}>
            <div className="modal-header">
              <h3 style={{ margin:0 }}>{editing ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h3>
              <button className="close-btn" onClick={() => setModalOpen(false)} style={{ background:'none', color:'#94a3b8' }}><FiX size={20} /></button>
            </div>
            <div className="modal-body" style={{ background:'#f8fafc', display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              <div className="left-col">
                <div className="form-group">
                  <label className="form-label">Tên hiển thị</label>
                  <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="VD: Gundam MG" />
                </div>
                <div className="form-group">
                  <label className="form-label">Slug (URL)</label>
                  <input className="form-input" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="VD: gundam-mg" />
                </div>
                <div className="form-group">
                  <label className="form-label">Danh mục cha</label>
                  <select className="form-input" value={form.parentId || ''} onChange={e => setForm({...form, parentId: e.target.value ? +e.target.value : null})}>
                    <option value="">Không (Gốc)</option>
                    {parents.filter(p => p.id !== editing).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Thứ tự ưu tiên</label>
                  <input className="form-input" type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: +e.target.value})} />
                </div>
              </div>

              <div className="right-col">
                <div className="form-group">
                  <label className="form-label" style={{ color:'var(--color-primary)', fontWeight:800 }}>Bộ lọc hiển thị</label>
                  <div style={{ background:'white', padding:15, borderRadius:12, border:'1px solid #e2e8f0' }}>
                    <p style={{ fontSize:'0.75rem', color:'#64748b', marginBottom:10 }}>Chọn các bộ lọc sẽ xuất hiện ở trang cửa hàng khi vào danh mục này.</p>
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {filterOptions.map(opt => (
                        <label key={opt.id} style={{ display:'flex', alignItems:'center', gap:10, fontSize:'0.85rem', fontWeight:600, cursor:'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={form.filterConfig.split(',').includes(opt.id)} 
                            onChange={() => toggleFilter(opt.id)} 
                            style={{ width:16, height:16, accentColor:'var(--color-primary)' }}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Mô tả ngắn</label>
                  <textarea className="form-input" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Mô tả danh mục..." />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModalOpen(false)} style={{ borderRadius:12 }}>Hủy bỏ</button>
              <button className="btn btn-primary" onClick={handleSave} style={{ borderRadius:12, minWidth:120 }}>{editing ? 'Lưu thay đổi' : 'Lưu lại'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
