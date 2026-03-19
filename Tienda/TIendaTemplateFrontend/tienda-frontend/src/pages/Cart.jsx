import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Package } from 'lucide-react';
import { BACKEND_URL } from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Cart.css';

function readCart() {
    try { return JSON.parse(localStorage.getItem('cart') ?? '[]'); }
    catch { return []; }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
}

const GRADIENTS = [
    'linear-gradient(135deg, #6366f1, #8b5cf6)',
    'linear-gradient(135deg, #3b82f6, #06b6d4)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #10b981, #3b82f6)',
    'linear-gradient(135deg, #ec4899, #f43f5e)',
    'linear-gradient(135deg, #8b5cf6, #ec4899)',
];

export default function Cart() {
    const [items, setItems] = useState(readCart);

    useEffect(() => {
        const sync = () => setItems(readCart());
        window.addEventListener('cartUpdated', sync);
        return () => window.removeEventListener('cartUpdated', sync);
    }, []);

    const updateQty = (id, delta) => {
        const next = items
            .map(x => x.id === id ? { ...x, quantity: x.quantity + delta } : x)
            .filter(x => x.quantity > 0);
        setItems(next);
        saveCart(next);
    };

    const remove = (id) => {
        const next = items.filter(x => x.id !== id);
        setItems(next);
        saveCart(next);
    };

    const clearCart = () => {
        setItems([]);
        saveCart([]);
    };

    const subtotal = items.reduce((s, x) => s + x.basePrice * x.quantity, 0);
    const shipping = subtotal === 0 ? 0 : subtotal >= 50 ? 0 : 4.99;
    const total = subtotal + shipping;

    return (
        <div className="cart-layout">
            <Navbar />
            <main className="cart-main">

                <div className="cart-header">
                    <div className="cart-header__inner">
                        <div className="cart-header__title-row">
                            <h1 className="cart-title">
                                <ShoppingCart size={28} />
                                Carrito
                            </h1>
                            {items.length > 0 && (
                                <span className="cart-count">
                                    {items.reduce((s, x) => s + x.quantity, 0)} {items.reduce((s, x) => s + x.quantity, 0) === 1 ? 'artículo' : 'artículos'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="cart-content">
                    {items.length === 0 ? (
                        <div className="cart-empty">
                            <div className="cart-empty__icon">
                                <ShoppingCart size={40} />
                            </div>
                            <h2>Tu carrito está vacío</h2>
                            <p>Añade productos desde la tienda para empezar.</p>
                            <a href="/" className="cart-empty__btn">Ver productos</a>
                        </div>
                    ) : (
                        <div className="cart-body">

                            {/* Items list */}
                            <div className="cart-items">
                                <div className="cart-items__header">
                                    <span>Producto</span>
                                    <span>Cantidad</span>
                                    <span>Total</span>
                                </div>

                                {items.map((item, i) => (
                                    <div key={item.id} className="cart-item">
                                        <div className="cart-item__info">
                                            <div className="cart-item__img-wrap">
                                                {item.image
                                                    ? <img src={`${BACKEND_URL}${item.image}`} alt={item.name} className="cart-item__img" />
                                                    : <div className="cart-item__img-placeholder" style={{ background: GRADIENTS[i % GRADIENTS.length] }}>
                                                        <Package size={20} color="rgba(255,255,255,0.7)" />
                                                      </div>
                                                }
                                            </div>
                                            <div className="cart-item__meta">
                                                <span className="cart-item__name">{item.name}</span>
                                                {item.variantLabel && (
                                                    <span className="cart-item__variant">{item.variantLabel}</span>
                                                )}
                                                <span className="cart-item__unit-price">{item.basePrice?.toFixed(2)} € / ud.</span>
                                            </div>
                                        </div>

                                        <div className="cart-item__qty">
                                            <button className="cart-item__qty-btn" onClick={() => updateQty(item.id, -1)} aria-label="Reducir">
                                                <Minus size={14} />
                                            </button>
                                            <span className="cart-item__qty-value">{item.quantity}</span>
                                            <button className="cart-item__qty-btn" onClick={() => updateQty(item.id, 1)} aria-label="Aumentar">
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <div className="cart-item__right">
                                            <span className="cart-item__total">
                                                {(item.basePrice * item.quantity).toFixed(2)} €
                                            </span>
                                            <button className="cart-item__remove" onClick={() => remove(item.id)} aria-label="Eliminar">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button className="cart-clear" onClick={clearCart}>
                                    <Trash2 size={14} /> Vaciar carrito
                                </button>
                            </div>

                            {/* Order summary */}
                            <div className="cart-summary">
                                <h2 className="cart-summary__title">Resumen del pedido</h2>

                                <div className="cart-summary__lines">
                                    <div className="cart-summary__line">
                                        <span>Subtotal</span>
                                        <span>{subtotal.toFixed(2)} €</span>
                                    </div>
                                    <div className="cart-summary__line">
                                        <span>Envío</span>
                                        <span className={shipping === 0 ? 'cart-summary__free' : ''}>
                                            {shipping === 0 ? 'Gratis' : `${shipping.toFixed(2)} €`}
                                        </span>
                                    </div>
                                    {shipping > 0 && (
                                        <p className="cart-summary__shipping-hint">
                                            Envío gratis a partir de 50 €
                                        </p>
                                    )}
                                    <div className="cart-summary__divider" />
                                    <div className="cart-summary__line cart-summary__line--total">
                                        <span>Total</span>
                                        <span>{total.toFixed(2)} €</span>
                                    </div>
                                </div>

                                <a href="/checkout" className="cart-summary__checkout">
                                    Tramitar pedido
                                </a>

                                <a href="/" className="cart-summary__continue">
                                    Seguir comprando
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
