package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.application.services.EmailService;
import com.backend.TiendaTemplateBackend.domain.model.PasswordResetToken;
import com.backend.TiendaTemplateBackend.domain.model.User;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.PasswordResetTokenRepository;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.UserRepository;
import com.backend.TiendaTemplateBackend.infrastructure.tenant.TenantContext;
import com.backend.TiendaTemplateBackend.infrastructure.tenant.TenantConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ForgotPasswordUseCase {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final TenantConfigService tenantConfigService;

    @Value("${app.frontend.url:http://localhost:4200}")
    private String defaultFrontendUrl;

    @Transactional
    public void execute(String email) {
        String pageCode = TenantContext.getCurrentTenant();
        var configOpt = tenantConfigService.getCurrentConfig();
        String frontendUrl = configOpt.map(c -> c.getAppFrontendUrl()).orElse(defaultFrontendUrl);
        
        Optional<User> userOpt = userRepository.findByEmailAndPageCode(email, pageCode);

        // Por seguridad, siempre respondemos lo mismo aunque el email no exista
        if (userOpt.isEmpty()) {
            return;
        }

        User user = userOpt.get();

        // Eliminar tokens previos del usuario
        tokenRepository.deleteAllByUser(user);

        // Generar nuevo token con expiración de 30 minutos
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(30))
                .build();
        tokenRepository.save(resetToken);

        // Construir el link de reset (apunta al frontend)
        String resetLink = frontendUrl + "/reset-password?token=" + token;
        String userName = user.getNombre() + " " + user.getApellido();

        emailService.sendPasswordResetEmail(user.getEmail(), userName, resetLink);
    }
}
