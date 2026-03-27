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

import com.backend.TiendaTemplateBackend.infrastructure.sendcloud.SendcloudService;
import com.backend.TiendaTemplateBackend.infrastructure.sendcloud.SendcloudParcelRequest;
import com.backend.TiendaTemplateBackend.infrastructure.notification.TelegramService;

@Service
@RequiredArgsConstructor
public class CreateOrderUseCase {

    private final OrderRepository orderRepository;
    private final ProductJpaRepository productJpaRepository;
    private final UserRepository userRepository;
    private final SendcloudService sendcloudService;
    private final TelegramService telegramService;

    @Transactional
    public Order execute(OrderRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        
        // Si es Recogida en tienda, lo marcamos como RESERVED en lugar de PENDING/PAID
        if ("PICKUP".equalsIgnoreCase(request.getDeliveryMode())) {
            order.setStatus("RESERVED");
        } else {
            order.setStatus(request.getPaymentIntentId() != null ? "PAID" : "PENDING");
        }
        
        order.setShippingAddress(request.getShippingAddress());
        order.setStripePaymentIntentId(request.getPaymentIntentId());
        order.setDeliveryMode(request.getDeliveryMode());

        double total = 0;
        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            ProductEntity product = productJpaRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            // Encontrar la variante para descontar el stock e identificar el precio
            com.backend.TiendaTemplateBackend.infrastructure.persistence.entities.ProductVariantEntity matchedVariant = null;
            if (product.getVariants() != null && itemReq.getVariantLabel() != null) {
                matchedVariant = product.getVariants().stream()
                        .filter(v -> {
                            String label = v.getColor() + " - " + v.getSize();
                            return label.equals(itemReq.getVariantLabel());
                        })
                        .findFirst()
                        .orElse(null);
            }

            if (matchedVariant != null) {
                if (matchedVariant.getStock() < itemReq.getQuantity()) {
                    throw new RuntimeException("Stock insuficiente para: " + product.getName() + " (" + itemReq.getVariantLabel() + ")");
                }
                matchedVariant.setStock(matchedVariant.getStock() - itemReq.getQuantity());
            }

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            
            Double price = (matchedVariant != null && matchedVariant.getPriceOverride() != null) 
                    ? matchedVariant.getPriceOverride() 
                    : product.getBasePrice();
            
            item.setPrice(price);
            item.setVariantLabel(itemReq.getVariantLabel());

            total += price * itemReq.getQuantity();
            order.getItems().add(item);
        }

        order.setTotalAmount(total);
        Order savedOrder = orderRepository.save(order);

        // SENDCLOUD INTEGRATION
        if (!"PICKUP".equalsIgnoreCase(request.getDeliveryMode())) {
            try {
                String rawAddress = request.getShippingAddress() != null ? request.getShippingAddress() : "";
                
                // Extraer el número de 5 cifras (Código Postal Español estándar)
                String postalCode = "00000";
                java.util.regex.Pattern cpPattern = java.util.regex.Pattern.compile("\\b\\d{5}\\b");
                java.util.regex.Matcher matcher = cpPattern.matcher(rawAddress);
                if (matcher.find()) {
                    postalCode = matcher.group();
                }

                // Extraer ciudad "Calle, Numero, Ciudad, CP"
                String city = "Ciudad Desconocida";
                String[] parts = rawAddress.split(",");
                if (parts.length >= 3) {
                    city = parts[parts.length - 2].trim();
                } else if (parts.length == 2) {
                    city = parts[1].trim();
                }

                SendcloudParcelRequest.Parcel parcelData = SendcloudParcelRequest.Parcel.builder()
                        .name(user.getNombre() + " " + user.getApellido())
                        .email(user.getEmail())
                        .telephone((user.getTelefono() != null && !user.getTelefono().isEmpty()) ? user.getTelefono() : "000000000")
                        .address(rawAddress)
                        .city(city)
                        .postal_code(postalCode)
                        .country("ES")
                        .weight("2")
                        .request_label(false)
                        .shipping_method(2190)
                        .build();

                SendcloudParcelRequest scRequest = SendcloudParcelRequest.builder()
                        .parcel(parcelData)
                        .build();
                
                String response = sendcloudService.createParcel(scRequest);

                // PARSE RESPONSE TO GET TRACKING AND LABEL
                try {
                    com.fasterxml.jackson.databind.JsonNode root = new com.fasterxml.jackson.databind.ObjectMapper().readTree(response);
                    com.fasterxml.jackson.databind.JsonNode parcelNode = root.path("parcel");
                    if (!parcelNode.isMissingNode()) {
                        String tracking = parcelNode.path("tracking_number").asText();
                        String label = parcelNode.path("label").path("label_printer").asText();
                        
                        savedOrder.setTrackingNumber(tracking);
                        savedOrder.setLabelUrl(label);
                        orderRepository.save(savedOrder);
                    }
                } catch (Exception parseEx) {
                    System.err.println("Error parseando respuesta de Sendcloud: " + parseEx.getMessage());
                }
            } catch(Exception e) {
                System.err.println("Fallo al crear envío en Sendcloud para el pedido " + savedOrder.getId() + ": " + e.getMessage());
                // No lanzamos excepcion para no reventar el flujo del usuario y que pierda su pedido pagado
            }
        }

        // Notify via Telegram (async-like, as it's separate from the main transaction success if needed, 
        // but here it's called at the end of the @Transactional method).
        try {
            telegramService.sendOrderNotification(savedOrder);
        } catch (Exception e) {
            System.err.println("Error triggering Telegram notification: " + e.getMessage());
        }

        return savedOrder;
    }
}