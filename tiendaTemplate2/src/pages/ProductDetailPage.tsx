import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiHeart, FiChevronLeft, FiChevronRight, FiTruck, FiRefreshCw } from 'react-icons/fi';
import api, { getImageUrl } from '../api/api';
import { useCart } from '../context/CartContext';
import type { Product, ProductVariant } from '../types';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get<Product>(`/products/${id}`)
        .then(res => {
          setProduct(res.data);
          if (res.data.variants.length > 0) {
            setSelectedVariant(res.data.variants[0]);
          }
        })
        .catch(() => toast.error('Error al cargar el producto'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div className="loading-screen"><div className="loading-spinner" /></div>;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '200px 0', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Pieza no encontrada</h2>
        <Link to="/catalogo" className="btn btn--outline" style={{ marginTop: '32px' }}>Volver al Catálogo</Link>
      </div>
    );
  }

  const uniqueColors = [...new Set(product.variants.map(v => v.color))].filter(Boolean);
  const sizesForColor = selectedVariant
    ? product.variants.filter(v => v.color === selectedVariant.color)
    : product.variants;
  
  const hasDiscount = product.discountPercent !== undefined && product.discountPercent > 0;
  const basePrice = selectedVariant?.priceOverride ?? product.basePrice;
  const finalPrice = hasDiscount ? basePrice * (1 - (product.discountPercent || 0) / 100) : basePrice;

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(product, selectedVariant, quantity);
      toast.success('Pieza añadida a su bolsa.');
    }
  };

  return (
    <div className="product-page fade-in">
      <div className="container product-page__container">
        
        {/* Gallery Section */}
        <div className="product-page__gallery">
          <div className="product-page__main-wrapper">
            {product.images.length > 0 ? (
              <img 
                src={getImageUrl(product.images[currentImageIndex], product.id)} 
                alt={product.name} 
                className="product-page__main-img"
              />
            ) : (
              <div className="product-page__img-placeholder" />
            )}
            
            <button className={`product-page__wishlist ${liked ? 'active' : ''}`} onClick={() => setLiked(!liked)}>
              <FiHeart size={20} fill={liked ? "var(--accent)" : "none"} />
            </button>

            {product.images.length > 1 && (
              <div className="product-page__nav">
                <button onClick={() => setCurrentImageIndex(p => (p - 1 + product.images.length) % product.images.length)}>
                  <FiChevronLeft size={24} />
                </button>
                <button onClick={() => setCurrentImageIndex(p => (p + 1) % product.images.length)}>
                  <FiChevronRight size={24} />
                </button>
              </div>
            )}
          </div>

          <div className="product-page__thumbs">
            {product.images.map((img, idx) => (
              <button 
                key={idx} 
                className={`product-page__thumb ${idx === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(idx)}
              >
                <img src={getImageUrl(img, product.id)} alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="product-page__info">
          <nav className="product-page__breadcrumb">
            <Link to="/catalogo">Colección</Link> / <span>{product.name}</span>
          </nav>

          <h1 className="product-page__title">{product.name}</h1>
          
          <div className="product-page__price-box">
            {hasDiscount ? (
              <>
                <span className="price price--new">€{finalPrice.toFixed(2)}</span>
                <span className="price price--old">€{basePrice.toFixed(2)}</span>
                <span className="badge badge--discount">-{product.discountPercent}%</span>
              </>
            ) : (
              <span className="price">€{basePrice.toFixed(2)}</span>
            )}
          </div>

          <p className="product-page__desc">{product.description}</p>

          <div className="product-page__options">
            {uniqueColors.length > 0 && (
              <div className="product-page__option-group">
                <label>Color</label>
                <div className="product-page__colors">
                  {uniqueColors.map(color => (
                    <button
                      key={color}
                      className={`color-dot ${selectedVariant?.color === color ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedVariant(product.variants.find(v => v.color === color) || null)}
                    />
                  ))}
                </div>
              </div>
            )}

            {sizesForColor.length > 0 && (
              <div className="product-page__option-group">
                <label>Talla</label>
                <div className="product-page__sizes">
                  {sizesForColor.map(v => (
                    <button
                      key={v.id}
                      className={`size-btn ${selectedVariant?.id === v.id ? 'active' : ''} ${v.stock === 0 ? 'disabled' : ''}`}
                      disabled={v.stock === 0}
                      onClick={() => setSelectedVariant(v)}
                    >
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="product-page__option-group">
              <label>Cantidad</label>
              <div className="product-page__qty">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
            </div>
          </div>

          <button 
            className="btn btn--primary btn--full btn--lg"
            disabled={!selectedVariant || selectedVariant.stock === 0}
            onClick={handleAddToCart}
          >
            {selectedVariant?.stock === 0 ? 'Agotado' : 'Añadir a la Bolsa'}
          </button>

          <div className="product-page__benefits">
            <div className="benefit-item">
              <FiTruck size={18} />
              <div>
                <h6>Envío de cortesía</h6>
                <p>En pedidos superiores a €50</p>
              </div>
            </div>
            <div className="benefit-item">
              <FiRefreshCw size={18} />
              <div>
                <h6>Devoluciones</h6>
                <p>Periodo de 14 días asegurado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
