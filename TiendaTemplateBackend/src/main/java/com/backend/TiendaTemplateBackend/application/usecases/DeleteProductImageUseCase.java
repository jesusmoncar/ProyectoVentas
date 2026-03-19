package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.infrastructure.persistence.jpa.ProductImageJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
public class DeleteProductImageUseCase {

    private final ProductImageJpaRepository productImageJpaRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Transactional
    public void execute(Long productId, Long imageId) throws IOException {
        var imageEntity = productImageJpaRepository.findByIdAndProductId(imageId, productId)
                .orElseThrow(() -> new RuntimeException("Imagen no encontrada con id: " + imageId));

        Path filePath = Paths.get(uploadDir, "products", imageEntity.getFilename());
        Files.deleteIfExists(filePath);

        productImageJpaRepository.delete(imageEntity);
    }
}