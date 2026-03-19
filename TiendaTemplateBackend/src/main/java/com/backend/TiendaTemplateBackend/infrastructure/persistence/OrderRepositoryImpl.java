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
    public Optional<Order> findByNumeroPedido(String numeroPedido) {
        return jpaRepository.findByNumeroPedido(numeroPedido);
    }

    @Override
    public List<Order> findAll() {
        return jpaRepository.findAll();
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
}