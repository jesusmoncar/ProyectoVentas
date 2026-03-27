package com.backend.TiendaTemplateBackend.application.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private Double basePrice;
    private Integer discountPercent;
    private List<ProductVariantResponse> variants;
    private List<String> images;
}
