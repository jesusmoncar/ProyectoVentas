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
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UploadProductImagesUseCase {

    private final ProductJpaRepository productJpaRepository;
    private final ProductImageJpaRepository productImageJpaRepository;
    private final ProductMapper productMapper;

    @Value("${app.upload.dir}")
    private String uploadDir;

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

        Path uploadPath = Paths.get(uploadDir, "products").toAbsolutePath();
        Files.createDirectories(uploadPath);

        for (MultipartFile file : files) {
            String extension = getExtension(file.getOriginalFilename());
            String filename = UUID.randomUUID() + "." + extension;

            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);

            ProductImageEntity imageEntity = new ProductImageEntity();
            imageEntity.setFilename(filename);
            imageEntity.setUrl("/uploads/products/" + filename);
            imageEntity.setProduct(productEntity);
            productImageJpaRepository.save(imageEntity);
        }

        // recargamos para devolver el producto actualizado con imagenes
        var updatedEntity = productJpaRepository.findById(productId).orElseThrow();
        return productMapper.toDomain(updatedEntity);
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "jpg";
        }
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}