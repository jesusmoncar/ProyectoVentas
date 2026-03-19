package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.domain.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteOrderUseCase {

    private final OrderRepository orderRepository;

    public void execute(Long id) {
        orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado: " + id));
        orderRepository.deleteById(id);
    }
}