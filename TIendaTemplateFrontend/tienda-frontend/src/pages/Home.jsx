import { useEffect, useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Package, ChevronDown, X, Heart } from 'lucide-react';
import api, { BACKEND_URL } from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductModal from '../components/ProductModal';
import './Home.css';

const GRADIENTS = [
    'linear-gradient(135deg, #6366f1, #8b5cf6)',
    'linear-gradient(135deg, #3b82f6, #06b6d4)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #10b981, #3b82f6)',
    'linear-gradient(135deg, #ec4899, #f43f5e)',
    'linear-gradient(135deg, #8b5cf6, #ec4899)',
];

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [waitlist, setWaitlist] = useState(() => {
        try { return JSON.parse(localStorage.getItem('waitlist') ?? '[]'); }
        catch { return []; }
    });

    // Sincronizar wishlist cuando el login la carga desde la BD
    useEffect(() => {
        const sync = () => {
            try { setWaitlist(JSON.parse(localStorage.getItem('waitlist') ?? '[]')); }
            catch { /* ignore */ }
        };
        window.addEventListener('wishlistUpdated', sync);
        return () => window.removeEventListener('wishlistUpdated', sync);
    }, []);

    const toggleWaitlist = (id) => {
        setWaitlist(prev => {
            const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
            localStorage.setItem('waitlist', JSON.stringify(next));
            return next;
        });
    };

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedProductIndex, setSelectedProductIndex] = useState(0);

    const [addedToCart, setAddedToCart] = useState(new Set());
    const [flyingItems, setFlyingItems] = useState([]);

    const triggerFlyAnimation = (e) => {
        if (!e) return;
        const card = e.currentTarget.closest('.product-card') || e.currentTarget.closest('.product-modal__content');
        if (!card) return;
        
        const imgEl = card.querySelector('.product-card__banner-img') || card.querySelector('img');
        if (!imgEl) return;
        
        const startRect = imgEl.getBoundingClientRect();
        const cartIcon = document.querySelector('.navbar__icon-btn--cart');
        const endRect = cartIcon 
            ? cartIcon.getBoundingClientRect() 
            : { top: 20, left: window.innerWidth - 60, width: 24, height: 24 };

        const newItem = {
            id: Date.now() + Math.random(),
            src: imgEl.src,
            startRect,
            endRect
        };

        setFlyingItems(prev => [...prev, newItem]);

        // Remove the item after animation completes (matches CSS 0.8s)
        setTimeout(() => {
            setFlyingItems(prev => prev.filter(i => i.id !== newItem.id));
        }, 850);
    };

    const handleAddToCart = (product, e = null, variant = null, variantIdx = null) => {
        if (e) triggerFlyAnimation(e);
        
        const cartKey = variant != null ? `${product.id}_v${variantIdx}` : String(product.id);
        const variantLabel = variant ? [variant.color, variant.size].filter(Boolean).join(' / ') : null;
        try {
            const cart = JSON.parse(localStorage.getItem('cart') ?? '[]');
            const existing = cart.find(x => x.id === cartKey);
            if (existing) { existing.quantity += 1; } else {
                cart.push({
                    id: cartKey,
                    productId: product.id,
                    name: product.name,
                    basePrice: product.basePrice,
                    image: product.images?.[0] ?? null,
                    quantity: 1,
                    ...(variantLabel ? { variantLabel } : {}),
                });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            window.dispatchEvent(new Event('cartUpdated'));
        } catch { /* ignore */ }
        setAddedToCart(prev => new Set([...prev, cartKey]));
        setTimeout(() => setAddedToCart(prev => { const s = new Set(prev); s.delete(cartKey); return s; }), 1500);
    };

    useEffect(() => {
        api.get('/products')
            .then(res => setProducts(res.data))
            .catch(() => setError('No se pudieron cargar los productos.'))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        let result = [...products];

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                (p.description && p.description.toLowerCase().includes(q))
            );
        }

        if (minPrice !== '') result = result.filter(p => p.basePrice >= Number(minPrice));
        if (maxPrice !== '') result = result.filter(p => p.basePrice <= Number(maxPrice));

        if (sortBy === 'price-asc') result.sort((a, b) => a.basePrice - b.basePrice);
        if (sortBy === 'price-desc') result.sort((a, b) => b.basePrice - a.basePrice);
        if (sortBy === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name));

        return result;
    }, [products, search, sortBy, minPrice, maxPrice]);

    const clearFilters = () => {
        setSearch('');
        setSortBy('default');
        setMinPrice('');
        setMaxPrice('');
    };

    const hasActiveFilters = search || sortBy !== 'default' || minPrice || maxPrice;

    return (
        <div className="home-layout">
            <Navbar />

            <main className="home-main">

                {/* Hero */}
                <section className="home-hero">
                    <div className="home-hero__inner">
                        <h1 className="home-hero__title">
                            Descubre nuestros<br />
                            <span className="home-hero__title-gradient">productos</span>
                        </h1>
                        <p className="home-hero__desc">
                            Encuentra todo lo que necesitas con los mejores precios.
                        </p>
                    </div>
                </section>

                {/* Toolbar */}
                <div className="home-toolbar">
                    <div className="home-toolbar__inner">

                        {/* Search */}
                        <div className="home-search">
                            <Search size={17} className="home-search__icon" />
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="home-search__input"
                            />
                            {search && (
                                <button className="home-search__clear" onClick={() => setSearch('')}>
                                    <X size={15} />
                                </button>
                            )}
                        </div>

                        {/* Sort */}
                        <div className="home-select-wrapper">
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="home-select"
                            >
                                <option value="default">Ordenar por</option>
                                <option value="price-asc">Precio: menor a mayor</option>
                                <option value="price-desc">Precio: mayor a menor</option>
                                <option value="name-asc">Nombre: A-Z</option>
                            </select>
                            <ChevronDown size={15} className="home-select-wrapper__icon" />
                        </div>

                        {/* Filter toggle */}
                        <button
                            className={`home-filter-btn ${filtersOpen ? 'home-filter-btn--active' : ''}`}
                            onClick={() => setFiltersOpen(v => !v)}
                        >
                            <SlidersHorizontal size={16} />
                            Filtros
                            {hasActiveFilters && <span className="home-filter-btn__dot" />}
                        </button>

                        {hasActiveFilters && (
                            <button className="home-clear-btn" onClick={clearFilters}>
                                <X size={14} />
                                Limpiar
                            </button>
                        )}
                    </div>

                    {/* Price filter panel */}
                    {filtersOpen && (
                        <div className="home-filter-panel">
                            <div className="home-filter-panel__inner">
                                <span className="home-filter-panel__label">Precio</span>
                                <div className="home-price-range">
                                    <input
                                        type="number"
                                        placeholder="Mín €"
                                        value={minPrice}
                                        onChange={e => setMinPrice(e.target.value)}
                                        className="home-price-input"
                                        min="0"
                                    />
                                    <span className="home-price-range__sep">—</span>
                                    <input
                                        type="number"
                                        placeholder="Máx €"
                                        value={maxPrice}
                                        onChange={e => setMaxPrice(e.target.value)}
                                        className="home-price-input"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results count */}
                <div className="home-content">
                    {!loading && !error && (
                        <p className="home-results-count">
                            {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
                            {hasActiveFilters && ' encontrados'}
                        </p>
                    )}

                    {/* States */}
                    {loading && (
                        <div className="home-state">
                            <div className="home-spinner" />
                            <p>Cargando productos...</p>
                        </div>
                    )}

                    {error && (
                        <div className="home-state home-state--error">
                            <p>{error}</p>
                        </div>
                    )}

                    {!loading && !error && filtered.length === 0 && (
                        <div className="home-state">
                            <Package size={40} color="#d1d5db" />
                            <p>No se encontraron productos.</p>
                            {hasActiveFilters && (
                                <button className="home-clear-btn home-clear-btn--center" onClick={clearFilters}>
                                    Limpiar filtros
                                </button>
                            )}
                        </div>
                    )}

                    {/* Product grid */}
                    {!loading && !error && filtered.length > 0 && (
                        <div className="home-grid">
                            {filtered.map((p, i) => (
                                <div key={p.id} className="product-card">
                                    <div className="product-card__banner">
                                        {p.images?.length > 0
                                            ? <img
                                                src={p.images[0].startsWith('http') ? p.images[0] : `${BACKEND_URL}${p.images[0]}`}
                                                alt={p.name}
                                                className="product-card__banner-img"
                                              />
                                            : <div
                                                className="product-card__banner-placeholder product-card__banner-img"
                                                style={{ background: GRADIENTS[i % GRADIENTS.length] }}
                                              >
                                                <Package size={36} color="rgba(255,255,255,0.7)" />
                                              </div>
                                        }
                                        <button
                                            className={`product-card__wishlist-btn ${waitlist.includes(p.id) ? 'product-card__wishlist-btn--active' : ''}`}
                                            onClick={e => { e.stopPropagation(); toggleWaitlist(p.id); }}
                                            title={waitlist.includes(p.id) ? 'Quitar de la lista de espera' : 'Añadir a la lista de espera'}
                                        >
                                            <Heart size={18} fill={waitlist.includes(p.id) ? 'currentColor' : 'none'} />
                                        </button>
                                    </div>
                                    <div className="product-card__body">
                                        <div className="product-card__header">
                                            <h3 className="product-card__name">{p.name}</h3>
                                            <span className="product-card__price">
                                                {p.basePrice?.toFixed(2)} €
                                            </span>
                                        </div>
                                        {p.description && (
                                            <p className="product-card__desc">{p.description}</p>
                                        )}
                                        <div className="product-card__footer">
                                            {p.variants?.length > 0 && (
                                                <div className="product-card__variants">
                                                    {p.variants.slice(0, 4).map(v => v.color).filter(Boolean)
                                                        .filter((c, idx, arr) => arr.indexOf(c) === idx)
                                                        .map(color => (
                                                            <span
                                                                key={color}
                                                                className="product-card__color-dot"
                                                                title={color}
                                                                style={{ background: color.toLowerCase() }}
                                                            />
                                                        ))}
                                                </div>
                                            )}
                                            <button className="product-card__btn" onClick={() => { setSelectedProduct(p); setSelectedProductIndex(i); }}>Ver producto</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    gradientIndex={selectedProductIndex}
                    onClose={() => setSelectedProduct(null)}
                    onAddToCart={(p, variant, variantIdx, event) => handleAddToCart(p, event, variant, variantIdx)}
                    addedToCart={addedToCart}
                />
            )}

            {/* Render flying cart items globally over the page */}
            {flyingItems.map(item => (
                <img 
                    key={item.id}
                    src={item.src}
                    alt=""
                    className="fly-to-cart-item"
                    // To animate from start to end accurately, we apply inline styles to set initial position,
                    // and use a setTimeout hack inside useEffect/ref to trigger CSS layout and set end position.
                    ref={(el) => {
                        if (el && !el.dataset.animated) {
                            el.dataset.animated = 'true';
                            // Start position
                            el.style.top = `${item.startRect.top}px`;
                            el.style.left = `${item.startRect.left}px`;
                            el.style.width = `${item.startRect.width}px`;
                            el.style.height = `${item.startRect.height}px`;
                            
                            // Force reflow
                            void el.offsetWidth;
                            
                            // Target position (cart icon)
                            el.style.top = `${item.endRect.top}px`;
                            el.style.left = `${item.endRect.left}px`;
                            el.style.width = `20px`;
                            el.style.height = `20px`;
                            el.style.opacity = '0';
                            el.style.transform = 'scale(0.2)';
                        }
                    }}
                />
            ))}
        </div>
    );
}
