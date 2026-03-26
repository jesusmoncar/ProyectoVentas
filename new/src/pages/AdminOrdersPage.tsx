import { useState, useEffect } from 'react';
import { FiSearch, FiTrash2, FiPackage, FiArrowLeft, FiClock, FiTruck, FiCheckCircle, FiLoader, FiEye, FiX, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../api/api';
import type { Order } from '../types';
import toast from 'react-hot-toast';

const statusOptions = [
  { value: 'PENDING', label: 'Pendiente', icon: FiClock, color: '#FFF9C4', textColor: '#8B7355' },
  { value: 'PAID', label: 'Pagado', icon: FiCheckCircle, color: '#FCE4EC', textColor: '#C2185B' },
  { value: 'RESERVED', label: 'Reservado', icon: FiCheckCircle, color: '#FFE0B2', textColor: '#E65100' },
  { value: 'PROCESSING', label: 'En Proceso', icon: FiLoader, color: '#E1F5FE', textColor: '#4A6FA5' },
  { value: 'SHIPPED', label: 'Enviado', icon: FiTruck, color: '#F3E5F5', textColor: '#7B5EA7' },
  { value: 'DELIVERED', label: 'Entregado', icon: FiCheckCircle, color: '#E8F5E9', textColor: '#3D8B63' },
  { value: 'RETURN_REQUESTED', label: 'Devol. Solicitada', icon: FiAlertCircle, color: '#FFEBEE', textColor: '#D32F2F' },
  { value: 'RETURNED', label: 'Devuelto', icon: FiCheckCircle, color: '#EEEEEE', textColor: '#616161' },
  { value: 'RETURN_REJECTED', label: 'Devol. Rechazada', icon: FiX, color: '#FFCDD2', textColor: '#C62828' }
];

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'returns'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; num: string } | null>(null);

  const [rejectModal, setRejectModal] = useState<{ id: number; num: string } | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    const endpoint = activeTab === 'returns' ? '/orders/devoluciones' : '/orders';
    api.get<Order[]>(endpoint)
      .then(res => setOrders(res.data))
      .catch(() => toast.error('Error al cargar datos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [activeTab]);

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return '—';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '—';
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return '—';
    }
  };

  const filtered = orders
    .filter(o => {
      const matchSearch = o.numeroPedido?.toLowerCase().includes(search.toLowerCase()) ||
                          o.shippingAddress?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !filterStatus || o.status === filterStatus;
      
      const orderDate = new Date(o.orderDate || o.createdAt || 0);
      orderDate.setHours(0, 0, 0, 0);
      const orderTime = orderDate.getTime();

      let matchDate = true;
      if (dateStart) {
        const start = new Date(dateStart);
        start.setHours(0, 0, 0, 0);
        if (orderTime < start.getTime()) matchDate = false;
      }
      if (dateEnd) {
        const end = new Date(dateEnd);
        end.setHours(0, 0, 0, 0);
        if (orderTime > end.getTime()) matchDate = false;
      }
      
      return matchSearch && matchStatus && matchDate;
    })
    .sort((a, b) => new Date(b.orderDate || b.createdAt || 0).getTime() - new Date(a.orderDate || a.createdAt || 0).getTime());

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      if (activeTab === 'returns' && newStatus === 'RETURNED') {
         await api.patch(`/orders/${orderId}/devolucion/aprobar`);
      } else {
         await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      }
      toast.success('Estado actualizado');
      fetchOrders();
    } catch {
      toast.error('Error al actualizar estado');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/orders/${deleteConfirm.id}`);
      toast.success('Pedido eliminado');
      setOrders(prev => prev.filter(o => o.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const handleRejectReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModal || !motivoRechazo.trim()) return toast.error('Por favor ingresa un motivo');
    try {
      await api.patch(`/orders/${rejectModal.id}/devolucion/rechazar`, { motivo: motivoRechazo });
      toast.success('Devolución rechazada correctamente');
      setRejectModal(null);
      setMotivoRechazo('');
      fetchOrders();
    } catch {
      toast.error('Error al rechazar devolución');
    }
  };

  const getStatusLabel = (status: string, deliveryMode?: string, address?: string) => {
    const isPickup = deliveryMode === 'PICKUP' || address?.includes('Tienda BLOOM');
    if (isPickup) {
      if (status === 'RESERVED') return 'Reserva Recibida';
      if (status === 'PROCESSING') return 'Preparando en Tienda';
      if (status === 'DELIVERED') return 'Recogido';
    }
    const s = statusOptions.find(o => o.value === status);
    return s ? s.label : status;
  };

  const getStatusBadge = (status: string, deliveryMode?: string, address?: string) => {
    const s = statusOptions.find(o => o.value === status);
    if (!s) return <span className="admin__status-badge">{status}</span>;
    return (
      <span className="admin__status-badge" style={{ background: s.color, color: s.textColor }}>
        {getStatusLabel(status, deliveryMode, address)}
      </span>
    );
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    processing: orders.filter(o => o.status === 'PROCESSING').length,
    shipped: orders.filter(o => o.status === 'SHIPPED').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
  };

  return (
    <div className="admin">
      <div className="admin__header">
        <div className="admin__header-left">
          <Link to="/" className="admin__back"><FiArrowLeft size={18} /> Volver a la tienda</Link>
          <h1><FiPackage size={28} /> Gestión de Pedidos</h1>
        </div>
        <Link to="/admin/productos" className="btn btn--outline">Ir a Productos</Link>
      </div>

      <div className="admin__tabs-bar" style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button 
          className={`btn ${activeTab === 'orders' ? 'btn--primary' : 'btn--ghost'}`} 
          onClick={() => setActiveTab('orders')}
        >
          <FiPackage /> Todos los Pedidos
        </button>
        <button 
          className={`btn ${activeTab === 'returns' ? 'btn--primary' : 'btn--ghost'}`} 
          onClick={() => setActiveTab('returns')}
        >
          <FiAlertCircle /> Gestión de Incidencias
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="admin__stats">
          <div className="admin__stat-card" style={{ borderLeftColor: 'var(--pastel-pink)' }}>
            <span className="admin__stat-number">{stats.total}</span>
            <span className="admin__stat-label">Total Pedidos</span>
          </div>
          <div className="admin__stat-card" style={{ borderLeftColor: '#F0D080' }}>
            <span className="admin__stat-number">{stats.pending}</span>
            <span className="admin__stat-label">Esperando Pago</span>
          </div>
          <div className="admin__stat-card" style={{ borderLeftColor: '#80CAFF' }}>
            <span className="admin__stat-number">{stats.processing}</span>
            <span className="admin__stat-label">En Preparación</span>
          </div>
          <div className="admin__stat-card" style={{ borderLeftColor: '#B39DDB' }}>
            <span className="admin__stat-number">{stats.shipped}</span>
            <span className="admin__stat-label">En Camino</span>
          </div>
          <div className="admin__stat-card" style={{ borderLeftColor: '#90D8B8' }}>
            <span className="admin__stat-number">{stats.delivered}</span>
            <span className="admin__stat-label">Completados</span>
          </div>
        </div>
      )}

      {/* Modern Toolbar */}
      <div className="admin__toolbar">
        <div className="catalog__search">
          <FiSearch size={18} />
          <input placeholder="Buscar por nº pedido o dirección..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="admin__toolbar-filters">
            <select className="admin__filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">Todos los estados</option>
              {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <div className="admin__filter-date-group">
              <input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} className="admin__filter-input" title="Desde" />
              <input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} className="admin__filter-input" title="Hasta" />
              {(dateStart || dateEnd) && (
                <button className="admin__action-btn" title="Limpiar fechas" onClick={() => { setDateStart(''); setDateEnd(''); }}>
                  <FiX />
                </button>
              )}
            </div>
          <span className="admin__count">{filtered.length} resultados</span>
        </div>
      </div>

      {/* Improved Table */}
      {loading ? (
        <div className="loading-screen"><div className="loading-spinner" /><p>Cargando datos...</p></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📋</div>
          <h3>Sin resultados</h3>
          <p>{filterStatus ? 'No hay pedidos con este filtro' : activeTab === 'returns' ? 'No hay incidencias actuales' : 'Aún no tienes pedidos registrados'}</p>
        </div>
      ) : (
        <div className="admin__table-wrapper">
          <table className="admin__table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Fecha y Hora</th>
                <th>Cliente / Envío</th>
                <th>Monto</th>
                <th>Estado Actual</th>
                <th>{activeTab === 'returns' ? 'Resolución' : 'Acciones'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id}>
                  <td>
                    <div className="admin__order-info">
                      <strong className="admin__order-number">#{order.numeroPedido}</strong>
                      <span className="admin__items-qty">{order.items?.length || 0} artículos</span>
                    </div>
                  </td>
                  <td>{formatDate(order.orderDate || order.createdAt || '')}</td>
                  <td>
                    <div className="admin__customer-info">
                      <span className="admin__address" title={order.shippingAddress}>{order.shippingAddress}</span>
                      {activeTab === 'returns' && order.motivoDevolucion && (
                        <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#D32F2F', background: '#FFEBEE', padding: '6px 10px', borderRadius: '4px' }}>
                          <strong>Motivo:</strong> {order.motivoDevolucion}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="admin__price-tag">€{order.totalAmount?.toFixed(2) || '0.00'}</span>
                  </td>
                  <td>
                    {activeTab === 'returns' && order.status === 'RETURN_REQUESTED' ? (
                       <div className="admin__status-control">
                          {getStatusBadge(order.status, order.deliveryMode, order.shippingAddress)}
                       </div>
                    ) : (
                      <div className="admin__status-control">
                        {getStatusBadge(order.status, order.deliveryMode, order.shippingAddress)}
                        <select
                          className="admin__select--inline"
                          value={order.status}
                          disabled={order.status === 'RETURNED'}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                        >
                          {statusOptions
                            .filter(opt => {
                              const isPickup = order.deliveryMode === 'PICKUP' || order.shippingAddress?.includes('Tienda BLOOM');
                              if (isPickup && opt.value === 'SHIPPED') return false;
                              if (!isPickup && opt.value === 'RESERVED') return false;
                              return true;
                            })
                            .map(s => (
                              <option key={s.value} value={s.value}>Cambiar a {getStatusLabel(s.value, order.deliveryMode, order.shippingAddress)}</option>
                            ))}
                        </select>
                      </div>
                    )}
                  </td>
                  <td>
                    {activeTab === 'returns' && order.status === 'RETURN_REQUESTED' ? (
                       <div style={{ display: 'flex', gap: '8px' }}>
                         <button className="btn btn--primary btn--sm" onClick={() => handleStatusChange(order.id, 'RETURNED')}>Aprobar</button>
                         <button className="btn btn--outline btn--sm" style={{ borderColor: '#FF5252', color: '#FF5252' }} onClick={() => setRejectModal({ id: order.id, num: order.numeroPedido || '' })}>Rechazar</button>
                       </div>
                    ) : (
                      <div className="admin__actions">
                        <button className="admin__action-btn" title="Ver Detalles" onClick={() => setSelectedOrder(order)}>
                          <FiEye size={18} />
                        </button>
                        <button className="admin__action-btn admin__action-btn--danger" title="Eliminar" onClick={() => setDeleteConfirm({ id: order.id, num: order.numeroPedido || '' })}>
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {selectedOrder && (
        <div className="admin__modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin__modal admin__modal--large" onClick={e => e.stopPropagation()}>
            <div className="admin__modal-header">
              <h2>Detalles del Pedido #{selectedOrder.numeroPedido}</h2>
              <button className="admin__modal-close" onClick={() => setSelectedOrder(null)}><FiX size={24} /></button>
            </div>
            
            <div className="admin__order-details">
              <div className="admin__order-meta">
                <div className="admin__meta-group">
                  <label>Fecha del pedido</label>
                  <span>{formatDate(selectedOrder.orderDate || selectedOrder.createdAt || '')}</span>
                </div>
                <div className="admin__meta-group">
                  <label>Estado del pedido</label>
                  {getStatusBadge(selectedOrder.status, selectedOrder.deliveryMode, selectedOrder.shippingAddress)}
                </div>
                <div className="admin__meta-group">
                  <label>Dirección de entrega</label>
                  <p>{selectedOrder.shippingAddress}</p>
                </div>
                {selectedOrder.deliveryMode === 'SHIPPING' && (
                   <div className="admin__meta-group">
                    <label>Seguimiento / Etiqueta</label>
                    <p style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <strong>ID:</strong> {selectedOrder.trackingNumber || 'ID seguimiento prueba'}
                      {selectedOrder.labelUrl ? (
                         <a 
                           href={`${import.meta.env.VITE_API_URL}/sandbox/sendcloud/labels/${selectedOrder.id}`} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="btn btn--outline btn--sm"
                         >
                           Descargar Etiqueta Real
                         </a>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>etiqueta de envio prueba</span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div className="admin__items-table-wrapper">
                <h3>Artículos en el pedido</h3>
                <table className="admin__items-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Variante</th>
                      <th>Cantidad</th>
                      <th>P. Unitario</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map((item, idx) => {
                      const qty = item.quantity || 0;
                      const price = item.price || item.unitPrice || 0;
                      const productName = item.product?.name || item.productName || 'Producto desconocido';
                      const variant = item.variantLabel || 'Estándar';
                      
                      return (
                        <tr key={idx}>
                          <td><strong>{productName}</strong></td>
                          <td><span className="admin__variant-label">{variant}</span></td>
                          <td>{qty}</td>
                          <td>€{Number(price).toFixed(2)}</td>
                          <td><strong>€{(qty * price).toFixed(2)}</strong></td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4} align="right"><strong>Total del Pedido:</strong></td>
                      <td><strong className="admin__final-total">€{(selectedOrder.totalAmount || 0).toFixed(2)}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="admin__modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin__modal admin__modal--danger" onClick={e => e.stopPropagation()}>
            <div className="admin__modal-danger-icon"><FiTrash2 /></div>
            <h2>¿Eliminar Pedido?</h2>
            <div className="admin__delete-confirm-text">
              ¿Estás seguro de que deseas eliminar este pedido permanentemente? Esta acción no se puede deshacer.
              <strong>Pedido #{deleteConfirm.num}</strong>
            </div>
            <div className="admin__form-actions">
              <button className="admin__btn-cancel" onClick={() => setDeleteConfirm(null)}>Cancelar</button>
              <button className="admin__btn-submit" style={{ background: '#FF5252' }} onClick={handleDelete}>
                Eliminar Permanentemente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Return Modal */}
      {rejectModal && (
        <div className="admin__modal-overlay" onClick={() => setRejectModal(null)}>
          <div className="admin__modal" onClick={e => e.stopPropagation()}>
            <div className="admin__modal-header">
               <h2>Rechazar Devolución</h2>
               <button className="admin__modal-close" onClick={() => setRejectModal(null)}><FiX size={24} /></button>
            </div>
            <form onSubmit={handleRejectReturn}>
              <div className="auth-form__field">
                <label>Escribe el motivo del rechazo (se mostrará al cliente)</label>
                <div className="auth-form__input-wrapper">
                  <textarea
                    autoFocus
                    required
                    style={{ width: '100%', padding: '12px', minHeight: '100px', borderRadius: '8px', border: '1px solid #FFCDD2', resize: 'vertical' }}
                    placeholder="Ej. El artículo presenta signos de desgaste..."
                    value={motivoRechazo}
                    onChange={e => setMotivoRechazo(e.target.value)}
                  />
                </div>
              </div>
              <div className="admin__form-actions" style={{ marginTop: '20px' }}>
                <button type="button" className="admin__btn-cancel" onClick={() => setRejectModal(null)}>Cancelar</button>
                <button type="submit" className="admin__btn-submit" style={{ background: '#FF5252' }}>
                  Confirmar Rechazo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
