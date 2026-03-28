package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.domain.model.User;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.UserRepository;
import com.backend.TiendaTemplateBackend.infrastructure.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SaveWishlistUseCase {

    private final UserRepository userRepository;

    @Transactional
    public void execute(String email, String wishlistJson) {
        String pageCode = TenantContext.getCurrentTenant();
        User user = userRepository.findByEmailAndPageCode(email, pageCode)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado en " + pageCode));
        user.setWishlistData(wishlistJson);
        userRepository.save(user);
    }
}
