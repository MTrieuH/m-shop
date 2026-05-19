import { useState, useEffect, useCallback } from 'react';
import { FiEye, FiSearch, FiX } from 'react-icons/fi';
import { adminGetOrders, adminUpdateOrderStatus } from '../../services/api';
import { formatPrice, getOrderStatusLabel, formatDate, getImageUrl } from '../../utils/helpers';
import Swal from 'sweetalert2';

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const load = useCallback(() => {
    adminGetOrders({ status: statusFilter || undefined, page, pageSize: 15 }).then(res => { setOrders(res.data.items); setTotal(res.data.totalCount); }).catch(() => {});
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminUpdateOrderStatus(orderId, newStatus);
      load();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) { Swal.fire('Lỗi', err.response?.data?.message || 'Lỗi cập nhật trạng thái', 'error'); }
  };

  const statuses = ['Pending', 'Confirmed', 'Shipping', 'Delivered', 'Cancelled'];

  return (
    <div>
      <div className="admin-toolbar">
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <select className="form-input" style={{ maxWidth: 200 }} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">Tất cả trạng thái</option>
            {statuses.map(s => <option key={s} value={s}>{getOrderStatusLabel(s)}</option>)}
          </select>
          <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{total} đơn hàng</span>
        </div>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr><th>Mã đơn</th><th>Khách hàng</th><th>SĐT</th><th>Phương thức</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ngày</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={8} style={{textAlign:'center', padding:40, color:'var(--color-text-muted)'}}>Không tìm thấy đơn hàng nào.</td></tr>
            ) : orders.map(o => (
              <tr key={o.id}>
                <td><strong>{o.orderCode}</strong></td>
                <td>{o.fullName}</td>
                <td>{o.phone}</td>
                <td><span style={{ fontSize:'0.85rem' }}>{o.paymentMethod}</span></td>
                <td style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{formatPrice(o.totalAmount)}</td>
                <td><span className={`status-badge ${o.status.toLowerCase()}`}>{getOrderStatusLabel(o.status)}</span></td>
                <td style={{ fontSize: '0.85rem' }}>{formatDate(o.createdAt)}</td>
                <td>
                  <div className="action-btns">
                    <button className="action-btn-sm edit" onClick={() => setSelectedOrder(o)}><FiEye size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {total > 15 && (
        <div className="pagination" style={{ marginTop: 24 }}>
          {[...Array(Math.ceil(total / 15))].map((_, i) => (
            <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
          ))}
        </div>
      )}

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" style={{ maxWidth: 800 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết đơn hàng #{selectedOrder.orderCode}</h3>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}><FiX /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
                <div>
                  <h4 style={{ marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 6 }}>Sản phẩm</h4>
                  <div className="order-items-list" style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="order-item-adm" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <img src={getImageUrl(item.productImage)} alt="" style={{ width: 50, height: 50, borderRadius: 6, objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.productName}</p>
                          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{formatPrice(item.price)} x {item.quantity}</p>
                        </div>
                        <p style={{ fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 20, padding: 16, background: '#f8f9fa', borderRadius: 8 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                      <span>Tổng giá trị:</span> <span>{formatPrice(selectedOrder.totalAmount)}</span>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', fontWeight:700, fontSize:'1.1rem', color:'var(--color-accent)' }}>
                      <span>Tổng cộng:</span> <span>{formatPrice(selectedOrder.totalAmount)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 style={{ marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 6 }}>Thông tin khách hàng</h4>
                  <div style={{ fontSize: '0.9rem', display:'flex', flexDirection:'column', gap:12 }}>
                    <div><p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Người nhận:</p><p style={{ fontWeight: 600 }}>{selectedOrder.fullName}</p></div>
                    <div><p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Số điện thoại:</p><p>{selectedOrder.phone}</p></div>
                    <div><p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Địa chỉ:</p><p>{selectedOrder.address}</p></div>
                    {selectedOrder.note && <div><p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Ghi chú:</p><p style={{ fontStyle: 'italic' }}>{selectedOrder.note}</p></div>}
                    <div><p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Thanh toán:</p><p>{selectedOrder.paymentMethod}</p></div>
                    
                    <div style={{ marginTop: 12, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
                      <p style={{ marginBottom: 8, fontWeight: 600 }}>Trạng thái đơn hàng</p>
                      <select
                        className="form-input"
                        value={selectedOrder.status}
                        onChange={e => handleStatusChange(selectedOrder.id, e.target.value)}
                        style={{ border: '2px solid var(--color-primary)' }}
                      >
                        {statuses.map(s => <option key={s} value={s}>{getOrderStatusLabel(s)}</option>)}
                      </select>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 8 }}>
                        Khi đổi sang <strong>"Đã xác nhận"</strong>, hàng sẽ tự động trừ kho.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" style={{ display:'flex', alignItems:'center', gap:5 }} onClick={() => window.print()}>In đơn hàng</button>
              <button className="btn btn-primary" onClick={() => setSelectedOrder(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

