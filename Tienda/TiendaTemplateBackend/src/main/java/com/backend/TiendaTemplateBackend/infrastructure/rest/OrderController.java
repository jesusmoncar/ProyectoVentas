package com.backend.TiendaTemplateBackend.infrastructure.rest;

import com.backend.TiendaTemplateBackend.application.dto.OrderRequest;
import com.backend.TiendaTemplateBackend.application.usecases.CreateOrderUseCase;
import com.backend.TiendaTemplateBackend.application.usecases.DeleteOrderUseCase;
import com.backend.TiendaTemplateBackend.application.usecases.GetAllOrdersUseCase;
import com.backend.TiendaTemplateBackend.application.usecases.GetOrderByNumeroPedidoUseCase;
import com.backend.TiendaTemplateBackend.application.usecases.UpdateOrderStatusUseCase;
import com.backend.TiendaTemplateBackend.domain.model.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final CreateOrderUseCase createOrderUseCase;
    private final GetOrderByNumeroPedidoUseCase getOrderByNumeroPedidoUseCase;
    private final GetAllOrdersUseCase getAllOrdersUseCase;
    private final DeleteOrderUseCase deleteOrderUseCase;
    private final UpdateOrderStatusUseCase updateOrderStatusUseCase;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest request, Authentication authentication) {
        Order order = createOrderUseCase.execute(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAll() {
        return ResponseEntity.ok(getAllOrdersUseCase.execute());
    }

    @GetMapping("/seguimiento/{numeroPedido}")
    public ResponseEntity<Order> getByNumeroPedido(@PathVariable String numeroPedido) {
        return ResponseEntity.ok(getOrderByNumeroPedidoUseCase.execute(numeroPedido));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        deleteOrderUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Order order = updateOrderStatusUseCase.execute(id, body.get("status"));
        return ResponseEntity.ok(order);
    }
}