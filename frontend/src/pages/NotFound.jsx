import { Link } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-page animate-fadeIn">
      <div className="container">
        <div className="not-found-content">
          <FiAlertCircle className="not-found-icon" />
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Không tìm thấy trang</h2>
          <p className="not-found-desc">Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không thể truy cập.</p>
          <Link to="/" className="btn btn-primary btn-lg">
            <FiHome /> Về Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
