package com.backend.TiendaTemplateBackend.domain.repository;

public interface PaymentService {
    String createPaymentIntent(Double amount, String currency);
    void refundPayment(String paymentIntentId, Double amountToRefund);
}
