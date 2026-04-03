import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiCheck, FiArrowLeft, FiLock, FiBox } from 'react-icons/fi';
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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, updateAddress } = useAuth();
  
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
  const [clientSecret, setClientSecret] = useState('');
  const [addressConfirmed, setAddressConfirmed] = useState(false);

  const shippingCost = (deliveryMode === 'PICKUP' || totalPrice >= 50) ? 0 : 4.99;
  const finalTotal = totalPrice + shippingCost;

  const orderData: OrderRequest = {
    shippingAddress: deliveryMode === 'PICKUP' ? 'Recogida en Tienda Studio Luxe (Calle Principal 123)' : JSON.stringify(address),
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
      toast.error('Por favor, complete los datos de envío.'); 
      return; 
    }
    if (items.length === 0) { toast.error('Su selección está vacía.'); return; }

    setLoading(true);
    
    if (deliveryMode === 'PICKUP') {
      try {
        const res = await api.post('/orders', orderData);
        handlePaymentSuccess(res.data.numeroPedido);
      } catch (err: any) {
        toast.error('Error al procesar la reserva.');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const res = await api.post('/payments/create-intent', { amount: finalTotal, currency: 'eur' });
      setClientSecret(res.data.clientSecret);
      setAddressConfirmed(true);
    } catch (err: any) {
      toast.error('Error de conexión con el terminal de pago.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (newOrderNumber: string) => {
    setOrderNumber(newOrderNumber);
    clearCart();
    toast.success('Su pedido ha sido procesado con éxito.');
  };

  if (orderNumber) {
    return (
      <div className="checkout-luxe fade-in">
        <div className="container checkout-luxe__success">
          <div className="success-icon"><FiCheck size={40} /></div>
          <h1>Pedido Confirmado</h1>
          <p className="order-id">Número de gestión: <span>{orderNumber}</span></p>
          <div className="success-card">
            <p>
              {deliveryMode === 'PICKUP' 
                ? 'Su reserva está lista. Dispone de 48 horas para retirar su pedido en nuestro Atelier.'
                : 'Su pedido ha sido procesado. Recibirá los detalles del seguimiento en su correo electrónico.'}
            </p>
          </div>
          <div className="success-actions">
            <Link to="/seguimiento" className="btn btn--primary">Seguir Pedido</Link>
            <Link to="/" className="btn btn--outline">Volver al Inicio</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-luxe fade-in">
      <div className="container">
        <header className="checkout-luxe__header">
          <Link to="/catalogo" className="back-link"><FiArrowLeft /> Seguir explorando</Link>
          <h1>Finalizar Selección</h1>
        </header>

        <div className="checkout-luxe__grid">
          <div className="checkout-luxe__main">
            <div className="checkout-luxe__modes">
              <button 
                className={`mode-btn ${deliveryMode === 'SHIPPING' ? 'active' : ''}`}
                onClick={() => { setDeliveryMode('SHIPPING'); setAddressConfirmed(false); }}
              >
                <FiMapPin /> Envío a Domicilio
              </button>
              <button 
                className={`mode-btn ${deliveryMode === 'PICKUP' ? 'active' : ''}`}
                onClick={() => { setDeliveryMode('PICKUP'); setAddressConfirmed(false); }}
              >
                <FiBox /> Recogida en Atelier
              </button>
            </div>

            <section className={`checkout-section ${addressConfirmed ? 'completed' : ''}`}>
              <h2 className="section-title">01. {deliveryMode === 'PICKUP' ? 'Información del Atelier' : 'Dirección de Entrega'}</h2>
              
              {!addressConfirmed ? (
                <form onSubmit={handleConfirmAddress}>
                  {deliveryMode === 'SHIPPING' ? (
                    <div className="checkout-address-luxe">
                      <AddressForm 
                        address={address} 
                        onChange={setAddress} 
                        onSave={async (addr) => {
                          try { await updateAddress(addr); toast.success('Dirección actualizada.'); } 
                          catch (e) { toast.error('Error al guardar.'); }
                        }}
                        savedAddress={user?.direccion}
                      />
                    </div>
                  ) : (
                    <div className="pickup-info-luxe">
                      <FiMapPin size={24} />
                      <div>
                        <h5>Studio Luxe Atelier</h5>
                        <p>Vía Elegance 45, Local B<br/>Madrid, 28001</p>
                        <p className="stock-note">Reserva asegurada por 48 horas.</p>
                      </div>
                    </div>
                  )}
                  <button type="submit" className="btn btn--primary btn--full" style={{ marginTop: '32px' }} disabled={loading}>
                    {loading ? 'Procesando...' : (deliveryMode === 'PICKUP' ? 'Confirmar Reserva' : 'Continuar al Pago')}
                  </button>
                </form>
              ) : (
                <div className="address-summary">
                  <p>{deliveryMode === 'PICKUP' ? 'Seleccionado: Atelier Madrid' : `Destino: ${address.street}, ${address.city}`}</p>
                  <button onClick={() => { setAddressConfirmed(false); setClientSecret(''); }}>Editar</button>
                </div>
              )}
            </section>

            {deliveryMode === 'SHIPPING' && (
              <section className={`checkout-section ${!addressConfirmed ? 'locked' : ''}`}>
                <h2 className="section-title">02. Pago Seguro</h2>
                {addressConfirmed && clientSecret ? (
                  <div className="stripe-wrapper-luxe">
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <CheckoutForm 
                        clientSecret={clientSecret} 
                        total={finalTotal} 
                        orderData={orderData} 
                        onSuccess={handlePaymentSuccess} 
                      />
                    </Elements>
                  </div>
                ) : (
                  <p className="payment-note"><FiLock /> El terminal de pago se activará tras confirmar la dirección.</p>
                )}
              </section>
            )}
          </div>

          <aside className="checkout-luxe__summary">
            <h2 className="summary-title">Resumen</h2>
            <div className="summary-items">
              {items.map(item => (
                <div key={`${item.product.id}-${item.variant.id}`} className="summary-item">
                  <div className="summary-item__img">
                    <img src={getImageUrl(item.product.images?.[0], item.product.id)} alt="" />
                  </div>
                  <div className="summary-item__info">
                    <h4>{item.product.name}</h4>
                    <span><span className="color-dot" style={{ backgroundColor: item.variant.color }}></span> {item.variant.size} (x{item.quantity})</span>
                  </div>
                  <span className="summary-item__price">€{( (item.variant.priceOverride ?? item.product.basePrice) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="summary-totals">
              <div className="total-row"><span>Subtotal</span><span>€{totalPrice.toFixed(2)}</span></div>
              <div className="total-row"><span>{deliveryMode === 'PICKUP' ? 'Recogida' : 'Envio'}</span><span>{shippingCost === 0 ? 'Gratis' : `€${shippingCost.toFixed(2)}`}</span></div>
              <div className="total-row total-row--final"><span>Total</span><span>€{finalTotal.toFixed(2)}</span></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
