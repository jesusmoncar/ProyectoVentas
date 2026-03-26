package com.backend.TiendaTemplateBackend.application.dto;


import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private String shippingAddress;
    private List<OrderItemRequest> items;
    private String paymentIntentId;
    private String deliveryMode; // ej: "SHIPPING" o "PICKUP"

    @Data
    public static  class OrderItemRequest {
        private Long productId;
        private Integer quantity;
        private String variantLabel;
    }
}
