import { useState, useEffect } from 'react';
import { Package, Calendar, MapPin, ChevronDown, ChevronUp, Loader2, ClipboardList, X, AlertTriangle, RotateCcw, Search } from 'lucide-react';
import api from '../api/axios';
import { formatVariantLabel } from '../utils/colorUtils';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './MyOrders.css';

const STATUS_LABEL = {
    PENDING: 'Pendiente',
    SHIPPING: 'En envío',
    DELIVERY: 'En reparto',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
    RETURN_REQUESTED: 'Devolución solicitada',
    RETURN_APPROVED: 'Devolución aprobada',
    RETURN_REJECTED: 'Devolución rechazada',
};
const STATUS_CLASS = {
    PENDING: 'mo-badge--pending',
    SHIPPING: 'mo-badge--shipping',
    DELIVERY: 'mo-badge--delivery',
    DELIVERED: 'mo-badge--delivered',
    CANCELLED: 'mo-badge--cancelled',
    RETURN_REQUESTED: 'mo-badge--return',
    RETURN_APPROVED: 'mo-badge--delivered',
    RETURN_REJECTED: 'mo-badge--cancelled',
};

function fmt(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expanded, setExpanded] = useState(null);
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');

    // Cancel confirmation state
    const [cancelTarget, setCancelTarget] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    // Return modal state
    const [returnTarget, setReturnTarget] = useState(null);
    const [returnMotivo, setReturnMotivo] = useState('');
    const [returning, setReturning] = useState(false);

    useEffect(() => {
        api.get('/orders/my')
            .then(res => setOrders(Array.isArray(res.data) ? res.data : []))
            .catch(err => setError(`Error ${err.response?.status ?? ''}: ${err.response?.data?.message ?? 'No se pudieron cargar los pedidos.'}`))
            .finally(() => setLoading(false));
    }, []);

    const handleCancel = async () => {
        if (!cancelTarget) return;
        setCancelling(true);
        try {
            const res = await api.patch(`/orders/${cancelTarget.id}/status`, { status: 'CANCELLED' });
            setOrders(prev => prev.map(o => o.id === cancelTarget.id ? res.data : o));
            setCancelTarget(null);
        } catch {
            alert('No se pudo cancelar el pedido. Inténtalo de nuevo.');
        } finally {
            setCancelling(false);
        }
    };

    const handleReturn = async () => {
        if (!returnTarget) return;
        setReturning(true);
        try {
            await api.post(`/orders/${returnTarget.id}/devolucion`, { motivo: returnMotivo });
            setOrders(prev => prev.map(o =>
                o.id === returnTarget.id ? { ...o, status: 'RETURN_REQUESTED' } : o
            ));
            setReturnTarget(null);
            setReturnMotivo('');
        } catch {
            alert('No se pudo solicitar la devolución. Inténtalo de nuevo.');
        } finally {
            setReturning(false);
        }
    };

    const canCancel = (status) => status === 'PENDING' || status === 'SHIPPING';
    const canReturn = (status) => status === 'DELIVERED';

    const filtered = orders
        .filter(o => filter === 'ALL' || o.status === filter)
        .filter(o => {
            if (!search.trim()) return true;
            const q = search.toLowerCase();
            return (
                String(o.numeroPedido).includes(q) ||
                o.shippingAddress?.toLowerCase().includes(q) ||
                o.items?.some(i => i.product?.name?.toLowerCase().includes(q))
            );
        });

    const counts = {
        ALL: orders.length,
        PENDING: orders.filter(o => o.status === 'PENDING').length,
        SHIPPING: orders.filter(o => o.status === 'SHIPPING').length,
        DELIVERY: orders.filter(o => o.status === 'DELIVERY').length,
        DELIVERED: orders.filter(o => o.status === 'DELIVERED').length,
        CANCELLED: orders.filter(o => o.status === 'CANCELLED').length,
        RETURN_REQUESTED: orders.filter(o => o.status === 'RETURN_REQUESTED').length,
    };

    const filterTabs = ['ALL', 'PENDING', 'SHIPPING', 'DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED']
        .filter(f => f === 'ALL' || counts[f] > 0);

    return (
        <div className="mo-layout">
            <Navbar />
            <main className="mo-main">

                <div className="mo-header">
                    <div className="mo-header__inner">
                        <h1 className="mo-title">
                            <ClipboardList size={28} />
                            Mis pedidos
                        </h1>
                        {!loading && (
                            <span className="mo-total-count">{orders.length} pedido{orders.length !== 1 ? 's' : ''}</span>
                        )}
                    </div>
                </div>

                <div className="mo-content">

                    {!loading && !error && orders.length > 0 && (
                        <div className="mo-search-wrap">
                            <div className="mo-search-inner">
                                <Search size={15} className="mo-search-icon" />
                                <input
                                    className="mo-search"
                                    type="text"
                                    placeholder="Buscar pedido, dirección o producto..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                {search && (
                                    <button className="mo-search-clear" onClick={() => setSearch('')} aria-label="Limpiar">
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {!loading && !error && orders.length > 0 && (
                        <div className="mo-filters">
                            {filterTabs.map(f => (
                                <button
                                    key={f}
                                    className={`mo-filter-btn ${filter === f ? 'mo-filter-btn--active' : ''}`}
                                    onClick={() => setFilter(f)}
                                >
                                    {f === 'ALL' ? 'Todos' : STATUS_LABEL[f]}
                                    <span className="mo-filter-btn__count">{counts[f]}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {loading && (
                        <div className="mo-state">
                            <Loader2 size={32} className="mo-spin" color="#6366f1" />
                            <p>Cargando pedidos...</p>
                        </div>
                    )}

                    {error && <div className="mo-state mo-state--error"><p>{error}</p></div>}

                    {!loading && !error && orders.length === 0 && (
                        <div className="mo-state">
                            <ClipboardList size={48} color="#d1d5db" />
                            <p className="mo-state__title">Aún no tienes pedidos</p>
                            <p className="mo-state__sub">Cuando realices una compra aparecerá aquí.</p>
                            <a href="/" className="mo-btn mo-btn--primary">Ir a la tienda</a>
                        </div>
                    )}

                    {!loading && !error && filtered.length === 0 && orders.length > 0 && (
                        <div className="mo-state">
                            <ClipboardList size={40} color="#d1d5db" />
                            <p>{search.trim() ? `Sin resultados para "${search}".` : `No hay pedidos con estado "${STATUS_LABEL[filter]}".`}</p>
                        </div>
                    )}

                    {!loading && !error && filtered.length > 0 && (
                        <div className="mo-list">
                            {filtered.map(order => (
                                <div key={order.id} className="mo-card">

                                    <div className="mo-card__row">
                                        <div className="mo-card__col mo-card__col--num">
                                            <span className="mo-card__label">Nº pedido</span>
                                            <span className="mo-card__mono">#{order.numeroPedido}</span>
                                        </div>
                                        <div className="mo-card__col">
                                            <span className="mo-card__label">Fecha</span>
                                            <span className="mo-card__value">
                                                <Calendar size={13} /> {fmt(order.orderDate)}
                                            </span>
                                        </div>
                                        <div className="mo-card__col">
                                            <span className="mo-card__label">Total</span>
                                            <span className="mo-card__price">{order.totalAmount?.toFixed(2)} €</span>
                                        </div>
                                        <div className="mo-card__col">
                                            <span className="mo-card__label">Estado</span>
                                            <span className={`mo-badge ${STATUS_CLASS[order.status] ?? 'mo-badge--pending'}`}>
                                                {STATUS_LABEL[order.status] ?? order.status}
                                            </span>
                                        </div>
                                        <div className="mo-card__actions">
                                            <button
                                                className="mo-action-btn mo-action-btn--expand"
                                                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                                            >
                                                {expanded === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                Detalles
                                            </button>
                                            {canCancel(order.status) && (
                                                <button
                                                    className="mo-action-btn mo-action-btn--cancel"
                                                    onClick={() => setCancelTarget(order)}
                                                >
                                                    <X size={14} />
                                                    Cancelar
                                                </button>
                                            )}
                                            {canReturn(order.status) && (
                                                <button
                                                    className="mo-action-btn mo-action-btn--return"
                                                    onClick={() => { setReturnTarget(order); setReturnMotivo(''); }}
                                                >
                                                    <RotateCcw size={14} />
                                                    Devolución
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {expanded === order.id && (
                                        <div className="mo-detail">
                                            <div className="mo-detail__address">
                                                <MapPin size={15} className="mo-detail__icon" />
                                                <div>
                                                    <span className="mo-detail__label">Dirección de envío</span>
                                                    <span className="mo-detail__text">{order.shippingAddress}</span>
                                                </div>
                                            </div>

                                            <div className="mo-detail__items">
                                                <span className="mo-detail__label">
                                                    <Package size={14} /> Productos
                                                </span>
                                                <div className="mo-detail__item-list">
                                                    {order.items?.map(item => (
                                                        <div key={item.id} className="mo-detail__item">
                                                            <div className="mo-detail__item-info">
                                                                <span className="mo-detail__item-name">
                                                                    {item.product?.name ?? `Producto #${item.product?.id}`}
                                                                </span>
                                                                {item.variantLabel && (
                                                                    <span className="mo-detail__item-variant">{formatVariantLabel(item.variantLabel)}</span>
                                                                )}
                                                            </div>
                                                            <span className="mo-detail__item-qty">× {item.quantity}</span>
                                                            <span className="mo-detail__item-price">
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

            {/* Cancel confirmation modal */}
            {cancelTarget && (
                <div className="mo-overlay" onClick={() => !cancelling && setCancelTarget(null)}>
                    <div className="mo-modal" onClick={e => e.stopPropagation()}>
                        <div className="mo-modal__icon mo-modal__icon--warn">
                            <AlertTriangle size={28} />
                        </div>
                        <h2 className="mo-modal__title">¿Cancelar pedido?</h2>
                        <p className="mo-modal__desc">
                            Vas a cancelar el pedido <strong>#{cancelTarget.numeroPedido}</strong>.
                            Esta acción no se puede deshacer.
                        </p>
                        <div className="mo-modal__actions">
                            <button
                                className="mo-btn mo-btn--ghost"
                                onClick={() => setCancelTarget(null)}
                                disabled={cancelling}
                            >
                                Volver
                            </button>
                            <button
                                className="mo-btn mo-btn--danger"
                                onClick={handleCancel}
                                disabled={cancelling}
                            >
                                {cancelling ? <Loader2 size={15} className="mo-spin" /> : <X size={15} />}
                                Sí, cancelar pedido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Return request modal */}
            {returnTarget && (
                <div className="mo-overlay" onClick={() => !returning && setReturnTarget(null)}>
                    <div className="mo-modal" onClick={e => e.stopPropagation()}>
                        <div className="mo-modal__icon mo-modal__icon--return">
                            <RotateCcw size={28} />
                        </div>
                        <h2 className="mo-modal__title">Solicitar devolución</h2>
                        <p className="mo-modal__desc">
                            Pedido <strong>#{returnTarget.numeroPedido}</strong>. Indica el motivo de la devolución (opcional).
                        </p>
                        <textarea
                            className="mo-textarea"
                            placeholder="Motivo de la devolución..."
                            value={returnMotivo}
                            onChange={e => setReturnMotivo(e.target.value)}
                            rows={3}
                        />
                        <div className="mo-modal__actions">
                            <button
                                className="mo-btn mo-btn--ghost"
                                onClick={() => setReturnTarget(null)}
                                disabled={returning}
                            >
                                Cancelar
                            </button>
                            <button
                                className="mo-btn mo-btn--return"
                                onClick={handleReturn}
                                disabled={returning}
                            >
                                {returning ? <Loader2 size={15} className="mo-spin" /> : <RotateCcw size={15} />}
                                Solicitar devolución
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
