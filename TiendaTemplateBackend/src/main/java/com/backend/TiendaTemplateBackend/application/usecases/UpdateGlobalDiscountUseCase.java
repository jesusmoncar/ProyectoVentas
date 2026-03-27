package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.domain.repository.ProductRepository;
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
        productRepository.updateGlobalDiscount(discountPercent);
    }
}
