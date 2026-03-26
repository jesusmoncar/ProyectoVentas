import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiCalendar, FiArrowRight, FiClock } from 'react-icons/fi';
import api from '../api/api';
import type { Order } from '../types';
import toast from 'react-hot-toast';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  useEffect(() => {
    api.get<Order[]>('/orders/my')
      .then(res => setOrders(res.data))
      .catch(() => toast.error('Error al cargar tus pedidos'))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const filteredOrders = orders.filter(order => {
    if (!order.orderDate) return true;
    
    // Normalizar a inicio del día para comparación pura de fechas
    const orderDate = new Date(order.orderDate);
    orderDate.setHours(0, 0, 0, 0);
    const orderTime = orderDate.getTime();

    if (dateStart) {
      const start = new Date(dateStart);
      start.setHours(0, 0, 0, 0);
      if (orderTime < start.getTime()) return false;
    }
    if (dateEnd) {
      const end = new Date(dateEnd);
      end.setHours(0, 0, 0, 0);
      if (orderTime > end.getTime()) return false;
    }
    return true;
  }).sort((a, b) => new Date(b.orderDate || 0).getTime() - new Date(a.orderDate || 0).getTime());

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'PENDING': return { text: 'Pendiente', class: 'status--pending' };
      case 'PROCESSING': return { text: 'Procesando', class: 'status--processing' };
      case 'SHIPPED': return { text: 'Enviado', class: 'status--shipped' };
      case 'DELIVERED': return { text: 'Entregado', class: 'status--delivered' };
      default: return { text: status, class: '' };
    }
  };

  if (loading) return <div className="loading-screen"><div className="loading-spinner" /></div>;

  return (
    <div className="orders-page container section-padding">
      <header className="orders-page__header">
        <h1>Mis Pedidos</h1>
        <p>Gestiona y rastrea tus compras en BLOOM</p>
      </header>

      <div className="orders-page__filters">
        <div className="filter-group">
          <label><FiCalendar size={14} /> Desde</label>
          <input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} />
        </div>
        <div className="filter-group">
          <label><FiCalendar size={14} /> Hasta</label>
          <input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} />
        </div>
        {(dateStart || dateEnd) && (
          <button className="btn btn--link" style={{fontSize:'0.85rem'}} onClick={() => { setDateStart(''); setDateEnd(''); }}>Limpiar filtros</button>
        )}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <FiPackage size={48} color="var(--gray-300)" />
          <h3>No se han encontrado pedidos</h3>
          <p>¿Aún no has estrenado tu armario BLOOM?</p>
          <Link to="/catalogo" className="btn btn--primary" style={{marginTop:'20px'}}>Ir a la tienda</Link>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map(order => {
            const status = getStatusLabel(order.status);
            return (
              <Link to={`/pedidos/${order.numeroPedido}`} key={order.id} className="order-card-link">
                <div className="order-card">
                  <div className="order-card__header">
                    <div className="order-info">
                      <span className="order-number">Pedido #{order.numeroPedido}</span>
                      <div className="order-date"><FiClock size={12} /> {formatDate(order.orderDate)}</div>
                    </div>
                    <span className={`status-badge ${status.class}`}>{status.text}</span>
                  </div>
                  <div className="order-card__content">
                    <div className="order-summary">
                      <span className="label">Total del Pedido</span>
                      <span className="price">€{(order.totalAmount || 0).toFixed(2)}</span>
                    </div>
                    <div className="order-action">
                      Ver detalle <FiArrowRight />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
