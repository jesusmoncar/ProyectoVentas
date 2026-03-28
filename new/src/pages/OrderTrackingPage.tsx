import { useState } from 'react';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin } from 'react-icons/fi';
import api, { formatAddress } from '../api/api';
import type { Order } from '../types';
import toast from 'react-hot-toast';

const statusSteps = [
  { key: 'PENDING', label: 'Pendiente', icon: FiClock },
  { key: 'PROCESSING', label: 'En Proceso', icon: FiPackage },
  { key: 'SHIPPED', label: 'Enviado', icon: FiTruck },
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
    <div className="tracking">
      <div className="tracking__header">
        <div className="tracking__header-content">
          <h1>Seguimiento de Pedido</h1>
          <p>Ingresa tu número de pedido para conocer su estado</p>
        </div>
      </div>

      <div className="tracking__search-wrapper">
        <form className="tracking__search" onSubmit={handleSearch}>
          <div className="tracking__search-input">
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="Número de pedido (ej: ORD-001234)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn--primary btn--lg" disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="tracking__loading">
          <div className="loading-spinner" />
          <p>Buscando tu pedido...</p>
        </div>
      )}

      {!loading && searched && !order && (
        <div className="empty-state">
          <div className="empty-state__icon">📦</div>
          <h3>Pedido no encontrado</h3>
          <p>Verifica que el número de pedido sea correcto e inténtalo de nuevo</p>
        </div>
      )}

      {order && (
        <div className="tracking__result">
          <div className="tracking__order-header">
            <div>
              <h2>Pedido #{order.numeroPedido}</h2>
              <p className="tracking__date">
                Fecha: {new Date(order.orderDate || order.createdAt || '').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <span className={`tracking__status tracking__status--${order.status?.toLowerCase()}`}>
              {statusSteps.find(s => s.key === order.status)?.label || order.status}
            </span>
          </div>

          {/* Progress Timeline */}
          <div className="tracking__timeline">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              return (
                <div key={step.key} className={`tracking__step ${isActive ? 'tracking__step--active' : ''} ${isCurrent ? 'tracking__step--current' : ''}`}>
                  <div className="tracking__step-icon">
                    <Icon size={24} />
                  </div>
                  <span className="tracking__step-label">{step.label}</span>
                  {index < statusSteps.length - 1 && <div className="tracking__step-line" />}
                </div>
              );
            })}
          </div>

          {/* Order Details */}
          <div className="tracking__details">
            <div className="tracking__detail-card">
              <h3><FiMapPin size={18} /> Dirección de Envío</h3>
              <p>{formatAddress(order.shippingAddress)}</p>
            </div>

            <div className="tracking__detail-card">
              <h3><FiPackage size={18} /> Artículos</h3>
              {order.items && order.items.length > 0 ? (
                <ul className="tracking__items">
                  {order.items.map((item, idx) => {
                    const price = item.price || item.unitPrice || 0;
                    const productName = item.product?.name || item.productName || 'Producto desconocido';
                    return (
                      <li key={item.id || idx} className="tracking__item">
                        <div>
                          <strong>{productName}</strong>
                          <span>{item.variantLabel || 'Estándar'} — x{item.quantity}</span>
                        </div>
                        <span>€{(price * item.quantity).toFixed(2)}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>Detalles no disponibles</p>
              )}
              <div className="tracking__total">
                <strong>Total</strong>
                <strong>€{order.totalAmount?.toFixed(2) || '—'}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
