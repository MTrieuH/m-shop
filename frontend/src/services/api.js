import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5230/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mshop_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============ Products ============
export const getProducts = (params) => api.get('/products', { params });
export const getProductBySlug = (slug) => api.get(`/products/${slug}`);
export const getFeaturedProducts = (count = 8) => api.get('/products/featured', { params: { count } });
export const getNewArrivals = (count = 8) => api.get('/products/new-arrivals', { params: { count } });
export const getRelatedProducts = (productId, count = 4) => api.get(`/products/${productId}/related`, { params: { count } });

// ============ Categories ============
export const getCategories = () => api.get('/categories');
export const getCategoryBySlug = (slug) => api.get(`/categories/${slug}`);

// ============ Auth ============
export const login = (data) => api.post('/auth/login', data);
export const googleLogin = (credential) => api.post('/auth/google', { credential });
export const register = (data) => api.post('/auth/register', data);
export const getProfile = () => api.get('/auth/profile');
export const updateProfile = (data) => api.put('/auth/profile', data);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, newPassword) => api.post('/auth/reset-password', { token, newPassword });
export const changePassword = (currentPassword, newPassword) => api.post('/auth/change-password', { currentPassword, newPassword });

// ============ Search ============
export const getSearchSuggestions = (q) => api.get('/products/suggestions', { params: { q } });

// ============ Orders ============
export const createOrder = (data) => api.post('/orders', data);
export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const confirmPayment = (id) => api.put(`/orders/${id}/confirm-payment`);
export const cancelOrder = (orderId, reason) => api.put(`/orders/${orderId}/cancel`, { reason });

// ======= Questions =======
export const getProductQuestions = (productId) => api.get(`/products/${productId}/questions`);
export const postProductQuestion = (productId, content) => api.post(`/products/${productId}/questions`, { content });
export const deleteProductQuestion = (productId, questionId) => api.delete(`/products/${productId}/questions/${questionId}`);

// ============ Reviews ============
export const getReviews = (productId) => api.get(`/reviews/${productId}`);
export const createReview = (data) => api.post('/reviews', data);
export const deleteReview = (reviewId) => api.delete(`/reviews/${reviewId}`);

// ============ Admin ============
export const getDashboard = () => api.get('/admin/dashboard');
export const adminGetProducts = (params) => api.get('/admin/products', { params });
export const adminCreateProduct = (data) => api.post('/admin/products', data);
export const adminUpdateProduct = (id, data) => api.put(`/admin/products/${id}`, data);
export const adminDeleteProduct = (id) => api.delete(`/admin/products/${id}`);
export const adminGetOrders = (params) => api.get('/admin/orders', { params });
export const adminUpdateOrderStatus = (id, status) => api.put(`/admin/orders/${id}/status`, { status });
export const adminUpdateUserRole = (id, role) => api.put(`/admin/users/${id}/role`, { role });
export const adminGetUsers = (params) => api.get('/admin/users', { params });
export const adminGetCategories = () => api.get('/admin/categories');
export const adminCreateCategory = (data) => api.post('/admin/categories', data);
export const adminUpdateCategory = (id, data) => api.put(`/admin/categories/${id}`, data);
export const adminDeleteCategory = (id) => api.delete(`/admin/categories/${id}`);

// ============ Wishlist ============
export const getWishlist = () => api.get('/wishlist');
export const addToWishlist = (productId) => api.post(`/wishlist/${productId}`);
export const removeFromWishlist = (productId) => api.delete(`/wishlist/${productId}`);

// ============ Coupons ============
export const validateCoupon = (code, orderTotal) => api.post('/coupons/validate', { code, orderTotal });
export const adminGetCoupons = () => api.get('/coupons');
export const adminCreateCoupon = (data) => api.post('/coupons', data);
export const adminDeleteCoupon = (id) => api.delete(`/coupons/${id}`);

// ============ Blogs ============
export const getBlogs = () => api.get('/blogs');
export const getBlogBySlug = (slug) => api.get(`/blogs/${slug}`);
export const adminGetBlogs = () => api.get('/blogs/admin');
export const adminCreateBlog = (data) => api.post('/blogs', data);
export const adminUpdateBlog = (id, data) => api.put(`/blogs/${id}`, data);
export const adminDeleteBlog = (id) => api.delete(`/blogs/${id}`);

// ============ Store Events ============
export const getEvents = (params) => api.get('/events', { params });
export const adminGetEvents = () => api.get('/admin/events');
export const adminCreateEvent = (data) => api.post('/admin/events', data);
export const adminUpdateEvent = (id, data) => api.put(`/admin/events/${id}`, data);
export const adminDeleteEvent = (id) => api.delete(`/admin/events/${id}`);

// ============ Images ============
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/images/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export default api;
