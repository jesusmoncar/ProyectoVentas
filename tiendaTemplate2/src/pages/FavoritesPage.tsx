import { Link } from 'react-router-dom';
import { FiHeart, FiArrowLeft } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

export default function FavoritesPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="favorites-luxe fade-in">
      <div className="container">
        <header className="section-header">
          <Link to="/catalogo" className="back-link">
            <FiArrowLeft /> Volver al Atelier
          </Link>
          <span className="section-header__tag">Colección Privada</span>
          <h1 className="section-header__title">Mis Favoritos</h1>
          <p className="section-header__desc">
            {wishlist.length === 0 
              ? "Su selección personalizada está vacía actualmente." 
              : `Dispone de ${wishlist.length} ${wishlist.length === 1 ? 'pieza guardada' : 'piezas guardadas'} en su lista.`}
          </p>
        </header>

        {wishlist.length > 0 ? (
          <div className="products-grid">
            {wishlist.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <div className="success-icon" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
              <FiHeart size={32} />
            </div>
            <h3>Sin piezas guardadas</h3>
            <p>Explore nuestra colección y guarde sus piezas predilectas para más tarde.</p>
            <Link to="/catalogo" className="btn btn--primary" style={{ marginTop: '32px' }}>
              Explorar Colección
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
