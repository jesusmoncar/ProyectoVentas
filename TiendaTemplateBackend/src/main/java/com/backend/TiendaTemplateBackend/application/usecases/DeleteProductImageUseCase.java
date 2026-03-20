package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.infrastructure.persistence.jpa.ProductImageJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
@RequiredArgsConstructor
public class DeleteProductImageUseCase {

    private final ProductImageJpaRepository productImageJpaRepository;
    private final Cloudinary cloudinary;

    @Transactional
    public void execute(Long productId, String filename) throws IOException {
        var imageEntity = productImageJpaRepository.findByFilenameAndProductId(filename, productId)
                .orElseThrow(() -> new RuntimeException("Imagen no encontrada con archivo: " + filename));

        String publicId = imageEntity.getFilename();
        if (publicId.contains(".")) {
            publicId = publicId.substring(0, publicId.lastIndexOf('.'));
        }
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

        productImageJpaRepository.delete(imageEntity);
    }
}