package com.backend.TiendaTemplateBackend.infrastructure.persistence.jpa;


import com.backend.TiendaTemplateBackend.infrastructure.persistence.entities.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductJpaRepository extends JpaRepository<ProductEntity, Long> {
    @Modifying
    @Query("UPDATE ProductEntity p SET p.discountPercent = :percent")
    void updateGlobalDiscount(@Param("percent") Integer percent);
}
