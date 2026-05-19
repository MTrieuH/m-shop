import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import BackToTop from './components/common/BackToTop';
import ErrorBoundary from './components/common/ErrorBoundary';
import './App.css';

// Lazy loaded page components
const Home = lazy(() => import('./pages/Home'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Auth').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Auth').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const Account = lazy(() => import('./pages/Account'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const About = lazy(() => import('./pages/StaticPages').then(m => ({ default: m.About })));
const FAQ = lazy(() => import('./pages/StaticPages').then(m => ({ default: m.FAQ })));
const Contact = lazy(() => import('./pages/StaticPages').then(m => ({ default: m.Contact })));
const BlogList = lazy(() => import('./pages/Blog').then(m => ({ default: m.BlogList })));
const BlogDetail = lazy(() => import('./pages/Blog').then(m => ({ default: m.BlogDetail })));
const ReturnPolicy = lazy(() => import('./pages/StaticPages').then(m => ({ default: m.ReturnPolicy })));
const ShippingPolicy = lazy(() => import('./pages/StaticPages').then(m => ({ default: m.ShippingPolicy })));
const SaleEvents = lazy(() => import('./pages/SaleEvents'));
const RestockSchedule = lazy(() => import('./pages/RestockSchedule'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lazy loaded Admin pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProductManager = lazy(() => import('./pages/admin/ProductManager'));
const OrderManager = lazy(() => import('./pages/admin/OrderManager'));
const CategoryManager = lazy(() => import('./pages/admin/CategoryManager'));
const UserManager = lazy(() => import('./pages/admin/UserManager'));
const CouponManager = lazy(() => import('./pages/admin/CouponManager'));
const EventManager = lazy(() => import('./pages/admin/EventManager'));

const PageLoader = () => (
  <div className="page-loader">
    <div className="loader-content">
      <div className="loader-logo">M</div>
      <div className="loader-bar"></div>
    </div>
  </div>
);


function AppLayout({ children }) {
  return (
    <>
      <Header />
      <main className="main-content">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'}>
        <ToastProvider>
          <AuthProvider>
            <WishlistProvider>
            <CartProvider>
              <BackToTop />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<AppLayout><Home /></AppLayout>} />
                <Route path="/san-pham" element={<AppLayout><ProductList /></AppLayout>} />
                <Route path="/san-pham/:slug" element={<AppLayout><ProductDetail /></AppLayout>} />
                <Route path="/danh-muc/:slug" element={<AppLayout><ProductList /></AppLayout>} />
                <Route path="/gio-hang" element={<AppLayout><Cart /></AppLayout>} />
                <Route path="/thanh-toan" element={<AppLayout><Checkout /></AppLayout>} />
                <Route path="/dang-nhap" element={<AppLayout><Login /></AppLayout>} />
                <Route path="/dang-ky" element={<AppLayout><Register /></AppLayout>} />
                <Route path="/quen-mat-khau" element={<AppLayout><ForgotPassword /></AppLayout>} />
                <Route path="/tai-khoan" element={<AppLayout><Account /></AppLayout>} />
                <Route path="/don-hang" element={<AppLayout><Account /></AppLayout>} />
                <Route path="/yeu-thich" element={<AppLayout><Wishlist /></AppLayout>} />
                
                <Route path="/gioi-thieu" element={<AppLayout><About /></AppLayout>} />
                <Route path="/faq" element={<AppLayout><FAQ /></AppLayout>} />
                <Route path="/lien-he" element={<AppLayout><Contact /></AppLayout>} />
                <Route path="/tin-tuc" element={<AppLayout><BlogList /></AppLayout>} />
                <Route path="/tin-tuc/:slug" element={<AppLayout><BlogDetail /></AppLayout>} />
                <Route path="/chinh-sach-doi-tra" element={<AppLayout><ReturnPolicy /></AppLayout>} />
                <Route path="/chinh-sach-van-chuyen" element={<AppLayout><ShippingPolicy /></AppLayout>} />
                <Route path="/su-kien-sale" element={<AppLayout><SaleEvents /></AppLayout>} />
                <Route path="/lich-hang-ve" element={<AppLayout><RestockSchedule /></AppLayout>} />

                {/* Admin routes */}
                <Route path="/admin" element={<Suspense fallback={<PageLoader />}><AdminLayout /></Suspense>}>
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<ProductManager />} />
                  <Route path="orders" element={<OrderManager />} />
                  <Route path="categories" element={<CategoryManager />} />
                  <Route path="users" element={<UserManager />} />
                  <Route path="coupons" element={<CouponManager />} />
                  <Route path="events" element={<EventManager />} />
                </Route>

                {/* 404 Not Found - must be last */}
                <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
              </Routes>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ToastProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}
