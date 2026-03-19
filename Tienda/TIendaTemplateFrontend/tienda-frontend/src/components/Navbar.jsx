import { useState, useEffect } from 'react';
import { ShoppingBag, LogOut, User, Menu, X, ShoppingCart, Heart, Package, ClipboardList } from 'lucide-react';
import './Navbar.css';

function parseToken(token) {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
}

export default function Navbar() {
    const token = localStorage.getItem('token');
    const payload = token ? parseToken(token) : null;
    const isLoggedIn = !!payload;
    const email = payload?.sub ?? null;
    const isAdmin = payload?.roles?.includes('ROLE_ADMIN') ?? false;
    const [menuOpen, setMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(() => {
        try { return JSON.parse(localStorage.getItem('cart') ?? '[]').reduce((s, x) => s + x.quantity, 0); }
        catch { return 0; }
    });

    useEffect(() => {
        const update = () => {
            try { setCartCount(JSON.parse(localStorage.getItem('cart') ?? '[]').reduce((s, x) => s + x.quantity, 0)); }
            catch { setCartCount(0); }
        };
        window.addEventListener('cartUpdated', update);
        return () => window.removeEventListener('cartUpdated', update);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <nav className="navbar">
            <div className="navbar__inner">

                <a href="/" className="navbar__logo">
                    <div className="navbar__logo-icon">
                        <ShoppingBag size={20} color="white" strokeWidth={1.8} />
                    </div>
                    <span className="navbar__logo-name">MiTienda</span>
                </a>

                <div className="navbar__links">
                    <a href="/" className="navbar__link navbar__link--active">Inicio</a>
                    <a href="/" className="navbar__link">Productos</a>
                    {isAdmin && (
                        <>
                            <a href="/admin/products" className="navbar__link navbar__link--admin">
                                <Package size={14} />
                                Gestión productos
                            </a>
                            <a href="/admin/orders" className="navbar__link navbar__link--admin">
                                <ClipboardList size={14} />
                                Gestión pedidos
                            </a>
                        </>
                    )}
                </div>

                <div className="navbar__actions">
                    <a href="/waitlist" className="navbar__icon-btn navbar__icon-btn--waitlist" title="Lista de espera">
                        <Heart size={20} />
                    </a>
                    <a href="/cart" className="navbar__icon-btn navbar__icon-btn--cart" title="Carrito">
                        <ShoppingCart size={20} />
                        {cartCount > 0 && <span className="navbar__cart-badge">{cartCount}</span>}
                    </a>

                    {isLoggedIn ? (
                        <>
                            <div className="navbar__user">
                                <User size={15} />
                                <span>{email}</span>
                            </div>
                            <button className="navbar__btn navbar__btn--outline" onClick={handleLogout}>
                                <LogOut size={15} />
                                Salir
                            </button>
                        </>
                    ) : (
                        <>
                            <a href="/login" className="navbar__btn navbar__btn--ghost">Iniciar sesión</a>
                            <a href="/register" className="navbar__btn navbar__btn--primary">Registrarse</a>
                        </>
                    )}
                </div>

                <button className="navbar__mobile-toggle" onClick={() => setMenuOpen(v => !v)}>
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {menuOpen && (
                <div className="navbar__mobile-menu">
                    <a href="/" className="navbar__mobile-link">Inicio</a>
                    <a href="/" className="navbar__mobile-link">Productos</a>
                    <a href="/waitlist" className="navbar__mobile-link">Lista de espera</a>
                    <a href="/cart" className="navbar__mobile-link">Carrito</a>
                    {isAdmin && (
                        <>
                            <div className="navbar__mobile-divider" />
                            <span className="navbar__mobile-section">Admin</span>
                            <a href="/admin/products" className="navbar__mobile-link navbar__mobile-link--admin">
                                Gestión de productos
                            </a>
                            <a href="/admin/orders" className="navbar__mobile-link navbar__mobile-link--admin">
                                Gestión de pedidos
                            </a>
                        </>
                    )}
                    <div className="navbar__mobile-divider" />
                    {isLoggedIn ? (
                        <>
                            <span className="navbar__mobile-user">{email}</span>
                            <button className="navbar__mobile-link navbar__mobile-link--danger" onClick={handleLogout}>
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <a href="/login" className="navbar__mobile-link">Iniciar sesión</a>
                            <a href="/register" className="navbar__mobile-link navbar__mobile-link--primary">Registrarse</a>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
