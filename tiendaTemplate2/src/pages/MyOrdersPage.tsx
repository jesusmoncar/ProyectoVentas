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
      .catch(() => toast.error('Error al cargar sus pedidos'))
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
      case 'PROCESSING': return { text: 'En preparación', class: 'status--processing' };
      case 'SHIPPED': return { text: 'En tránsito', class: 'status--shipped' };
      case 'DELIVERED': return { text: 'Entregado', class: 'status--delivered' };
      default: return { text: status, class: '' };
    }
  };

  if (loading) return <div className="loading-screen"><div className="loading-spinner" /></div>;

  return (
    <div className="orders-luxe fade-in">
      <div className="container">
        <header className="section-header">
          <Link to="/catalogo" className="back-link">
            <FiArrowLeft size={16} /> Volver a Mi Atelier
          </Link>
          <span className="section-header__tag">Historial de Adquisiciones</span>
          <h1 className="section-header__title">Mis Pedidos</h1>
          <p className="section-header__desc">Gestione el seguimiento y los detalles de sus pedidos realizados.</p>
        </header>

        <div className="orders-luxe__filters">
          <div className="filter-group">
            <label><FiCalendar size={14} /> Fecha inicial</label>
            <input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} />
          </div>
          <div className="filter-group">
            <label><FiCalendar size={14} /> Fecha final</label>
            <input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} />
          </div>
          {(dateStart || dateEnd) && (
            <button className="btn-clear" onClick={() => { setDateStart(''); setDateEnd(''); }}>Limpiar selección</button>
          )}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="catalog-empty">
            <div className="success-icon" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
              <FiPackage size={32} />
            </div>
            <h3>Sin pedidos registrados</h3>
            <p>Aún no dispone de actividad en su historial de compras.</p>
            <Link to="/catalogo" className="btn btn--primary" style={{marginTop:'32px'}}>Explorar Colección</Link>
          </div>
        ) : (
          <div className="orders-list-luxe">
            {filteredOrders.map(order => {
              const status = getStatusLabel(order.status);
              return (
                <Link to={`/pedidos/${order.numeroPedido}`} key={order.id} className="order-card-luxe">
                  <div className="order-card-luxe__header">
                    <div className="order-meta">
                      <span className="order-number">PEDIDO #{order.numeroPedido}</span>
                      <div className="order-date"><FiClock size={12} /> {formatDate(order.orderDate)}</div>
                    </div>
                    <span className={`status-badge ${status.class}`}>{status.text}</span>
                  </div>
                  <div className="order-card-luxe__footer">
                    <div className="order-total">
                      <span className="label">Total consolidado</span>
                      <span className="price">€{(order.totalAmount || 0).toFixed(2)}</span>
                    </div>
                    <div className="order-link">
                      Detalles <FiArrowRight />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import { FiArrowLeft } from 'react-icons/fi';
