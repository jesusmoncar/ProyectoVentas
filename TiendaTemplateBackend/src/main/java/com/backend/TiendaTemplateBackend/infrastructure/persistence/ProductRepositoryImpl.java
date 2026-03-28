package com.backend.TiendaTemplateBackend.infrastructure.persistence;

import com.backend.TiendaTemplateBackend.domain.model.Product;
import com.backend.TiendaTemplateBackend.domain.repository.ProductRepository;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.entities.ProductEntity;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.jpa.ProductJpaRepository;
import com.backend.TiendaTemplateBackend.application.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.stream.Collectors;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.entities.ProductVariantEntity;

import com.backend.TiendaTemplateBackend.infrastructure.tenant.TenantContext;

@Component
@RequiredArgsConstructor // Inyecta automáticamente el JPA repo y el Mapper
public class ProductRepositoryImpl implements ProductRepository {

    private final ProductJpaRepository jpaRepository;
    private final ProductMapper productMapper;

    @Override
    public Product save(Product product) {
        ProductEntity entity;
        String currentPageCode = TenantContext.getCurrentTenant();
        
        if (product.getId() != null) {
            entity = jpaRepository.findById(product.getId()).orElseThrow();
            entity.setName(product.getName());
            entity.setDescription(product.getDescription());
            entity.setBasePrice(product.getBasePrice());
            entity.setDiscountPercent(product.getDiscountPercent() != null ? product.getDiscountPercent() : 0);
            entity.setPageCode(currentPageCode); // Ensure pageCode is set

            if (entity.getVariants() != null) {
                entity.getVariants().clear();
            } else {
                entity.setVariants(new ArrayList<>());
            }

            if (product.getVariants() != null) {
                List<ProductVariantEntity> paramVariants = product.getVariants().stream()
                        .map(productMapper::toVariantEntity)
                        .peek(v -> v.setProduct(entity))
                        .collect(Collectors.toList());
                entity.getVariants().addAll(paramVariants);
            }
        } else {
            entity = productMapper.toEntity(product);
            entity.setPageCode(currentPageCode); // Set tenant for new products
            if (entity.getVariants() != null) {
                entity.getVariants().forEach(variant -> variant.setProduct(entity));
            }
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
    public List<Product> findByPageCode(String pageCode) {
        return productMapper.toDomainList(jpaRepository.findByPageCode(pageCode));
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return jpaRepository.existsById(id);
    }

    @Override
    public void updateGlobalDiscount(Integer discountPercent, String pageCode) {
        jpaRepository.updateGlobalDiscount(discountPercent, pageCode);
    }
}