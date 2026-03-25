package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.domain.model.User;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class GetUserSavedDataUseCase {

    private final UserRepository userRepository;

    public Map<String, String> execute(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return Map.of(
                "cart",     user.getCartData()     != null ? user.getCartData()     : "[]",
                "wishlist", user.getWishlistData() != null ? user.getWishlistData() : "[]"
        );
    }
}
