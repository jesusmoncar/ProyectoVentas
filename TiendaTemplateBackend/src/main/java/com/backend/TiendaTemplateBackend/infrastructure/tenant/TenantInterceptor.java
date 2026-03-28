package com.backend.TiendaTemplateBackend.infrastructure.tenant;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

/**
 * Interceptor that catches the X-Page-Code header from every request
 * and sets it in the TenantContext.
 */
@Component
public class TenantInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String pageCode = request.getHeader("X-Page-Code");
        
        // Default to "bloom" if not provided for now, but in production we can reject.
        if (pageCode == null || pageCode.trim().isEmpty()) {
            pageCode = "bloom";
        }
        
        TenantContext.setCurrentTenant(pageCode);
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) {
        TenantContext.clear();
    }
}
