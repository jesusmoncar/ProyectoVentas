package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.domain.repository.OrderRepository;
import com.backend.TiendaTemplateBackend.infrastructure.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteOrderUseCase {

    private final OrderRepository orderRepository;

    public void execute(Long id) {
        String pageCode = TenantContext.getCurrentTenant();
        orderRepository.findById(id)
                .filter(order -> order.getPageCode().equals(pageCode))
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado o no pertenece a la tienda: " + id));
        orderRepository.deleteById(id, pageCode);
    }
}