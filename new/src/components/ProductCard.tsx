import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiEye } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getImageUrl } from '../api/api';
import type { Product } from '../types';

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useWishlist();
  const [imageLoaded, setImageLoaded] = useState(false);

  const liked = isFavorite(product.id);
  const imageUrl = getImageUrl(product.images?.[0], product.id);

  const uniqueColors = [...new Set(product.variants.map(v => v.color))].filter(Boolean);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.variants.length > 0) {
      addToCart(product, product.variants[0]);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  return (
    <div className="product-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <Link to={`/producto/${product.id}`} className="product-card__link">
        <div className="product-card__image-wrapper">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className={`product-card__image ${imageLoaded ? 'product-card__image--loaded' : ''}`}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="product-card__placeholder">
              <FiShoppingBag size={48} />
              <span>BLOOM</span>
            </div>
          )}

          <div className="product-card__overlay">
            <button className="product-card__overlay-btn" onClick={handleAddToCart} title="Agregar al carrito">
              <FiShoppingBag size={18} />
            </button>
            <Link to={`/producto/${product.id}`} className="product-card__overlay-btn" title="Ver detalles">
              <FiEye size={18} />
            </Link>
          </div>

          <button
            className={`product-card__like ${liked ? 'product-card__like--active' : ''}`}
            onClick={handleToggleFavorite}
            aria-label="Me gusta"
          >
            <FiHeart size={18} fill={liked ? "currentColor" : "none"} />
          </button>

          {product.variants.some(v => v.stock <= 3 && v.stock > 0) && (
            <span className="product-card__badge product-card__badge--limited">¡Últimas!</span>
          )}
          {product.discountPercent !== undefined && product.discountPercent > 0 && (
            <span className="product-card__badge product-card__badge--discount">-{product.discountPercent}%</span>
          )}
        </div>

        <div className="product-card__info">
          <h3 className="product-card__name">{product.name}</h3>

          {uniqueColors.length > 0 && (
            <div className="product-card__colors">
              {uniqueColors.slice(0, 5).map(color => (
                <span
                  key={color}
                  className="product-card__color-dot"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              {uniqueColors.length > 5 && (
                <span className="product-card__color-more">+{uniqueColors.length - 5}</span>
              )}
            </div>
          )}

          <div className="product-card__price-row">
            {product.discountPercent !== undefined && product.discountPercent > 0 ? (
              <>
                <span className="product-card__price product-card__price--discount">
                  €{(product.basePrice * (1 - product.discountPercent / 100)).toFixed(2)}
                </span>
                <span className="product-card__price-old">€{product.basePrice.toFixed(2)}</span>
              </>
            ) : (
              <span className="product-card__price">€{product.basePrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
