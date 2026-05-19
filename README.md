<h1 align="center">M-Shop: Mô Hình Gundam & Figure</h1>

<p align="center">
  <i>Một nền tảng thương mại điện tử Full-stack dành cho những người đam mê mô hình.</i>
</p>

## 🚀 Tính năng nổi bật
- **Giao diện thân thiện (Khách hàng):** Tìm kiếm, lọc sản phẩm, thêm vào giỏ hàng, thanh toán trực tuyến.
- **Quản lý toàn diện (Admin):** Bảng điều khiển (Dashboard), quản lý Sản phẩm, Danh mục, Đơn hàng, Người dùng và Mã giảm giá (Coupons).
- **Xác thực bảo mật:** Đăng nhập an toàn bằng JWT và hỗ trợ đăng nhập bằng tài khoản Google (OAuth 2.0).

## 💻 Công nghệ sử dụng (Tech Stack)

### 🎨 Frontend
- **Framework:** ReactJS 19, Vite
- **Routing:** React Router v7
- **Giao tiếp API:** Axios
- **UI/UX:** SweetAlert2, Swiper (Tạo slider chuyên nghiệp), CSS thuần.

### ⚙️ Backend
- **Framework:** ASP.NET Core 10.0 RESTful API
- **Database:** SQL Server
- **ORM:** Entity Framework Core 10.0
- **Bảo mật:** JWT (JSON Web Tokens), Google.Apis.Auth

---

## 🔑 Tài khoản Test (Admin)
- **Email:** `admin@mshop.vn`
- **Mật khẩu:** `Admin@123`

---

## 🛠 Hướng dẫn cài đặt (Local Development)

### 1. Backend (ASP.NET Core API)
```bash
cd backend
dotnet restore
dotnet tool install --global dotnet-ef
dotnet ef database update
dotnet run
```

### 2. Frontend (React/Vite)
```bash
cd frontend
npm install
npm run dev
```

---
*Dự án được xây dựng với mục đích học tập và làm Portfolio.*