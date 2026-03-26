import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem, Product, ProductVariant } from '../types';

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
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = item.variant.priceOverride ?? item.product.basePrice;
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
