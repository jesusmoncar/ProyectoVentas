import { useState } from 'react';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin } from 'react-icons/fi';
import api, { formatAddress } from '../api/api';
import type { Order } from '../types';
import toast from 'react-hot-toast';

const statusSteps = [
  { key: 'PENDING', label: 'Pendiente', icon: FiClock },
  { key: 'PROCESSING', label: 'Preparación', icon: FiPackage },
  { key: 'SHIPPED', label: 'En camino', icon: FiTruck },
  { key: 'DELIVERED', label: 'Entregado', icon: FiCheckCircle },
];

export default function OrderTrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) { toast.error('Ingresa un número de pedido'); return; }
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get<Order>(`/orders/seguimiento/${trackingNumber}`);
      setOrder(res.data);
    } catch {
      setOrder(null);
      toast.error('Pedido no encontrado');
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? statusSteps.findIndex(s => s.key === order.status) : -1;

  return (
    <div className="tracking-luxe fade-in">
      <div className="container">
        <header className="section-header">
          <span className="section-header__tag">Servicio de conserjería</span>
          <h1 className="section-header__title">Géstion de Seguimiento</h1>
          <p className="section-header__desc">Introduzca su identificador de pedido para conocer el estado actual de su adquisición.</p>
        </header>

        <form className="tracking-search-luxe" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Número de pedido (ej: ORD-XXXXXX)"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Buscando...' : 'Localizar'}
          </button>
        </form>

        {loading && (
          <div className="loading-screen" style={{ height: '200px' }}>
            <div className="loading-spinner" />
          </div>
        )}

        {!loading && searched && !order && (
          <div className="catalog-empty">
            <h3>Pedido no localizado</h3>
            <p>Por favor, verifique el identificador introducido e inténtalo de nuevo.</p>
          </div>
        )}

        {order && (
          <div className="tracking-result-luxe fade-in">
            <div className="order-card-luxe">
              <div className="order-card-luxe__header">
                <div className="order-meta">
                  <span className="order-number">ORDEN #{order.numeroPedido}</span>
                  <div className="order-date">
                    Fecha: {new Date(order.orderDate || order.createdAt || '').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                <span className={`status-badge status--${order.status?.toLowerCase()}`}>
                   {statusSteps.find(s => s.key === order.status)?.label || order.status}
                </span>
              </div>

              {/* Progress Timeline */}
              <div className="timeline-luxe">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index <= currentStepIndex;
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  return (
                    <div key={step.key} className={`timeline-step ${isActive ? 'timeline-step--active' : ''} ${isCompleted ? 'timeline-step--completed' : ''} ${isCurrent ? 'timeline-step--current' : ''}`}>
                      <div className="timeline-icon">
                        <Icon size={20} />
                      </div>
                      <span className="timeline-label" style={{ fontSize: '0.8rem', fontWeight: isActive ? 700 : 400, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="order-detail-grid" style={{ marginTop: '48px' }}>
               <div className="detail-section">
                  <h3 className="profile-section-title"><FiMapPin size={18} /> Destino de Entrega</h3>
                  <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>{formatAddress(order.shippingAddress)}</p>
               </div>
               <div className="detail-section">
                  <h3 className="profile-section-title"><FiPackage size={18} /> Resumen de Piezas</h3>
                  <div className="order-total">
                    <span className="label">Total consolidado</span>
                    <span className="price" style={{ fontSize: '1.5rem' }}>€{order.totalAmount?.toFixed(2) || '—'}</span>
                  </div>
                  <Link to={`/pedidos/${order.numeroPedido}`} className="btn btn--primary btn--full" style={{ marginTop: '24px' }}>
                    Ver Detalles Completos
                  </Link>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
