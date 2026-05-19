import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiBox, FiShoppingBag, FiUsers, FiLayers, FiArrowLeft, FiMenu, FiX, FiTag, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import './Admin.css';

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isStaff = user && (user.role === 'Admin' || user.role === 'Warehouse');

  useEffect(() => {
    if (!loading && !isStaff) { navigate('/dang-nhap'); return; }
    
    // Redirect Warehouse users from dashboard to products
    if (!loading && user?.role === 'Warehouse' && location.pathname === '/admin') {
      navigate('/admin/products', { replace: true });
    }
  }, [user, loading, navigate, isStaff, location.pathname]);

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontSize:'1.1rem',color:'#666'}}>Đang tải...</div>;
  if (!isStaff) return null;

  const allNavItems = [
    { path: '/admin', icon: <FiGrid />, label: 'Tổng quan', exact: true, roles: ['Admin'] },
    { path: '/admin/products', icon: <FiBox />, label: 'Sản phẩm', roles: ['Admin', 'Warehouse'] },
    { path: '/admin/orders', icon: <FiShoppingBag />, label: 'Đơn hàng', roles: ['Admin', 'Warehouse'] },
    { path: '/admin/categories', icon: <FiLayers />, label: 'Danh mục', roles: ['Admin'] },
    { path: '/admin/users', icon: <FiUsers />, label: 'Người dùng', roles: ['Admin'] },
    { path: '/admin/coupons', icon: <FiTag />, label: 'Mã giảm giá', roles: ['Admin'] },
    { path: '/admin/events', icon: <FiCalendar />, label: 'Banner & Sự kiện', roles: ['Admin', 'Warehouse'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(user.role));

  const isActive = (item) => item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  return (
    <div className="admin-wrapper">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-logo">
            <div className="logo-m">M</div>
            <span className="logo-text">SHOP Admin</span>
          </Link>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}><FiX size={22} /></button>
        </div>
        
        <nav className="admin-nav">
          {navItems.map(item => (
            <Link key={item.path} to={item.path} className={`admin-nav-item ${isActive(item) ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              {item.icon} <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-profile">
            <div className="admin-user-avatar">
              {user.fullName.charAt(0)}
            </div>
            <div className="admin-user-info">
              <span className="admin-user-name">{user.fullName}</span>
              <span className="admin-user-role">{user.role === 'Admin' ? 'Quản trị viên' : 'Nhân viên kho'}</span>
            </div>
          </div>
          <Link to="/" className="admin-nav-item back-link"><FiArrowLeft /> Về trang chủ</Link>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}><FiMenu size={22} /></button>
          <div className="admin-topbar-title">
            <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>Admin /</span>
            {navItems.find(i => isActive(i))?.label || 'Bảng điều khiển'}
          </div>
          <div className="admin-topbar-actions">
             {/* Future topbar actions like notifications */}
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
}

