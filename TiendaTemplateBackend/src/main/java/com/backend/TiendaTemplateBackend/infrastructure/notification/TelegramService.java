package com.backend.TiendaTemplateBackend.infrastructure.notification;

import com.backend.TiendaTemplateBackend.domain.model.Order;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@Service
public class TelegramService {

    @Value("${telegram.bot.token:}")
    private String botToken;

    @Value("${telegram.chat.id:}")
    private String chatId;

    private final RestTemplate restTemplate;

    public TelegramService() {
        this.restTemplate = new RestTemplate();
    }

    public void sendOrderNotification(Order order) {
        if (botToken == null || botToken.isEmpty() || "YOUR_BOT_TOKEN".equals(botToken)) {
            System.out.println("Telegram bot token not configured. Skipping notification.");
            return;
        }

        String message = formatOrderMessage(order);
        String url = String.format("https://api.telegram.org/bot%s/sendMessage?chat_id=%s&text=%s&parse_mode=Markdown", 
                botToken, chatId, message);

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("Telegram notification sent for order: " + order.getId());
            } else {
                System.err.println("Failed to send Telegram notification: " + response.getBody());
            }
        } catch (Exception e) {
            System.err.println("Error sending Telegram notification: " + e.getMessage());
        }
    }

    private String formatOrderMessage(Order order) {
        StringBuilder sb = new StringBuilder();
        sb.append("🛍️ *¡Nuevo Pedido Recibido!* \n\n");
        sb.append("*ID Pedido:* ").append(order.getId()).append("\n");
        sb.append("*Cliente:* ").append(order.getUser().getNombre()).append(" ").append(order.getUser().getApellido()).append("\n");
        sb.append("*Total:* ").append(String.format("%.2f", order.getTotalAmount())).append("€\n");
        sb.append("*Método:* ").append(order.getDeliveryMode()).append("\n");
        
        if ("PICKUP".equalsIgnoreCase(order.getDeliveryMode())) {
            sb.append("📍 *Recogida en tienda*\n");
        } else {
            sb.append("🚚 *Envío a domicilio*\n");
            if (order.getShippingAddress() != null) {
                sb.append("🏠 *Dirección:* ").append(order.getShippingAddress()).append("\n");
            }
            if (order.getTrackingNumber() != null) {
                sb.append("📦 *Tracking:* `").append(order.getTrackingNumber()).append("` \n");
            }
        }
        
        return sb.toString();
    }
}
