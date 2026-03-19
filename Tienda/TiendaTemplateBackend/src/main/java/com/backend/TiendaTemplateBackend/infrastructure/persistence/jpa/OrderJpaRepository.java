package com.backend.TiendaTemplateBackend.infrastructure.persistence.jpa;

import com.backend.TiendaTemplateBackend.domain.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderJpaRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByNumeroPedido(String numeroPedido);
}