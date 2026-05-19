import { useState, useEffect } from 'react';
import { FiTag, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { adminGetCoupons, adminCreateCoupon, adminDeleteCoupon } from '../../services/api';
import './Admin.css';

export default function CouponManager() {
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code:'', description:'', discountType:'Percent', discountValue:10, minOrderAmount:0, maxDiscount:'', maxUses:100, expiresAt:'' });
  const [loading, setLoading] = useState(true);

  const loadCoupons = () => {
    adminGetCoupons().then(res => setCoupons(res.data)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(loadCoupons, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const data = { ...form, maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : null, expiresAt: form.expiresAt || null };
    await adminCreateCoupon(data);
    setShowModal(false);
    setForm({ code:'', description:'', discountType:'Percent', discountValue:10, minOrderAmount:0, maxDiscount:'', maxUses:100, expiresAt:'' });
    loadCoupons();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa mã giảm giá này?')) return;
    await adminDeleteCoupon(id);
    loadCoupons();
  };

  return (
    <div className="admin-page">
      <h2 className="admin-title">Mã Giảm Giá</h2>
      <div style={{display:'flex', justifyContent:'flex-end', marginBottom:16}}>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><FiPlus /> Tạo mã mới</button>
      </div>

      {loading ? <p>Đang tải...</p> : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead><tr>
              <th>Mã</th><th>Mô tả</th><th>Giảm giá</th><th>Đơn tối thiểu</th><th>Đã dùng</th><th>Hết hạn</th><th>Thao tác</th>
            </tr></thead>
            <tbody>
              {coupons.length === 0 ? <tr><td colSpan="7" style={{textAlign:'center',padding:40}}>Chưa có mã giảm giá</td></tr> :
                coupons.map(c => (
                  <tr key={c.id}>
                    <td><strong style={{color:'var(--color-primary)', letterSpacing:1}}><FiTag /> {c.code}</strong></td>
                    <td>{c.description || '–'}</td>
                    <td>{c.discountType === 'Percent' ? `${c.discountValue}%` : `${c.discountValue.toLocaleString('vi-VN')}₫`}{c.maxDiscount ? ` (max ${c.maxDiscount.toLocaleString('vi-VN')}₫)` : ''}</td>
                    <td>{c.minOrderAmount > 0 ? `${c.minOrderAmount.toLocaleString('vi-VN')}₫` : '–'}</td>
                    <td>{c.usedCount}/{c.maxUses}</td>
                    <td>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('vi-VN') : 'Không'}</td>
                    <td><button className="btn-icon danger" onClick={() => handleDelete(c.id)} title="Xóa"><FiTrash2 /></button></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <h3>Tạo Mã Giảm Giá</h3>
              <button className="close-btn" onClick={() => setShowModal(false)} style={{ background:'none', color:'#94a3b8' }}><FiX size={20} /></button>
            </div>
            <div className="modal-body" style={{ background: '#f8fafc' }}>
              <form id="coupon-form" onSubmit={handleCreate}>
                <div className="form-group">
                  <label className="form-label">Mã code giảm giá</label>
                  <input className="form-input" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} required maxLength={20} placeholder="VD: GIAM20" />
                </div>
                <div className="form-group">
                  <label className="form-label">Mô tả chương trình</label>
                  <input className="form-input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="VD: Giảm 20% cho đơn từ 500K" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div className="form-group">
                    <label className="form-label">Loại giảm giá</label>
                    <select className="form-input" value={form.discountType} onChange={e => setForm({...form, discountType: e.target.value})}>
                      <option value="Percent">Phần trăm (%)</option>
                      <option value="Fixed">Số tiền cố định (₫)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mức giảm</label>
                    <input className="form-input" type="number" value={form.discountValue} onChange={e => setForm({...form, discountValue: parseFloat(e.target.value)})} required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div className="form-group">
                    <label className="form-label">Giá trị đơn tối thiểu (₫)</label>
                    <input className="form-input" type="number" value={form.minOrderAmount} onChange={e => setForm({...form, minOrderAmount: parseFloat(e.target.value)})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Giảm tối đa (₫)</label>
                    <input className="form-input" type="number" value={form.maxDiscount} onChange={e => setForm({...form, maxDiscount: e.target.value})} placeholder="Không giới hạn" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div className="form-group">
                    <label className="form-label">Lượt dùng tối đa</label>
                    <input className="form-input" type="number" value={form.maxUses} onChange={e => setForm({...form, maxUses: parseInt(e.target.value)})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hết hạn (Tùy chọn)</label>
                    <input className="form-input" type="date" value={form.expiresAt} onChange={e => setForm({...form, expiresAt: e.target.value})} />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} style={{ borderRadius: 12 }}>Hủy bỏ</button>
              <button type="submit" form="coupon-form" className="btn btn-primary" style={{ borderRadius: 12, minWidth: 120 }}>Tạo mã</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
