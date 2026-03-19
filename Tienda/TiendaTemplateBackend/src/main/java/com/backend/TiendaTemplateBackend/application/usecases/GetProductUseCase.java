package com.backend.TiendaTemplateBackend.application.usecases;


import com.backend.TiendaTemplateBackend.domain.model.Product;
import com.backend.TiendaTemplateBackend.domain.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetProductUseCase {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<Product> getAll(){
        return productRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Product getById(Long id){
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto con ID: " + id + " no encontrado"));
    }
}
