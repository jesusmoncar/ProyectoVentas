package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.domain.model.User;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.UserRepository;
import com.backend.TiendaTemplateBackend.infrastructure.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class GetUserSavedDataUseCase {

    private final UserRepository userRepository;

    public Map<String, String> execute(String email) {
        String pageCode = TenantContext.getCurrentTenant();
        User user = userRepository.findByEmailAndPageCode(email, pageCode)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado en " + pageCode));
        return Map.of(
                "cart",     user.getCartData()     != null ? user.getCartData()     : "[]",
                "wishlist", user.getWishlistData() != null ? user.getWishlistData() : "[]"
        );
    }
}
