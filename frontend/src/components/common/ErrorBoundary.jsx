import React from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-page animate-fadeIn">
          <div className="error-content">
            <FiAlertTriangle className="error-icon" />
            <h2 className="error-title">Đã Có Lỗi Xảy Ra!</h2>
            <p className="error-desc">Chúng tôi xin lỗi vì sự bất tiện này. Có vẻ như hệ thống đang gặp sự cố kỹ thuật tạm thời.</p>
            <button className="btn btn-primary btn-lg" onClick={() => window.location.reload()}>
              <FiRefreshCw /> Tải Lại Trang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
