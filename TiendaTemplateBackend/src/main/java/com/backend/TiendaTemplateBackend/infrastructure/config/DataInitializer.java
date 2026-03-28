package com.backend.TiendaTemplateBackend.infrastructure.config;

import com.backend.TiendaTemplateBackend.domain.model.Role;
import com.backend.TiendaTemplateBackend.domain.model.User;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.RoleRepository;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.TenantConfigRepository;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.UserRepository;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.entities.TenantConfig;
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
    private final TenantConfigRepository tenantConfigRepository;

    @Override
    public void run(String... args) {
        // 1. Roles
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

        // 2. Tenant Config (BLOOM) por defecto si no existe
        if (tenantConfigRepository.findById("bloom").isEmpty()) {
            TenantConfig bloomConfig = new TenantConfig();
            bloomConfig.setPageCode("bloom");
            bloomConfig.setAppName("TiendaTemplate");
            // Aquí puedes poner valores por defecto o dejarlos nulos para configurar via SQL/Admin
            bloomConfig.setStripeSecretKey("sk_test_..."); 
            tenantConfigRepository.save(bloomConfig);
        }

        // 3. Usuario Admin por defecto vinculado a 'bloom'
        if (userRepository.findByEmailAndPageCode("admin@tienda.com", "bloom").isEmpty()) {
            User admin = new User();
            admin.setPageCode("bloom");
            admin.setEmail("admin@tienda.com");
            admin.setNombre("Admin");
            admin.setApellido("Admin");
            admin.setPassword(passwordEncoder.encode("Admin1234!"));
            admin.setRoles(Set.of(adminRole));
            userRepository.save(admin);
        }
    }
}
