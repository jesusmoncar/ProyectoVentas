package com.backend.TiendaTemplateBackend.application.mapper;

import com.backend.TiendaTemplateBackend.application.dto.ProductResponse;
import com.backend.TiendaTemplateBackend.application.dto.ProductVariantResponse;
import com.backend.TiendaTemplateBackend.domain.model.Product;
import com.backend.TiendaTemplateBackend.domain.model.ProductVariant;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.entities.ProductEntity;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.entities.ProductImageEntity;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.entities.ProductVariantEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring") //permite que spring lo inyecte como Bean
public interface ProductMapper {

    //convierte entidad(DB) a modelo(Negocio)
    @Mapping(target = "images", source = "images", qualifiedByName = "toImageUrls")
    Product toDomain(ProductEntity entity);

    //conviete de modelo(Negocio) a entidad(DB)
    @Mapping(target = "variants", source = "variants")
    @Mapping(target = "images", ignore = true)
    ProductEntity toEntity(Product product);

    //mapeo variantes
    ProductVariant toVariantDomain(ProductVariantEntity entity);

    //recursividad infinita
    @Mapping(target = "product", ignore = true)
    ProductVariantEntity toVariantEntity(ProductVariant domain);

    //mapeo de lista
    List<Product> toDomainList(List<ProductEntity> entities);

    //mapeo a DTO de respuesta
    ProductResponse toResponse(Product product);
    ProductVariantResponse toVariantResponse(ProductVariant variant);
    List<ProductResponse> toResponseList(List<Product> products);

    // extrae las URLs de las imagenes
    @Named("toImageUrls")
    default List<String> toImageUrls(List<ProductImageEntity> images) {
        if (images == null) return Collections.emptyList();
        return images.stream().map(ProductImageEntity::getUrl).collect(Collectors.toList());
    }
}