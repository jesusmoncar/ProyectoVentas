import { createContext, useContext, useState, useCallback } from 'react';

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

    const login = useCallback((newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(buildUser(newToken));
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
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
