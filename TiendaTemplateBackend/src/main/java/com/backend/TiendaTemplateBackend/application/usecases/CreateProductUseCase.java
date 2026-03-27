package com.backend.TiendaTemplateBackend.application.usecases;


import com.backend.TiendaTemplateBackend.application.dto.ProductRequest;
import com.backend.TiendaTemplateBackend.domain.model.Product;
import com.backend.TiendaTemplateBackend.domain.model.ProductVariant;
import com.backend.TiendaTemplateBackend.domain.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CreateProductUseCase {

    private final ProductRepository productRepository;

    @Transactional
    public Product execute(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setBasePrice(request.getBasePrice());
        product.setDiscountPercent(request.getDiscountPercent() != null ? request.getDiscountPercent() : 0);

        if (request.getVariants() != null) {
            product.setVariants(request.getVariants().stream().map(v -> {
                ProductVariant variant = new ProductVariant();
                variant.setSku(generateSku(request.getName(), v.getColor(), v.getSize()));
                variant.setColor(v.getColor());
                variant.setSize(v.getSize());
                variant.setStock(v.getStock());
                variant.setPriceOverride(v.getPriceOverride());
                return variant;
            }).collect(Collectors.toList()));
        }

        if (!product.isAvailable()) {
            throw new IllegalArgumentException("El producto debe tener precio");
        }

        return productRepository.save(product);
    }

    // Formato: CAM-AZU-L-A3F2 (producto-color-talla-random)
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