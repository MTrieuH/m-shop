import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiUser, FiPackage, FiLogOut, FiEdit2, FiLock, FiCheck, FiShield, FiEye, FiEyeOff, FiPhone, FiMapPin, FiMail, FiAlertCircle, FiChevronDown, FiChevronUp, FiClock, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { getOrders, updateProfile, changePassword } from '../services/api';
import { formatPrice, getOrderStatusLabel, formatDate } from '../utils/helpers';
import Swal from 'sweetalert2';
import './Account.css';

/* ============ VN VALIDATION ============ */
const VN_PHONE_REGEX = /^(0[3-9])[0-9]{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(field, value) {
  if (!value || !value.trim()) return null;
  switch (field) {
    case 'phone':
      return VN_PHONE_REGEX.test(value) ? null : 'Số điện thoại phải đúng định dạng VN (10 số, bắt đầu bằng 03-09)';
    case 'email':
      return EMAIL_REGEX.test(value) ? null : 'Email không đúng định dạng';
    case 'address':
      return value.trim().length >= 10 ? null : 'Địa chỉ phải có ít nhất 10 ký tự';
    case 'fullName':
      return value.trim().length >= 2 ? null : 'Họ tên phải có ít nhất 2 ký tự';
    default:
      return null;
  }
}

function isFieldVerified(field, value) {
  if (!value || !value.trim()) return false;
  return validateField(field, value) === null;
}

/* ============ PROFILE COMPLETENESS ============ */
function getProfileCompleteness(user) {
  const fields = [
    { key: 'fullName', label: 'Họ tên', filled: !!user.fullName },
    { key: 'email', label: 'Email', filled: !!user.email },
    { key: 'phone', label: 'Số điện thoại', filled: !!user.phone && VN_PHONE_REGEX.test(user.phone) },
    { key: 'address', label: 'Địa chỉ', filled: !!user.address && user.address.length >= 10 },
  ];
  const filled = fields.filter(f => f.filled).length;
  return { fields, filled, total: fields.length, percent: Math.round((filled / fields.length) * 100) };
}

/* ============ VERIFICATION BADGE ============ */
function VerifyBadge({ verified, label }) {
  return (
    <span className={`verify-badge ${verified ? 'verified' : 'unverified'}`}>
      {verified ? <><FiCheck size={12} /> Đã xác minh</> : <><FiAlertCircle size={12} /> {label || 'Chưa cập nhật'}</>}
    </span>
  );
}

/* ============ PASSWORD INPUT ============ */
function PasswordField({ value, onChange, placeholder, id }) {
  const [show, setShow] = useState(false);
  return (
    <div className="password-field-wrapper">
      <input
        id={id}
        className="form-input"
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
      <button type="button" className="pw-toggle" onClick={() => setShow(!show)} tabIndex={-1}>
        {show ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
}

/* ============ ORDER TRACKING ROADMAP ============ */
const ORDER_TIMELINE_STEPS = [
  { status: 'Pending',   label: 'Đặt hàng',      desc: 'Đơn hàng đã được tạo, chờ xác nhận', icon: <FiClock /> },
  { status: 'Confirmed', label: 'Xác nhận',       desc: 'Đã xác nhận đơn hàng, chuẩn bị hàng', icon: <FiCheckCircle /> },
  { status: 'Shipping',  label: 'Đang giao',      desc: 'Đơn vị vận chuyển đang giao hàng đến bạn', icon: <FiTruck /> },
  { status: 'Delivered', label: 'Hoàn thành',     desc: 'Giao hàng thành công', icon: <FiCheck /> },
];

function getStepIndex(status) {
  if (status === 'Cancelled') return -1;
  const idx = ORDER_TIMELINE_STEPS.findIndex(s => s.status === status);
  return idx >= 0 ? idx : 0;
}

function OrderTrackingRoadmap({ order }) {
  const isCancelled = order.status === 'Cancelled';
  const currentIdx = getStepIndex(order.status);

  if (isCancelled) {
    return (
      <div className="order-tracking-cancelled">
        <FiXCircle size={28} />
        <div>
          <strong>Đơn hàng đã bị hủy</strong>
          <p>Nếu bạn đã thanh toán, số tiền sẽ được hoàn trả trong 3-5 ngày làm việc.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-tracking-roadmap">
      <h4 className="roadmap-title">Tình trạng đơn hàng</h4>
      <div className="roadmap-timeline">
        {ORDER_TIMELINE_STEPS.map((step, idx) => {
          const isCompleted = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <div key={step.status} className={`roadmap-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
              <div className="roadmap-icon-col">
                <div className="roadmap-icon">{step.icon}</div>
                {idx < ORDER_TIMELINE_STEPS.length - 1 && <div className="roadmap-connector" />}
              </div>
              <div className="roadmap-info">
                <span className="roadmap-step-label">{step.label}</span>
                <span className="roadmap-step-desc">{step.desc}</span>
                {isCurrent && <span className="roadmap-current-tag">Hiện tại</span>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="roadmap-meta">
        <div className="roadmap-meta-row">
          <span>Phương thức thanh toán</span>
          <strong>{order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : order.paymentMethod === 'QR' ? 'Chuyển khoản QR' : 'Chuyển khoản'}</strong>
        </div>
        {order.phone && (
          <div className="roadmap-meta-row">
            <span>Liên hệ</span>
            <strong>{order.phone}</strong>
          </div>
        )}
        {order.address && (
          <div className="roadmap-meta-row">
            <span>Giao đến</span>
            <strong>{order.address}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ MAIN COMPONENT ============ */
export default function Account() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';
  const initialOrderId = searchParams.get('orderId') ? parseInt(searchParams.get('orderId')) : null;

  const [tab, setTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', address: '' });
  const [formErrors, setFormErrors] = useState({});

  // Password state
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Order expand state
  const [expandedOrder, setExpandedOrder] = useState(initialOrderId);

  // Cancel Modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState('Thay đổi địa chỉ / Số điện thoại nhận hàng');
  const [cancelReasonOther, setCancelReasonOther] = useState('');

  const cancelOptions = [
    'Thay đổi địa chỉ / Số điện thoại nhận hàng',
    'Muốn thay đổi hình thức thanh toán',
    'Tìm thấy nơi khác có giá hợp lý hơn',
    'Thủ tục thanh toán quá phức tạp',
    'Không còn nhu cầu mua nữa',
    'Khác'
  ];

  useEffect(() => {
    if (!user) { navigate('/dang-nhap'); return; }
    setForm({ fullName: user.fullName, phone: user.phone || '', address: user.address || '' });
    getOrders().then(res => setOrders(res.data)).catch(() => {});
  }, [user, navigate]);

  const completeness = useMemo(() => user ? getProfileCompleteness(user) : null, [user]);

  /* ---- Validate form on change ---- */
  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    const err = validateField(field, value);
    setFormErrors(prev => ({ ...prev, [field]: err }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });

    const errors = {};
    if (form.fullName) errors.fullName = validateField('fullName', form.fullName);
    if (form.phone) errors.phone = validateField('phone', form.phone);
    if (form.address) errors.address = validateField('address', form.address);

    const hasErrors = Object.values(errors).some(v => v !== null);
    setFormErrors(errors);
    if (hasErrors) return;

    try {
      const res = await updateProfile(form);
      setUser(res.data);
      setEditing(false);
      setProfileMsg({ type: 'success', text: 'Cập nhật thông tin thành công!' });
      setTimeout(() => setProfileMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');
    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassError('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (passForm.newPassword.length < 6) {
      setPassError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    setIsChangingPass(true);
    try {
      await changePassword(passForm.currentPassword, passForm.newPassword);
      setPassSuccess('Đổi mật khẩu thành công!');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassError(err.response?.data?.message || 'Mật khẩu hiện tại không đúng.');
    } finally {
      setIsChangingPass(false);
    }
  };

  const submitCancelOrder = async () => {
    const finalReason = cancelReason === 'Khác' ? cancelReasonOther : cancelReason;
    if (!finalReason.trim()) { Swal.fire('Lỗi', 'Vui lòng nhập lý do', 'warning'); return; }
    try {
      const { cancelOrder } = await import('../services/api');
      const res = await cancelOrder(cancelOrderId, finalReason);
      setOrders(orders.map(o => o.id === cancelOrderId ? res.data : o));
      setCancelModalOpen(false);
      setCancelReasonOther('');
      Swal.fire('Thành công', 'Đã hủy đơn hàng thành công.', 'success');
    } catch(err) {
      Swal.fire('Lỗi', err.response?.data?.message || 'Không thể hủy đơn hàng.', 'error');
    }
  };

  if (!user) return null;

  return (
    <div className="account-page">
      <div className="container">
        <h1 className="page-title">Tài Khoản</h1>
        <div className="account-layout">
          {/* ============ SIDEBAR ============ */}
          <aside className="account-sidebar">
            <div className="account-user-card">
              <div className="account-avatar">{user.fullName?.charAt(0)?.toUpperCase()}</div>
              <div>
                <p className="account-name">{user.fullName}</p>
                <p className="account-email">{user.email}</p>
              </div>
            </div>

            {/* Profile Completeness */}
            {completeness && (
              <div className="completeness-section">
                <div className="completeness-header">
                  <span className="completeness-label">Hồ sơ hoàn thiện</span>
                  <span className="completeness-percent">{completeness.percent}%</span>
                </div>
                <div className="completeness-bar">
                  <div className="completeness-fill" style={{ width: `${completeness.percent}%` }} />
                </div>
                {completeness.percent < 100 && (
                  <p className="completeness-hint">Hoàn thiện hồ sơ để thanh toán nhanh hơn</p>
                )}
              </div>
            )}

            <nav className="account-nav">
              <button className={`account-nav-item ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
                <FiUser /> Thông tin cá nhân
              </button>
              <button className={`account-nav-item ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
                <FiPackage /> Đơn hàng ({orders.length})
              </button>
              <button className={`account-nav-item ${tab === 'security' ? 'active' : ''}`} onClick={() => setTab('security')}>
                <FiLock /> Bảo mật
              </button>
              <button className="account-nav-item logout" onClick={() => { logout(); navigate('/'); }}>
                <FiLogOut /> Đăng xuất
              </button>
            </nav>
          </aside>

          {/* ============ CONTENT ============ */}
          <div className="account-content">
            {/* ---- PROFILE TAB ---- */}
            {tab === 'profile' && (
              <div className="account-section">
                <div className="section-header-row">
                  <h2>Thông tin cá nhân</h2>
                  {!editing && (
                    <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>
                      <FiEdit2 /> Chỉnh sửa
                    </button>
                  )}
                </div>

                {profileMsg.text && (
                  <div className={`alert ${profileMsg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                    {profileMsg.type === 'success' ? <FiCheck /> : null} {profileMsg.text}
                  </div>
                )}

                {editing ? (
                  <form onSubmit={handleUpdateProfile} className="account-form">
                    <div className="form-group">
                      <label className="form-label">Họ tên *</label>
                      <input
                        className={`form-input ${formErrors.fullName ? 'input-error' : ''}`}
                        value={form.fullName}
                        onChange={e => handleFormChange('fullName', e.target.value)}
                        required
                      />
                      {formErrors.fullName && <span className="field-error">{formErrors.fullName}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Số điện thoại</label>
                      <input
                        className={`form-input ${formErrors.phone ? 'input-error' : ''}`}
                        value={form.phone}
                        onChange={e => handleFormChange('phone', e.target.value)}
                        placeholder="VD: 0912345678"
                        maxLength={10}
                      />
                      {formErrors.phone && <span className="field-error">{formErrors.phone}</span>}
                      {!formErrors.phone && form.phone && <span className="field-hint">✓ Số điện thoại hợp lệ</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Địa chỉ nhận hàng</label>
                      <textarea
                        className={`form-input ${formErrors.address ? 'input-error' : ''}`}
                        rows={3}
                        value={form.address}
                        onChange={e => handleFormChange('address', e.target.value)}
                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      />
                      {formErrors.address && <span className="field-error">{formErrors.address}</span>}
                      {!formErrors.address && form.address && form.address.length >= 10 && <span className="field-hint">✓ Địa chỉ hợp lệ</span>}
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
                      <button type="button" className="btn btn-outline" onClick={() => { setEditing(false); setForm({ fullName: user.fullName, phone: user.phone || '', address: user.address || '' }); setFormErrors({}); }}>Hủy</button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-info-grid">
                    <div className="info-card">
                      <div className="info-card-header">
                        <FiMail className="info-card-icon" />
                        <span className="info-label">Email</span>
                      </div>
                      <strong className="info-value">{user.email}</strong>
                      <VerifyBadge verified={isFieldVerified('email', user.email)} />
                    </div>
                    <div className="info-card">
                      <div className="info-card-header">
                        <FiUser className="info-card-icon" />
                        <span className="info-label">Họ tên</span>
                      </div>
                      <strong className="info-value">{user.fullName}</strong>
                      <VerifyBadge verified={isFieldVerified('fullName', user.fullName)} />
                    </div>
                    <div className="info-card">
                      <div className="info-card-header">
                        <FiPhone className="info-card-icon" />
                        <span className="info-label">Điện thoại</span>
                      </div>
                      <strong className="info-value">{user.phone || 'Chưa cập nhật'}</strong>
                      <VerifyBadge verified={isFieldVerified('phone', user.phone)} label="Chưa xác minh" />
                    </div>
                    <div className="info-card">
                      <div className="info-card-header">
                        <FiMapPin className="info-card-icon" />
                        <span className="info-label">Địa chỉ nhận hàng</span>
                      </div>
                      <strong className="info-value">{user.address || 'Chưa cập nhật'}</strong>
                      <VerifyBadge verified={isFieldVerified('address', user.address)} label="Chưa cập nhật" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ---- SECURITY TAB ---- */}
            {tab === 'security' && (
              <div className="account-section">
                <h2>Bảo mật tài khoản</h2>
                <div className="security-banner">
                  <FiShield size={32} className="security-icon" />
                  <div>
                    <h4>Bảo vệ tài khoản của bạn</h4>
                    <p>Đổi mật khẩu định kỳ (3-6 tháng) để đảm bảo an toàn tài khoản M-Shop.</p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="account-form security-form">
                  {passError && <div className="alert alert-error">{passError}</div>}
                  {passSuccess && <div className="alert alert-success"><FiCheck /> {passSuccess}</div>}

                  <div className="form-group">
                    <label className="form-label">Mật khẩu hiện tại</label>
                    <PasswordField
                      id="current-pw"
                      value={passForm.currentPassword}
                      onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })}
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mật khẩu mới</label>
                    <PasswordField
                      id="new-pw"
                      value={passForm.newPassword}
                      onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })}
                      placeholder="Ít nhất 6 ký tự"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Xác nhận mật khẩu mới</label>
                    <PasswordField
                      id="confirm-pw"
                      value={passForm.confirmPassword}
                      onChange={e => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                      placeholder="Nhập lại mật khẩu mới"
                    />
                    {passForm.confirmPassword && passForm.newPassword !== passForm.confirmPassword && (
                      <span className="field-error">Mật khẩu xác nhận không khớp</span>
                    )}
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={isChangingPass}>
                    {isChangingPass ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                  </button>
                </form>
              </div>
            )}

            {/* ---- ORDERS TAB ---- */}
            {tab === 'orders' && (
              <div className="account-section">
                <h2>Lịch sử đơn hàng</h2>
                {orders.length === 0 ? (
                  <div className="no-data-card">
                    <FiPackage size={48} />
                    <p>Bạn chưa có đơn hàng nào.</p>
                    <Link to="/san-pham" className="btn btn-primary btn-sm">Mua sắm ngay</Link>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map(order => (
                      <div key={order.id} className={`order-card ${expandedOrder === order.id ? 'expanded' : ''}`}>
                        <div className="order-header" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                          <div className="order-header-left">
                            <span className="order-code">#{order.orderCode}</span>
                            <span className="order-date">{formatDate(order.createdAt)}</span>
                          </div>
                          <div className="order-header-right">
                            <span className={`order-status status-${order.status.toLowerCase()}`}>{getOrderStatusLabel(order.status)}</span>
                            {expandedOrder === order.id ? <FiChevronUp /> : <FiChevronDown />}
                          </div>
                        </div>

                        {expandedOrder === order.id && (
                          <div className="order-details-expanded">
                            {/* === ORDER TRACKING ROADMAP === */}
                            <OrderTrackingRoadmap order={order} />

                            <div className="order-items-section">
                              <h5 className="order-items-title">Sản phẩm trong đơn</h5>
                              <div className="order-items-list">
                                {order.items?.map((item, i) => (
                                  <div key={i} className="order-item-row">
                                    <span className="order-item-name">{item.productName}</span>
                                    <span className="order-item-qty">x{item.quantity}</span>
                                    <span className="order-item-price">{formatPrice(item.price * item.quantity)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="order-footer">
                          <span className="order-total">Tổng: {formatPrice(order.totalAmount)}</span>
                          {order.status === 'Pending' && (
                            <button 
                              className="btn btn-outline btn-sm btn-danger-outline" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setCancelOrderId(order.id);
                                setCancelModalOpen(true);
                              }}
                            >
                              Hủy đơn
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {cancelModalOpen && (
        <div className="cancel-modal-overlay">
          <div className="cancel-modal-content">
            <h3>Hủy Đơn Hàng</h3>
            <p className="cancel-subtitle">Vui lòng chọn lý do hủy đơn hàng của bạn:</p>
            <div className="cancel-reasons">
              {cancelOptions.map(r => (
                <label key={r} className="cancel-radio">
                  <input type="radio" name="reason" checked={cancelReason === r} onChange={() => setCancelReason(r)} /> 
                  <span className="cancel-radio-text">{r}</span>
                </label>
              ))}
              {cancelReason === 'Khác' && (
                <textarea 
                  className="form-input cancel-other-input" 
                  rows={2} 
                  placeholder="Nhập lý do của bạn..." 
                  value={cancelReasonOther} 
                  onChange={e => setCancelReasonOther(e.target.value)} 
                />
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setCancelModalOpen(false)}>Quay lại</button>
              <button className="btn btn-primary" style={{background: 'var(--color-danger)'}} onClick={submitCancelOrder}>Xác nhận Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
