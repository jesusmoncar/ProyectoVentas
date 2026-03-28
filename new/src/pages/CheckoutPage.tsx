import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiShoppingBag, FiCheck, FiArrowLeft, FiLock, FiBox } from 'react-icons/fi';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../api/api';
import api from '../api/api';
import toast from 'react-hot-toast';
import type { OrderRequest, ShippingAddress } from '../types';
import CheckoutForm from '../components/CheckoutForm';
import AddressForm from '../components/AddressForm';

// Make sure to configure your environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, updateAddress } = useAuth();
  
  // States
  const [deliveryMode, setDeliveryMode] = useState<'SHIPPING' | 'PICKUP'>('SHIPPING');
  const [address, setAddress] = useState<ShippingAddress>(() => {
    if (user?.direccion) {
      try {
        return JSON.parse(user.direccion);
      } catch (e) {
        return { street: user.direccion, houseNumber: '', postalCode: '', city: '', country: 'ES' };
      }
    }
    return { street: '', houseNumber: '', postalCode: '', city: '', country: 'ES' };
  });
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  // Stripe States
  const [clientSecret, setClientSecret] = useState('');
  const [addressConfirmed, setAddressConfirmed] = useState(false);

  // If PICKUP, shipping cost is 0
  const shippingCost = (deliveryMode === 'PICKUP' || totalPrice >= 50) ? 0 : 4.99;
  const finalTotal = totalPrice + shippingCost;

  const orderData: OrderRequest = {
    shippingAddress: deliveryMode === 'PICKUP' ? 'Recogida en Tienda BLOOM (Calle Principal 123)' : JSON.stringify(address),
    deliveryMode: deliveryMode,
    items: items.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      variantLabel: `${item.variant.color} - ${item.variant.size}`
    }))
  };

  const handleConfirmAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deliveryMode === 'SHIPPING' && (!address.street.trim() || !address.postalCode.trim() || !address.city.trim())) { 
      toast.error('Completa los campos obligatorios de la dirección de envío'); 
      return; 
    }
    if (items.length === 0) { toast.error('Tu carrito está vacío'); return; }

    setLoading(true);
    
    // Si es recogida en tienda, creamos el pedido directamente como RESERVADO
    if (deliveryMode === 'PICKUP') {
      try {
        const res = await api.post('/orders', orderData);
        handlePaymentSuccess(res.data.numeroPedido);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error al reservar el pedido');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Flujo normal de envío a domicilio: Pedimos el Intento de Pago al Backend
    try {
      const res = await api.post('/payments/create-intent', { 
        amount: finalTotal, 
        currency: 'eur' 
      });
      setClientSecret(res.data.clientSecret);
      setAddressConfirmed(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al conectar con la pasarela de pago');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (newOrderNumber: string) => {
    setOrderNumber(newOrderNumber);
    clearCart();
    toast.success(deliveryMode === 'PICKUP' ? '¡Pedido reservado exitosamente! 🎉' : '¡Pedido creado y pagado exitosamente! 🎉');
  };

  if (orderNumber) {
    return (
      <div className="checkout">
        <div className="checkout__success">
          <div className="checkout__success-icon">
            <FiCheck size={48} />
          </div>
          <h1>¡Pedido Confirmado!</h1>
          <p>Tu número de seguimiento es:</p>
          <span className="checkout__order-number">pedido prueba</span>
          <p className="checkout__success-text">
            {deliveryMode === 'PICKUP' 
              ? 'Has elegido recoger tu pedido en tienda. Tienes 48 horas para pasar a recogerlo y abonarlo antes de que se cancele automáticamente la reserva.'
              : 'Recibirás un email con los detalles de tu pedido. Puedes hacer seguimiento en cualquier momento.'}
          </p>
          <div className="checkout__success-actions">
            <Link to={`/seguimiento`} className="btn btn--primary btn--lg">Seguir Mi Pedido</Link>
            <Link to="/" className="btn btn--outline btn--lg">Volver al Inicio</Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout">
        <div className="empty-state" style={{ minHeight: '50vh' }}>
          <div className="empty-state__icon">🛒</div>
          <h3>Tu carrito está vacío</h3>
          <p>Agrega algunos productos antes de continuar</p>
          <Link to="/catalogo" className="btn btn--primary">Explorar Catálogo</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="checkout__header">
        <Link to="/catalogo" className="checkout__back"><FiArrowLeft size={20} /> Seguir Comprando</Link>
        <h1>Finalizar Compra</h1>
      </div>

      <div className="checkout__container">
        <div className="checkout__form">
        
          <div className="checkout__delivery-modes" style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
             <button 
                type="button" 
                className={`btn ${deliveryMode === 'SHIPPING' ? 'btn--primary' : 'btn--outline'}`} 
                onClick={() => { setDeliveryMode('SHIPPING'); setAddressConfirmed(false); }}
                style={{ flex: 1, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
             >
                <FiMapPin /> Envío a Domicilio
             </button>
             <button 
                type="button" 
                className={`btn ${deliveryMode === 'PICKUP' ? 'btn--primary' : 'btn--outline'}`} 
                onClick={() => { setDeliveryMode('PICKUP'); setAddressConfirmed(false); }}
                style={{ flex: 1, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
             >
                <FiBox /> Recoger en Tienda
             </button>
          </div>

          <div className={`checkout__section ${addressConfirmed ? 'checkout__section--completed' : ''}`}>
            <h2>
              {deliveryMode === 'PICKUP' ? <><FiBox size={20} /> Información de Recogida</> : <><FiMapPin size={20} /> Dirección de Envío</>}
            </h2>
            {!addressConfirmed ? (
              <form onSubmit={handleConfirmAddress}>
                {deliveryMode === 'SHIPPING' ? (
                  <AddressForm 
                    address={address} 
                    onChange={setAddress} 
                    onSave={async (addr) => {
                      try {
                        await updateAddress(addr);
                        toast.success('Dirección guardada en tu perfil');
                      } catch (err) {
                        toast.error('Error al guardar la dirección');
                      }
                    }}
                    savedAddress={user?.direccion}
                  />
                ) : (
                  <div className="checkout__payment-placeholder" style={{ backgroundColor: 'var(--pastel-pink-light)', textAlign: 'left', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <FiMapPin size={24} style={{ color: 'var(--pastel-pink-dark)', flexShrink: 0, marginTop: '2px' }}/>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Tienda Central BLOOM</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem' }}>Calle Principal 123, Local 4B<br/>Madrid, 28001</p>
                      <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', fontWeight: 600, color: 'var(--pastel-pink-dark)' }}>El stock se reservará durante 48 horas.</p>
                    </div>
                  </div>
                )}
                
                <button type="submit" className="btn btn--outline btn--full btn--lg" style={{ marginTop: '20px' }} disabled={loading}>
                  {loading 
                    ? 'Procesando...' 
                    : deliveryMode === 'PICKUP' ? 'Confirmar Reserva en Tienda' : 'Confirmar Dirección y Proceder al Pago'
                  }
                </button>
              </form>
            ) : (
              <div className="checkout__address-confirmed">
                <p><strong>{deliveryMode === 'PICKUP' ? 'Recogida en:' : 'Enviando a:'}</strong> {deliveryMode === 'PICKUP' ? 'Tienda Central BLOOM' : `${address.street} ${address.houseNumber}, ${address.postalCode} ${address.city}`}</p>
                <button className="btn btn--ghost" onClick={() => { setAddressConfirmed(false); setClientSecret(''); }}>✎ Cambiar</button>
              </div>
            )}
          </div>

          {deliveryMode === 'SHIPPING' && (
            <div className={`checkout__section ${!addressConfirmed ? 'checkout__section--locked' : ''}`}>
              <h2><FiLock size={20} /> Pago Seguro</h2>
              
              {!addressConfirmed ? (
                 <div className="checkout__payment-placeholder">
                   <p>💳 Confirma la dirección de envío para habilitar el pago de forma segura por Stripe</p>
                 </div>
              ) : (
                <div className="checkout__stripe-container">
                  {clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <CheckoutForm 
                        clientSecret={clientSecret} 
                        total={finalTotal} 
                        orderData={orderData} 
                        onSuccess={handlePaymentSuccess} 
                      />
                    </Elements>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="checkout__summary">
          <h2>Resumen del Pedido</h2>
          <ul className="checkout__items">
            {items.map(item => {
              const imageUrl = getImageUrl(item.product.images?.[0], item.product.id);
              const price = item.variant.priceOverride ?? item.product.basePrice;
              return (
                <li key={`${item.product.id}-${item.variant.id}`} className="checkout__item">
                  <div className="checkout__item-image">
                    {imageUrl ? <img src={imageUrl} alt={item.product.name} /> : <FiShoppingBag size={24} />}
                  </div>
                  <div className="checkout__item-info">
                    <h4>{item.product.name}</h4>
                    <span>{item.variant.color} — {item.variant.size}</span>
                    <span>Cantidad: {item.quantity}</span>
                  </div>
                  <span className="checkout__item-price">€{(price * item.quantity).toFixed(2)}</span>
                </li>
              );
            })}
          </ul>
          <div className="checkout__totals">
            <div className="checkout__total-row">
              <span>Subtotal</span>
              <span>€{totalPrice.toFixed(2)}</span>
            </div>
            <div className="checkout__total-row">
              <span>{deliveryMode === 'PICKUP' ? 'Recogida' : 'Envío'}</span>
              <span>{shippingCost === 0 ? 'Gratis' : `€${shippingCost.toFixed(2)}`}</span>
            </div>
            <hr />
            <div className="checkout__total-row checkout__total-row--final">
              <span>Total a {deliveryMode === 'PICKUP' ? 'Pagar en Local' : 'Pagar'}</span>
              <span>€{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
