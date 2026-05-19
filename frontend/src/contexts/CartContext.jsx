import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const cartKey = user ? `mshop_cart_${user.email}` : 'mshop_cart_guest';
  const previousUserRef = useRef(null);

  const [currentKey, setCurrentKey] = useState(cartKey);
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(cartKey);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  /* ============ SMART MERGE: Guest → User ============ */
  if (cartKey !== currentKey) {
    try {
      const userCartRaw = localStorage.getItem(cartKey);
      const userCart = userCartRaw ? JSON.parse(userCartRaw) : [];

      // Check if transitioning from guest → logged-in user
      const wasGuest = currentKey === 'mshop_cart_guest';
      const isNowUser = cartKey !== 'mshop_cart_guest';

      if (wasGuest && isNowUser && items.length > 0) {
        // MERGE: Combine guest items into user cart
        const mergedCart = [...userCart];
        items.forEach(guestItem => {
          const existingIndex = mergedCart.findIndex(i => i.id === guestItem.id);
          if (existingIndex >= 0) {
            // Same product: keep the larger quantity
            mergedCart[existingIndex] = {
              ...mergedCart[existingIndex],
              quantity: Math.max(mergedCart[existingIndex].quantity, guestItem.quantity)
            };
          } else {
            // New item: add to cart
            mergedCart.push(guestItem);
          }
        });

        // Clear guest cart
        localStorage.removeItem('mshop_cart_guest');
        // Save merged cart
        localStorage.setItem(cartKey, JSON.stringify(mergedCart));
        setItems(mergedCart);
      } else {
        // Normal switch (logout, or no guest items)
        setItems(userCart);
      }
    } catch { setItems([]); }
    setCurrentKey(cartKey);
  }

  // Track previous user for merge detection
  useEffect(() => {
    previousUserRef.current = user;
  }, [user]);

  useEffect(() => {
    localStorage.setItem(currentKey, JSON.stringify(items));
  }, [items, currentKey]);

  const addToCart = (product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: Math.min(product.quantity, i.quantity + qty) } : i);
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: Math.min(product.quantity, qty),
        maxQuantity: product.quantity
      }];
    });
  };

  const removeFromCart = (productId) => {
    setItems(prev => prev.filter(i => i.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setItems(prev => prev.map(i => {
      if (i.id === productId) {
        return { ...i, quantity: Math.min(i.maxQuantity || 999, quantity) };
      }
      return i;
    }));
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
