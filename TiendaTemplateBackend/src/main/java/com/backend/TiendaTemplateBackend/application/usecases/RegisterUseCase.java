package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.application.dto.AuthRequest;
import com.backend.TiendaTemplateBackend.domain.model.Role;
import com.backend.TiendaTemplateBackend.domain.model.User;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.RoleRepository;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.UserRepository;
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
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("El email ya existe.");
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Rol " + roleName + " no encontrado."));

        User user = new User();
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
