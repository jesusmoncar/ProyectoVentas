package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.domain.repository.ProductRepository;
import com.backend.TiendaTemplateBackend.infrastructure.tenant.TenantContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UpdateGlobalDiscountUseCase {

    private final ProductRepository productRepository;

    @Transactional
    public void execute(Integer discountPercent) {
        if (discountPercent < 0 || discountPercent > 100) {
            throw new IllegalArgumentException("El descuento debe estar entre 0 y 100");
        }
        String pageCode = TenantContext.getCurrentTenant();
        productRepository.updateGlobalDiscount(discountPercent, pageCode);
    }
}
