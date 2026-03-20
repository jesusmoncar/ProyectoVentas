package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.application.mapper.ProductMapper;
import com.backend.TiendaTemplateBackend.domain.model.Product;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.entities.ProductImageEntity;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.jpa.ProductImageJpaRepository;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.jpa.ProductJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
@RequiredArgsConstructor
public class UploadProductImagesUseCase {

    private final ProductJpaRepository productJpaRepository;
    private final ProductImageJpaRepository productImageJpaRepository;
    private final ProductMapper productMapper;
    private final Cloudinary cloudinary;

    @Transactional
    public Product execute(Long productId, List<MultipartFile> files) throws IOException {
        var productEntity = productJpaRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + productId));

        if (files == null || files.isEmpty()) {
            throw new RuntimeException("Debes subir al menos 1 imagen");
        }
        if (files.size() > 5) {
            throw new RuntimeException("No puedes subir más de 5 imágenes a la vez");
        }

        int currentCount = productImageJpaRepository.countByProductId(productId);
        if (currentCount + files.size() > 5) {
            throw new RuntimeException(
                    "El producto ya tiene " + currentCount + " imagen(es). Solo puedes añadir " + (5 - currentCount) + " más"
            );
        }

        for (MultipartFile file : files) {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            
            String secureUrl = uploadResult.get("secure_url").toString();
            String parsedFilename = secureUrl.substring(secureUrl.lastIndexOf('/') + 1);

            ProductImageEntity imageEntity = new ProductImageEntity();
            imageEntity.setFilename(parsedFilename);
            imageEntity.setUrl(secureUrl);
            imageEntity.setProduct(productEntity);
            productImageJpaRepository.save(imageEntity);
        }

        // recargamos para devolver el producto actualizado con imagenes
        var updatedEntity = productJpaRepository.findById(productId).orElseThrow();
        return productMapper.toDomain(updatedEntity);
    }

}