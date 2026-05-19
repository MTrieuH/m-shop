import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const wishlistKey = user ? `mshop_wishlist_${user.email}` : 'mshop_wishlist_guest';

  const [currentKey, setCurrentKey] = useState(wishlistKey);
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(wishlistKey);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  if (wishlistKey !== currentKey) {
    try {
      const saved = localStorage.getItem(wishlistKey);
      setWishlist(saved ? JSON.parse(saved) : []);
    } catch { setWishlist([]); }
    setCurrentKey(wishlistKey);
  }

  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem(currentKey, JSON.stringify(wishlist));
  }, [wishlist, currentKey]);

  const toggleWishlist = (product) => {
    const exists = wishlist.find(item => item.id === product.id);
    if (exists) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
      toast.info(`Đã xóa ${product.name} khỏi danh sách yêu thích`);
    } else {
      setWishlist([...wishlist, product]);
      toast.success(`Đã thêm ${product.name} vào danh sách yêu thích`);
    }
  };

  const isInWishlist = (id) => wishlist.some(item => item.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
