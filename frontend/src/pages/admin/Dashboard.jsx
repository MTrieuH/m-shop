import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBox, FiShoppingBag, FiUsers, FiDollarSign, FiClock, FiAlertTriangle, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { getDashboard } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { formatPrice, getOrderStatusLabel, formatDate, getImageUrl } from '../../utils/helpers';

export default function Dashboard() {
  const { user: currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard().then(res => setData(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="animate-fadeIn">
      <div className="stats-grid">
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 140, borderRadius: 20 }} />)}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div className="skeleton" style={{ height: 300, borderRadius: 20 }} />
        <div className="skeleton" style={{ height: 300, borderRadius: 20 }} />
      </div>
    </div>
  );

  if (!data) return <div style={{padding:20, textAlign:'center'}}>Không thể tải dữ liệu Dashboard.</div>;

  const isAdmin = currentUser?.role === 'Admin';

  const stats = [
    { icon: <FiDollarSign />, label: 'Tổng doanh thu', value: formatPrice(data.totalRevenue || 0), trend: '+12.5%', cls: 'blue', adminOnly: true },
    { icon: <FiShoppingBag />, label: 'Tổng đơn hàng', value: data.totalOrders || 0, trend: '+8.2%', cls: 'green' },
    { icon: <FiBox />, label: 'Tổng sản phẩm', value: data.totalProducts || 0, cls: 'orange' },
    { icon: <FiUsers />, label: 'Tổng khách hàng', value: data.totalUsers || 0, trend: '+5.4%', cls: 'purple', adminOnly: true },
    { icon: <FiClock />, label: 'Chờ xử lý', value: data.pendingOrders || 0, cls: 'blue', warehouseOnly: true },
  ].filter(s => (isAdmin || !s.adminOnly) && (!s.warehouseOnly || !isAdmin));

  return (
    <div className="animate-fadeIn">
      {/* Stats Section */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            {s.trend && <div className="stat-trend trend-up"><FiTrendingUp /> {s.trend}</div>}
          </div>
        ))}
      </div>
 
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: 24, marginBottom: 24 }}>
        {/* Low Stock alerting list */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title"><FiAlertTriangle style={{marginRight:8, color:'#ef4444'}} /> Cảnh báo tồn kho thấp</h3>
            <span className="status-badge" style={{background:'#fef2f2', color:'#ef4444', fontWeight:800}}>{data.lowStockProducts || 0}</span>
          </div>
          <div className="low-stock-list" style={{ padding: '0 24px 24px' }}>
            {data.lowStockList && data.lowStockList.length > 0 ? (
              <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                {data.lowStockList.map((p, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:16, padding:'12px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <img src={getImageUrl(p.imageUrl)} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} onError={(e)=>e.target.src='https://placehold.co/44x44'} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize:'0.9rem', fontWeight:700, color:'#1e293b', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</p>
                      <p style={{ fontSize:'0.75rem', color:'#64748b' }}>Thương hiệu: {p.brand}</p>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <p style={{ fontSize:'1rem', fontWeight:800, color:'#ef4444' }}>{p.quantity}</p>
                      <p style={{ fontSize:'0.65rem', color:'#94a3b8', textTransform:'uppercase', fontWeight:700 }}>còn lại</p>
                    </div>
                  </div>
                ))}
                <Link to="/admin/products" className="btn btn-outline btn-full btn-sm" style={{ marginTop: 16, borderRadius: 10 }}>Xem tất cả kho hàng</Link>
              </div>
            ) : (
                <div style={{ textAlign:'center', padding:'40px 0' }}>
                   <div style={{ fontSize:'2.5rem', marginBottom:12 }}>✅</div>
                   <p style={{ color:'#64748b', fontSize:'0.9rem' }}>Kho hàng đang ở mức an toàn</p>
                </div>
            )}
          </div>
        </div>

        {/* Revenue chart - Admin Only */}
        {isAdmin && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Xu hướng doanh thu (6 tháng)</h3>
            </div>
            <div style={{ padding: 24 }}>
              {data.monthlyRevenue && data.monthlyRevenue.length > 0 ? (
                <div style={{ height: 200, position:'relative', display:'flex', alignItems:'flex-end', gap:12 }}>
                  {data.monthlyRevenue.map((m, i) => {
                    const maxRev = Math.max(...data.monthlyRevenue.map(x => x.revenue), 1);
                    const h = Math.max((m.revenue / maxRev) * 100, 5);
                    return (
                      <div key={i} style={{ flex: 1, display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                        <div style={{ 
                            width: '100%', 
                            height: `${h}%`, 
                            background: 'var(--color-primary)', 
                            borderRadius: '8px 8px 4px 4px',
                            opacity: 0.8 + (i * 0.04),
                            transition: 'height 1s ease-in-out',
                            position:'relative'
                        }} title={formatPrice(m.revenue)}>
                            <div style={{ position:'absolute', top:-20, left:'50%', transform:'translateX(-50%)', fontSize:'0.65rem', fontWeight:700, opacity:0.6 }}>
                                {Math.round(m.revenue/1000000)}M
                            </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>{m.month}</div>
                      </div>
                    );
                  })}
                </div>
              ) : <p style={{color:'#64748b', textAlign:'center', padding:40}}>Chưa có dữ liệu thống kê</p>}
              
              <div style={{ marginTop: 24, padding: 16, background: '#f8fafc', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Tháng hiện tại</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 800 }}>{formatPrice(data.monthlyRevenue?.[data.monthlyRevenue.length-1]?.revenue || 0)}</p>
                 </div>
                 <div style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
                    <FiTrendingUp /> +15%
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Đơn hàng mới nhận</h3>
          <Link to="/admin/orders" className="btn btn-sm btn-outline" style={{ borderRadius: 8 }}>Xem cấu trúc đơn <FiArrowRight /></Link>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr><th>Mã đơn</th><th>Khách hàng</th><th>Tổng tiền</th><th>Trạng thái</th><th>Thời gian</th></tr>
            </thead>
            <tbody>
              {!data.recentOrders || data.recentOrders.length === 0 ? (
                <tr><td colSpan={5} style={{textAlign:'center', padding:40, color:'#94a3b8'}}>Chưa có đơn hàng nào phát sinh</td></tr>
              ) : data.recentOrders.map(o => (
                <tr key={o.id}>
                  <td><strong style={{ color: 'var(--color-primary)' }}>#{o.orderCode}</strong></td>
                  <td>{o.fullName}</td>
                  <td style={{ fontWeight: 700 }}>{formatPrice(o.totalAmount)}</td>
                  <td>
                    <span className={`status-badge ${o.status.toLowerCase()}`} style={{
                        background: o.status === 'Delivered' ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)',
                        color: o.status === 'Delivered' ? 'var(--color-success)' : 'var(--color-info)'
                    }}>{getOrderStatusLabel(o.status)}</span>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

