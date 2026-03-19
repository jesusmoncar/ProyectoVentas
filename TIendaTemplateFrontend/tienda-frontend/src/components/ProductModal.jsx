import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingCart, Package } from 'lucide-react';
import { BACKEND_URL } from '../api/axios';
import './ProductModal.css';

const GRADIENTS = [
    'linear-gradient(135deg,#6366f1,#8b5cf6)',
    'linear-gradient(135deg,#3b82f6,#06b6d4)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
    'linear-gradient(135deg,#10b981,#3b82f6)',
    'linear-gradient(135deg,#ec4899,#f43f5e)',
    'linear-gradient(135deg,#8b5cf6,#ec4899)',
];

export default function ProductModal({ product, gradientIndex = 0, onClose, onAddToCart, addedToCart }) {
    const [imgIndex, setImgIndex] = useState(0);
    const [selectedVariantIdx, setSelectedVariantIdx] = useState(null);

    const images = product?.images ?? [];
    const variants = product?.variants ?? [];
    const hasVariants = variants.length > 0;

    const selectedVariant = selectedVariantIdx !== null ? variants[selectedVariantIdx] : null;
    const cartKey = selectedVariant
        ? `${product.id}_v${selectedVariantIdx}`
        : String(product.id);

    const isAdded = addedToCart.has(cartKey);

    useEffect(() => {
        setImgIndex(0);
        setSelectedVariantIdx(null);
    }, [product]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    if (!product) return null;

    const prevImg = () => setImgIndex(i => (i - 1 + images.length) % images.length);
    const nextImg = () => setImgIndex(i => (i + 1) % images.length);

    const totalStock = variants.reduce((s, v) => s + (v.stock ?? 0), 0);
    const canAdd = !hasVariants || (selectedVariant && (selectedVariant.stock ?? 0) > 0);

    const handleAdd = () => {
        if (!canAdd) return;
        onAddToCart(product, selectedVariant, selectedVariantIdx);
    };

    let btnLabel = 'Añadir al carrito';
    if (isAdded) btnLabel = '¡Añadido!';
    else if (hasVariants && !selectedVariant) btnLabel = 'Selecciona una variante';
    else if (selectedVariant && (selectedVariant.stock ?? 0) === 0) btnLabel = 'Sin stock';
    else if (!hasVariants && totalStock === 0) btnLabel = 'Sin stock';

    return (
        <div className="pm-overlay" onClick={onClose}>
            <div className="pm-modal" onClick={e => e.stopPropagation()}>
                <button className="pm-close" onClick={onClose} aria-label="Cerrar">
                    <X size={20} />
                </button>

                {/* Image panel */}
                <div className="pm-image-panel">
                    {images.length > 0 ? (
                        <>
                            <img
                                src={`${BACKEND_URL}${images[imgIndex]}`}
                                alt={product.name}
                                className="pm-image"
                            />
                            {images.length > 1 && (
                                <>
                                    <button className="pm-nav pm-nav--prev" onClick={prevImg}>
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button className="pm-nav pm-nav--next" onClick={nextImg}>
                                        <ChevronRight size={20} />
                                    </button>
                                    <div className="pm-dots">
                                        {images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                className={`pm-dot ${idx === imgIndex ? 'pm-dot--active' : ''}`}
                                                onClick={() => setImgIndex(idx)}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div
                            className="pm-image-placeholder"
                            style={{ background: GRADIENTS[gradientIndex % GRADIENTS.length] }}
                        >
                            <Package size={56} color="rgba(255,255,255,0.7)" />
                        </div>
                    )}
                </div>

                {/* Info panel */}
                <div className="pm-info">
                    <div className="pm-info__top">
                        <h2 className="pm-name">{product.name}</h2>
                        <span className="pm-price">{product.basePrice?.toFixed(2)} €</span>
                    </div>

                    {product.description && (
                        <p className="pm-desc">{product.description}</p>
                    )}

                    {/* Stock badge */}
                    <div className="pm-meta">
                        <span className={`pm-stock-badge ${totalStock === 0 ? 'pm-stock-badge--out' : ''}`}>
                            {totalStock === 0 ? 'Sin stock' : `${totalStock} en stock`}
                        </span>
                    </div>

                    {/* Variants */}
                    {hasVariants && (
                        <div className="pm-section">
                            <p className="pm-section__label">
                                Elige variante
                                {!selectedVariant && <span className="pm-section__required"> — obligatorio</span>}
                            </p>
                            <div className="pm-variants">
                                {variants.map((v, idx) => {
                                    const outOfStock = (v.stock ?? 0) === 0;
                                    const isSelected = selectedVariantIdx === idx;
                                    return (
                                        <button
                                            key={idx}
                                            className={`pm-variant-btn ${isSelected ? 'pm-variant-btn--selected' : ''} ${outOfStock ? 'pm-variant-btn--out' : ''}`}
                                            onClick={() => !outOfStock && setSelectedVariantIdx(isSelected ? null : idx)}
                                            disabled={outOfStock}
                                            title={outOfStock ? 'Sin stock' : undefined}
                                        >
                                            {v.color && (
                                                <span
                                                    className="pm-variant-color"
                                                    style={{ background: v.color.toLowerCase() }}
                                                />
                                            )}
                                            <span className="pm-variant-label">
                                                {[v.color, v.size].filter(Boolean).join(' / ') || `Variante ${idx + 1}`}
                                            </span>
                                            <span className={`pm-variant-stock ${outOfStock ? 'pm-variant-stock--out' : ''}`}>
                                                {outOfStock ? 'Agotado' : `${v.stock} uds`}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="pm-actions">
                        <button
                            className={`pm-cart-btn ${isAdded ? 'pm-cart-btn--added' : ''} ${!canAdd && !isAdded ? 'pm-cart-btn--disabled' : ''}`}
                            onClick={handleAdd}
                            disabled={!canAdd || isAdded}
                        >
                            <ShoppingCart size={17} />
                            {btnLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
