package com.backend.TiendaTemplateBackend.application.dto;

import lombok.Data;

@Data
public class ProductVariantResponse {
    private Long id;
    private String sku;
    private String color;
    private String size;
    private Integer stock;
    private Double priceOverride;
}
