package com.backend.TiendaTemplateBackend.infrastructure.persistence.jpa;

import com.backend.TiendaTemplateBackend.infrastructure.persistence.entities.ProductImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductImageJpaRepository extends JpaRepository<ProductImageEntity, Long> {

    List<ProductImageEntity> findByProductId(Long productId);

    Optional<ProductImageEntity> findByIdAndProductId(Long id, Long productId);

    int countByProductId(Long productId);
}