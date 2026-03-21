import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Menu, X, ShoppingCart, Heart, Package, ClipboardList, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();
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
        logout();
        navigate('/');
    };

    const displayName = user?.nombre || user?.email || '';

    return (
        <nav className="navbar">
            <div className="navbar__inner">

                <Link to="/" className="navbar__logo">
                    <div className="navbar__logo-icon">
                        <ShoppingBag size={20} color="white" strokeWidth={1.8} />
                    </div>
                    <span className="navbar__logo-name">MiTienda</span>
                </Link>

                <div className="navbar__links">
                    <Link to="/" className="navbar__link navbar__link--active">Inicio</Link>
                    {isLoggedIn && (
                        <Link to="/my-orders" className="navbar__link">Mis pedidos</Link>
                    )}
                    {user?.isAdmin && (
                        <>
                            <Link to="/admin/products" className="navbar__link navbar__link--admin">
                                <Package size={14} />
                                Gestión productos
                            </Link>
                            <Link to="/admin/orders" className="navbar__link navbar__link--admin">
                                <ClipboardList size={14} />
                                Gestión pedidos
                            </Link>
                            <Link to="/admin/incidencias" className="navbar__link navbar__link--admin">
                                <AlertTriangle size={14} />
                                Incidencias
                            </Link>
                        </>
                    )}
                </div>

                <div className="navbar__actions">
                    <Link to="/waitlist" className="navbar__icon-btn navbar__icon-btn--waitlist" title="Lista de espera">
                        <Heart size={20} />
                    </Link>
                    <Link to="/cart" className="navbar__icon-btn navbar__icon-btn--cart" title="Carrito">
                        <ShoppingCart size={20} />
                        {cartCount > 0 && <span className="navbar__cart-badge">{cartCount}</span>}
                    </Link>

                    {isLoggedIn ? (
                        <>
                            <div className="navbar__user">
                                <User size={15} />
                                <span>{displayName}</span>
                            </div>
                            <button className="navbar__btn navbar__btn--outline" onClick={handleLogout}>
                                <LogOut size={15} />
                                Salir
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar__btn navbar__btn--ghost">Iniciar sesión</Link>
                            <Link to="/register" className="navbar__btn navbar__btn--primary">Registrarse</Link>
                        </>
                    )}
                </div>

                <button className="navbar__mobile-toggle" onClick={() => setMenuOpen(v => !v)}>
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {menuOpen && (
                <div className="navbar__mobile-menu">
                    <Link to="/" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Inicio</Link>
                    {isLoggedIn && (
                        <Link to="/my-orders" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Mis pedidos</Link>
                    )}
                    <Link to="/waitlist" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Lista de espera</Link>
                    <Link to="/cart" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Carrito</Link>
                    {user?.isAdmin && (
                        <>
                            <div className="navbar__mobile-divider" />
                            <span className="navbar__mobile-section">Admin</span>
                            <Link to="/admin/products" className="navbar__mobile-link navbar__mobile-link--admin" onClick={() => setMenuOpen(false)}>
                                Gestión de productos
                            </Link>
                            <Link to="/admin/orders" className="navbar__mobile-link navbar__mobile-link--admin" onClick={() => setMenuOpen(false)}>
                                Gestión de pedidos
                            </Link>
                            <Link to="/admin/incidencias" className="navbar__mobile-link navbar__mobile-link--admin" onClick={() => setMenuOpen(false)}>
                                Incidencias / Devoluciones
                            </Link>
                        </>
                    )}
                    <div className="navbar__mobile-divider" />
                    {isLoggedIn ? (
                        <>
                            <span className="navbar__mobile-user">{displayName}</span>
                            <button className="navbar__mobile-link navbar__mobile-link--danger" onClick={handleLogout}>
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Iniciar sesión</Link>
                            <Link to="/register" className="navbar__mobile-link navbar__mobile-link--primary" onClick={() => setMenuOpen(false)}>Registrarse</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
