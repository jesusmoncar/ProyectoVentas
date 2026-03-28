import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiLogOut, FiSearch, FiPackage, FiGrid, FiHeart, FiSettings } from 'react-icons/fi';
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
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
    setAdminDropdownOpen(false);
  }, [location]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <button className="navbar__menu-btn mobile-only" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-text">BLOOM</span>
          <span className="navbar__logo-dot">.</span>
        </Link>

        <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          {/* Mobile User Header */}
          <div className="mobile-only" style={{ width: '100%', marginBottom: '10px' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'var(--gray-100)', borderRadius: '16px', width: '100%' }}>
                <div className={`navbar__avatar ${isAdmin ? 'navbar__avatar--admin' : ''}`} style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                  {user?.nombre?.charAt(0).toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>{user?.nombre}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user?.email}</span>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn--primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>Iniciar Sesión</Link>
            )}
          </div>

          <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'navbar__link--active' : ''}`} onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link to="/catalogo" className={`navbar__link ${location.pathname === '/catalogo' ? 'navbar__link--active' : ''}`} onClick={() => setMenuOpen(false)}>Catálogo</Link>
          
          {isAuthenticated && (
            <Link to="/mis-pedidos" className={`navbar__link ${location.pathname === '/mis-pedidos' ? 'navbar__link--active' : ''}`} onClick={() => setMenuOpen(false)}>Mis Pedidos</Link>
          )}

          {!isAuthenticated && (
             <Link to="/seguimiento" className={`navbar__link ${location.pathname === '/seguimiento' ? 'navbar__link--active' : ''}`} onClick={() => setMenuOpen(false)}>Seguimiento</Link>
          )}
          
          {/* Mobile extra actions */}
          <div className="mobile-only navbar__mobile-extra">
            <div className="navbar__divider" style={{ width: '100%', height: '1px', background: 'var(--gray-200)', margin: '10px 0' }} />
            {isAuthenticated && (
              <>
                <Link to="/profile" className="navbar__link" style={{ fontSize: '1.1rem' }} onClick={() => setMenuOpen(false)}>Mi Perfil</Link>
                <Link to="/favoritos" className="navbar__link" style={{ fontSize: '1.1rem' }} onClick={() => setMenuOpen(false)}>Mis Favoritos</Link>
                
                {isAdmin && (
                  <>
                    <div className="navbar__divider" style={{ width: '100%', height: '1px', background: 'var(--gray-200)', margin: '10px 0' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Admin</span>
                    <Link to="/admin/productos" className="navbar__link" style={{ fontSize: '1.1rem' }} onClick={() => setMenuOpen(false)}>Gestión Productos</Link>
                    <Link to="/admin/pedidos" className="navbar__link" style={{ fontSize: '1.1rem' }} onClick={() => setMenuOpen(false)}>Gestión Pedidos</Link>
                  </>
                )}

                <div className="navbar__divider" style={{ width: '100%', height: '1px', background: 'var(--gray-200)', margin: '20px 0' }} />
                <button 
                  className="navbar__link" 
                  style={{ color: '#FF5252', border: 'none', background: 'none', padding: 0, fontSize: '1.1rem' }} 
                  onClick={() => { logout(); setMenuOpen(false); }}
                >
                  <FiLogOut size={18} style={{ marginRight: '8px' }} /> Cerrar Sesión
                </button>
              </>
            )}
          </div>

          {/* Desktop Admin Menu */}
          {isAdmin && !menuOpen && (
            <div className="navbar__admin-menu-wrapper">
              <button 
                className={`navbar__link navbar__link--admin ${location.pathname.startsWith('/admin') ? 'navbar__link--active' : ''}`}
                onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
              >
                <FiSettings size={14} /> Admin
              </button>
              {adminDropdownOpen && (
                <div className="navbar__admin-dropdown">
                  <Link to="/admin/productos" className="navbar__dropdown-item" onClick={() => setAdminDropdownOpen(false)}>
                    <FiGrid size={16} /> Gestión Productos
                  </Link>
                  <Link to="/admin/pedidos" className="navbar__dropdown-item" onClick={() => setAdminDropdownOpen(false)}>
                    <FiPackage size={16} /> Gestión Pedidos
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={`navbar__overlay ${menuOpen ? 'navbar__overlay--open' : ''}`} onClick={() => setMenuOpen(false)} />

        <div className="navbar__actions">
          <Link to="/catalogo" className="navbar__action-btn" aria-label="Buscar">
            <FiSearch size={20} />
          </Link>

          <Link to="/favoritos" className="navbar__action-btn navbar__wishlist-btn" aria-label="Favoritos">
            <FiHeart size={20} />
            {wishlist.length > 0 && (
              <span className="navbar__cart-badge">{wishlist.length}</span>
            )}
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
                  <Link to="/favoritos" className="navbar__dropdown-item">
                    <FiHeart size={16} /> Mis Favoritos
                  </Link>
                  <Link to="/mis-pedidos" className="navbar__dropdown-item">
                    <FiPackage size={16} /> Mis Pedidos
                  </Link>
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

    </nav>
  );
}
