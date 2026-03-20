package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.application.dto.ProductRequest;
import com.backend.TiendaTemplateBackend.domain.model.Product;
import com.backend.TiendaTemplateBackend.domain.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.UUID;
import java.util.stream.Collectors;

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

        // 3. Actualizar variantes
        if (request.getVariants() != null) {
            java.util.List<com.backend.TiendaTemplateBackend.domain.model.ProductVariant> updatedVariants = 
                request.getVariants().stream().map(vReq -> {
                    com.backend.TiendaTemplateBackend.domain.model.ProductVariant variant = new com.backend.TiendaTemplateBackend.domain.model.ProductVariant();
                    variant.setSku(generateSku(request.getName(), vReq.getColor(), vReq.getSize()));
                    variant.setColor(vReq.getColor());
                    variant.setSize(vReq.getSize());
                    variant.setStock(vReq.getStock());
                    variant.setPriceOverride(vReq.getPriceOverride());
                    return variant;
                }).collect(Collectors.toList());
            existingProduct.setVariants(updatedVariants);
        } else {
            existingProduct.setVariants(new java.util.ArrayList<>());
        }

        return productRepository.save(existingProduct);
    }

    private String generateSku(String productName, String color, String size) {
        String prod = normalize(productName, 3);
        String col  = normalize(color != null ? color : "GEN", 3);
        String tal  = normalize(size  != null ? size  : "UN",  4);
        String rand = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 4).toUpperCase();
        return prod + "-" + col + "-" + tal + "-" + rand;
    }

    private String normalize(String value, int maxChars) {
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("[^\\p{ASCII}]", "")
                .replaceAll("[^a-zA-Z0-9]", "")
                .toUpperCase();
        return normalized.length() >= maxChars ? normalized.substring(0, maxChars) : normalized;
    }
}
