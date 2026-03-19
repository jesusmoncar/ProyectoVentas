package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.application.dto.ProductRequest;
import com.backend.TiendaTemplateBackend.domain.model.Product;
import com.backend.TiendaTemplateBackend.domain.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UpdateProductUseCase {

    private final ProductRepository productRepository;

    @Transactional
    public Product execute(Long id, ProductRequest request) {
        // 1. Verificar si existe
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto con ID " + id + " no encontrado"));

        // 2. Actualizar datos básicos
        existingProduct.setName(request.getName());
        existingProduct.setDescription(request.getDescription());
        existingProduct.setBasePrice(request.getBasePrice());

        return productRepository.save(existingProduct);
    }
}
