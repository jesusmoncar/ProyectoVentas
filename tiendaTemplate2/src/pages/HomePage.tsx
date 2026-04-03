import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
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
    <div className="home fade-in">
      {/* Editorial Hero */}
      <section className="hero-editorial">
        <div className="container hero-editorial__wrapper">
          <div className="hero-editorial__content">
            <span className="hero-editorial__tag">Colección SS26</span>
            <h1 className="hero-editorial__title">
              La esencia <br />
              de lo <i>esencial</i>.
            </h1>
            <p className="hero-editorial__desc">
              Piezas atemporales diseñadas para perdurar. <br />
              Minimalismo elevado a su máxima expresión.
            </p>
            <div className="hero-editorial__actions">
              <Link to="/catalogo" className="btn btn--primary">Descubrir</Link>
              <Link to="/catalogo" className="btn btn--outline">Nueva York 26</Link>
            </div>
          </div>
          <div className="hero-editorial__visual">
            <div className="hero-editorial__main-img">
               {/* Image placeholder with elegant styling */}
               <div className="img-placeholder" />
            </div>
            <div className="hero-editorial__side-img">
               <div className="img-placeholder img-placeholder--small" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories - Minimalist Grid */}
      <section className="categories-luxe">
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag">Categorías</span>
            <h2 className="section-header__title">Nuestra Selección</h2>
          </div>
          <div className="categories-luxe__grid">
            <Link to="/catalogo?category=vestidos" className="cat-card">
              <div className="cat-card__media"><div className="img-placeholder" /></div>
              <div className="cat-card__info">
                <h3>Vestidos</h3>
                <span>Explorar <FiArrowRight /></span>
              </div>
            </Link>
            <Link to="/catalogo?category=accesorios" className="cat-card">
              <div className="cat-card__media"><div className="img-placeholder" /></div>
              <div className="cat-card__info">
                <h3>Accesorios</h3>
                <span>Explorar <FiArrowRight /></span>
              </div>
            </Link>
            <Link to="/catalogo?category=esenciales" className="cat-card">
              <div className="cat-card__media"><div className="img-placeholder" /></div>
              <div className="cat-card__info">
                <h3>Esenciales</h3>
                <span>Explorar <FiArrowRight /></span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="featured-luxe">
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag">Tendencia</span>
            <h2 className="section-header__title">Los Favoritos del Atelier</h2>
          </div>
          
          {loading ? (
            <div className="products-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {products.slice(0, 4).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
          
          <div className="featured-luxe__footer">
            <Link to="/catalogo" className="btn btn--outline">Ver toda la colección</Link>
          </div>
        </div>
      </section>

      {/* Quote / Philosophy Section */}
      <section className="philosophy-luxe">
        <div className="container">
          <div className="philosophy-luxe__content">
            <blockquote>
              "La elegancia es la única belleza que nunca se desvanece."
            </blockquote>
            <cite>Studio Luxe Philosophy</cite>
          </div>
        </div>
      </section>

      {/* Newsletter removed as requested */}
    </div>
  );
}
