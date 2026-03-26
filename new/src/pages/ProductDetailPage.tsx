import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiChevronLeft, FiChevronRight, FiCheck, FiTruck, FiRefreshCw, FiShield } from 'react-icons/fi';
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
    return (
      <div className="product-detail">
        <div className="product-detail__container">
          <div className="product-detail__gallery">
            <div className="product-skeleton__image" style={{ height: '500px', borderRadius: 'var(--radius-lg)' }} />
          </div>
          <div className="product-detail__info">
            <div className="product-skeleton__text" style={{ width: '60%', height: '32px' }} />
            <div className="product-skeleton__text" style={{ width: '30%', height: '24px', marginTop: '12px' }} />
            <div className="product-skeleton__text" style={{ width: '100%', height: '80px', marginTop: '20px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="empty-state" style={{ minHeight: '60vh' }}>
        <div className="empty-state__icon">😕</div>
        <h3>Producto no encontrado</h3>
        <Link to="/catalogo" className="btn btn--primary">Volver al Catálogo</Link>
      </div>
    );
  }

  const uniqueColors = [...new Set(product.variants.map(v => v.color))].filter(Boolean);
  const sizesForColor = selectedVariant
    ? product.variants.filter(v => v.color === selectedVariant.color)
    : product.variants;
  const currentPrice = selectedVariant?.priceOverride ?? product.basePrice;

  const handleColorSelect = (color: string) => {
    const variant = product.variants.find(v => v.color === color);
    if (variant) setSelectedVariant(variant);
  };

  const handleSizeSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(product, selectedVariant, quantity);
      toast.success('¡Agregado al carrito!', { icon: '🛒' });
    }
  };

  const nextImage = () => {
    if (product.images.length > 0) {
      setCurrentImageIndex(prev => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images.length > 0) {
      setCurrentImageIndex(prev => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  return (
    <div className="product-detail">
      <div className="product-detail__breadcrumb">
        <Link to="/">Inicio</Link>
        <span>/</span>
        <Link to="/catalogo">Catálogo</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="product-detail__container">
        {/* Gallery */}
        <div className="product-detail__gallery">
          <div className="product-detail__main-image">
            {product.images.length > 0 ? (
              <>
                <img
                  src={getImageUrl(product.images[currentImageIndex], product.id)}
                  alt={product.name}
                />
                {product.images.length > 1 && (
                  <>
                    <button className="product-detail__nav-btn product-detail__nav-btn--prev" onClick={prevImage}>
                      <FiChevronLeft size={20} />
                    </button>
                    <button className="product-detail__nav-btn product-detail__nav-btn--next" onClick={nextImage}>
                      <FiChevronRight size={20} />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="product-card__placeholder" style={{ height: '100%', minHeight: '400px' }}>
                <FiShoppingBag size={64} />
                <span>BLOOM</span>
              </div>
            )}
            <button
              className={`product-detail__like ${liked ? 'product-card__like--active' : ''}`}
              onClick={() => setLiked(!liked)}
            >
              <FiHeart size={22} />
            </button>
          </div>

          {product.images.length > 1 && (
            <div className="product-detail__thumbnails">
              {product.images.map((img, idx) => (
                <button
                  key={typeof img === 'string' ? img : img.id || idx}
                  className={`product-detail__thumb ${idx === currentImageIndex ? 'product-detail__thumb--active' : ''}`}
                  onClick={() => setCurrentImageIndex(idx)}
                >
                  <img src={getImageUrl(img, product.id)} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="product-detail__info">
          <h1 className="product-detail__name">{product.name}</h1>
          <div className="product-detail__price">€{currentPrice.toFixed(2)}</div>
          <p className="product-detail__description">{product.description}</p>

          {/* Colors */}
          {uniqueColors.length > 0 && (
            <div className="product-detail__section">
              <h3>Color</h3>
              <div className="product-detail__colors">
                {uniqueColors.map(color => (
                  <button
                    key={color}
                    className={`product-detail__color-btn ${selectedVariant?.color === color ? 'product-detail__color-btn--active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                    title={color}
                  >
                    {selectedVariant?.color === color && <FiCheck size={16} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizesForColor.length > 0 && (
            <div className="product-detail__section">
              <h3>Talla</h3>
              <div className="product-detail__sizes">
                {sizesForColor.map(variant => (
                  <button
                    key={variant.id}
                    className={`product-detail__size-btn ${selectedVariant?.id === variant.id ? 'product-detail__size-btn--active' : ''} ${variant.stock === 0 ? 'product-detail__size-btn--disabled' : ''}`}
                    onClick={() => variant.stock > 0 && handleSizeSelect(variant)}
                    disabled={variant.stock === 0}
                  >
                    {variant.size}
                    {variant.stock > 0 && variant.stock <= 3 && (
                      <span className="product-detail__stock-warning">¡{variant.stock} left!</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="product-detail__section">
            <h3>Cantidad</h3>
            <div className="product-detail__quantity">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            className="btn btn--primary btn--full btn--lg product-detail__add-btn"
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock === 0}
          >
            <FiShoppingBag size={20} />
            {selectedVariant?.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
          </button>

          {/* Benefits */}
          <div className="product-detail__benefits">
            <div className="product-detail__benefit">
              <FiTruck size={18} />
              <span>Envío gratis en pedidos +€50</span>
            </div>
            <div className="product-detail__benefit">
              <FiRefreshCw size={18} />
              <span>Devolución gratuita 30 días</span>
            </div>
            <div className="product-detail__benefit">
              <FiShield size={18} />
              <span>Garantía de calidad</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
