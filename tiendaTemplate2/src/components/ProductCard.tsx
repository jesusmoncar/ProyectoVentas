import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiPlus } from 'react-icons/fi';
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

  const hasDiscount = product.discountPercent !== undefined && product.discountPercent > 0;
  const price = hasDiscount 
    ? (product.basePrice * (1 - (product.discountPercent || 0) / 100)) 
    : product.basePrice;

  const uniqueColors = Array.from(new Set(product.variants.map(v => v.color).filter(Boolean)));

  return (
    <div className="product-card fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
      <Link to={`/producto/${product.id}`} className="product-card__wrapper">
        <div className="product-card__media">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className={`product-card__img ${imageLoaded ? 'product-card__img--loaded' : ''}`}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="product-card__placeholder">
              <span>Studio Luxe</span>
            </div>
          )}
          
          <button 
            className={`product-card__wishlist ${liked ? 'product-card__wishlist--active' : ''}`}
            onClick={handleToggleFavorite}
          >
            <FiHeart size={16} fill={liked ? "var(--accent)" : "none"} />
          </button>

          <div className="product-card__badges">
            {hasDiscount && <span className="badge badge--discount">-{product.discountPercent}%</span>}
            {product.variants.some(v => v.stock <= 3 && v.stock > 0) && <span className="badge badge--stock">Ultimas unidades</span>}
          </div>

        </div>

        <div className="product-card__content">
          <h3 className="product-card__title">{product.name}</h3>
          {uniqueColors.length > 0 && (
            <div className="product-card__colors">
              {uniqueColors.map(color => (
                <span key={color} className="color-swatch-sm" style={{ backgroundColor: color }} title={color} />
              ))}
            </div>
          )}
          <div className="product-card__price-box">
            {hasDiscount ? (
              <>
                <span className="price price--new">€{price.toFixed(2)}</span>
                <span className="price price--old">€{product.basePrice.toFixed(2)}</span>
              </>
            ) : (
              <span className="price">€{product.basePrice.toFixed(2)}</span>
            )}
          </div>
          
          <div className="product-card__quick-add">
            <button className="btn-quick-add" onClick={handleAddToCart}>
              <FiPlus size={14} /> <span>Añadir</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
