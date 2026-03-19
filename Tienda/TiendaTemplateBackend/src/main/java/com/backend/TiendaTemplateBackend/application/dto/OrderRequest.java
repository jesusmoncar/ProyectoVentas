package com.backend.TiendaTemplateBackend.application.dto;


import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private String shippingAddress;
    private List<OrderItemRequest> items;

    @Data
    public static  class OrderItemRequest {
        private Long productId;
        private Integer quantity;
    }
}
