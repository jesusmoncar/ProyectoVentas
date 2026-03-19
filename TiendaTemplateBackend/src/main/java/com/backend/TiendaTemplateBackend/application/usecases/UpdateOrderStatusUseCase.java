package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.domain.model.Order;
import com.backend.TiendaTemplateBackend.domain.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UpdateOrderStatusUseCase {

    private final OrderRepository orderRepository;

    public Order execute(Long id, String newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
}
