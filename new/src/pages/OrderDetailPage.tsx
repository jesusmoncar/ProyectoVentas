import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiMapPin, FiTruck, FiCheckCircle, FiClock, FiAlertCircle, FiX } from 'react-icons/fi';
import api, { getImageUrl } from '../api/api';
import type { Order } from '../types';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const { numeroPedido } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Devoluciones
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [loadingReturn, setLoadingReturn] = useState(false);

  useEffect(() => {
    api.get<Order>(`/orders/seguimiento/${numeroPedido}`)
      .then(res => setOrder(res.data))
      .catch(() => toast.error('No se pudo encontrar el pedido'))
      .finally(() => setLoading(false));
  }, [numeroPedido]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const handleRequestReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivo.trim()) { toast.error('Por favor ingresa un motivo'); return; }
    
    setLoadingReturn(true);
    try {
      // Usamos el ID interno del pedido ya que la API espera /orders/{id}/devolucion
      const res = await api.post(`/orders/${order?.id}/devolucion`, { motivo });
      setOrder(res.data);
      toast.success('Solicitud de devolución enviada exitosamente');
      setIsReturnModalOpen(false);
      setMotivo('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al solicitar devolución');
    } finally {
      setLoadingReturn(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="loading-spinner" /></div>;
  if (!order) return (
    <div className="container section-padding text-center">
      <h2>Pedido no encontrado</h2>
      <Link to="/mis-pedidos" className="btn btn--primary" style={{marginTop:'20px'}}>Volver a mis pedidos</Link>
    </div>
  );

  return (
    <div className="order-detail-page container section-padding">
      <Link to="/mis-pedidos" className="back-link"><FiArrowLeft /> Volver a mis pedidos</Link>
      
      <div className="order-detail-header">
        <div className="header-left">
          <h1>Detalle del Pedido</h1>
          <span className="order-num">#{order.numeroPedido}</span>
        </div>
        <div className="order-meta">
          <div className="meta-item">
            <FiClock />
            <span>{formatDate(order.orderDate)}</span>
          </div>
        </div>
      </div>

      <div className="order-detail-grid">
        <div className="detail-main">
          
          {/* Alertas de Incidencia/Devolución */}
          {order.motivoDevolucion && (
            <div className="detail-section" style={{ backgroundColor: 'var(--pastel-pink-light)', borderColor: 'var(--pastel-pink-dark)' }}>
              <h3 style={{ color: 'var(--pastel-pink-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiAlertCircle /> Incidencia Abierta
              </h3>
              <p><strong>Motivo de la devolución:</strong> {order.motivoDevolucion}</p>
              {order.motivoRechazo && (
                <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(255,255,255,0.6)', borderRadius: '8px', borderLeft: '4px solid #FF5252' }}>
                  <p style={{ margin: 0, color: '#FF5252' }}><strong>Solicitud Rechazada:</strong> {order.motivoRechazo}</p>
                </div>
              )}
            </div>
          )}

          <section className="detail-section">
            <h3>Artículos del Pedido</h3>
            <div className="order-items-list">
              {order.items.map((item, idx) => (
                <div key={item.id || idx} className="order-item-row">
                  <div className="item-image">
                    <img src={getImageUrl(item.product?.images?.[0], item.product?.id)} alt={item.product?.name} />
                  </div>
                  <div className="item-info">
                    <h4>{item.product?.name || 'Producto'}</h4>
                    <p className="variant">{item.variantLabel || 'N/A'}</p>
                    <div className="item-price-qty">
                      <span>{item.quantity} x €{(item.price || 0).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="item-total">
                    €{(item.quantity * (item.price || 0)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total-block">
              <div className="total-row">
                <span>Subtotal</span>
                <span>€{(order.totalAmount || 0).toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Envío</span>
                <span className="free">Gratis</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>€{(order.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>
          </section>
        </div>

        <div className="detail-sidebar">
          <section className="detail-section sidebar-box">
            <h3>Estado del Pedido</h3>
            <div className="status-timeline">
              {order.deliveryMode === 'PICKUP' || order.shippingAddress?.includes('Tienda BLOOM') ? (
                // Timeline para RECOGIDA EN TIENDA
                <>
                  <div className={`timeline-step ${['RESERVED', 'PROCESSING', 'DELIVERED'].includes(order.status) ? 'active' : ''}`}>
                    <FiClock /> <span>Reserva Recibida</span>
                  </div>
                  <div className={`timeline-step ${['PROCESSING', 'DELIVERED'].includes(order.status) ? 'active' : ''}`}>
                    <FiPackage /> <span>Preparando en Tienda</span>
                  </div>
                  <div className={`timeline-step ${order.status === 'DELIVERED' ? 'completed' : ''}`}>
                    <FiCheckCircle /> <span>Recogido</span>
                  </div>
                </>
              ) : (
                // Timeline para ENVÍO NORMAL
                <>
                  <div className={`timeline-step ${['PENDING','PAID','PROCESSING','SHIPPED','DELIVERED','RETURN_REQUESTED','RETURNED','RETURN_REJECTED'].includes(order.status) ? 'active' : ''}`}>
                    <FiClock /> <span>{order.status === 'PAID' ? 'Pago Recibido' : 'Pedido Registrado'}</span>
                  </div>
                  <div className={`timeline-step ${['PROCESSING','SHIPPED','DELIVERED','RETURN_REQUESTED','RETURNED','RETURN_REJECTED'].includes(order.status) ? 'active' : ''}`}>
                    <FiPackage /> <span>Procesando</span>
                  </div>
                  <div className={`timeline-step ${['SHIPPED','DELIVERED','RETURN_REQUESTED','RETURNED','RETURN_REJECTED'].includes(order.status) ? 'active' : ''}`}>
                    <FiTruck /> <span>En camino</span>
                  </div>
                  <div className={`timeline-step ${['DELIVERED','RETURN_REQUESTED','RETURNED','RETURN_REJECTED'].includes(order.status) ? 'completed' : ''}`}>
                    <FiCheckCircle /> <span>Entregado</span>
                  </div>
                  {['RETURN_REQUESTED','RETURNED','RETURN_REJECTED'].includes(order.status) && (
                     <div className={`timeline-step ${order.status === 'RETURNED' ? 'completed' : 'active'}`}>
                       <FiAlertCircle /> <span>{order.status === 'RETURNED' ? 'Devuelto' : order.status === 'RETURN_REJECTED' ? 'Devolución Rechazada' : 'Devolución Solicitada'}</span>
                     </div>
                  )}
                </>
              )}
            </div>
          </section>

          {order.status === 'DELIVERED' && !order.motivoDevolucion && (
            <section className="detail-section sidebar-box" style={{ backgroundColor: 'var(--pastel-pink-light)', textAlign: 'center' }}>
              <h3 style={{ marginTop: 0 }}>¿Problemas con tu pedido?</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>Puedes solicitar una devolución si no estás satisfecho con tu compra.</p>
              <button 
                className="btn btn--outline" 
                style={{ width: '100%', borderColor: 'var(--pastel-pink-dark)', color: 'var(--pastel-pink-dark)' }}
                onClick={() => setIsReturnModalOpen(true)}
              >
                Solicitar Devolución
              </button>
            </section>
          )}

          <section className="detail-section sidebar-box">
             <h3>Seguimiento del Envío</h3>
             <div className="address-box">
               <FiTruck />
               <p>{order.trackingNumber || 'ID seguimiento prueba'}</p>
             </div>
             {order.deliveryMode === 'SHIPPING' && (
               <div style={{ marginTop: '12px' }}>
                 {order.labelUrl ? (
                   <a 
                     href={`${import.meta.env.VITE_API_URL}/sandbox/sendcloud/labels/${order.id}`} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="btn btn--outline btn--sm" 
                     style={{ width: '100%' }}
                   >
                     Ver Etiqueta de Envío
                   </a>
                 ) : (
                   <p style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>etiqueta de envio prueba</p>
                 )}
               </div>
             )}
          </section>

          <section className="detail-section sidebar-box">
            <h3>Dirección de Entrega</h3>
            <div className="address-box">
              <FiMapPin />
              <p>{order.shippingAddress || 'No especificada'}</p>
            </div>
          </section>
        </div>
      </div>

      {isReturnModalOpen && (
        <div className="admin__modal-overlay" onClick={() => setIsReturnModalOpen(false)}>
          <div className="admin__modal" onClick={e => e.stopPropagation()}>
            <div className="admin__modal-header">
               <h2>Solicitar Devolución</h2>
               <button className="admin__modal-close" onClick={() => setIsReturnModalOpen(false)}><FiX size={24} /></button>
            </div>
            <form onSubmit={handleRequestReturn}>
              <div className="auth-form__field">
                <label>Por favor, explícanos el motivo de la devolución</label>
                <div className="auth-form__input-wrapper">
                  <textarea
                    autoFocus
                    required
                    style={{ width: '100%', padding: '12px', minHeight: '100px', borderRadius: '8px', border: '1px solid var(--pastel-pink)', resize: 'vertical' }}
                    placeholder="Ej. El producto llegó dañado o la talla no es la correcta..."
                    value={motivo}
                    onChange={e => setMotivo(e.target.value)}
                  />
                </div>
              </div>

              <div className="auth-form__field" style={{ marginTop: '16px' }}>
                <div style={{ background: '#FFF3F3', padding: '12px', borderRadius: '8px', border: '1px solid #FFCDD2', fontSize: '0.9rem' }}>
                  <strong>Información importante:</strong>
                  <p style={{ margin: '4px 0 0 0', color: '#666' }}>
                    Los gastos de gestión (<strong>€2.00</strong>) no son reembolsables.
                  </p>
                  <p style={{ margin: '4px 0 0 0', color: '#333' }}>
                    Cantidad estimada a reembolsar: <strong>€{Math.max(0, (order.totalAmount || 0) - 2.00).toFixed(2)}</strong>
                  </p>
                </div>
              </div>

              <div className="admin__form-actions" style={{ marginTop: '20px' }}>
                <button type="button" className="admin__btn-cancel" onClick={() => setIsReturnModalOpen(false)}>Cancelar</button>
                <button type="submit" className="admin__btn-submit" disabled={loadingReturn}>
                  {loadingReturn ? 'Enviando...' : 'Enviar Solicitud'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
