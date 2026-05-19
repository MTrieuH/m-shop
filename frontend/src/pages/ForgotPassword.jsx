import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiCheck, FiArrowLeft } from 'react-icons/fi';
import { forgotPassword, resetPassword } from '../services/api';
import './Auth.css';

export function ForgotPassword() {
  const [step, setStep] = useState(1); // 1=email, 2=token+newpass, 3=done
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      // In development, show the token (in production, this would be sent via email)
      if (res.data.token) setGeneratedToken(res.data.token);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra.');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự.'); return; }
    if (newPassword !== confirmPassword) { setError('Mật khẩu xác nhận không khớp.'); return; }
    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Mã đặt lại không hợp lệ.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/dang-nhap" className="auth-back"><FiArrowLeft /> Quay lại đăng nhập</Link>

        {step === 1 && (
          <>
            <h1>Quên Mật Khẩu</h1>
            <p className="auth-subtitle">Nhập email để nhận mã đặt lại mật khẩu</p>
            <form onSubmit={handleRequestReset}>
              <div className="form-group">
                <label><FiMail /> Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" required />
              </div>
              {error && <p className="form-error">{error}</p>}
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Gửi mã đặt lại'}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h1>Đặt Lại Mật Khẩu</h1>
            <p className="auth-subtitle">Nhập mã đặt lại và mật khẩu mới</p>
            {generatedToken && (
              <div className="token-display">
                <p>📧 <strong>Mã đặt lại (demo):</strong></p>
                <code>{generatedToken}</code>
                <p className="token-note">Trong phiên bản chính thức, mã này sẽ được gửi qua email.</p>
              </div>
            )}
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label><FiLock /> Mã đặt lại</label>
                <input type="text" value={token} onChange={e => setToken(e.target.value)} placeholder="Nhập mã 8 ký tự" required maxLength={8} />
              </div>
              <div className="form-group">
                <label><FiLock /> Mật khẩu mới</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Ít nhất 6 ký tự" required />
              </div>
              <div className="form-group">
                <label><FiLock /> Xác nhận mật khẩu</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Nhập lại mật khẩu" required />
              </div>
              {error && <p className="form-error">{error}</p>}
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <div className="auth-success">
            <FiCheck size={48} className="success-icon" />
            <h2>Đặt Lại Thành Công!</h2>
            <p>Mật khẩu đã được đổi. Bạn có thể đăng nhập với mật khẩu mới.</p>
            <Link to="/dang-nhap" className="btn btn-primary btn-full">Đăng nhập ngay</Link>
          </div>
        )}
      </div>
    </div>
  );
}
