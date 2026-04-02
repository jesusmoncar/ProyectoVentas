import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiMapPin, FiTruck, FiCheckCircle, FiClock, FiAlertCircle, FiX } from 'react-icons/fi';
import api, { getImageUrl, formatAddress } from '../api/api';
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
    <div className="order-detail-luxe fade-in">
      <div className="container">
        <header className="section-header">
          <Link to="/mis-pedidos" className="back-link">
            <FiArrowLeft /> Volver a mis pedidos
          </Link>
          <span className="section-header__tag">Detalles de Adquisición</span>
          <h1 className="section-header__title">Pedido #{order.numeroPedido}</h1>
          <p className="section-header__desc">Realizado el {formatDate(order.orderDate)}</p>
        </header>
        
        <div className="order-detail-grid">
          <div className="detail-main">
            {/* Alertas de Incidencia/Devolución */}
            {order.motivoDevolucion && (
              <div className="detail-section" style={{ background: '#fdf8f8', borderColor: 'var(--error)' }}>
                <h3 style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  <FiAlertCircle /> Incidencia Registrada
                </h3>
                <p style={{ marginTop: '16px', fontSize: '0.95rem' }}><strong>Motivo:</strong> {order.motivoDevolucion}</p>
                {order.motivoRechazo && (
                  <div style={{ marginTop: '12px', padding: '16px', background: 'var(--white)', borderLeft: '4px solid var(--error)' }}>
                    <p style={{ margin: 0, color: 'var(--error)', fontWeight: 600 }}>Decisión de la Boutique: {order.motivoRechazo}</p>
                  </div>
                )}
              </div>
            )}

            <section className="detail-section">
              <h3 className="profile-section-title">Manifiesto de Artículos</h3>
              <div className="order-items-list">
                {order.items.map((item, idx) => (
                  <div key={item.id || idx} className="order-item-luxe">
                    <img className="order-item-luxe__img" src={getImageUrl(item.product?.images?.[0], item.product?.id)} alt={item.product?.name} />
                    <div className="order-item-luxe__info" style={{ flex: 1 }}>
                      <h4>{item.product?.name || 'Pieza de Colección'}</h4>
                      <p className="variant" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {(() => {
                          const label = item.variantLabel || 'Colección Estándar';
                          const parts = label.split(' - ');
                          const color = parts[0]?.trim();
                          const size = parts[1]?.trim() || '';
                          const isColor = color?.startsWith('#');
                          return isColor ? (
                            <><span className="color-dot" style={{ backgroundColor: color }}></span> {size}</>
                          ) : (
                            <>{label}</>
                          );
                        })()}
                      </p>
                      <div className="item-price-qty" style={{ marginTop: '12px' }}>
                        <span>{item.quantity} x €{(item.price || 0).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="item-total" style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.2rem' }}>
                      €{(item.quantity * (item.price || 0)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-total-block" style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--border-light)' }}>
                <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span>Subtotal</span>
                  <span>€{(order.totalAmount || 0).toFixed(2)}</span>
                </div>
                <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <span>Servicio de Entrega</span>
                  <span style={{ color: 'var(--success)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Cortesia</span>
                </div>
                <div className="total-row grand-total" style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '24px', borderTop: '1px solid var(--text-primary)', fontSize: '1.5rem', fontFamily: 'var(--font-serif)', fontWeight: 600 }}>
                  <span>Monto Total</span>
                  <span>€{(order.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </section>
          </div>

          <div className="detail-sidebar">
            <section className="detail-section sidebar-box">
              <h3 className="profile-section-title">Estatus</h3>
              <div className="timeline-luxe">
                {order.deliveryMode === 'PICKUP' ? (
                  <>
                    <div className={`timeline-step ${['RESERVED', 'PROCESSING', 'DELIVERED'].includes(order.status) ? 'timeline-step--active' : ''}`}>
                      <FiClock className="timeline-icon" /> <span>Reserva Confirmada</span>
                    </div>
                    <div className={`timeline-step ${['PROCESSING', 'DELIVERED'].includes(order.status) ? 'timeline-step--active' : ''}`}>
                      <FiPackage className="timeline-icon" /> <span>En Preparación</span>
                    </div>
                    <div className={`timeline-step ${order.status === 'DELIVERED' ? 'timeline-step--completed' : ''}`}>
                      <FiCheckCircle className="timeline-icon" /> <span>Retirado en Boutique</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`timeline-step ${['PENDING','PAID','PROCESSING','SHIPPED','DELIVERED','RETURN_REQUESTED','RETURNED','RETURN_REJECTED'].includes(order.status) ? 'timeline-step--active' : ''}`}>
                      <FiClock className="timeline-icon" /> <span>Registrado</span>
                    </div>
                    <div className={`timeline-step ${['PROCESSING','SHIPPED','DELIVERED','RETURN_REQUESTED','RETURNED','RETURN_REJECTED'].includes(order.status) ? 'timeline-step--active' : ''}`}>
                      <FiPackage className="timeline-icon" /> <span>En Taller</span>
                    </div>
                    <div className={`timeline-step ${['SHIPPED','DELIVERED','RETURN_REQUESTED','RETURNED','RETURN_REJECTED'].includes(order.status) ? 'timeline-step--active' : ''}`}>
                      <FiTruck className="timeline-icon" /> <span>En Tránsito</span>
                    </div>
                    <div className={`timeline-step ${['DELIVERED','RETURN_REQUESTED','RETURNED','RETURN_REJECTED'].includes(order.status) ? 'timeline-step--completed' : ''}`}>
                      <FiCheckCircle className="timeline-icon" /> <span>Entregado</span>
                    </div>
                  </>
                )}
              </div>
            </section>

            {order.status === 'DELIVERED' && !order.motivoDevolucion && (
              <section className="detail-section sidebar-box" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                <h3 className="profile-section-title" style={{ color: 'var(--text-primary)' }}>Asistencia</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>¿Desea tramitar una devolución de su adquisición?</p>
                <button 
                  className="btn btn--outline btn--full"
                  onClick={() => setIsReturnModalOpen(true)}
                >
                  Gestionar Devolución
                </button>
              </section>
            )}

            <section className="detail-section sidebar-box">
               <h3 className="profile-section-title">Logística</h3>
               <div className="address-box" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                 <FiTruck size={18} color="var(--accent)" />
                 <p style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em' }}>{order.trackingNumber || 'SINC-Tracking-ID'}</p>
               </div>
               {order.deliveryMode === 'SHIPPING' && order.labelUrl && (
                  <a 
                    href={`${import.meta.env.VITE_API_URL}/sandbox/sendcloud/labels/${order.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn--outline btn--full" 
                    style={{ marginTop: '20px', fontSize: '0.75rem' }}
                  >
                    Descargar Guía de Envío
                  </a>
               )}
            </section>

            <section className="detail-section sidebar-box">
              <h3 className="profile-section-title">Destinatario</h3>
              <div className="address-box" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <FiMapPin size={18} color="var(--accent)" />
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{formatAddress(order.shippingAddress)}</p>
              </div>
            </section>
          </div>
        </div>

        {isReturnModalOpen && (
          <div className="cart-overlay cart-overlay--visible" onClick={() => setIsReturnModalOpen(false)}>
            <div className="cart-drawer cart-drawer--open" onClick={e => e.stopPropagation()} style={{ padding: '60px' }}>
              <div className="cart-drawer__header" style={{ padding: 0, border: 'none', marginBottom: '40px' }}>
                 <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Devolución</h2>
                 <button onClick={() => setIsReturnModalOpen(false)} style={{ color: 'var(--text-primary)' }}><FiX size={24} /></button>
              </div>
              <p className="profile-section-note">Por favor, detalle los motivos de su solicitud para que nuestro equipo de conserjería pueda asistirle.</p>
              <form onSubmit={handleRequestReturn}>
                <textarea
                  autoFocus
                  required
                  style={{ width: '100%', padding: '24px', minHeight: '150px', border: '1px solid var(--border-light)', background: 'var(--bg-secondary)', marginBottom: '32px' }}
                  placeholder="Describa el motivo..."
                  value={motivo}
                  onChange={e => setMotivo(e.target.value)}
                />

                <div style={{ background: 'var(--bg-secondary)', padding: '24px', marginBottom: '40px', border: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, display: 'block', marginBottom: '12px' }}>Resumen de Reembolso</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span>Estimado</span>
                    <strong style={{ fontFamily: 'var(--font-serif)' }}>€{Math.max(0, (order.totalAmount || 0) - 2.00).toFixed(2)}</strong>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px' }}>*Se aplicará una tarifa de gestión de €2.00.</p>
                </div>

                <button type="submit" className="btn btn--primary btn--full" disabled={loadingReturn}>
                  {loadingReturn ? 'Tramitando...' : 'Enviar Solicitud'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
