package com.backend.TiendaTemplateBackend.application.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private Double basePrice;
    private Integer discountPercent;
    private List<VariantRequest> variants;

    @Data
    public static class VariantRequest {
        private String color;
        private String size;
        private Integer stock;
        private Double priceOverride;
    }
}