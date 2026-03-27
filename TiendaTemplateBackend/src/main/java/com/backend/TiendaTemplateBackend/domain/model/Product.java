package com.backend.TiendaTemplateBackend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    private Long id;
    private String name;
    private String description;
    private Double basePrice;
    private Integer discountPercent;
    private List<ProductVariant> variants;
    private List<String> images;

    // Lógica de negocio consolidada
    public boolean hasStock() {
        return variants != null && variants.stream().anyMatch(v -> v.getStock() > 0);
    }

    public Integer getTotalStock() {
        return variants == null ? 0 : variants.stream().mapToInt(ProductVariant::getStock).sum();
    }

    public boolean isAvailable() {
        return hasStock() && basePrice > 0;
    }
}