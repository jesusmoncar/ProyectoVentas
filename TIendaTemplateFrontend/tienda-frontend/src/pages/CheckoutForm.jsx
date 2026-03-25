import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Lock, Loader2, ShieldCheck, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: '15px',
            color: '#111827',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSmoothing: 'antialiased',
            '::placeholder': { color: '#9ca3af' },
        },
        invalid: { color: '#ef4444', iconColor: '#ef4444' },
    },
    hidePostalCode: true,
};

export default function CheckoutForm({ clientSecret, total, addressData, cartItems }) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState('');
    const [cardFocused, setCardFocused] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setPaying(true);
        setError('');

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: elements.getElement(CardElement) },
        });

        if (stripeError) {
            setError(stripeError.message);
            setPaying(false);
            return;
        }

        if (paymentIntent.status === 'succeeded') {
            try {
                const addressStr = [
                    addressData.nombre,
                    addressData.direccion,
                    addressData.puerta,
                    `${addressData.cp} ${addressData.ciudad}`,
                    addressData.provincia,
                    addressData.pais,
                    `Tel: ${addressData.telefono}`,
                ].filter(Boolean).join(', ');

                const orderItems = cartItems.map(x => ({
                    productId: x.productId ?? x.id,
                    quantity: x.quantity,
                    ...(x.variantLabel ? { variantLabel: x.variantLabel } : {}),
                }));

                const res = await api.post('/orders', {
                    shippingAddress: addressStr,
                    items: orderItems,
                    paymentIntentId: paymentIntent.id,
                });

                localStorage.removeItem('cart');
                window.dispatchEvent(new Event('cartUpdated'));
                navigate(`/order-confirmation/${res.data.numeroPedido}`);
            } catch (err) {
                const msg = err.response?.data?.message ?? err.message;
                setError(`Pago recibido, pero error al registrar el pedido: ${msg}`);
                setPaying(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="co-checkout-form">
            <div className="co-card-field">
                <div className="co-card-field__header">
                    <label className="co-card-label">
                        <CreditCard size={15} />
                        Datos de tarjeta
                    </label>
                    <div className="co-card-brands">
                        <span className="co-brand-badge co-brand-badge--visa">VISA</span>
                        <span className="co-brand-badge co-brand-badge--mc">MC</span>
                        <span className="co-brand-badge co-brand-badge--amex">AMEX</span>
                    </div>
                </div>
                <div className={`co-card-element${cardFocused ? ' co-card-element--focused' : ''}`}>
                    <CardElement
                        options={CARD_ELEMENT_OPTIONS}
                        onFocus={() => setCardFocused(true)}
                        onBlur={() => setCardFocused(false)}
                    />
                </div>
                <p className="co-card-hint">
                    Para pruebas usa <strong>4242 4242 4242 4242</strong>, cualquier fecha futura y CVC.
                </p>
            </div>

            {error && (
                <div className="co-pay-error">
                    <span className="co-pay-error__icon">!</span>
                    {error}
                </div>
            )}

            <button className="co-pay-btn" type="submit" disabled={paying || !stripe}>
                {paying ? (
                    <>
                        <Loader2 size={18} className="co-spin" />
                        Procesando pago...
                    </>
                ) : (
                    <>
                        <Lock size={16} />
                        Pagar {total.toFixed(2)} €
                    </>
                )}
            </button>

            <p className="co-payment__ssl">
                <ShieldCheck size={13} />
                Pago seguro cifrado con SSL · Powered by Stripe
            </p>
        </form>
    );
}
