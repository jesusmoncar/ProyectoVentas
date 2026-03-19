package com.backend.TiendaTemplateBackend.infrastructure.config;

import com.backend.TiendaTemplateBackend.domain.model.Role;
import com.backend.TiendaTemplateBackend.domain.model.User;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.RoleRepository;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        Role userRole = roleRepository.findByName("ROLE_USER").orElseGet(() -> {
            Role r = new Role();
            r.setName("ROLE_USER");
            return roleRepository.save(r);
        });

        Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseGet(() -> {
            Role r = new Role();
            r.setName("ROLE_ADMIN");
            return roleRepository.save(r);
        });

        // Crea el admin por defecto si no existe — CAMBIAR LA CONTRASEÑA EN PRODUCCIÓN
        if (userRepository.findByEmail("admin@tienda.com").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@tienda.com");
            admin.setPassword(passwordEncoder.encode("Admin1234!"));
            admin.setRoles(Set.of(adminRole));
            userRepository.save(admin);
        }
    }
}
