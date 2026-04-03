import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import type { CartItem, Product, ProductVariant } from '../types';
import { useAuth } from './AuthContext';
import api from '../api/api';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (productId: number, variantId: number) => void;
  updateQuantity: (productId: number, variantId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const skipSync = useRef(false);

  // 1. Fetch from backend on login
  useEffect(() => {
    if (authLoading) return;

    const fetchBackendCart = async () => {
      if (!isAuthenticated) {
        setIsInitialLoad(false);
        return;
      }
      
      try {
        const res = await api.get<{ cart: string }>('/user/saved-data');
        if (res.data && res.data.cart) {
          const remoteItems: CartItem[] = JSON.parse(res.data.cart);
          
          setItems(prevItems => {
            // Merging strategy:
            // Combine items from localStorage (guest) with remote items (BBDD)
            const merged = [...remoteItems];
            
            prevItems.forEach(localItem => {
              const remoteExists = merged.find(
                ri => ri.product.id === localItem.product.id && ri.variant.id === localItem.variant.id
              );
              if (!remoteExists) {
                merged.push(localItem);
              }
            });

            // Prevent immediate sync back if data didn't change meaningfully
            if (JSON.stringify(merged) === JSON.stringify(prevItems)) {
               skipSync.current = true;
            }
            
            return merged;
          });
        }
      } catch (err) {
        console.error("Error fetching cart from backend:", err);
      } finally {
        setIsInitialLoad(false);
      }
    };

    fetchBackendCart();
  }, [isAuthenticated, authLoading]);

  // 1.5. Clear cart on logout
  useEffect(() => {
    if (!isAuthenticated && !authLoading && !isInitialLoad) {
      setItems([]);
      localStorage.removeItem('cart');
    }
  }, [isAuthenticated, authLoading, isInitialLoad]);

  // 2. Sync to localStorage and Backend whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
    
    const syncToBackend = async () => {
      if (!isAuthenticated || authLoading || isInitialLoad) return;
      if (skipSync.current) {
        skipSync.current = false;
        return;
      }

      try {
        await api.put('/user/cart', { cart: JSON.stringify(items) });
      } catch (err) {
        console.error("Error syncing cart to backend:", err);
      }
    };

    const timeoutId = setTimeout(syncToBackend, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [items, isAuthenticated, authLoading, isInitialLoad]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const basePrice = item.variant.priceOverride ?? item.product.basePrice;
    const discount = item.product.discountPercent ?? 0;
    const price = basePrice * (1 - discount / 100);
    return sum + price * item.quantity;
  }, 0);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (product: Product, variant: ProductVariant, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(
        i => i.product.id === product.id && i.variant.id === variant.id
      );
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.variant.id === variant.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, variant, quantity }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: number, variantId: number) => {
    setItems(prev => prev.filter(
      i => !(i.product.id === productId && i.variant.id === variantId)
    ));
  };

  const updateQuantity = (productId: number, variantId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setItems(prev => prev.map(i =>
      i.product.id === productId && i.variant.id === variantId
        ? { ...i, quantity }
        : i
    ));
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{
      items, totalItems, totalPrice, isOpen,
      openCart, closeCart, addToCart, removeFromCart, updateQuantity, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
