package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.application.dto.LoginRequest;
import com.backend.TiendaTemplateBackend.application.dto.AuthResponse;
import com.backend.TiendaTemplateBackend.domain.model.Role;
import com.backend.TiendaTemplateBackend.domain.model.User;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.UserRepository;
import com.backend.TiendaTemplateBackend.infrastructure.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LoginUseCase {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse execute(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Credenciales inválidas.");
        }

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .toList();

        String token = jwtService.generateToken(user.getEmail(), Map.of("roles", roles));
        return new AuthResponse(token, user.getEmail(), user.getNombre(), user.getApellido(), user.getTelefono(), user.getDireccion());
    }
}
