package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.domain.model.Order;
import com.backend.TiendaTemplateBackend.domain.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetOrderByNumeroPedidoUseCase {

    private final OrderRepository orderRepository;

    public Order execute(String numeroPedido) {
        return orderRepository.findByNumeroPedido(numeroPedido)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado: " + numeroPedido));
    }
}