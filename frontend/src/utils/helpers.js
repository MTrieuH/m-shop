// Format VND currency
export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Truncate text
export const truncate = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get stock status label in Vietnamese
export const getStockLabel = (status) => {
  switch (status) {
    case 'InStock': return 'Còn hàng';
    case 'LowStock': return 'Sắp hết hàng';
    case 'OutOfStock': return 'Hết hàng';
    case 'PreOrder': return 'Đặt trước';
    default: return status;
  }
};

// Get order status label
export const getOrderStatusLabel = (status) => {
  const map = {
    'Pending': 'Chờ xác nhận',
    'Confirmed': 'Đã xác nhận',
    'Shipping': 'Đang giao hàng',
    'Delivered': 'Đã giao hàng',
    'Cancelled': 'Đã huỷ'
  };
  return map[status] || status;
};

// Calculate discount percentage
export const calcDiscount = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

// Generate placeholder image URL
export const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/600x600/1a1a2e/22d3ee?text=M-Shop';
  if (path.startsWith('http')) return path;
  
  // If it's a seed image path (but not an uploaded image), use a themed placeholder during development
  if (path.startsWith('/images/') && !path.startsWith('/images/uploads/')) {
    const segments = path.split('/');
    const filename = segments.pop();
    const name = filename.split('.')[0].replace(/-/g, ' ');
    const category = segments.pop();
    
    return `https://placehold.co/600x600/1a1a2e/22d3ee?text=${encodeURIComponent(name.toUpperCase())}\n(${category})`;
  }

  const backendUrl = 'http://localhost:5230';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${backendUrl}${cleanPath}`;
};

