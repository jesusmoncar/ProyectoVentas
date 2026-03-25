package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.application.dto.OrderRequest;
import com.backend.TiendaTemplateBackend.domain.model.Order;
import com.backend.TiendaTemplateBackend.domain.model.OrderItem;
import com.backend.TiendaTemplateBackend.domain.model.User;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.UserRepository;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.entities.ProductEntity;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.jpa.ProductJpaRepository;
import com.backend.TiendaTemplateBackend.domain.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CreateOrderUseCase {

    private final OrderRepository orderRepository;
    private final ProductJpaRepository productJpaRepository;
    private final UserRepository userRepository;

    @Transactional
    public Order execute(OrderRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(request.getPaymentIntentId() != null ? "PAID" : "PENDING");
        order.setShippingAddress(request.getShippingAddress());
        order.setStripePaymentIntentId(request.getPaymentIntentId());

        double total = 0;
        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            ProductEntity product = productJpaRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setPrice(product.getBasePrice());
            item.setVariantLabel(itemReq.getVariantLabel());

            total += product.getBasePrice() * itemReq.getQuantity();
            order.getItems().add(item);
        }

        order.setTotalAmount(total);
        return orderRepository.save(order);
    }
}