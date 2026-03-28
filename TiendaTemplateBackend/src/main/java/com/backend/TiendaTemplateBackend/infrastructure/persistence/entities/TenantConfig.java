package com.backend.TiendaTemplateBackend.infrastructure.persistence.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tenant_configs")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class TenantConfig {

    @Id
    @Column(name = "page_code")
    private String pageCode;

    private String appName;
    
    // Telegram
    private String telegramBotToken;
    private String telegramChatId;

    // Sendcloud
    private String sendcloudApiKey;
    private String sendcloudApiSecret;

    // Stripe
    private String stripeSecretKey;

    // Cloudinary
    private String cloudinaryCloudName;
    private String cloudinaryApiKey;
    private String cloudinaryApiSecret;

    // Email (SMTP)
    private String mailHost;
    private Integer mailPort;
    private String mailUsername;
    private String mailPassword;

    private String appFrontendUrl;
}
