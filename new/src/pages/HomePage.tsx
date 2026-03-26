import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiStar } from 'react-icons/fi';
import api from '../api/api';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Product[]>('/products')
      .then(res => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__bg-shapes">
          <div className="hero__shape hero__shape--1" />
          <div className="hero__shape hero__shape--2" />
          <div className="hero__shape hero__shape--3" />
          <div className="hero__shape hero__shape--4" />
        </div>
        <div className="hero__content">
          <span className="hero__badge">✨ Nueva Colección 2026</span>
          <h1 className="hero__title">
            Descubre Tu <span className="hero__title-accent">Estilo</span> Único
          </h1>
          <p className="hero__subtitle">
            Explora nuestra colección exclusiva de moda pensada para quienes buscan piezas que realmente marquen la diferencia.
          </p>
          <div className="hero__cta">
            <Link to="/catalogo" className="btn btn--primary btn--lg">
              Explorar Colección <FiArrowRight size={20} />
            </Link>
            <Link to="/catalogo" className="btn btn--outline btn--lg">
              Ver Novedades
            </Link>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__card hero__card--1">
            <div className="hero__card-inner" style={{ background: 'var(--pastel-pink-light)' }}>
              <span className="hero__card-emoji">👗</span>
              <span>Vestidos</span>
            </div>
          </div>
          <div className="hero__card hero__card--2">
            <div className="hero__card-inner" style={{ background: 'var(--pastel-lavender-light)' }}>
              <span className="hero__card-emoji">👔</span>
              <span>Camisas</span>
            </div>
          </div>
          <div className="hero__card hero__card--3">
            <div className="hero__card-inner" style={{ background: 'var(--pastel-mint-light)' }}>
              <span className="hero__card-emoji">👖</span>
              <span>Pantalones</span>
            </div>
          </div>
          <div className="hero__card hero__card--4">
            <div className="hero__card-inner" style={{ background: 'var(--pastel-peach-light)' }}>
              <span className="hero__card-emoji">👟</span>
              <span>Accesorios</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="features__grid">
          <div className="feature-card">
            <div className="feature-card__icon" style={{ background: 'var(--pastel-pink-light)' }}>
              <FiTruck size={28} />
            </div>
            <h3>Envío Gratis</h3>
            <p>En pedidos superiores a €50</p>
          </div>
          <div className="feature-card">
            <div className="feature-card__icon" style={{ background: 'var(--pastel-mint-light)' }}>
              <FiShield size={28} />
            </div>
            <h3>Pago Seguro</h3>
            <p>Transacciones 100% protegidas</p>
          </div>
          <div className="feature-card">
            <div className="feature-card__icon" style={{ background: 'var(--pastel-lavender-light)' }}>
              <FiRefreshCw size={28} />
            </div>
            <h3>Devolución Fácil</h3>
            <p>30 días de devolución gratuita</p>
          </div>
          <div className="feature-card">
            <div className="feature-card__icon" style={{ background: 'var(--pastel-peach-light)' }}>
              <FiStar size={28} />
            </div>
            <h3>Calidad Premium</h3>
            <p>Materiales de primera calidad</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="section-header">
          <span className="section-header__tag">Categorías</span>
          <h2 className="section-header__title">Explora por Estilo</h2>
          <p className="section-header__desc">Encuentra exactamente lo que buscas entre nuestras categorías</p>
        </div>
        <div className="categories__grid">
          <Link to="/catalogo" className="category-card category-card--large" style={{ background: 'var(--gradient-accent)' }}>
            <span className="category-card__emoji">👗</span>
            <div className="category-card__info">
              <h3>Vestidos</h3>
              <span>Ver colección <FiArrowRight /></span>
            </div>
          </Link>
          <Link to="/catalogo" className="category-card" style={{ background: 'var(--gradient-mint)' }}>
            <span className="category-card__emoji">👕</span>
            <div className="category-card__info">
              <h3>Camisetas</h3>
              <span>Ver colección <FiArrowRight /></span>
            </div>
          </Link>
          <Link to="/catalogo" className="category-card" style={{ background: 'linear-gradient(135deg, var(--pastel-peach), var(--pastel-yellow))' }}>
            <span className="category-card__emoji">👖</span>
            <div className="category-card__info">
              <h3>Pantalones</h3>
              <span>Ver colección <FiArrowRight /></span>
            </div>
          </Link>
          <Link to="/catalogo" className="category-card" style={{ background: 'linear-gradient(135deg, var(--pastel-blue), var(--pastel-lavender))' }}>
            <span className="category-card__emoji">👜</span>
            <div className="category-card__info">
              <h3>Accesorios</h3>
              <span>Ver colección <FiArrowRight /></span>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="section-header">
          <span className="section-header__tag">Lo Más Popular</span>
          <h2 className="section-header__title">Productos Destacados</h2>
          <p className="section-header__desc">Las piezas favoritas de nuestros clientes esta temporada</p>
        </div>
        {loading ? (
          <div className="products-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="product-skeleton">
                <div className="product-skeleton__image" />
                <div className="product-skeleton__text" />
                <div className="product-skeleton__text product-skeleton__text--short" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="products-grid">
            {products.slice(0, 8).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>🌸 Pronto tendremos productos increíbles para ti</p>
          </div>
        )}
        <div className="featured-products__cta">
          <Link to="/catalogo" className="btn btn--outline btn--lg">
            Ver Todo el Catálogo <FiArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="promo-banner__content">
          <span className="promo-banner__tag">Oferta Especial</span>
          <h2 className="promo-banner__title">Hasta 40% de Descuento</h2>
          <p className="promo-banner__text">En toda la nueva colección primavera-verano 2026</p>
          <Link to="/catalogo" className="btn btn--white btn--lg">
            Comprar Ahora <FiArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="newsletter__content">
          <h2 className="newsletter__title">Únete a la Familia BLOOM</h2>
          <p className="newsletter__text">Suscríbete para recibir ofertas exclusivas, novedades y un 10% de descuento en tu primera compra</p>
          <form className="newsletter__form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="tu@email.com" className="newsletter__input" />
            <button type="submit" className="btn btn--primary">Suscribirme</button>
          </form>
        </div>
      </section>
    </div>
  );
}
