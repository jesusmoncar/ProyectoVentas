package com.backend.TiendaTemplateBackend.infrastructure.tenant;

/**
 * Utility class to store and retrieve the current page code (tenant) 
 * for the current thread during the request lifecycle.
 */
public class TenantContext {
    private static final ThreadLocal<String> CURRENT_TENANT = new ThreadLocal<>();

    public static void setCurrentTenant(String tenant) {
        CURRENT_TENANT.set(tenant);
    }

    public static String getCurrentTenant() {
        return CURRENT_TENANT.get();
    }

    public static void clear() {
        CURRENT_TENANT.remove();
    }
}
