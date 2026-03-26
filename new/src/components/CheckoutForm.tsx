import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FiLock, FiShield, FiCreditCard, FiLoader } from 'react-icons/fi';
import api from '../api/api';
import type { OrderRequest } from '../types';
import toast from 'react-hot-toast';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#2D2D2D',
      fontFamily: '"Poppins", sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': { color: '#BDBDBD' },
    },
    invalid: { color: '#e53935', iconColor: '#e53935' },
  },
  hidePostalCode: true,
};

interface CheckoutFormProps {
  clientSecret: string;
  total: number;
  orderData: OrderRequest;
  onSuccess: (orderNumber: string) => void;
}

export default function CheckoutForm({ clientSecret, total, orderData, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [cardFocused, setCardFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPaying(true);
    setError('');

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement)! },
    });

    if (stripeError) {
      setError(stripeError.message || 'Error al procesar el pago');
      setPaying(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      try {
        const finalOrderData: OrderRequest = {
          ...orderData,
          paymentIntentId: paymentIntent.id,
        };
        const res = await api.post('/orders', finalOrderData);
        onSuccess(res.data.numeroPedido);
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message || 'Error al registrar el pedido');
        setError('Pago recibido, pero error al registrar el pedido. Contacta a soporte.');
        setPaying(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form-stripe">
      <div className="checkout__payment-card">
        <div className="checkout__payment-header">
          <label>
            <FiCreditCard size={18} /> Datos de tarjeta
          </label>
        </div>
        <div className={`checkout__card-element ${cardFocused ? 'focused' : ''}`}>
          <CardElement
            options={CARD_ELEMENT_OPTIONS}
            onFocus={() => setCardFocused(true)}
            onBlur={() => setCardFocused(false)}
          />
        </div>
        <p className="checkout__card-hint">
          Para pruebas usa <strong>4242 4242 4242 4242</strong>, cualquier fecha futura y CVC.
        </p>
      </div>

      {error && (
        <div className="checkout__payment-error">
          <span>⚠️</span> {error}
        </div>
      )}

      <button className="btn btn--primary btn--full btn--lg stripe-btn-margin" type="submit" disabled={paying || !stripe}>
        {paying ? (
          <>
            <FiLoader size={18} className="icon-spin" /> Procesando pago...
          </>
        ) : (
          <>
            <FiLock size={18} /> Pagar €{total.toFixed(2)}
          </>
        )}
      </button>

      <p className="checkout__ssl-info">
        <FiShield size={14} /> Pago seguro cifrado con SSL · Powered by Stripe
      </p>
    </form>
  );
}
