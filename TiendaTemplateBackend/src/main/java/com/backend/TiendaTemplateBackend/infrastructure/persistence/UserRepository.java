package com.backend.TiendaTemplateBackend.infrastructure.persistence;

import com.backend.TiendaTemplateBackend.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailAndPageCode(String email, String pageCode);
}