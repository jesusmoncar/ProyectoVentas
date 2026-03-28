package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.domain.model.Order;
import com.backend.TiendaTemplateBackend.domain.repository.OrderRepository;
import com.backend.TiendaTemplateBackend.infrastructure.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetAllOrdersUseCase {

    private final OrderRepository orderRepository;

    public List<Order> execute() {
        String pageCode = TenantContext.getCurrentTenant();
        return orderRepository.findAll(pageCode);
    }
}
