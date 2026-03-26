import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiLogOut, FiSearch, FiSettings, FiPackage, FiGrid } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <button className="navbar__menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-text">BLOOM</span>
          <span className="navbar__logo-dot">.</span>
        </Link>

        <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'navbar__link--active' : ''}`}>Inicio</Link>
          <Link to="/catalogo" className={`navbar__link ${location.pathname === '/catalogo' ? 'navbar__link--active' : ''}`}>Catálogo</Link>
          {isAuthenticated ? (
            <Link to="/mis-pedidos" className={`navbar__link ${location.pathname === '/mis-pedidos' ? 'navbar__link--active' : ''}`}>Mis Pedidos</Link>
          ) : (
            <Link to="/seguimiento" className={`navbar__link ${location.pathname === '/seguimiento' ? 'navbar__link--active' : ''}`}>Seguimiento</Link>
          )}
          {isAdmin && (
            <Link to="/admin/productos" className={`navbar__link navbar__link--admin ${location.pathname.startsWith('/admin') ? 'navbar__link--active' : ''}`}>
              <FiSettings size={14} /> Admin
            </Link>
          )}
        </div>

        <div className="navbar__actions">
          <Link to="/catalogo" className="navbar__action-btn" aria-label="Buscar">
            <FiSearch size={20} />
          </Link>

          <button className="navbar__action-btn navbar__cart-btn" onClick={openCart} aria-label="Carrito">
            <FiShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="navbar__cart-badge">{totalItems}</span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="navbar__user-menu-wrapper">
              <button className="navbar__action-btn navbar__user-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <div className={`navbar__avatar ${isAdmin ? 'navbar__avatar--admin' : ''}`}>
                  {user?.nombre?.charAt(0).toUpperCase()}
                </div>
              </button>
              {userMenuOpen && (
                <div className="navbar__user-dropdown">
                  <div className="navbar__user-info">
                    <span className="navbar__user-name">{user?.nombre} {user?.apellido}</span>
                    <span className="navbar__user-email">{user?.email}</span>
                    {isAdmin && <span className="navbar__user-role">👑 Administrador</span>}
                  </div>
                  <hr className="navbar__divider" />
                  <Link to="/profile" className="navbar__dropdown-item">Mi Perfil</Link>
                  <Link to="/mis-pedidos" className="navbar__dropdown-item">
                    <FiPackage size={16} /> Mis Pedidos
                  </Link>
                  {isAdmin && (
                    <>
                      <hr className="navbar__divider" />
                      <Link to="/admin/productos" className="navbar__dropdown-item navbar__dropdown-item--admin">
                        <FiGrid size={16} /> Gestión Productos
                      </Link>
                      <Link to="/admin/pedidos" className="navbar__dropdown-item navbar__dropdown-item--admin">
                        <FiPackage size={16} /> Gestión Pedidos
                      </Link>
                    </>
                  )}
                  <hr className="navbar__divider" />
                  <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={logout}>
                    <FiLogOut size={16} /> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar__action-btn" aria-label="Iniciar Sesión">
              <FiUser size={20} />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile overlay */}
      {menuOpen && <div className="navbar__overlay" onClick={() => setMenuOpen(false)} />}
    </nav>
  );
}
