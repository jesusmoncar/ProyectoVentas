package com.backend.TiendaTemplateBackend.infrastructure.persistence;

import com.backend.TiendaTemplateBackend.infrastructure.persistence.entities.TenantConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TenantConfigRepository extends JpaRepository<TenantConfig, String> {
}
