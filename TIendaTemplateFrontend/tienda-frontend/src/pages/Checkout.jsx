import { useState } from 'react';
import { MapPin, Edit2, CheckCircle, ShoppingBag, ArrowLeft, Lock, Loader2 } from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Checkout.css';

const EMPTY_FORM = {
    nombre: '', telefono: '', direccion: '', puerta: '',
    cp: '', ciudad: '', provincia: '', pais: 'España',
};

function readAddress() {
    try { return JSON.parse(localStorage.getItem('shippingAddress') ?? 'null'); }
    catch { return null; }
}

function readCart() {
    try { return JSON.parse(localStorage.getItem('cart') ?? '[]'); }
    catch { return []; }
}

export default function Checkout() {
    const [savedAddress, setSavedAddress] = useState(readAddress);
    const [editing, setEditing] = useState(!readAddress());
    const [form, setForm] = useState(savedAddress ?? EMPTY_FORM);
    const [errors, setErrors] = useState({});

    const items = readCart();
    const subtotal = items.reduce((s, x) => s + x.basePrice * x.quantity, 0);
    const shipping = subtotal > 0 && subtotal < 50 ? 4.99 : 0;
    const total = subtotal + shipping;

    const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

    const validate = () => {
        const e = {};
        if (!form.nombre.trim())    e.nombre    = 'Campo requerido';
        if (!form.telefono.trim())  e.telefono  = 'Campo requerido';
        if (!form.direccion.trim()) e.direccion = 'Campo requerido';
        if (!form.cp.trim())        e.cp        = 'Campo requerido';
        if (!form.ciudad.trim())    e.ciudad    = 'Campo requerido';
        if (!form.provincia.trim()) e.provincia = 'Campo requerido';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        localStorage.setItem('shippingAddress', JSON.stringify(form));
        setSavedAddress({ ...form });
        setEditing(false);
    };

    const addressConfirmed = savedAddress && !editing;

    const [paying, setPaying] = useState(false);
    const [payError, setPayError] = useState('');

    const handlePay = async () => {
        if (!addressConfirmed) return;
        setPaying(true);
        setPayError('');
        try {
            const addressStr = [
                savedAddress.nombre,
                savedAddress.direccion,
                savedAddress.puerta,
                `${savedAddress.cp} ${savedAddress.ciudad}`,
                savedAddress.provincia,
                savedAddress.pais,
                `Tel: ${savedAddress.telefono}`,
            ].filter(Boolean).join(', ');

            const orderItems = items.map(x => ({
                productId: x.productId ?? x.id,
                quantity: x.quantity,
                ...(x.variantLabel ? { variantLabel: x.variantLabel } : {}),
            }));
            const res = await api.post('/orders', { shippingAddress: addressStr, items: orderItems });

            localStorage.removeItem('cart');
            window.dispatchEvent(new Event('cartUpdated'));
            window.location.href = `/order-confirmation/${res.data.numeroPedido}`;
        } catch (err) {
            const status = err.response?.status;
            const msg = err.response?.data?.message ?? err.response?.data?.error ?? err.message;
            setPayError(`Error ${status ? `(${status})` : ''}: ${msg ?? 'No se pudo procesar el pedido.'}`);
            setPaying(false);
        }
    };

    return (
        <div className="co-layout">
            <Navbar />
            <main className="co-main">

                <div className="co-header">
                    <div className="co-header__inner">
                        <a href="/cart" className="co-back">
                            <ArrowLeft size={16} /> Volver al carrito
                        </a>
                        <h1 className="co-title">Finalizar pedido</h1>
                    </div>
                </div>

                <div className="co-content">
                    <div className="co-steps">

                        {/* ── Step 1: Shipping address ── */}
                        <section className="co-section">
                            <div className="co-section__head">
                                <div className={`co-step-badge ${addressConfirmed ? 'co-step-badge--done' : 'co-step-badge--active'}`}>
                                    {addressConfirmed ? <CheckCircle size={16} /> : '1'}
                                </div>
                                <h2 className="co-section__title">Dirección de envío</h2>
                            </div>

                            {addressConfirmed ? (
                                <div className="co-address-card">
                                    <MapPin size={18} className="co-address-card__icon" />
                                    <div className="co-address-card__info">
                                        <strong>{savedAddress.nombre}</strong>
                                        <span>
                                            {savedAddress.direccion}
                                            {savedAddress.puerta ? `, ${savedAddress.puerta}` : ''}
                                        </span>
                                        <span>
                                            {savedAddress.cp} {savedAddress.ciudad}, {savedAddress.provincia}
                                        </span>
                                        <span>{savedAddress.pais} · {savedAddress.telefono}</span>
                                    </div>
                                    <button className="co-address-card__edit" onClick={() => setEditing(true)}>
                                        <Edit2 size={14} /> Cambiar
                                    </button>
                                </div>
                            ) : (
                                <div className="co-form">
                                    <div className="co-form__grid">
                                        <div className="co-field co-field--full">
                                            <label>Nombre completo <span className="co-req">*</span></label>
                                            <input
                                                className={`co-input ${errors.nombre ? 'co-input--error' : ''}`}
                                                value={form.nombre}
                                                onChange={set('nombre')}
                                                placeholder="Ana García López"
                                            />
                                            {errors.nombre && <span className="co-error-msg">{errors.nombre}</span>}
                                        </div>

                                        <div className="co-field">
                                            <label>Teléfono <span className="co-req">*</span></label>
                                            <input
                                                className={`co-input ${errors.telefono ? 'co-input--error' : ''}`}
                                                value={form.telefono}
                                                onChange={set('telefono')}
                                                placeholder="+34 600 000 000"
                                            />
                                            {errors.telefono && <span className="co-error-msg">{errors.telefono}</span>}
                                        </div>

                                        <div className="co-field co-field--full">
                                            <label>Dirección <span className="co-req">*</span></label>
                                            <input
                                                className={`co-input ${errors.direccion ? 'co-input--error' : ''}`}
                                                value={form.direccion}
                                                onChange={set('direccion')}
                                                placeholder="Calle Mayor, 24"
                                            />
                                            {errors.direccion && <span className="co-error-msg">{errors.direccion}</span>}
                                        </div>

                                        <div className="co-field">
                                            <label>
                                                Piso / Puerta
                                                <span className="co-optional"> (opcional)</span>
                                            </label>
                                            <input
                                                className="co-input"
                                                value={form.puerta}
                                                onChange={set('puerta')}
                                                placeholder="2º B"
                                            />
                                        </div>

                                        <div className="co-field">
                                            <label>Código postal <span className="co-req">*</span></label>
                                            <input
                                                className={`co-input ${errors.cp ? 'co-input--error' : ''}`}
                                                value={form.cp}
                                                onChange={set('cp')}
                                                placeholder="28001"
                                            />
                                            {errors.cp && <span className="co-error-msg">{errors.cp}</span>}
                                        </div>

                                        <div className="co-field">
                                            <label>Ciudad <span className="co-req">*</span></label>
                                            <input
                                                className={`co-input ${errors.ciudad ? 'co-input--error' : ''}`}
                                                value={form.ciudad}
                                                onChange={set('ciudad')}
                                                placeholder="Madrid"
                                            />
                                            {errors.ciudad && <span className="co-error-msg">{errors.ciudad}</span>}
                                        </div>

                                        <div className="co-field">
                                            <label>Provincia <span className="co-req">*</span></label>
                                            <input
                                                className={`co-input ${errors.provincia ? 'co-input--error' : ''}`}
                                                value={form.provincia}
                                                onChange={set('provincia')}
                                                placeholder="Madrid"
                                            />
                                            {errors.provincia && <span className="co-error-msg">{errors.provincia}</span>}
                                        </div>

                                        <div className="co-field">
                                            <label>País</label>
                                            <input
                                                className="co-input"
                                                value={form.pais}
                                                onChange={set('pais')}
                                                placeholder="España"
                                            />
                                        </div>
                                    </div>

                                    <div className="co-form__actions">
                                        {savedAddress && (
                                            <button className="co-btn co-btn--ghost" onClick={() => setEditing(false)}>
                                                Cancelar
                                            </button>
                                        )}
                                        <button className="co-btn co-btn--primary" onClick={handleSave}>
                                            Confirmar dirección
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* ── Step 2: Payment ── */}
                        <section className={`co-section ${!addressConfirmed ? 'co-section--locked' : ''}`}>
                            <div className="co-section__head">
                                <div className={`co-step-badge ${addressConfirmed ? 'co-step-badge--active' : ''}`}>
                                    2
                                </div>
                                <h2 className="co-section__title">Pago</h2>
                            </div>

                            <div className="co-payment">
                                <p className="co-payment__desc">
                                    Serás redirigido a nuestra pasarela de pago segura para completar la compra.
                                </p>

                                <div className="co-payment__methods">
                                    <span className="co-method-badge">Visa</span>
                                    <span className="co-method-badge">Mastercard</span>
                                    <span className="co-method-badge">PayPal</span>
                                    <span className="co-method-badge">Apple Pay</span>
                                    <span className="co-method-badge">Google Pay</span>
                                </div>

                                {payError && <p className="co-pay-error">{payError}</p>}

                                <button
                                    className="co-pay-btn"
                                    disabled={!addressConfirmed || paying}
                                    onClick={handlePay}
                                >
                                    {paying
                                        ? <><Loader2 size={17} className="co-spin" /> Procesando pedido...</>
                                        : <><Lock size={17} /> Confirmar y pagar · {total.toFixed(2)} €</>
                                    }
                                </button>

                                <p className="co-payment__ssl">
                                    <Lock size={11} /> Pago cifrado con SSL — tus datos están protegidos
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* ── Order summary sidebar ── */}
                    <aside className="co-summary">
                        <h2 className="co-summary__title">
                            <ShoppingBag size={17} /> Resumen del pedido
                        </h2>

                        <div className="co-summary__items">
                            {items.length === 0 ? (
                                <p className="co-summary__empty">El carrito está vacío.</p>
                            ) : items.map(item => (
                                <div key={item.id} className="co-summary__item">
                                    <span className="co-summary__item-name">
                                        {item.name}
                                        <span className="co-summary__item-qty">×{item.quantity}</span>
                                    </span>
                                    <span className="co-summary__item-price">
                                        {(item.basePrice * item.quantity).toFixed(2)} €
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="co-summary__totals">
                            <div className="co-summary__line">
                                <span>Subtotal</span>
                                <span>{subtotal.toFixed(2)} €</span>
                            </div>
                            <div className="co-summary__line">
                                <span>Envío</span>
                                <span className={shipping === 0 ? 'co-summary__free' : ''}>
                                    {shipping === 0 ? 'Gratis' : `${shipping.toFixed(2)} €`}
                                </span>
                            </div>
                            {shipping > 0 && (
                                <p className="co-summary__shipping-note">Envío gratis a partir de 50 €</p>
                            )}
                            <div className="co-summary__divider" />
                            <div className="co-summary__line co-summary__line--total">
                                <span>Total</span>
                                <span>{total.toFixed(2)} €</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    );
}
