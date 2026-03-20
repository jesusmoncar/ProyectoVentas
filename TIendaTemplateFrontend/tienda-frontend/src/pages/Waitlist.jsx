import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Package, ArrowLeft } from 'lucide-react';
import api, { BACKEND_URL } from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Waitlist.css';

const GRADIENTS = [
    'linear-gradient(135deg, #6366f1, #8b5cf6)',
    'linear-gradient(135deg, #3b82f6, #06b6d4)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #10b981, #3b82f6)',
    'linear-gradient(135deg, #ec4899, #f43f5e)',
    'linear-gradient(135deg, #8b5cf6, #ec4899)',
];

function getWaitlist() {
    try { return JSON.parse(localStorage.getItem('waitlist') ?? '[]'); }
    catch { return []; }
}

function addToCartStorage(product) {
    try {
        const cart = JSON.parse(localStorage.getItem('cart') ?? '[]');
        const existing = cart.find(x => x.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                basePrice: product.basePrice,
                image: product.images?.[0] ?? null,
                quantity: 1,
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
    } catch { /* ignore */ }
}

export default function Waitlist() {
    const [waitlistIds, setWaitlistIds] = useState(getWaitlist);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addedIds, setAddedIds] = useState(new Set());

    useEffect(() => {
        api.get('/products')
            .then(res => setProducts(res.data))
            .catch(() => setError('No se pudieron cargar los productos.'))
            .finally(() => setLoading(false));
    }, []);

    const waitlistProducts = products.filter(p => waitlistIds.includes(p.id));

    const removeFromWaitlist = (id) => {
        const next = waitlistIds.filter(x => x !== id);
        setWaitlistIds(next);
        localStorage.setItem('waitlist', JSON.stringify(next));
    };

    const handleAddToCart = (product) => {
        addToCartStorage(product);
        setAddedIds(prev => new Set([...prev, product.id]));
        setTimeout(() => {
            setAddedIds(prev => {
                const s = new Set(prev);
                s.delete(product.id);
                return s;
            });
        }, 1500);
    };

    return (
        <div className="wl-layout">
            <Navbar />
            <main className="wl-main">

                <div className="wl-header">
                    <div className="wl-header__inner">
                        <a href="/" className="wl-back">
                            <ArrowLeft size={16} /> Volver a la tienda
                        </a>
                        <div className="wl-header__title-row">
                            <h1 className="wl-title">
                                <Heart size={28} fill="currentColor" />
                                Lista de espera
                            </h1>
                            {!loading && waitlistProducts.length > 0 && (
                                <span className="wl-count">
                                    {waitlistProducts.length} {waitlistProducts.length === 1 ? 'producto' : 'productos'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="wl-content">
                    {loading && (
                        <div className="wl-state">
                            <div className="wl-spinner" />
                            <p>Cargando productos...</p>
                        </div>
                    )}

                    {error && (
                        <div className="wl-state wl-state--error">
                            <p>{error}</p>
                        </div>
                    )}

                    {!loading && !error && waitlistProducts.length === 0 && (
                        <div className="wl-empty">
                            <div className="wl-empty__icon">
                                <Heart size={40} />
                            </div>
                            <h2>Tu lista de espera está vacía</h2>
                            <p>Pulsa el corazón en cualquier producto para guardarlo aquí.</p>
                            <a href="/" className="wl-empty__btn">Ver productos</a>
                        </div>
                    )}

                    {!loading && !error && waitlistProducts.length > 0 && (
                        <div className="wl-grid">
                            {waitlistProducts.map((p, i) => (
                                <div key={p.id} className="wl-card">
                                    <div className="wl-card__banner">
                                        {p.images?.length > 0
                                            ? <img
                                                src={p.images[0].startsWith('http') ? p.images[0] : `${BACKEND_URL}${p.images[0]}`}
                                                alt={p.name}
                                                className="wl-card__img"
                                              />
                                            : <div
                                                className="wl-card__placeholder"
                                                style={{ background: GRADIENTS[i % GRADIENTS.length] }}
                                              >
                                                <Package size={36} color="rgba(255,255,255,0.7)" />
                                              </div>
                                        }
                                        <button
                                            className="wl-card__remove"
                                            onClick={() => removeFromWaitlist(p.id)}
                                            title="Quitar de la lista de espera"
                                        >
                                            <Heart size={18} fill="currentColor" />
                                        </button>
                                    </div>

                                    <div className="wl-card__body">
                                        <div className="wl-card__header">
                                            <h3 className="wl-card__name">{p.name}</h3>
                                            <span className="wl-card__price">{p.basePrice?.toFixed(2)} €</span>
                                        </div>

                                        {p.description && (
                                            <p className="wl-card__desc">{p.description}</p>
                                        )}

                                        {p.variants?.length > 0 && (
                                            <div className="wl-card__variants">
                                                {p.variants.slice(0, 4).map(v => v.color).filter(Boolean)
                                                    .filter((c, idx, arr) => arr.indexOf(c) === idx)
                                                    .map(color => (
                                                        <span
                                                            key={color}
                                                            className="wl-card__color-dot"
                                                            title={color}
                                                            style={{ background: color.toLowerCase() }}
                                                        />
                                                    ))}
                                            </div>
                                        )}

                                        <button
                                            className={`wl-card__cart-btn ${addedIds.has(p.id) ? 'wl-card__cart-btn--added' : ''}`}
                                            onClick={() => handleAddToCart(p)}
                                        >
                                            <ShoppingCart size={16} />
                                            {addedIds.has(p.id) ? '¡Añadido al carrito!' : 'Añadir al carrito'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
