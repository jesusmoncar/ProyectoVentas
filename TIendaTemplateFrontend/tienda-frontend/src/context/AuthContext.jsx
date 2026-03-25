import { createContext, useContext, useState, useCallback } from 'react';
import { fetchSavedData, persistCart, persistWishlist, mergeCart, mergeWishlist } from '../api/userDataApi';

const AuthContext = createContext(null);

function parseToken(token) {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
}

function buildUser(token) {
    const payload = parseToken(token);
    if (!payload) return null;
    return {
        email:   payload.sub ?? '',
        nombre:  payload.nombre ?? payload.sub ?? '',
        roles:   payload.roles ?? [],
        isAdmin: (payload.roles ?? []).includes('ROLE_ADMIN'),
    };
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user,  setUser]  = useState(() => {
        const t = localStorage.getItem('token');
        return t ? buildUser(t) : null;
    });

    const login = useCallback(async (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(buildUser(newToken));

        // Traer carrito y wishlist guardados en BD y fusionar con lo que haya en local
        try {
            const remote = await fetchSavedData();
            const localCart     = JSON.parse(localStorage.getItem('cart')     || '[]');
            const localWishlist = JSON.parse(localStorage.getItem('waitlist') || '[]');
            const cart     = mergeCart(localCart, remote.cart);
            const wishlist = mergeWishlist(localWishlist, remote.wishlist);
            localStorage.setItem('cart',     JSON.stringify(cart));
            localStorage.setItem('waitlist', JSON.stringify(wishlist));
            window.dispatchEvent(new Event('cartUpdated'));
            window.dispatchEvent(new Event('wishlistUpdated'));
        } catch {
            // Si falla la sincronización mantenemos lo que hay en local
        }
    }, []);

    const logout = useCallback(async () => {
        // Guardar carrito y wishlist en BD antes de limpiar
        try {
            const cart     = JSON.parse(localStorage.getItem('cart')     || '[]');
            const wishlist = JSON.parse(localStorage.getItem('waitlist') || '[]');
            await Promise.all([persistCart(cart), persistWishlist(wishlist)]);
        } catch {
            // No bloqueamos el logout si falla el guardado
        }

        localStorage.removeItem('token');
        localStorage.removeItem('cart');
        localStorage.removeItem('waitlist');
        localStorage.removeItem('shippingAddress');
        setToken(null);
        setUser(null);
        window.dispatchEvent(new Event('cartUpdated'));
        window.dispatchEvent(new Event('wishlistUpdated'));
    }, []);

    return (
        <AuthContext.Provider value={{ token, user, isLoggedIn: !!token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
    return ctx;
}
