package com.backend.TiendaTemplateBackend.infrastructure.rest;

import com.backend.TiendaTemplateBackend.application.dto.OrderRequest;
import com.backend.TiendaTemplateBackend.application.usecases.*;
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
    private final GetOrdersByUserUseCase getOrdersByUserUseCase;
    private final DeleteOrderUseCase deleteOrderUseCase;
    private final UpdateOrderStatusUseCase updateOrderStatusUseCase;
    private final RequestDevolucionUseCase requestDevolucionUseCase;
    private final GetDevolucionesUseCase getDevolucionesUseCase;
    private final AprobarDevolucionUseCase aprobarDevolucionUseCase;
    private final RechazarDevolucionUseCase rechazarDevolucionUseCase;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest request, Authentication authentication) {
        Order order = createOrderUseCase.execute(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAll() {
        return ResponseEntity.ok(getAllOrdersUseCase.execute());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {
        return ResponseEntity.ok(getOrdersByUserUseCase.execute(authentication.getName()));
    }

    @GetMapping("/devoluciones")
    public ResponseEntity<List<Order>> getDevoluciones() {
        return ResponseEntity.ok(getDevolucionesUseCase.execute());
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

    @PostMapping("/{id}/devolucion")
    public ResponseEntity<Order> requestDevolucion(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            Authentication authentication) {
        String motivo = body != null ? body.get("motivo") : null;
        Order order = requestDevolucionUseCase.execute(id, motivo, authentication.getName());
        return ResponseEntity.ok(order);
    }

    @PatchMapping("/{id}/devolucion/aprobar")
    public ResponseEntity<Order> aprobarDevolucion(@PathVariable Long id) {
        return ResponseEntity.ok(aprobarDevolucionUseCase.execute(id));
    }

    @PatchMapping("/{id}/devolucion/rechazar")
    public ResponseEntity<Order> rechazarDevolucion(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String motivo = body != null ? body.get("motivo") : null;
        return ResponseEntity.ok(rechazarDevolucionUseCase.execute(id, motivo));
    }
}
