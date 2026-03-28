package com.backend.TiendaTemplateBackend.infrastructure.tenant;

import com.backend.TiendaTemplateBackend.infrastructure.persistence.TenantConfigRepository;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.entities.TenantConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TenantConfigService {

    private final TenantConfigRepository tenantConfigRepository;

    /**
     * Gets the configuration for the current request's tenant.
     * If the tenant is not found, returns empty Optional.
     */
    public Optional<TenantConfig> getCurrentConfig() {
        String tenant = TenantContext.getCurrentTenant();
        if (tenant == null) return Optional.empty();
        return tenantConfigRepository.findById(tenant);
    }

    /**
     * Gets the configuration for a specific tenant code.
     */
    public Optional<TenantConfig> getConfigFor(String pageCode) {
        return tenantConfigRepository.findById(pageCode);
    }
}
