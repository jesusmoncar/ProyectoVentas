package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.domain.model.Order;
import com.backend.TiendaTemplateBackend.domain.repository.OrderRepository;
import com.backend.TiendaTemplateBackend.infrastructure.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetOrderByNumeroPedidoUseCase {

    private final OrderRepository orderRepository;

    public Order execute(String numeroPedido) {
        String pageCode = TenantContext.getCurrentTenant();
        return orderRepository.findByNumeroPedido(numeroPedido, pageCode)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado: " + numeroPedido + " en tienda " + pageCode));
    }
}