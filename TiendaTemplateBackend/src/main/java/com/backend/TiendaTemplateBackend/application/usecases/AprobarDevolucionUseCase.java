package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.domain.model.Order;
import com.backend.TiendaTemplateBackend.domain.repository.OrderRepository;
import com.backend.TiendaTemplateBackend.domain.repository.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AprobarDevolucionUseCase {

    private final OrderRepository orderRepository;
    private final PaymentService paymentService;

    public Order execute(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (!"RETURN_REQUESTED".equals(order.getStatus())) {
            throw new RuntimeException("El pedido no tiene una solicitud de devolución pendiente");
        }

        // Automatic Stripe Refund with management fee
        if (order.getStripePaymentIntentId() != null && !order.getStripePaymentIntentId().isEmpty()) {
            double managementFee = 2.00;
            double amountToRefund = order.getTotalAmount() - managementFee;
            if (amountToRefund > 0) {
                paymentService.refundPayment(order.getStripePaymentIntentId(), amountToRefund);
            }
        }

        order.setStatus("RETURNED");
        return orderRepository.save(order);
    }
}
