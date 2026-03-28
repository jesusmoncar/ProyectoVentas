package com.backend.TiendaTemplateBackend.domain.repository;

import com.backend.TiendaTemplateBackend.domain.model.Order;

import java.util.List;
import java.util.Optional;

public interface OrderRepository {
    Order save(Order order);
    Optional<Order> findById(Long id);
    Optional<Order> findByNumeroPedido(String numeroPedido, String pageCode);
    List<Order> findAll(String pageCode);
    void deleteById(Long id, String pageCode);
}