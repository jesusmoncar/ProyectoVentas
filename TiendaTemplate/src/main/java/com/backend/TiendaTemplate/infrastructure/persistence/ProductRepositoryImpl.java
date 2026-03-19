package com.backend.TiendaTemplate.infrastructure.persistence;

import com.backend.TiendaTemplate.domain.model.Product;
import com.backend.TiendaTemplate.domain.repository.ProductRepository;
import com.backend.TiendaTemplate.infrastructure.persistence.entities.ProductEntity;
import com.backend.TiendaTemplate.infrastructure.persistence.jpa.ProductJpaRepository;
import com.backend.TiendaTemplate.application.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor // Inyecta automáticamente el JPA repo y el Mapper
public class ProductRepositoryImpl implements ProductRepository {

    private final ProductJpaRepository jpaRepository;
    private final ProductMapper productMapper;

    @Override
    public Product save(Product product) {
        ProductEntity entity = productMapper.toEntity(product);
        // Aseguramos la relación bidireccional para que JPA guarde bien las variantes
        if (entity.getVariants() != null) {
            entity.getVariants().forEach(variant -> variant.setProduct(entity));
        }
        ProductEntity savedEntity = jpaRepository.save(entity);
        return productMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Product> findById(Long id) {
        return jpaRepository.findById(id)
                .map(productMapper::toDomain);
    }

    @Override
    public List<Product> findAll() {
        return productMapper.toDomainList(jpaRepository.findAll());
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
}