package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.domain.model.Order;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.jpa.OrderJpaRepository;
import com.backend.TiendaTemplateBackend.infrastructure.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetOrdersByUserUseCase {

    private final OrderJpaRepository orderJpaRepository;

    public List<Order> execute(String email) {
        String pageCode = TenantContext.getCurrentTenant();
        return orderJpaRepository.findByUserEmailAndPageCode(email, pageCode);
    }
}
