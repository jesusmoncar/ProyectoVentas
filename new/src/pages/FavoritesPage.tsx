import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiArrowLeft, FiGrid } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

export default function FavoritesPage() {
  const { wishlist } = useWishlist();
  const [isCompactView, setIsCompactView] = useState(window.innerWidth < 768);

  useEffect(() => {
    // Sync initial state if needed
  }, []);

  return (
    <div className="favorites-page">
      <div className="favorites-page__container">
        <header className="favorites-page__header">
          <Link to="/catalogo" className="favorites-page__back">
            <FiArrowLeft /> Volver al catálogo
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', position: 'relative' }}>
            <h1 className="favorites-page__title" style={{ margin: 0 }}>
              Mis Favoritos <FiHeart className="favorites-page__title-icon" />
            </h1>
            <button 
              className={`btn btn--action-icon ${isCompactView ? 'btn--action-icon-active' : ''} mobile-only`}
              onClick={() => setIsCompactView(!isCompactView)}
              style={{ position: 'absolute', right: 0 }}
            >
              <FiGrid size={20} />
            </button>
          </div>
          <p className="favorites-page__subtitle">
            {wishlist.length === 0 
              ? "Aún no tienes productos en tu lista de deseos." 
              : `Tienes ${wishlist.length} ${wishlist.length === 1 ? 'producto' : 'productos'} guardados.`}
          </p>
        </header>

        {wishlist.length > 0 ? (
          <div className={`favorites-page__grid products-grid ${isCompactView ? 'products-grid--compact' : ''}`}>
            {wishlist.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="favorites-page__empty">
            <div className="favorites-page__empty-icon">
              <FiHeart size={64} />
            </div>
            <h2>Tu lista está vacía</h2>
            <p>¡Explora nuestro catálogo y guarda los productos que más te gusten!</p>
            <Link to="/catalogo" className="favorites-page__explore-btn">
              Explorar Catálogo
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .favorites-page {
          padding: 120px 20px 60px;
          min-height: 80vh;
        }
        .favorites-page__container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .favorites-page__header {
          margin-bottom: 40px;
          text-align: center;
        }
        .favorites-page__back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          margin-bottom: 16px;
          transition: color 0.2s;
        }
        .favorites-page__back:hover {
          color: var(--primary);
        }
        .favorites-page__title {
          font-size: 2.5rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .favorites-page__title-icon {
          color: #E8A0B8;
        }
        .favorites-page__subtitle {
          color: var(--text-secondary);
          font-size: 1.1rem;
          margin-top: 10px;
        }
        .favorites-page__grid {
          width: 100%;
        }
        @media (max-width: 768px) {
          .favorites-page__title { font-size: 1.8rem; }
        }
        .favorites-page__empty {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 20px;
          box-shadow: var(--shadow-sm);
        }
        .favorites-page__empty-icon {
          color: #eee;
          margin-bottom: 24px;
        }
        .favorites-page__empty h2 {
          font-size: 1.5rem;
          margin-bottom: 12px;
        }
        .favorites-page__empty p {
          color: var(--text-secondary);
          margin-bottom: 30px;
        }
        .favorites-page__explore-btn {
          display: inline-block;
          padding: 14px 32px;
          background: var(--primary);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .favorites-page__explore-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}

