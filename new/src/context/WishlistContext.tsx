import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import type { Product } from '../types';
import { useAuth } from './AuthContext';
import api from '../api/api';
import toast from 'react-hot-toast';

interface WishlistContextType {
  wishlist: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const skipSync = useRef(false);

  // 1. Fetch from backend on login
  useEffect(() => {
    if (authLoading) return;

    const fetchBackendWishlist = async () => {
      if (!isAuthenticated) {
        setIsInitialLoad(false);
        return;
      }
      
      try {
        const res = await api.get<{ wishlist: string }>('/user/saved-data');
        if (res.data && res.data.wishlist) {
          const remoteItems: Product[] = JSON.parse(res.data.wishlist);
          
          setWishlist(prevItems => {
            // Merging strategy:
            // Combine items from localStorage (guest) with remote items (BBDD)
            const merged = [...remoteItems];
            
            prevItems.forEach(localItem => {
              const remoteExists = merged.find(ri => ri.id === localItem.id);
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
        console.error("Error fetching wishlist from backend:", err);
      } finally {
        setIsInitialLoad(false);
      }
    };

    fetchBackendWishlist();
  }, [isAuthenticated, authLoading]);

  // 1.5. Clear on logout
  useEffect(() => {
    if (!isAuthenticated && !authLoading && !isInitialLoad) {
      setWishlist([]);
      localStorage.removeItem('wishlist');
    }
  }, [isAuthenticated, authLoading, isInitialLoad]);

  // 2. Sync to localStorage and Backend whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    const syncToBackend = async () => {
      if (!isAuthenticated || authLoading || isInitialLoad) return;
      if (skipSync.current) {
        skipSync.current = false;
        return;
      }

      try {
        await api.put('/user/wishlist', { wishlist: JSON.stringify(wishlist) });
      } catch (err) {
        console.error("Error syncing wishlist to backend:", err);
      }
    };

    const timeoutId = setTimeout(syncToBackend, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [wishlist, isAuthenticated, authLoading, isInitialLoad]);

  const toggleFavorite = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        toast.success(`Eliminado de favoritos: ${product.name}`, { icon: '💔' });
        return prev.filter(item => item.id !== product.id);
      } else {
        toast.success(`Añadido a favoritos: ${product.name}`, { icon: '❤️' });
        return [...prev, product];
      }
    });
  };

  const isFavorite = (productId: number) => {
    return wishlist.some(item => item.id === productId);
  };

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider value={{
      wishlist, toggleFavorite, isFavorite, clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
