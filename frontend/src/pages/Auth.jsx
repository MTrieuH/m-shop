import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiArrowRight, FiCheck, FiInfo } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import './Auth.css';

/* ============ PASSWORD STRENGTH ============ */
function getPasswordStrength(pw) {
  if (!pw) return { level: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { level: 1, label: 'Yếu', color: 'var(--color-danger)' };
  if (score <= 3) return { level: 2, label: 'Trung bình', color: 'var(--color-warning)' };
  return { level: 3, label: 'Mạnh', color: 'var(--color-success)' };
}

/* ============ DECORATIVE PANEL ============ */
function AuthDecorPanel({ title, subtitle }) {
  return (
    <div className="auth-decor-panel">
      <div className="auth-decor-shapes">
        <div className="decor-circle decor-circle-1" />
        <div className="decor-circle decor-circle-2" />
        <div className="decor-circle decor-circle-3" />
      </div>
      <div className="auth-decor-content">
        <Link to="/" className="auth-decor-logo">
          <span className="logo-m">M</span>
          <span className="logo-text">-SHOP</span>
        </Link>
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <div className="auth-decor-features">
          <div className="decor-feature"><FiCheck /> Đảm bảo chính hãng 100%</div>
          <div className="decor-feature"><FiCheck /> Miễn phí vận chuyển từ 500K</div>
          <div className="decor-feature"><FiCheck /> Hỗ trợ 24/7</div>
        </div>
      </div>
    </div>
  );
}

/* ============ PASSWORD INPUT WITH TOGGLE ============ */
function PasswordInput({ value, onChange, placeholder = 'Nhập mật khẩu', id, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className="password-input-wrapper">
      <FiLock className="input-icon" />
      <input
        id={id}
        className="form-input has-icon"
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
      />
      <button type="button" className="password-toggle" onClick={() => setShow(!show)} tabIndex={-1} aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>
        {show ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
}

/* ============ DIVIDER ============ */
function AuthDivider({ text }) {
  return (
    <div className="auth-divider">
      <span>{text}</span>
    </div>
  );
}

/* ================================================
   LOGIN
   ================================================ */
export function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('return');
  const [email, setEmail] = useState(() => localStorage.getItem('mshop_remember_email') || '');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(() => !!localStorage.getItem('mshop_remember_email'));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Remember me
      if (remember) {
        localStorage.setItem('mshop_remember_email', email);
      } else {
        localStorage.removeItem('mshop_remember_email');
      }
      const res = await login(email, password);
      if (returnUrl) navigate(returnUrl);
      else if (res.user.role === 'Admin') navigate('/admin');
      else if (res.user.role === 'Warehouse') navigate('/admin/products');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng.');
    } finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      const res = await loginWithGoogle(credentialResponse.credential);
      if (returnUrl) navigate(returnUrl);
      else if (res.user.role === 'Admin') navigate('/admin');
      else if (res.user.role === 'Warehouse') navigate('/admin/products');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập Google thất bại.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <AuthDecorPanel
          title="Chào mừng trở lại!"
          subtitle="Đăng nhập để tiếp tục mua sắm và theo dõi đơn hàng của bạn."
        />

        <div className="auth-form-panel">
          <div className="auth-form-inner">
            <div className="auth-header">
              <h1>Đăng Nhập</h1>
              <p>Nhập thông tin tài khoản của bạn</p>
            </div>

            {/* Google Login */}
            <div className="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Đăng nhập Google thất bại.')}
                text="signin_with"
                shape="rectangular"
                width="100%"
                theme="outline"
              />
            </div>

            <AuthDivider text="hoặc đăng nhập bằng email" />

            {error && (
              <div className="auth-error">
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">Email</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    id="login-email"
                    className="form-input has-icon"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="login-password">Mật khẩu</label>
                <PasswordInput
                  id="login-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                />
              </div>

              <div className="auth-options-row">
                <label className="remember-me">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                  <span className="checkmark" />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <Link to="/quen-mat-khau" className="forgot-link">Quên mật khẩu?</Link>
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg auth-submit-btn" disabled={loading}>
                {loading ? (
                  <span className="btn-loading"><span className="spinner" /> Đang đăng nhập...</span>
                ) : (
                  <span>Đăng Nhập <FiArrowRight /></span>
                )}
              </button>
            </form>

            <p className="auth-footer">
              Chưa có tài khoản? <Link to="/dang-ky">Đăng ký ngay <FiArrowRight size={14} /></Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================
   REGISTER
   ================================================ */
export function Register() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const pwStrength = getPasswordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      setSuccess('Đăng ký thành công!');
      setTimeout(() => navigate('/dang-nhap'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại.');
    } finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký bằng Google thất bại.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <AuthDecorPanel
          title="Tham gia M-Shop"
          subtitle="Khám phá bộ sưu tập Gunpla, Model Kit chính hãng với giá tốt nhất."
        />

        <div className="auth-form-panel">
          <div className="auth-form-inner">
            <div className="auth-header">
              <h1>Tạo Tài Khoản</h1>
              <p>Chỉ mất 30 giây để bắt đầu</p>
            </div>

            {/* Google Signup */}
            <div className="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Đăng ký bằng Google thất bại.')}
                text="signup_with"
                shape="rectangular"
                width="100%"
                theme="outline"
              />
            </div>

            <AuthDivider text="hoặc đăng ký bằng email" />

            {success && (
              <div className="auth-success-msg">
                <FiCheck /> {success} Đang chuyển hướng...
              </div>
            )}
            {error && (
              <div className="auth-error">
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">Họ tên</label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    id="reg-name"
                    className="form-input has-icon"
                    value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">Email</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    id="reg-email"
                    className="form-input has-icon"
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="email@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">Mật khẩu</label>
                <PasswordInput
                  id="reg-password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Ít nhất 6 ký tự"
                  autoComplete="new-password"
                />
                {form.password && (
                  <div className="password-strength">
                    <div className="strength-bars">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="strength-bar" style={{ background: i <= pwStrength.level ? pwStrength.color : 'var(--color-border)' }} />
                      ))}
                    </div>
                    <span className="strength-label" style={{ color: pwStrength.color }}>{pwStrength.label}</span>
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg auth-submit-btn" disabled={loading}>
                {loading ? (
                  <span className="btn-loading"><span className="spinner" /> Đang tạo tài khoản...</span>
                ) : (
                  <span>Tạo Tài Khoản <FiArrowRight /></span>
                )}
              </button>
            </form>

            {/* Info notice */}
            <div className="auth-info-notice">
              <FiInfo />
              <span>Bạn có thể bổ sung SĐT và địa chỉ sau trong <Link to="/tai-khoan">Quản lý tài khoản</Link> để sử dụng đầy đủ chức năng thanh toán.</span>
            </div>

            <p className="auth-footer">
              Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập <FiArrowRight size={14} /></Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
