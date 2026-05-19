import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCalendar, FiTag, FiFilter, FiUpload, FiImage, FiSettings } from 'react-icons/fi';
import { adminGetEvents, adminCreateEvent, adminUpdateEvent, adminDeleteEvent, uploadImage } from '../../services/api';
import { getImageUrl } from '../../utils/helpers';
import Swal from 'sweetalert2';

const TYPES = ['Banner', 'Sale', 'NewArrival', 'Restock', 'Event'];
const STATUSES = ['Upcoming', 'Active', 'Ended'];
const TYPE_LABELS = { Banner: 'Banner Trang Chủ', Sale: 'Sale / Khuyến Mãi', NewArrival: 'Hàng Mới Về', Restock: 'Restock Hàng', Event: 'Sự Kiện Cửa Hàng' };
const STATUS_LABELS = { Upcoming: 'Sắp tới', Active: 'Đang diễn ra', Ended: 'Đã kết thúc' };

const EMPTY = {
  title: '', description: '', type: 'Banner', status: 'Active',
  startDate: '', endDate: '', imageUrl: '', badgeText: '', linkUrl: '', isPublished: true
};

function toInputDate(iso) {
  if (!iso) return '';
  return new Date(iso).toISOString().split('T')[0];
}

export default function EventManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [filterType, setFilterType] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchEvents = useCallback(() => {
    setLoading(true);
    adminGetEvents().then(res => setEvents(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const openCreate = () => { setForm({ ...EMPTY }); setEditId(null); setShowForm(true); };
  const openEdit = (ev) => {
    setForm({
      title: ev.title, description: ev.description || '', type: ev.type, status: ev.status,
      startDate: toInputDate(ev.startDate), endDate: toInputDate(ev.endDate),
      imageUrl: ev.imageUrl || '', badgeText: ev.badgeText || '', linkUrl: ev.linkUrl || '',
      isPublished: ev.isPublished
    });
    setEditId(ev.id);
    setShowForm(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      setForm(prev => ({ ...prev, imageUrl: res.data.url }));
    } catch (err) {
      Swal.fire('Lỗi', 'Lỗi tải ảnh', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
      };
      if (editId) await adminUpdateEvent(editId, payload);
      else await adminCreateEvent(payload);
      setShowForm(false);
      fetchEvents();
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    const confirmResult = await Swal.fire({
      title: 'Xác nhận xóa?',
      text: 'Xóa sự kiện/banner này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });
    if (!confirmResult.isConfirmed) return;
    await adminDeleteEvent(id);
    fetchEvents();
  };

  const filtered = filterType ? events.filter(e => e.type === filterType) : events;

  return (
    <>
      <div className="animate-fadeIn">
      <div className="admin-toolbar">
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
          <button className={`btn btn-sm ${!filterType ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilterType('')} style={{ borderRadius: '10px' }}>
            <FiFilter size={14} /> Tất cả ({events.length})
          </button>
          {TYPES.map(t => {
            const count = events.filter(e => e.type === t).length;
            return (
              <button key={t} className={`btn btn-sm ${filterType === t ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilterType(t)} style={{ borderRadius: '10px' }}>
                {TYPE_LABELS[t]} ({count})
              </button>
            );
          })}
        </div>
        <button className="btn btn-primary" onClick={openCreate} style={{ padding: '12px 24px', borderRadius: '12px' }}>
          <FiPlus /> Thêm Banner / Sự Kiện
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
           <h3 className="admin-card-title">Banner & Sự kiện đang hoạt động</h3>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Banner / Ảnh</th>
                <th>Thông tin</th>
                <th>Loại</th>
                <th>Thời hạn</th>
                <th>Hiển thị</th>
                <th style={{ textAlign:'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}><div className="skeleton" style={{ height: 200, width: '100%' }} /></td></tr>
              ) : filtered.map(ev => (
                <tr key={ev.id}>
                  <td>
                    <div className="product-cell">
                      <img src={getImageUrl(ev.imageUrl)} alt="" style={{ width: 80, height: 45, borderRadius: 8 }} />
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>{ev.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{ev.badgeText || 'Không có badge'}</div>
                  </td>
                  <td><span className="status-badge" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--color-info)' }}>{TYPE_LABELS[ev.type]}</span></td>
                  <td>
                    <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                      {ev.startDate ? new Date(ev.startDate).toLocaleDateString('vi-VN') : 'N/A'} - 
                      {ev.endDate ? new Date(ev.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                    </div>
                    <span className={`status-badge status-${ev.status.toLowerCase()}`} style={{ marginTop: 4, fontSize: '0.65rem' }}>{STATUS_LABELS[ev.status]}</span>
                  </td>
                  <td>{ev.isPublished ? <span style={{color:'var(--color-success)', fontWeight:700}}>Đang phát</span> : <span style={{color:'var(--color-text-muted)'}}>Nháp</span>}</td>
                  <td style={{ textAlign:'right' }}>
                    <div className="action-btns" style={{ justifyContent:'flex-end' }}>
                      <button className="action-btn-sm edit" onClick={() => openEdit(ev)}><FiEdit2 size={14} /></button>
                      <button className="action-btn-sm delete" onClick={() => handleDelete(ev.id)}><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>Chưa có dữ liệu cho mục này.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <h3>{editId ? 'Chỉnh sửa Banner / Sự Kiện' : 'Tạo mới Banner / Sự Kiện'}</h3>
              <button className="close-btn" onClick={() => setShowForm(false)} style={{ background:'none', color:'#94a3b8' }}><FiX size={20} /></button>
            </div>
            
            <div className="modal-body" style={{ background: '#f8fafc' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
                <div>
                  <div className="form-group">
                    <label className="form-label">Tiêu đề (Slide Title)</label>
                    <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="VD: Gundam Chính Hãng" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phụ đề (Subtitle / Badge)</label>
                    <input className="form-input" value={form.badgeText} onChange={e => setForm({ ...form, badgeText: e.target.value })} placeholder="VD: Sale Mùa Hè" />
                  </div>
                </div>
                <div>
                   <div className="form-group">
                    <label className="form-label">Hình ảnh hiển thị</label>
                    <div className="image-upload-wrapper" style={{ padding: 12 }} onClick={() => document.getElementById('event-image-upload').click()}>
                      <input type="file" id="event-image-upload" hidden onChange={handleImageUpload} accept="image/*" />
                      {form.imageUrl ? (
                         <div style={{ position:'relative', height: 100 }}>
                            <img src={getImageUrl(form.imageUrl)} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:8 }} />
                         </div>
                      ) : (
                        <div style={{ padding: '10px 0', color: '#94a3b8', fontSize:'0.8rem' }}>
                          <FiImage size={24} />
                          <p>Bấm để tải ảnh</p>
                        </div>
                      )}
                      {uploading && <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,0.7)', display:'flex', alignItems:'center', justifyContent:'center' }}>Đang tải...</div>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả ngắn (Description)</label>
                <textarea className="form-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Nhập nội dung hiển thị trên banner..." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">Phân loại</label>
                  <select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    {TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Đường dẫn khi click (Link URL)</label>
                  <input className="form-input" value={form.linkUrl} onChange={e => setForm({ ...form, linkUrl: e.target.value })} placeholder="/san-pham/..." />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">Ngày bắt đầu</label>
                  <input className="form-input" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Ngày kết thúc</label>
                  <input className="form-input" type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>

              <div style={{ display:'flex', gap:24 }}>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                    <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} style={{ width:18, height:18 }} />
                    Kích hoạt hiển thị công khai
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowForm(false)} style={{ borderRadius: 12 }}>Hủy</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ borderRadius: 12, minWidth: 120 }}>
                <FiSettings /> {saving ? 'Đang lưu...' : (editId ? 'Lưu thay đổi' : 'Tạo mới')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

