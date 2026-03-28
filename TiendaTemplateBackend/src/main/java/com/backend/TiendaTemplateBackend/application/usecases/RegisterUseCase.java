package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.application.dto.AuthRequest;
import com.backend.TiendaTemplateBackend.domain.model.Role;
import com.backend.TiendaTemplateBackend.domain.model.User;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.RoleRepository;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.UserRepository;
import com.backend.TiendaTemplateBackend.infrastructure.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class RegisterUseCase {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public void execute(AuthRequest request, String roleName) {
        String pageCode = TenantContext.getCurrentTenant();
        if (userRepository.findByEmailAndPageCode(request.getEmail(), pageCode).isPresent()) {
            throw new IllegalArgumentException("El email ya existe en esta tienda.");
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Rol " + roleName + " no encontrado."));

        User user = new User();
        user.setPageCode(pageCode);
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setNombre(request.getNombre());
        user.setApellido(request.getApellido());
        user.setTelefono(request.getTelefono());
        user.setDireccion(request.getDireccion());
        user.setRoles(Collections.singleton(role));
        userRepository.save(user);
    }
}
