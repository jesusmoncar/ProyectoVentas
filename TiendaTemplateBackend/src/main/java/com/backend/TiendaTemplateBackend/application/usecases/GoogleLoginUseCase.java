package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.application.dto.AuthResponse;
import com.backend.TiendaTemplateBackend.domain.model.Role;
import com.backend.TiendaTemplateBackend.domain.model.User;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.RoleRepository;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.UserRepository;
import com.backend.TiendaTemplateBackend.infrastructure.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GoogleLoginUseCase {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    private static final String GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

    public AuthResponse execute(String accessToken) {
        // Verificar el token con Google y obtener info del usuario
        Map<String, Object> googleUser = fetchGoogleUserInfo(accessToken);

        String email     = (String) googleUser.get("email");
        String firstName = (String) googleUser.getOrDefault("given_name", email.split("@")[0]);
        String lastName  = (String) googleUser.getOrDefault("family_name", "");

        if (email == null) {
            throw new IllegalArgumentException("No se pudo obtener el email de Google.");
        }

        // Buscar o crear el usuario
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            Role role = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("Rol ROLE_USER no encontrado."));

            User newUser = new User();
            newUser.setEmail(email);
            newUser.setNombre(firstName);
            newUser.setApellido(lastName.isEmpty() ? "-" : lastName);
            // Contraseña aleatoria: los usuarios de Google no hacen login con contraseña
            newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            newUser.setRoles(Collections.singleton(role));
            return userRepository.save(newUser);
        });

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .toList();

        String token = jwtService.generateToken(user.getEmail(), Map.of("roles", roles));
        return new AuthResponse(token, user.getEmail(), user.getNombre(), user.getApellido(),
                user.getTelefono(), user.getDireccion());
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> fetchGoogleUserInfo(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                GOOGLE_USERINFO_URL,
                HttpMethod.GET,
                entity,
                Map.class
        );

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new IllegalArgumentException("Token de Google inválido.");
        }
        return response.getBody();
    }
}
