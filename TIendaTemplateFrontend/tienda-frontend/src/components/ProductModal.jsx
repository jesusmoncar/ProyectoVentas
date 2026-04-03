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

    const images = product?.images ?? [];
    const variants = product?.variants ?? [];
    const hasVariants = variants.length > 0;

    // Obtener colores únicos
    const availableColors = Array.from(new Set(variants.map(v => v.color).filter(Boolean)));
    
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);

    // Resetear al cambiar de producto
    useEffect(() => {
        setImgIndex(0);
        if (variants.length > 0) {
            const colors = Array.from(new Set(variants.map(v => v.color).filter(Boolean)));
            setSelectedColor(colors.length > 0 ? colors[0] : null);
            setSelectedSize(null);
        }
    }, [product]);

    // Bloquear scroll del body
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Cerrar con Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    if (!product) return null;

    const prevImg = () => setImgIndex(i => (i - 1 + images.length) % images.length);
    const nextImg = () => setImgIndex(i => (i + 1) % images.length);

    const totalStock = variants.length > 0 ? variants.reduce((s, v) => s + (v.stock ?? 0), 0) : (product.stock ?? 0);

    // Lógica para encontrar la variante seleccionada
    // Si no hay colores pero sí tamaños (solo tamaños), selectedColor es null
    let availableVariantsForSelection = variants;
    if (availableColors.length > 0) {
        availableVariantsForSelection = variants.filter(v => v.color === selectedColor);
    }

    const uncoloredVariants = variants.filter(v => !v.color && v.size); // En caso de que haya variantes sin color

    const isSizeRequired = availableVariantsForSelection.some(v => v.size) || uncoloredVariants.some(v => v.size);

    const selectedVariant = variants.find(v => 
        (availableColors.length > 0 ? v.color === selectedColor : true) && 
        (isSizeRequired ? v.size === selectedSize : true)
    ) || null;

    const selectedVariantIdx = selectedVariant ? variants.indexOf(selectedVariant) : null;
    const cartKey = selectedVariant ? `${product.id}_v${selectedVariantIdx}` : String(product.id);
    const isAdded = addedToCart.has(cartKey);

    const canAdd = !hasVariants || (selectedVariant && (selectedVariant.stock ?? 0) > 0);

    const handleAdd = (e) => {
        if (!canAdd) return;
        onAddToCart(product, selectedVariant, selectedVariantIdx, e);
    };

    let btnLabel = 'Añadir al carrito';
    if (isAdded) btnLabel = '¡Añadido!';
    else if (hasVariants && isSizeRequired && !selectedSize) btnLabel = 'Selecciona una talla';
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
                                src={images[imgIndex].startsWith('http') ? images[imgIndex] : `${BACKEND_URL}${images[imgIndex]}`}
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

                    {/* Meta (Stock total si no hay variantes) */}
                    {!hasVariants && (
                        <div className="pm-meta">
                            <span className={`pm-stock-badge ${totalStock === 0 ? 'pm-stock-badge--out' : ''}`}>
                                {totalStock === 0 ? 'Sin stock' : `${totalStock} en stock`}
                            </span>
                        </div>
                    )}

                    {/* Variantes separadas por Color y Talla */}
                    {hasVariants && (
                        <div className="pm-section">
                            
                            {/* Grupo: Color */}
                            {availableColors.length > 0 && (
                                <div className="pm-option-group">
                                    <p className="pm-section__label">
                                        Color: <span style={{ color: '#111827', fontWeight: 600, textTransform: 'capitalize' }}>
                                            {variants.find(v => v.color === selectedColor)?.colorName || selectedColor}
                                        </span>
                                    </p>
                                    <div className="pm-color-list">
                                        {availableColors.map(color => {
                                            const isSelected = color === selectedColor;
                                            return (
                                                <button
                                                    key={color}
                                                    className={`pm-color-btn ${isSelected ? 'pm-color-btn--active' : ''}`}
                                                    style={{ background: color.toLowerCase() }}
                                                    onClick={() => {
                                                        setSelectedColor(color);
                                                        setSelectedSize(null); // Resetea la talla al cambiar de color
                                                    }}
                                                    title={color}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Grupo: Tallas */}
                            {isSizeRequired && (
                                <div className="pm-option-group">
                                    <p className="pm-section__label">
                                        Talla
                                        {!selectedSize && <span className="pm-section__required"> — obligatorio</span>}
                                    </p>
                                    <div className="pm-size-list">
                                        {(availableColors.length > 0 ? availableVariantsForSelection : uncoloredVariants).map(v => {
                                            const outOfStock = (v.stock ?? 0) === 0;
                                            const isSelected = v.size === selectedSize;
                                            return (
                                                <button
                                                    key={v.size || v.id}
                                                    className={`pm-size-btn ${isSelected ? 'pm-size-btn--active' : ''} ${outOfStock ? 'pm-size-btn--out' : ''}`}
                                                    onClick={() => !outOfStock && setSelectedSize(isSelected ? null : v.size)}
                                                    disabled={outOfStock}
                                                >
                                                    {v.size}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Mostrar el stock de la variante seleccionada o indicar si está agotada */}
                            {selectedVariant && (
                                <div className="pm-meta" style={{ marginTop: '4px' }}>
                                    <span className={`pm-stock-badge ${(selectedVariant.stock ?? 0) === 0 ? 'pm-stock-badge--out' : ''}`}>
                                        {(selectedVariant.stock ?? 0) === 0 ? 'Variante agotada' : `${selectedVariant.stock} uds en stock`}
                                    </span>
                                </div>
                            )}
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
