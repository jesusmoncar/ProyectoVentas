package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.domain.model.Order;
import com.backend.TiendaTemplateBackend.domain.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AprobarDevolucionUseCase {

    private final OrderRepository orderRepository;

    public Order execute(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (!"RETURN_REQUESTED".equals(order.getStatus())) {
            throw new RuntimeException("El pedido no tiene una solicitud de devolución pendiente");
        }

        order.setStatus("RETURN_APPROVED");
        return orderRepository.save(order);
    }
}
