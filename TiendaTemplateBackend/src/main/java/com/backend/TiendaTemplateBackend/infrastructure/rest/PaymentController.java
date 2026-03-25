package com.backend.TiendaTemplateBackend.infrastructure.rest;

import com.backend.TiendaTemplateBackend.domain.repository.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Crea un PaymentIntent en Stripe y devuelve el clientSecret al frontend.
     * Body esperado: { "amount": 29.99, "currency": "eur" }
     */
    @PostMapping("/create-intent")
    public ResponseEntity<Map<String, String>> createIntent(@RequestBody Map<String, Object> body) {
        Double amount = Double.valueOf(body.get("amount").toString());
        String currency = body.getOrDefault("currency", "eur").toString();
        String clientSecret = paymentService.createPaymentIntent(amount, currency);
        return ResponseEntity.ok(Map.of("clientSecret", clientSecret));
    }
}
