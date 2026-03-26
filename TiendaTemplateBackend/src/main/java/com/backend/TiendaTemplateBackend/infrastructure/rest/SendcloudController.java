package com.backend.TiendaTemplateBackend.infrastructure.rest;

import com.backend.TiendaTemplateBackend.domain.model.Order;
import com.backend.TiendaTemplateBackend.domain.repository.OrderRepository;
import com.backend.TiendaTemplateBackend.infrastructure.sendcloud.SendcloudParcelRequest;
import com.backend.TiendaTemplateBackend.infrastructure.sendcloud.SendcloudService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sandbox/sendcloud")
@RequiredArgsConstructor
public class SendcloudController {

    private final SendcloudService sendcloudService;
    private final OrderRepository orderRepository;

    @PostMapping("/test-parcel")
    public ResponseEntity<String> testCreateParcel(@RequestBody SendcloudParcelRequest request) {
        String response = sendcloudService.createParcel(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/labels/{orderId}")
    public ResponseEntity<byte[]> getOrderLabel(@PathVariable Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (order.getLabelUrl() == null || order.getLabelUrl().isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        byte[] pdf = sendcloudService.getLabelPdf(order.getLabelUrl());
        if (pdf == null) {
            return ResponseEntity.internalServerError().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"etiqueta-" + order.getNumeroPedido() + ".pdf\"")
                .body(pdf);
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleSendcloudWebhook(@RequestBody String payload) {
        System.out.println("====== SENDCLOUD WEBHOOK RECEIVED ======");
        System.out.println(payload);
        System.out.println("========================================");
        return ResponseEntity.ok("Webhook received");
    }
}
