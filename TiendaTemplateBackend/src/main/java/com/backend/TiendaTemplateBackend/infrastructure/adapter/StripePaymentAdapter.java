package com.backend.TiendaTemplateBackend.infrastructure.adapter;

import com.backend.TiendaTemplateBackend.domain.repository.PaymentService;
import com.backend.TiendaTemplateBackend.infrastructure.tenant.TenantConfigService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StripePaymentAdapter implements PaymentService {

    private final TenantConfigService tenantConfigService;

    @Value("${stripe.secret.key:placeholder}")
    private String defaultSecretKey;

    private String getApiKey() {
        return tenantConfigService.getCurrentConfig()
                .map(c -> c.getStripeSecretKey())
                .filter(key -> key != null && !key.isBlank())
                .orElse(defaultSecretKey);
    }

    @Override
    public String createPaymentIntent(Double amount, String currency) {
        Stripe.apiKey = getApiKey();
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
        Stripe.apiKey = getApiKey();
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
