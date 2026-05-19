import { Link } from 'react-router-dom';
import './StaticPages.css';

export function About() {
  return (
    <div className="static-page">
      <div className="container">
        <div className="static-hero">
          <h1>Giới Thiệu M-Shop</h1>
          <p>Cửa hàng mô hình lắp ráp hàng đầu</p>
        </div>
        <div className="static-content">
          <div className="content-block">
            <h2>Về Chúng Tôi</h2>
            <p>M-Shop là cửa hàng chuyên cung cấp mô hình lắp ráp (Gunpla, Model Kits) chính hãng từ các thương hiệu hàng đầu như Bandai, Kotobukiya, Good Smile Company và nhiều hãng khác.</p>
            <p>Chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng tốt nhất với giá cả cạnh tranh, dịch vụ tận tâm và giao hàng nhanh chóng trên toàn quốc.</p>
          </div>
          <div className="content-block">
            <h2>Tại Sao Chọn M-Shop?</h2>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-emoji">🛡️</span>
                <h3>Chính Hãng 100%</h3>
                <p>Tất cả sản phẩm đều là hàng chính hãng, có tem và mã nhận diện đầy đủ.</p>
              </div>
              <div className="feature-item">
                <span className="feature-emoji">💰</span>
                <h3>Giá Tốt Nhất</h3>
                <p>Cam kết giá cạnh tranh nhất thị trường, nhiều chương trình ưu đãi hấp dẫn.</p>
              </div>
              <div className="feature-item">
                <span className="feature-emoji">🚚</span>
                <h3>Giao Hàng Toàn Quốc</h3>
                <p>Miễn phí vận chuyển cho đơn hàng từ 500.000₫, đóng gói cẩn thận, an toàn.</p>
              </div>
              <div className="feature-item">
                <span className="feature-emoji">🎧</span>
                <h3>Hỗ Trợ Tận Tâm</h3>
                <p>Đội ngũ tư vấn am hiểu, sẵn sàng hỗ trợ bạn chọn sản phẩm phù hợp.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const faqs = [
    { q: 'Gunpla là gì?', a: 'Gunpla (Gundam Plastic Model) là mô hình lắp ráp nhựa của các nhân vật robot từ series Gundam, được sản xuất bởi Bandai.' },
    { q: 'Các grade (cấp độ) của Gunpla?', a: 'PG (Perfect Grade - 1/60, chi tiết nhất), MG (Master Grade - 1/100), RG (Real Grade - 1/144), HG (High Grade - 1/144), SD (Super Deformed - tỉ lệ nhỏ).' },
    { q: 'Tôi mới bắt đầu nên chọn grade nào?', a: 'HG (High Grade) hoặc Entry Grade là lựa chọn tốt cho người mới. Dễ ráp, giá phải chăng, và vẫn đẹp.' },
    { q: 'Có cần dùng keo khi ráp Gunpla không?', a: 'Không! Hầu hết Gunpla hiện đại đều là snap-fit (lắp ghép) và không cần keo. Bạn chỉ cần kìm cắt.' },
    { q: 'Chính sách đổi trả như thế nào?', a: 'Chúng tôi chấp nhận đổi trả trong 7 ngày nếu sản phẩm còn nguyên seal, chưa qua sử dụng.' },
    { q: 'Thời gian giao hàng bao lâu?', a: 'Nội thành HCM: 1-2 ngày. Các tỉnh: 2-5 ngày. Miễn phí vận chuyển cho đơn từ 500.000₫.' },
    { q: 'Sản phẩm Pre-order là gì?', a: 'Pre-order là đặt hàng trước. Sản phẩm chưa phát hành, bạn đặt trước và sẽ nhận hàng khi có.' },
  ];

  return (
    <div className="static-page">
      <div className="container">
        <div className="static-hero">
          <h1>Câu Hỏi Thường Gặp</h1>
          <p>Giải đáp những thắc mắc phổ biến</p>
        </div>
        <div className="static-content">
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <details key={i} className="faq-item">
                <summary className="faq-question">{faq.q}</summary>
                <p className="faq-answer">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Contact() {
  return (
    <div className="static-page">
      <div className="container">
        <div className="static-hero">
          <h1>Liên Hệ</h1>
          <p>Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
        </div>
        <div className="static-content">
          <div className="contact-grid">
            <div className="contact-info-block">
              <h2>Thông tin liên hệ</h2>
              <div className="contact-detail">
                <h3>📍 Địa chỉ</h3>
                <p>123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p>
              </div>
              <div className="contact-detail">
                <h3>📞 Điện thoại</h3>
                <p>0901 234 567</p>
              </div>
              <div className="contact-detail">
                <h3>✉️ Email</h3>
                <p>info@mshop.vn</p>
              </div>
              <div className="contact-detail">
                <h3>🕐 Giờ làm việc</h3>
                <p>Thứ 2 - Chủ nhật: 9:00 - 21:00</p>
              </div>
            </div>
            <div className="contact-form-block">
              <h2>Gửi tin nhắn</h2>
              <form onSubmit={e => e.preventDefault()}>
                <div className="form-group">
                  <label className="form-label">Họ tên</label>
                  <input className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" />
                </div>
                <div className="form-group">
                  <label className="form-label">Nội dung</label>
                  <textarea className="form-input" rows={5}></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-lg">Gửi tin nhắn</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReturnPolicy() {
  return (
    <div className="static-page">
      <div className="container">
        <div className="static-hero">
          <h1>Chính Sách Đổi Trả</h1>
          <p>Đảm bảo quyền lợi khách hàng tại M-Shop</p>
        </div>
        <div className="static-content">
          <div className="content-block">
            <h2>1. Điều kiện đổi trả</h2>
            <p>M-Shop hỗ trợ đổi trả sản phẩm trong vòng <strong>7 ngày</strong> kể từ khi nhận hàng với các điều kiện sau:</p>
            <ul>
              <li>Sản phẩm còn nguyên tem, seal, chưa mở hộp và chưa qua sử dụng.</li>
              <li>Sản phẩm bị lỗi từ phía nhà sản xuất (thiếu runner, lỗi nhựa nghiêm trọng).</li>
              <li>Sản phẩm không đúng với mô tả trên website hoặc giao sai mẫu mã.</li>
            </ul>
          </div>
          <div className="content-block">
            <h2>2. Những trường hợp không được đổi trả</h2>
            <ul>
              <li>Sản phẩm đã bị bóc seal, mở hộp hoặc đã bắt đầu lắp ráp.</li>
              <li>Sản phẩm bị hư hại do lỗi của người mua (làm rơi, va đập, để nơi ẩm ướt).</li>
              <li>Sản phẩm là quà tặng kèm theo chương trình khuyến mãi.</li>
            </ul>
          </div>
          <div className="content-block">
            <h2>3. Quy trình đổi trả</h2>
            <p>Bước 1: Chụp ảnh/quay video tình trạng sản phẩm và liên hệ bộ phận hỗ trợ qua Hotline: 0901 234 567.</p>
            <p>Bước 2: Gửi trả hàng về địa chỉ: 123 Nguyễn Huệ, Quận 1, TP.HCM.</p>
            <p>Bước 3: Sau khi kiểm tra hàng nhận lại, M-Shop sẽ tiến hành gửi sản phẩm mới hoặc hoàn tiền trong vòng 3-5 ngày làm việc.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShippingPolicy() {
  return (
    <div className="static-page">
      <div className="container">
        <div className="static-hero">
          <h1>Chính Sách Vận Chuyển</h1>
          <p>Giao hàng nhanh chóng và an toàn trên toàn quốc</p>
        </div>
        <div className="static-content">
          <div className="content-block">
            <h2>1. Thời gian giao hàng</h2>
            <p>M-Shop cam kết giao hàng trong thời gian sớm nhất:</p>
            <ul>
              <li><strong>Khu vực nội thành TP.HCM:</strong> 1 - 2 ngày làm việc.</li>
              <li><strong>Các tỉnh thành khác:</strong> 3 - 5 ngày làm việc tùy khu vực địa lý.</li>
            </ul>
          </div>
          <div className="content-block">
            <h2>2. Phí vận chuyển</h2>
            <ul>
              <li><strong>Miễn phí vận chuyển:</strong> Áp dụng cho đơn hàng từ <strong>500.000 VNĐ</strong> trở lên trên toàn quốc.</li>
              <li><strong>Phí ship tiêu chuẩn:</strong> 30.000 VNĐ cho các đơn hàng dưới 500.000 VNĐ.</li>
            </ul>
          </div>
          <div className="content-block">
            <h2>3. Đóng gói chuyên nghiệp</h2>
            <p>Vì đây là mặt hàng mô hình lắp ráp nên M-Shop cực kỳ chú trọng khâu đóng gói:</p>
            <ul>
              <li>Sử dụng thùng carton cứng 3 lớp hoặc 5 lớp.</li>
              <li>Quấn xốp nổ (bubble wrap) dày để bảo vệ hộp sản phẩm không bị móp méo.</li>
              <li>Dán băng keo niêm phong cẩn thận.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
