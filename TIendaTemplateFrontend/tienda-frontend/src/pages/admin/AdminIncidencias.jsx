import { useState, useEffect } from 'react';
import { AlertTriangle, Calendar, Package, ChevronDown, ChevronUp, Loader2, CheckCircle, XCircle, RotateCcw, User } from 'lucide-react';
import api from '../../api/axios';
import { formatVariantLabel } from '../../utils/colorUtils';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './AdminIncidencias.css';

const STATUS_LABEL = {
    RETURN_REQUESTED: 'Pendiente de revisión',
    RETURN_APPROVED: 'Aprobada',
    RETURN_REJECTED: 'Rechazada',
};
const STATUS_CLASS = {
    RETURN_REQUESTED: 'ai-badge--pending',
    RETURN_APPROVED: 'ai-badge--approved',
    RETURN_REJECTED: 'ai-badge--rejected',
};

function fmt(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

export default function AdminIncidencias() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expanded, setExpanded] = useState(null);
    const [filter, setFilter] = useState('RETURN_REQUESTED');

    // Approve state
    const [approveTarget, setApproveTarget] = useState(null);
    const [approving, setApproving] = useState(false);

    // Reject modal state
    const [rejectTarget, setRejectTarget] = useState(null);
    const [rejectMotivo, setRejectMotivo] = useState('');
    const [rejecting, setRejecting] = useState(false);

    useEffect(() => {
        api.get('/orders/devoluciones')
            .then(res => setOrders(Array.isArray(res.data) ? res.data : []))
            .catch(err => setError(`Error ${err.response?.status ?? ''}: ${err.response?.data?.message ?? 'No se pudieron cargar las incidencias.'}`))
            .finally(() => setLoading(false));
    }, []);

    const handleApprove = async () => {
        if (!approveTarget) return;
        setApproving(true);
        try {
            const res = await api.patch(`/orders/${approveTarget.id}/devolucion/aprobar`);
            setOrders(prev => prev.map(o => o.id === approveTarget.id ? { ...o, ...res.data, status: 'RETURN_APPROVED' } : o));
            setApproveTarget(null);
        } catch {
            alert('No se pudo aprobar la devolución. Inténtalo de nuevo.');
        } finally {
            setApproving(false);
        }
    };

    const handleReject = async () => {
        if (!rejectTarget) return;
        setRejecting(true);
        try {
            const res = await api.patch(`/orders/${rejectTarget.id}/devolucion/rechazar`, { motivo: rejectMotivo });
            setOrders(prev => prev.map(o => o.id === rejectTarget.id ? { ...o, ...res.data, status: 'RETURN_REJECTED' } : o));
            setRejectTarget(null);
            setRejectMotivo('');
        } catch {
            alert('No se pudo rechazar la devolución. Inténtalo de nuevo.');
        } finally {
            setRejecting(false);
        }
    };

    const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

    const counts = {
        ALL: orders.length,
        RETURN_REQUESTED: orders.filter(o => o.status === 'RETURN_REQUESTED').length,
        RETURN_APPROVED: orders.filter(o => o.status === 'RETURN_APPROVED').length,
        RETURN_REJECTED: orders.filter(o => o.status === 'RETURN_REJECTED').length,
    };

    return (
        <div className="ai-layout">
            <Navbar />
            <main className="ai-main">

                <div className="ai-header">
                    <div className="ai-header__inner">
                        <h1 className="ai-title">
                            <AlertTriangle size={28} />
                            Incidencias / Devoluciones
                        </h1>
                        {!loading && counts.RETURN_REQUESTED > 0 && (
                            <span className="ai-pending-badge">
                                {counts.RETURN_REQUESTED} pendiente{counts.RETURN_REQUESTED !== 1 ? 's' : ''}
                            </span>
                        )}
                        {!loading && counts.RETURN_REQUESTED === 0 && (
                            <span className="ai-ok-badge">Sin pendientes</span>
                        )}
                    </div>
                </div>

                <div className="ai-content">

                    {!loading && !error && (
                        <div className="ai-filters">
                            {[
                                { key: 'RETURN_REQUESTED', label: 'Pendientes' },
                                { key: 'RETURN_APPROVED', label: 'Aprobadas' },
                                { key: 'RETURN_REJECTED', label: 'Rechazadas' },
                                { key: 'ALL', label: 'Todas' },
                            ].map(({ key, label }) => (
                                <button
                                    key={key}
                                    className={`ai-filter-btn ${filter === key ? 'ai-filter-btn--active' : ''} ${key === 'RETURN_REQUESTED' && counts.RETURN_REQUESTED > 0 ? 'ai-filter-btn--alert' : ''}`}
                                    onClick={() => setFilter(key)}
                                >
                                    {label}
                                    <span className="ai-filter-btn__count">{counts[key]}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {loading && (
                        <div className="ai-state">
                            <Loader2 size={32} className="ai-spin" color="#6366f1" />
                            <p>Cargando incidencias...</p>
                        </div>
                    )}

                    {error && <div className="ai-state ai-state--error"><p>{error}</p></div>}

                    {!loading && !error && filtered.length === 0 && (
                        <div className="ai-state">
                            <CheckCircle size={48} color="#6ee7b7" />
                            <p className="ai-state__title">No hay incidencias {filter !== 'ALL' ? `"${STATUS_LABEL[filter] ?? filter}"` : ''}</p>
                            <p className="ai-state__sub">Todo en orden.</p>
                        </div>
                    )}

                    {!loading && !error && filtered.length > 0 && (
                        <div className="ai-list">
                            {filtered.map(order => (
                                <div key={order.id} className={`ai-card ${order.status === 'RETURN_REQUESTED' ? 'ai-card--pending' : ''}`}>

                                    <div className="ai-card__row">
                                        <div className="ai-card__col ai-card__col--num">
                                            <span className="ai-card__label">Nº pedido</span>
                                            <span className="ai-card__mono">#{order.numeroPedido}</span>
                                        </div>
                                        <div className="ai-card__col">
                                            <span className="ai-card__label">Cliente</span>
                                            <span className="ai-card__value">
                                                <User size={13} />
                                                {order.clienteEmail ?? order.userEmail ?? '—'}
                                            </span>
                                        </div>
                                        <div className="ai-card__col">
                                            <span className="ai-card__label">Fecha pedido</span>
                                            <span className="ai-card__value">
                                                <Calendar size={13} /> {fmt(order.orderDate)}
                                            </span>
                                        </div>
                                        <div className="ai-card__col">
                                            <span className="ai-card__label">Total</span>
                                            <span className="ai-card__price">{order.totalAmount?.toFixed(2)} €</span>
                                        </div>
                                        <div className="ai-card__col">
                                            <span className="ai-card__label">Estado</span>
                                            <span className={`ai-badge ${STATUS_CLASS[order.status] ?? 'ai-badge--pending'}`}>
                                                {STATUS_LABEL[order.status] ?? order.status}
                                            </span>
                                        </div>
                                        <div className="ai-card__actions">
                                            <button
                                                className="ai-action-btn ai-action-btn--expand"
                                                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                                            >
                                                {expanded === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                Ver
                                            </button>
                                            {order.status === 'RETURN_REQUESTED' && (
                                                <>
                                                    <button
                                                        className="ai-action-btn ai-action-btn--approve"
                                                        onClick={() => setApproveTarget(order)}
                                                    >
                                                        <CheckCircle size={14} />
                                                        Aprobar
                                                    </button>
                                                    <button
                                                        className="ai-action-btn ai-action-btn--reject"
                                                        onClick={() => { setRejectTarget(order); setRejectMotivo(''); }}
                                                    >
                                                        <XCircle size={14} />
                                                        Rechazar
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {expanded === order.id && (
                                        <div className="ai-detail">
                                            {/* Motivo del cliente */}
                                            <div className="ai-detail__motivo">
                                                <RotateCcw size={15} className="ai-detail__icon" />
                                                <div>
                                                    <span className="ai-detail__label">Motivo de la devolución</span>
                                                    <span className="ai-detail__text">
                                                        {order.motivoDevolucion || <em className="ai-detail__empty">El cliente no indicó motivo.</em>}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Respuesta del admin (si fue rechazada) */}
                                            {order.status === 'RETURN_REJECTED' && order.motivoRechazo && (
                                                <div className="ai-detail__rechazo">
                                                    <XCircle size={15} className="ai-detail__icon ai-detail__icon--reject" />
                                                    <div>
                                                        <span className="ai-detail__label">Motivo de rechazo</span>
                                                        <span className="ai-detail__text">{order.motivoRechazo}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Productos */}
                                            <div className="ai-detail__items">
                                                <span className="ai-detail__label">
                                                    <Package size={14} /> Productos del pedido
                                                </span>
                                                <div className="ai-detail__item-list">
                                                    {order.items?.map(item => (
                                                        <div key={item.id} className="ai-detail__item">
                                                            <div className="ai-detail__item-info">
                                                                <span className="ai-detail__item-name">
                                                                    {item.product?.name ?? `Producto #${item.product?.id}`}
                                                                </span>
                                                                {item.variantLabel && (
                                                                    <span className="ai-detail__item-variant">{formatVariantLabel(item.variantLabel)}</span>
                                                                )}
                                                            </div>
                                                            <span className="ai-detail__item-qty">× {item.quantity}</span>
                                                            <span className="ai-detail__item-price">
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

            {/* Approve confirmation modal */}
            {approveTarget && (
                <div className="ai-overlay" onClick={() => !approving && setApproveTarget(null)}>
                    <div className="ai-modal" onClick={e => e.stopPropagation()}>
                        <div className="ai-modal__icon ai-modal__icon--approve">
                            <CheckCircle size={28} />
                        </div>
                        <h2 className="ai-modal__title">¿Aprobar devolución?</h2>
                        <p className="ai-modal__desc">
                            Vas a aprobar la devolución del pedido <strong>#{approveTarget.numeroPedido}</strong>.
                            El cliente será notificado.
                        </p>
                        <div className="ai-modal__actions">
                            <button
                                className="ai-btn ai-btn--ghost"
                                onClick={() => setApproveTarget(null)}
                                disabled={approving}
                            >
                                Cancelar
                            </button>
                            <button
                                className="ai-btn ai-btn--approve"
                                onClick={handleApprove}
                                disabled={approving}
                            >
                                {approving ? <Loader2 size={15} className="ai-spin" /> : <CheckCircle size={15} />}
                                Sí, aprobar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject modal */}
            {rejectTarget && (
                <div className="ai-overlay" onClick={() => !rejecting && setRejectTarget(null)}>
                    <div className="ai-modal" onClick={e => e.stopPropagation()}>
                        <div className="ai-modal__icon ai-modal__icon--reject">
                            <XCircle size={28} />
                        </div>
                        <h2 className="ai-modal__title">Rechazar devolución</h2>
                        <p className="ai-modal__desc">
                            Pedido <strong>#{rejectTarget.numeroPedido}</strong>. Indica el motivo del rechazo (opcional).
                        </p>
                        <textarea
                            className="ai-textarea"
                            placeholder="Motivo del rechazo..."
                            value={rejectMotivo}
                            onChange={e => setRejectMotivo(e.target.value)}
                            rows={3}
                        />
                        <div className="ai-modal__actions">
                            <button
                                className="ai-btn ai-btn--ghost"
                                onClick={() => setRejectTarget(null)}
                                disabled={rejecting}
                            >
                                Cancelar
                            </button>
                            <button
                                className="ai-btn ai-btn--reject"
                                onClick={handleReject}
                                disabled={rejecting}
                            >
                                {rejecting ? <Loader2 size={15} className="ai-spin" /> : <XCircle size={15} />}
                                Rechazar devolución
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
