package com.backend.TiendaTemplateBackend.infrastructure.adapter;

import com.backend.TiendaTemplateBackend.domain.repository.PaymentService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.stripe.model.Refund;
import com.stripe.param.RefundCreateParams;

@Service
public class StripePaymentAdapter implements PaymentService {

    @Value("${stripe.secret.key}")
    private String secretKey;

    @Override
    public String createPaymentIntent(Double amount, String currency) {
        Stripe.apiKey = secretKey;
        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) (amount * 100)) // Stripe trabaja en céntimos
                    .setCurrency(currency)
                    .build();
            PaymentIntent intent = PaymentIntent.create(params);
            return intent.getClientSecret();
        } catch (StripeException e) {
            throw new RuntimeException("Error con Stripe: " + e.getMessage());
        }
    }

    @Override
    public void refundPayment(String paymentIntentId, Double amountToRefund) {
        Stripe.apiKey = secretKey;
        try {
            RefundCreateParams params = RefundCreateParams.builder()
                    .setPaymentIntent(paymentIntentId)
                    .setAmount((long) (amountToRefund * 100))
                    .build();
            Refund.create(params);
        } catch (StripeException e) {
            throw new RuntimeException("Error procesando reembolso en Stripe: " + e.getMessage());
        }
    }
}
