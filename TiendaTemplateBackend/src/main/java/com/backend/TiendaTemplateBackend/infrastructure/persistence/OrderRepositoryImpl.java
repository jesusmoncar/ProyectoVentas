package com.backend.TiendaTemplateBackend.infrastructure.persistence;

import com.backend.TiendaTemplateBackend.domain.model.Order;
import com.backend.TiendaTemplateBackend.domain.repository.OrderRepository;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.jpa.OrderJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OrderRepositoryImpl implements OrderRepository {

    private final OrderJpaRepository jpaRepository;

    @Override
    public Order save(Order order) {
        return jpaRepository.save(order);
    }

    @Override
    public Optional<Order> findById(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public Optional<Order> findByNumeroPedido(String numeroPedido, String pageCode) {
        return jpaRepository.findByNumeroPedidoAndPageCode(numeroPedido, pageCode);
    }

    @Override
    public List<Order> findAll(String pageCode) {
        return jpaRepository.findAllByPageCode(pageCode);
    }

    @Override
    public void deleteById(Long id, String pageCode) {
        // Here we could also verify if the order belongs to the tenant before deleting,
        // but for now let's delegate to the JPA repository or do a check.
        jpaRepository.findById(id).ifPresent(order -> {
            if (order.getPageCode().equals(pageCode)) {
                jpaRepository.delete(order);
            }
        });
    }
}