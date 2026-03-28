package com.backend.TiendaTemplateBackend.infrastructure.sendcloud;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.backend.TiendaTemplateBackend.infrastructure.tenant.TenantConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class SendcloudService {

    private final TenantConfigService tenantConfigService;
    private final RestTemplate restTemplate = new RestTemplate();

    private static final String API_URL = "https://panel.sendcloud.sc/api/v2/parcels";

    /**
     * Creates a parcel in Sendcloud.
     * Request label is always forced to false to prevent surprises in early testing.
     * 
     * @param request The data for the parcel
     * @return The response from Sendcloud API
     */
    public String createParcel(SendcloudParcelRequest request) {
        var config = tenantConfigService.getCurrentConfig()
                .orElseThrow(() -> new RuntimeException("Sendcloud config missing for current tenant"));
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
        headers.setBasicAuth(config.getSendcloudApiKey().trim(), config.getSendcloudApiSecret().trim());

        HttpEntity<SendcloudParcelRequest> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    API_URL,
                    HttpMethod.POST,
                    entity,
                    String.class
            );
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Error creating parcel in Sendcloud: " + e.getMessage());
            throw new RuntimeException("Sendcloud API Error: " + e.getMessage(), e);
        }
    }

    public byte[] getLabelPdf(String labelUrl) {
        var config = tenantConfigService.getCurrentConfig()
                .orElseThrow(() -> new RuntimeException("Sendcloud config missing for current tenant"));
                
        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
        headers.setBasicAuth(config.getSendcloudApiKey().trim(), config.getSendcloudApiSecret().trim());

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<byte[]> response = restTemplate.exchange(
                    labelUrl,
                    HttpMethod.GET,
                    entity,
                    byte[].class
            );
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Error downloading label from Sendcloud: " + e.getMessage());
            return null;
        }
    }
}
