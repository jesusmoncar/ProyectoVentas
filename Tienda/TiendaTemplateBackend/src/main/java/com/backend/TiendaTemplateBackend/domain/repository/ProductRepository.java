package com.backend.TiendaTemplateBackend.domain.repository;

import com.backend.TiendaTemplateBackend.domain.model.Product;

import java.util.List;
import java.util.Optional;

public interface ProductRepository {
    //Metodos CRUD
    Product save(Product product);
    Optional<Product> findById(Long id);
    List<Product> findAll();
    void deleteById(Long id);
    boolean existsById(Long id);

}
