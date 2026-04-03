import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiSearch, FiHeart, FiSettings } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems, openCart } = useCart();
  const { wishlist } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
    setAdminMenuOpen(false);
  }, [location]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <button className="navbar__menu-btn mobile-only" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        {menuOpen && (
          <div className="navbar__backdrop mobile-only fade-in" onClick={() => setMenuOpen(false)}></div>
        )}

        <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <span className="navbar__drawer-logo mobile-only">Studio Luxe</span>
          <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'navbar__link--active' : ''}`}>Inicio</Link>
          <Link to="/catalogo" className={`navbar__link ${location.pathname === '/catalogo' ? 'navbar__link--active' : ''}`}>Catálogo</Link>
          {isAuthenticated && (
            <Link to="/mis-pedidos" className={`navbar__link ${location.pathname === '/mis-pedidos' ? 'navbar__link--active' : ''}`}>Pedidos</Link>
          )}
        </div>

        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-text">Studio Luxe</span>
        </Link>

        <div className="navbar__actions">
          <Link to="/catalogo" className="navbar__action-btn desktop-only" aria-label="Buscar">
            <FiSearch size={18} />
          </Link>

          <Link to="/favoritos" className="navbar__action-btn" aria-label="Favoritos">
            <FiHeart size={18} />
            {wishlist.length > 0 && (
              <span className="navbar__badge">{wishlist.length}</span>
            )}
          </Link>

          <button className="navbar__action-btn" onClick={openCart} aria-label="Carrito">
            <FiShoppingBag size={18} />
            {totalItems > 0 && (
              <span className="navbar__badge">{totalItems}</span>
            )}
          </button>

          {isAdmin && (
            <div className="navbar__admin-wrapper">
              <button className="navbar__action-btn navbar__admin-btn" onClick={() => setAdminMenuOpen(!adminMenuOpen)} aria-label="Admin">
                <FiSettings size={18} />
              </button>
              {adminMenuOpen && (
                <div className="navbar__admin-dropdown">
                  <Link to="/admin/productos" className="navbar__dropdown-link">Gestión Productos</Link>
                  <Link to="/admin/pedidos" className="navbar__dropdown-link">Gestión Pedidos</Link>
                </div>
              )}
            </div>
          )}
          <div className="navbar__user-wrapper">
            {isAuthenticated ? (
              <div className="navbar__user-dropdown-container">
                <button className="navbar__user-trigger" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                  <span className="navbar__user-initial">{user?.nombre?.charAt(0)}</span>
                </button>
                {userMenuOpen && (
                  <div className="navbar__dropdown">
                    <div className="navbar__dropdown-header">
                      <p>{user?.nombre} {user?.apellido}</p>
                      <span>{user?.email}</span>
                    </div>
                    <Link to="/profile" className="navbar__dropdown-link">Mi Perfil</Link>
                    <Link to="/mis-pedidos" className="navbar__dropdown-link">Mis Pedidos</Link>
                    <button className="navbar__dropdown-link navbar__dropdown-link--danger" onClick={logout}>
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="navbar__action-btn" aria-label="Iniciar Sesión">
                <FiUser size={18} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
