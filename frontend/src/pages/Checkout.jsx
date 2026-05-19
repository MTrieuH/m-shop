import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FiCheck, FiTag, FiTruck, FiCreditCard, FiPackage, FiAlertCircle, FiSmartphone, FiDollarSign, FiArrowLeft, FiArrowRight, FiSave, FiClock } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder, validateCoupon, updateProfile, confirmPayment } from '../services/api';
import { formatPrice, getImageUrl } from '../utils/helpers';
import './Checkout.css';

/* ============ STEP INDICATOR ============ */
function StepIndicator({ currentStep, steps }) {
  return (
    <div className="checkout-stepper">
      {steps.map((step, idx) => (
        <div key={step.num} className={`stepper-step ${currentStep >= step.num ? 'active' : ''} ${currentStep > step.num ? 'completed' : ''}`}>
          <div className="stepper-circle">
            {currentStep > step.num ? <FiCheck /> : step.icon}
          </div>
          <span className="stepper-label">{step.label}</span>
          {idx < steps.length - 1 && <div className="stepper-line" />}
        </div>
      ))}
    </div>
  );
}

/* ============ VN PHONE VALIDATION ============ */
const VN_PHONE_REGEX = /^(0[3-9])[0-9]{8}$/;

/* ============ STEPPER CONFIGS ============ */
const STEPS_COD = [
  { num: 1, label: 'Thông tin', icon: <FiTruck /> },
  { num: 2, label: 'Thanh toán', icon: <FiCreditCard /> },
  { num: 3, label: 'Hoàn tất', icon: <FiCheck /> },
];

const STEPS_TRANSFER = [
  { num: 1, label: 'Thông tin', icon: <FiTruck /> },
  { num: 2, label: 'Thanh toán', icon: <FiCreditCard /> },
  { num: 3, label: 'Chuyển khoản', icon: <FiSmartphone /> },
  { num: 4, label: 'Hoàn tất', icon: <FiCheck /> },
];

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const buyNowItem = location.state?.buyNowItem;

  const { items: cartItems, cartTotal: storeCartTotal, clearCart } = useCart();
  
  const items = buyNowItem ? [buyNowItem] : cartItems;
  const cartTotal = buyNowItem ? buyNowItem.price * buyNowItem.quantity : storeCartTotal;

  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null); // Created order data
  const [paymentConfirmed, setPaymentConfirmed] = useState(false); // Only true when user confirms payment
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [saveInfoPrompt, setSaveInfoPrompt] = useState(false);
  const [infoSaved, setInfoSaved] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    email: '',
    paymentMethod: 'COD',
    note: ''
  });

  // Auto-fill from user profile
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const shippingFee = cartTotal >= 500000 ? 0 : 30000;
  const finalTotal = cartTotal + shippingFee - couponDiscount;

  // Profile completeness check
  const profileComplete = useMemo(() => {
    return !!(user?.phone && VN_PHONE_REGEX.test(user.phone) && user?.address && user.address.length >= 10);
  }, [user]);

  // Check if form info differs from profile (= user entered new info at checkout)
  const infoChanged = useMemo(() => {
    if (!user) return false;
    return (form.phone && form.phone !== (user.phone || '')) ||
           (form.address && form.address !== (user.address || '')) ||
           (form.fullName && form.fullName !== user.fullName);
  }, [form, user]);

  // Dynamic steps based on payment method
  const isTransferPayment = form.paymentMethod === 'QR';
  const stepperSteps = isTransferPayment ? STEPS_TRANSFER : STEPS_COD;
  const finalStepNum = isTransferPayment ? 4 : 3;

  useEffect(() => {
    if (!user && !orderResult) {
      navigate('/dang-nhap?return=/thanh-toan');
    }
  }, [user, orderResult, navigate]);



  if (items.length === 0 && !orderResult) {
    navigate('/gio-hang');
    return null;
  }

  if (!user && !orderResult) {
    return null;
  }

  /* ---- Step 1 Validation ---- */
  const validateStep1 = () => {
    if (!form.fullName.trim()) { setError('Vui lòng nhập họ tên.'); return false; }
    if (!form.phone.trim()) { setError('Vui lòng nhập số điện thoại.'); return false; }
    if (!VN_PHONE_REGEX.test(form.phone)) { setError('Số điện thoại không đúng định dạng VN (10 số, bắt đầu 03-09).'); return false; }
    if (!form.address.trim() || form.address.length < 10) { setError('Vui lòng nhập địa chỉ giao hàng (ít nhất 10 ký tự).'); return false; }
    setError('');

    // Show save prompt if info differs from profile and not already saved
    if (infoChanged && !profileComplete && !infoSaved) {
      setSaveInfoPrompt(true);
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) return;
    setStep(prev => Math.min(prev + 1, 2));
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  /* ---- Save info to profile (Shopee-style) ---- */
  const handleSaveInfo = async () => {
    try {
      const res = await updateProfile({
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
      });
      setUser(res.data);
      setInfoSaved(true);
      setSaveInfoPrompt(false);
    } catch {
      setSaveInfoPrompt(false);
    }
  };

  const handleSkipSave = () => {
    setSaveInfoPrompt(false);
  };

  /* ---- Coupon ---- */
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponMsg('');
    try {
      const res = await validateCoupon(couponCode.trim(), cartTotal);
      if (res.data.valid) {
        setCouponDiscount(res.data.discount);
        setCouponApplied(true);
        setCouponMsg(res.data.message);
      } else {
        setCouponDiscount(0);
        setCouponApplied(false);
        setCouponMsg(res.data.message);
      }
    } catch { setCouponMsg('Không thể kiểm tra mã giảm giá.'); }
  };

  const handleRemoveCoupon = () => {
    setCouponCode(''); setCouponDiscount(0); setCouponApplied(false); setCouponMsg('');
  };

  /* ---- Submit Order ---- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await createOrder({
        ...form,
        items: items.map(i => ({ productId: i.id, quantity: i.quantity }))
      });
      setOrderResult(res.data);
      if (!buyNowItem) clearCart();

      // COD: Go straight to success
      if (form.paymentMethod === 'COD') {
        setPaymentConfirmed(true);
        setStep(3);
      } else {
        // QR/Bank: Go to transfer step (step 3), NOT success yet
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally { setLoading(false); }
  };

  /* ---- Secret Shortcut (Hidden) ---- */
  const handleSecretConfirm = async () => {
    try {
      await confirmPayment(orderResult.id);
      setPaymentConfirmed(true);
      setStep(4);
    } catch {
      // ignore
    }
  };



  /* ============ FINAL SUCCESS PAGE ============ */
  if (orderResult && paymentConfirmed) {
    return (
      <div className="checkout-page">
        <div className="container">
          <StepIndicator currentStep={finalStepNum} steps={stepperSteps} />

          <div className="order-success">
            <div className="success-animation">
              <div className="success-circle">
                <FiCheck size={48} />
              </div>
            </div>
            <h2>Đặt Hàng Thành Công!</h2>
            <p className="success-subtitle">Cảm ơn bạn đã mua sắm tại M-Shop</p>

            <div className="success-detail-card">
              <div className="success-detail-row">
                <span>Mã đơn hàng</span>
                <strong>#{orderResult.orderCode}</strong>
              </div>
              <div className="success-detail-row">
                <span>Tổng tiền</span>
                <strong className="text-accent">{formatPrice(orderResult.totalAmount)}</strong>
              </div>
              <div className="success-detail-row">
                <span>Phương thức</span>
                <strong>{orderResult.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : orderResult.paymentMethod === 'QR' ? 'Chuyển khoản QR' : 'Chuyển khoản'}</strong>
              </div>
              <div className="success-detail-row">
                <span>SĐT nhận hàng</span>
                <strong>{orderResult.phone}</strong>
              </div>
              <p className="success-note">
                Chúng tôi sẽ liên hệ xác nhận qua <strong>{orderResult.phone}</strong>. Bạn có thể theo dõi tình trạng đơn hàng trong mục <Link to="/tai-khoan">Tài khoản → Đơn hàng</Link>.
              </p>
            </div>

            <div className="success-actions">
              <Link to={`/tai-khoan?tab=orders&orderId=${orderResult.id}`} className="btn btn-outline">Xem đơn hàng</Link>
              <Link to="/san-pham" className="btn btn-primary">Tiếp tục mua sắm</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ============ TRANSFER CONFIRMATION STEP (Step 3 for QR) ============ */
  if (orderResult && !paymentConfirmed && isTransferPayment) {
    const qrUrl = orderResult.paymentUrl || `https://img.vietqr.io/image/VCB-0123456789-compact2.png?amount=${orderResult.totalAmount}&addInfo=MSHOP%20${orderResult.orderCode}&accountName=M-SHOP`;

    return (
      <div className="checkout-page">
        <div className="container">
          <StepIndicator currentStep={3} steps={stepperSteps} />

          <div className="transfer-confirmation-page">
            <div className="transfer-notice">
              <FiClock size={24} />
              <div>
                <h3>Đơn hàng đã được tạo — Vui lòng hoàn tất thanh toán</h3>
                <p>Mã đơn: <strong>#{orderResult.orderCode}</strong> • Số tiền: <strong className="text-accent">{formatPrice(orderResult.totalAmount)}</strong></p>
              </div>
            </div>

            <div className="transfer-content-grid">
              {/* Bank info */}
              <div className="transfer-bank-card">
                <h4><FiCreditCard /> Thông tin chuyển khoản</h4>
                <div className="bank-details">
                  <div className="bank-row"><span>Ngân hàng</span><strong>Vietcombank</strong></div>
                  <div className="bank-row"><span>Số tài khoản</span><strong>0123456789</strong></div>
                  <div className="bank-row"><span>Chủ tài khoản</span><strong>M-SHOP</strong></div>
                  <div className="bank-row bank-row-highlight"><span>Nội dung CK</span><strong>MSHOP {orderResult.orderCode}</strong></div>
                  <div className="bank-row bank-row-highlight"><span>Số tiền</span><strong className="text-accent">{formatPrice(orderResult.totalAmount)}</strong></div>
                </div>
                <div className="bank-warning">
                  <FiAlertCircle /> Vui lòng ghi đúng nội dung chuyển khoản để đơn hàng được xử lý nhanh nhất.
                </div>
              </div>

              {/* QR Code */}
              {orderResult.paymentMethod === 'QR' && (
                <div className="transfer-qr-card">
                  <h4><FiSmartphone /> Quét QR để thanh toán</h4>
                  <div className="qr-container" onDoubleClick={handleSecretConfirm} title="Bí mật: Click đúp vào mã QR để duyệt tự động">
                    <img src={qrUrl} alt="VietQR" className="qr-image" />
                  </div>
                  <div className="qr-instructions">
                    <p>1. Mở App Ngân hàng / Ví điện tử</p>
                    <p>2. Chọn <strong>Quét QR</strong></p>
                    <p>3. Quét mã bên trên</p>
                    <p>4. Kiểm tra thông tin và xác nhận</p>
                  </div>
                </div>
              )}
            </div>

            <div className="transfer-confirm-section">
              <div 
                style={{ height: '50px', cursor: 'default' }} 
                onDoubleClick={handleSecretConfirm}
              />
              <p className="transfer-support">Cần hỗ trợ? Liên hệ <strong>0901 234 567</strong></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ============ CHECKOUT FORM ============ */
  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Thanh Toán</h1>
        <StepIndicator currentStep={step} steps={stepperSteps} />

        {/* Profile incomplete warning */}
        {!profileComplete && (
          <div className="profile-warning">
            <FiAlertCircle />
            <span>Hồ sơ chưa đầy đủ. <Link to="/tai-khoan">Cập nhật SĐT và địa chỉ</Link> để thanh toán nhanh hơn lần sau.</span>
          </div>
        )}

        {/* Save info prompt (Shopee-style) */}
        {saveInfoPrompt && (
          <div className="save-info-prompt">
            <FiSave className="save-info-icon" />
            <div className="save-info-text">
              <strong>Lưu thông tin giao hàng?</strong>
              <p>Để lần sau không cần nhập lại, lưu thông tin này vào hồ sơ của bạn.</p>
            </div>
            <div className="save-info-actions">
              <button className="btn btn-primary btn-sm" onClick={handleSaveInfo}>Lưu</button>
              <button className="btn btn-outline btn-sm" onClick={handleSkipSave}>Bỏ qua</button>
            </div>
          </div>
        )}

        {infoSaved && (
          <div className="alert-inline alert-success-inline">
            <FiCheck /> Đã lưu thông tin vào hồ sơ. Lần sau sẽ tự động điền!
          </div>
        )}

        <form className="checkout-layout" onSubmit={handleSubmit}>
          <div className="checkout-form">
            {/* ---- STEP 1: Shipping Info ---- */}
            {step === 1 && (
              <div className="checkout-step-content">
                <h3 className="form-section-title"><FiTruck /> Thông tin giao hàng</h3>
                {error && <div className="form-error">{error}</div>}

                <div className="form-group">
                  <label className="form-label">Họ tên *</label>
                  <input className="form-input" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="VD: Nguyễn Văn A" required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Số điện thoại *</label>
                    <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="VD: 0912345678" maxLength={10} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Địa chỉ giao hàng *</label>
                  <textarea className="form-input" rows={3} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Ghi chú đơn hàng</label>
                  <textarea className="form-input" rows={2} placeholder="Ghi chú cho đơn hàng..." value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
                </div>

                <div className="step-actions">
                  <Link to="/gio-hang" className="btn btn-outline"><FiArrowLeft /> Quay lại giỏ hàng</Link>
                  <button type="button" className="btn btn-primary" onClick={handleNextStep}>Tiếp tục <FiArrowRight /></button>
                </div>
              </div>
            )}

            {/* ---- STEP 2: Payment ---- */}
            {step === 2 && (
              <div className="checkout-step-content">
                <h3 className="form-section-title"><FiCreditCard /> Phương thức thanh toán</h3>
                {error && <div className="form-error">{error}</div>}

                <div className="payment-options">
                  {[
                    { value: 'COD', label: 'Thanh toán khi nhận hàng', desc: 'Thanh toán trực tiếp cho đơn vị vận chuyển', icon: <FiDollarSign /> },
                    { value: 'QR', label: 'Quét mã QR', desc: 'Thanh toán bằng VietQR — Hỗ trợ mọi ngân hàng', icon: <FiSmartphone />, tag: 'NHANH NHẤT' }
                  ].map(opt => (
                    <label key={opt.value} className={`payment-card ${form.paymentMethod === opt.value ? 'active' : ''}`}>
                      <input type="radio" name="payment" value={opt.value} checked={form.paymentMethod === opt.value} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} />
                      <div className="payment-card-icon">{opt.icon}</div>
                      <div className="payment-card-info">
                        <span className="payment-card-label">{opt.label}</span>
                        <span className="payment-card-desc">{opt.desc}</span>
                      </div>
                      {opt.tag && <span className="payment-tag">{opt.tag}</span>}
                      <div className="payment-radio" />
                    </label>
                  ))}
                </div>

                {/* Transfer method preview hint */}
                {isTransferPayment && (
                  <div className="transfer-preview-hint">
                    <FiAlertCircle />
                    <span>Sau khi đặt hàng, bạn sẽ nhận được thông tin chuyển khoản. Đơn hàng chỉ được xử lý khi bạn xác nhận đã thanh toán.</span>
                  </div>
                )}

                <div className="step-actions">
                  <button type="button" className="btn btn-outline" onClick={handlePrevStep}><FiArrowLeft /> Quay lại</button>
                  <button type="submit" className="btn btn-accent btn-lg" disabled={loading}>
                    {loading ? 'Đang xử lý...' : form.paymentMethod === 'COD' ? `Đặt hàng — ${formatPrice(finalTotal)}` : `Tiếp tục thanh toán — ${formatPrice(finalTotal)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ============ SIDEBAR SUMMARY ============ */}
          <div className="checkout-summary">
            <div className="summary-card">
              <h3 className="summary-title"><FiPackage /> Đơn hàng ({items.length})</h3>
              <div className="checkout-items">
                {items.map(item => (
                  <div key={item.id} className="checkout-item">
                    <div className="checkout-item-img-wrap">
                      <img src={getImageUrl(item.imageUrl)} alt="" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/1a1a2e/22d3ee?text=M'; }} />
                      <span className="checkout-item-badge">{item.quantity}</span>
                    </div>
                    <div className="checkout-item-info">
                      <p className="checkout-item-name">{item.name}</p>
                    </div>
                    <span className="checkout-item-price">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="coupon-section">
                <label className="form-label"><FiTag /> Mã giảm giá</label>
                {couponApplied ? (
                  <div className="coupon-applied">
                    <span className="coupon-badge">✅ {couponCode.toUpperCase()}</span>
                    <button type="button" className="coupon-remove" onClick={handleRemoveCoupon}>Xóa</button>
                  </div>
                ) : (
                  <div className="coupon-input-row">
                    <input className="form-input" placeholder="Nhập mã..." value={couponCode} onChange={e => setCouponCode(e.target.value)} />
                    <button type="button" className="btn btn-outline btn-sm" onClick={handleApplyCoupon}>Áp dụng</button>
                  </div>
                )}
                {couponMsg && <p className={`coupon-msg ${couponApplied ? 'success' : 'error'}`}>{couponMsg}</p>}
              </div>

              <div className="summary-divider" />
              <div className="summary-row"><span>Tạm tính</span><span>{formatPrice(cartTotal)}</span></div>
              <div className="summary-row"><span>Phí vận chuyển</span><span>{shippingFee === 0 ? <span className="free-ship">Miễn phí</span> : formatPrice(shippingFee)}</span></div>
              {couponDiscount > 0 && <div className="summary-row discount-row"><span>Giảm giá</span><span>-{formatPrice(couponDiscount)}</span></div>}
              <div className="summary-divider" />
              <div className="summary-row summary-total"><span>Tổng cộng</span><span>{formatPrice(finalTotal)}</span></div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
