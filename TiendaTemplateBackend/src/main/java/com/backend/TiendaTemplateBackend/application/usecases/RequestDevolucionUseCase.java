package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.domain.model.Order;
import com.backend.TiendaTemplateBackend.domain.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RequestDevolucionUseCase {

    private final OrderRepository orderRepository;

    public Order execute(Long id, String motivo, String userEmail) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (!order.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("No tienes permiso para gestionar este pedido");
        }
        if (!"DELIVERED".equals(order.getStatus())) {
            throw new RuntimeException("Solo se pueden solicitar devoluciones de pedidos entregados");
        }

        order.setStatus("RETURN_REQUESTED");
        order.setMotivoDevolucion(motivo);
        return orderRepository.save(order);
    }
}
