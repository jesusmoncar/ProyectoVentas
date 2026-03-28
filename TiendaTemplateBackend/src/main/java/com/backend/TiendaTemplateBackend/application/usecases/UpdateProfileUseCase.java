package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.domain.model.User;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.UserRepository;
import com.backend.TiendaTemplateBackend.infrastructure.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UpdateProfileUseCase {

    private final UserRepository userRepository;

    @Transactional
    public void execute(String email, String nombre, String apellido, String telefono) {
        String pageCode = TenantContext.getCurrentTenant();
        User user = userRepository.findByEmailAndPageCode(email, pageCode)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado en " + pageCode));
        
        if (nombre != null) user.setNombre(nombre);
        if (apellido != null) user.setApellido(apellido);
        if (telefono != null) user.setTelefono(telefono);
        
        userRepository.save(user);
    }
}
