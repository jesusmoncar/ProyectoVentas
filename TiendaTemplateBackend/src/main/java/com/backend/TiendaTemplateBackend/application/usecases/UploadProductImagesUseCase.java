package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.application.mapper.ProductMapper;
import com.backend.TiendaTemplateBackend.domain.model.Product;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.entities.ProductImageEntity;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.jpa.ProductImageJpaRepository;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.jpa.ProductJpaRepository;
import com.backend.TiendaTemplateBackend.infrastructure.tenant.TenantConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
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
    private final TenantConfigService tenantConfigService;

    @Value("${cloudinary.cloud_name:placeholder}")
    private String defaultCloudName;
    @Value("${cloudinary.api_key:placeholder}")
    private String defaultApiKey;
    @Value("${cloudinary.api_secret:placeholder}")
    private String defaultApiSecret;

    private Cloudinary getCloudinary() {
        var config = tenantConfigService.getCurrentConfig().orElse(null);
        Map<String, String> cloudinaryConfig = new HashMap<>();
        
        if (config != null && config.getCloudinaryCloudName() != null) {
            cloudinaryConfig.put("cloud_name", config.getCloudinaryCloudName());
            cloudinaryConfig.put("api_key", config.getCloudinaryApiKey());
            cloudinaryConfig.put("api_secret", config.getCloudinaryApiSecret());
        } else {
            cloudinaryConfig.put("cloud_name", defaultCloudName);
            cloudinaryConfig.put("api_key", defaultApiKey);
            cloudinaryConfig.put("api_secret", defaultApiSecret);
        }
        return new Cloudinary(cloudinaryConfig);
    }

    @Transactional
    public Product execute(Long productId, List<MultipartFile> files) throws IOException {
        Cloudinary cloudinary = getCloudinary();
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