import { useState, useEffect } from 'react';
import { Package, Calendar, MapPin, ChevronDown, ChevronUp, Loader2, ClipboardList } from 'lucide-react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './AdminOrders.css';

const STATUS_LABEL = { PENDING: 'Pendiente', SHIPPING: 'En envío', DELIVERY: 'En reparto', DELIVERED: 'Entregado' };
const STATUS_CLASS = { PENDING: 'ao-badge--pending', SHIPPING: 'ao-badge--shipping', DELIVERY: 'ao-badge--delivery', DELIVERED: 'ao-badge--delivered' };

function decodeJwt(token) {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch { return null; }
}

function isAdmin() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    const payload = decodeJwt(token);
    return payload?.roles?.includes('ROLE_ADMIN') ?? false;
}

function fmt(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expanded, setExpanded] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        if (!isAdmin()) { window.location.href = '/'; return; }
        api.get('/orders')
            .then(res => setOrders(Array.isArray(res.data) ? res.data : []))
            .catch((err) => setError(`Error ${err.response?.status ?? ''}: ${err.response?.data?.message ?? 'No se pudieron cargar los pedidos.'}`))
            .finally(() => setLoading(false));
    }, []);

    const NEXT_STATUS = { PENDING: 'SHIPPING', SHIPPING: 'DELIVERY', DELIVERY: 'DELIVERED' };
    const NEXT_LABEL = { PENDING: 'En envío', SHIPPING: 'En reparto', DELIVERY: 'Entregado' };

    const handleStatusAdvance = async (order) => {
        const next = NEXT_STATUS[order.status];
        if (!next) return;
        setUpdatingStatus(order.id);
        try {
            const res = await api.patch(`/orders/${order.id}/status`, { status: next });
            setOrders(prev => prev.map(o => o.id === order.id ? res.data : o));
        } catch {
            alert('No se pudo actualizar el estado del pedido.');
        } finally {
            setUpdatingStatus(null);
        }
    };

    const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

    const counts = {
        ALL: orders.length,
        PENDING: orders.filter(o => o.status === 'PENDING').length,
        SHIPPING: orders.filter(o => o.status === 'SHIPPING').length,
        DELIVERY: orders.filter(o => o.status === 'DELIVERY').length,
        DELIVERED: orders.filter(o => o.status === 'DELIVERED').length,
    };

    return (
        <div className="ao-layout">
            <Navbar />
            <main className="ao-main">

                <div className="ao-header">
                    <div className="ao-header__inner">
                        <h1 className="ao-title">
                            <ClipboardList size={28} />
                            Gestión de pedidos
                        </h1>
                        {!loading && (
                            <span className="ao-total-count">{orders.length} pedidos en total</span>
                        )}
                    </div>
                </div>

                <div className="ao-content">

                    {/* Filter tabs */}
                    {!loading && !error && (
                        <div className="ao-filters">
                            {['ALL', 'PENDING', 'SHIPPING', 'DELIVERY', 'DELIVERED'].map(f => (
                                <button
                                    key={f}
                                    className={`ao-filter-btn ${filter === f ? 'ao-filter-btn--active' : ''}`}
                                    onClick={() => setFilter(f)}
                                >
                                    {f === 'ALL' ? 'Todos' : STATUS_LABEL[f]}
                                    <span className="ao-filter-btn__count">{counts[f]}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {loading && (
                        <div className="ao-state">
                            <Loader2 size={32} className="ao-spin" color="#6366f1" />
                            <p>Cargando pedidos...</p>
                        </div>
                    )}

                    {error && <div className="ao-state ao-state--error"><p>{error}</p></div>}

                    {!loading && !error && filtered.length === 0 && (
                        <div className="ao-state">
                            <ClipboardList size={40} color="#d1d5db" />
                            <p>No hay pedidos pendientes{filter !== 'ALL' ? ` con estado "${STATUS_LABEL[filter]}"` : ''}.</p>
                        </div>
                    )}

                    {!loading && !error && filtered.length > 0 && (
                        <div className="ao-list">
                            {filtered.map(order => (
                                <div key={order.id} className="ao-card">

                                    {/* Row summary */}
                                    <div className="ao-card__row">
                                        <div className="ao-card__col ao-card__col--num">
                                            <span className="ao-card__label">Nº pedido</span>
                                            <span className="ao-card__mono">#{order.numeroPedido}</span>
                                        </div>
                                        <div className="ao-card__col">
                                            <span className="ao-card__label">Fecha</span>
                                            <span className="ao-card__value">
                                                <Calendar size={13} /> {fmt(order.orderDate)}
                                            </span>
                                        </div>
                                        <div className="ao-card__col">
                                            <span className="ao-card__label">Total</span>
                                            <span className="ao-card__price">{order.totalAmount?.toFixed(2)} €</span>
                                        </div>
                                        <div className="ao-card__col">
                                            <span className="ao-card__label">Estado</span>
                                            <span className={`ao-badge ${STATUS_CLASS[order.status] ?? 'ao-badge--pending'}`}>
                                                {STATUS_LABEL[order.status] ?? order.status}
                                            </span>
                                        </div>
                                        <div className="ao-card__actions">
                                            <button
                                                className="ao-action-btn ao-action-btn--expand"
                                                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                                                title="Ver detalles"
                                            >
                                                {expanded === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                Detalles
                                            </button>
                                            {NEXT_STATUS[order.status] && (
                                                <button
                                                    className="ao-action-btn ao-action-btn--status"
                                                    onClick={() => handleStatusAdvance(order)}
                                                    disabled={updatingStatus === order.id}
                                                    title={NEXT_LABEL[order.status]}
                                                >
                                                    {updatingStatus === order.id
                                                        ? <Loader2 size={15} className="ao-spin" />
                                                        : NEXT_LABEL[order.status]
                                                    }
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expanded detail */}
                                    {expanded === order.id && (
                                        <div className="ao-detail">
                                            <div className="ao-detail__address">
                                                <MapPin size={15} className="ao-detail__icon" />
                                                <div>
                                                    <span className="ao-detail__label">Dirección de envío</span>
                                                    <span className="ao-detail__text">{order.shippingAddress}</span>
                                                </div>
                                            </div>

                                            <div className="ao-detail__items">
                                                <span className="ao-detail__label">
                                                    <Package size={14} /> Productos
                                                </span>
                                                <div className="ao-detail__item-list">
                                                    {order.items?.map(item => (
                                                        <div key={item.id} className="ao-detail__item">
                                                            <span className="ao-detail__item-name">
                                                                {item.product?.name ?? `Producto #${item.product?.id}`}
                                                            </span>
                                                            <span className="ao-detail__item-qty">× {item.quantity}</span>
                                                            <span className="ao-detail__item-price">
                                                                {(item.price * item.quantity).toFixed(2)} €
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
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
