package com.backend.TiendaTemplateBackend.application.scheduler;

import com.backend.TiendaTemplateBackend.domain.model.Order;
import com.backend.TiendaTemplateBackend.domain.model.OrderItem;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.jpa.OrderJpaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderExpirationScheduler {

    private final OrderJpaRepository orderJpaRepository;

    @Scheduled(cron = "0 0 * * * ?") // Se comprueba cada hora
    @Transactional
    public void cancelExpiredReservations() {
        LocalDateTime twoDaysAgo = LocalDateTime.now().minusDays(2);
        List<Order> expiredOrders = orderJpaRepository.findByStatusAndOrderDateBefore("RESERVED", twoDaysAgo);

        if (expiredOrders.isEmpty()) {
            return;
        }
        
        log.info("Encontrados {} pedidos RESERVADOS expirados para cancelar.", expiredOrders.size());

        for (Order order : expiredOrders) {
            order.setStatus("CANCELLED");
            
            // Devolver stock a las variantes basadas en los order items
            for (OrderItem item : order.getItems()) {
                if (item.getProduct() != null && item.getProduct().getVariants() != null) {
                    item.getProduct().getVariants().stream()
                            .filter(v -> {
                                String label = v.getColor() + " - " + v.getSize();
                                return label.equals(item.getVariantLabel());
                            })
                            .findFirst()
                            .ifPresent(variant -> {
                                variant.setStock(variant.getStock() + item.getQuantity());
                            });
                }
            }
            orderJpaRepository.save(order);
            log.info("Pedido {} cancelado (expirado a los 2 días) y stock devuelto.", order.getNumeroPedido());
        }
    }
}
