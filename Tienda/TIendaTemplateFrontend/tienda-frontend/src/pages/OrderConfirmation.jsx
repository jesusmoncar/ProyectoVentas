import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Package, MapPin, Calendar, Hash, ShoppingBag, Loader2 } from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './OrderConfirmation.css';

const STATUS_LABEL = { PENDING: 'Pendiente', PAID: 'Pagado', SHIPPED: 'Enviado' };
const STATUS_CLASS = { PENDING: 'oc-badge--pending', PAID: 'oc-badge--paid', SHIPPED: 'oc-badge--shipped' };

function fmt(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('es-ES', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

export default function OrderConfirmation() {
    const { numeroPedido } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/orders/seguimiento/${numeroPedido}`)
            .then(res => setOrder(res.data))
            .catch(() => setError('No se encontró el pedido.'))
            .finally(() => setLoading(false));
    }, [numeroPedido]);

    return (
        <div className="oc-layout">
            <Navbar />
            <main className="oc-main">

                {loading && (
                    <div className="oc-state">
                        <Loader2 size={32} className="oc-spin" color="#6366f1" />
                        <p>Cargando pedido...</p>
                    </div>
                )}

                {error && (
                    <div className="oc-state oc-state--error">
                        <p>{error}</p>
                        <a href="/" className="oc-btn oc-btn--primary">Volver a la tienda</a>
                    </div>
                )}

                {!loading && order && (
                    <>
                        {/* Hero */}
                        <div className="oc-hero">
                            <div className="oc-hero__inner">
                                <div className="oc-hero__icon">
                                    <CheckCircle size={40} />
                                </div>
                                <h1 className="oc-hero__title">¡Pedido confirmado!</h1>
                                <p className="oc-hero__desc">
                                    Gracias por tu compra. Hemos recibido tu pedido y lo estamos procesando.
                                </p>
                                <div className="oc-hero__number">
                                    <Hash size={15} />
                                    <span>Nº de pedido:</span>
                                    <strong>{order.numeroPedido}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="oc-content">

                            {/* Order meta */}
                            <div className="oc-card">
                                <h2 className="oc-card__title">Detalles del pedido</h2>
                                <div className="oc-meta">
                                    <div className="oc-meta__item">
                                        <Calendar size={16} className="oc-meta__icon" />
                                        <div>
                                            <span className="oc-meta__label">Fecha</span>
                                            <span className="oc-meta__value">{fmt(order.orderDate)}</span>
                                        </div>
                                    </div>
                                    <div className="oc-meta__item">
                                        <Hash size={16} className="oc-meta__icon" />
                                        <div>
                                            <span className="oc-meta__label">Nº de seguimiento</span>
                                            <span className="oc-meta__value oc-meta__value--mono">{order.numeroPedido}</span>
                                        </div>
                                    </div>
                                    <div className="oc-meta__item">
                                        <ShoppingBag size={16} className="oc-meta__icon" />
                                        <div>
                                            <span className="oc-meta__label">Estado</span>
                                            <span className={`oc-badge ${STATUS_CLASS[order.status] ?? ''}`}>
                                                {STATUS_LABEL[order.status] ?? order.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="oc-meta__item">
                                        <MapPin size={16} className="oc-meta__icon" />
                                        <div>
                                            <span className="oc-meta__label">Dirección de envío</span>
                                            <span className="oc-meta__value">{order.shippingAddress}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="oc-card">
                                <h2 className="oc-card__title">Productos</h2>
                                <div className="oc-items">
                                    {order.items?.map(item => (
                                        <div key={item.id} className="oc-item">
                                            <div className="oc-item__icon">
                                                <Package size={18} color="#6366f1" />
                                            </div>
                                            <div className="oc-item__info">
                                                <span className="oc-item__name">{item.product?.name ?? '—'}</span>
                                                <span className="oc-item__qty">× {item.quantity}</span>
                                            </div>
                                            <span className="oc-item__price">
                                                {(item.price * item.quantity).toFixed(2)} €
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="oc-total">
                                    <span>Total</span>
                                    <strong>{order.totalAmount?.toFixed(2)} €</strong>
                                </div>
                            </div>

                            <div className="oc-actions">
                                <a href="/" className="oc-btn oc-btn--primary">Seguir comprando</a>
                            </div>
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
}
