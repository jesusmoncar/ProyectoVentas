package com.backend.TiendaTemplateBackend.infrastructure.persistence.jpa;

import com.backend.TiendaTemplateBackend.domain.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderJpaRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByNumeroPedidoAndPageCode(String numeroPedido, String pageCode);
    List<Order> findByUserEmailAndPageCode(String email, String pageCode);
    List<Order> findByStatusInAndPageCode(List<String> statuses, String pageCode);
    List<Order> findAllByPageCode(String pageCode);
    
    // Buscar ordenes por estado y fecha anterior a... (Global para Scheduler)
    List<Order> findByStatusAndOrderDateBefore(String status, java.time.LocalDateTime date);

    // Buscar ordenes por estado y fecha anterior a... (Específico por tienda)
    List<Order> findByStatusAndOrderDateBeforeAndPageCode(String status, java.time.LocalDateTime date, String pageCode);
}