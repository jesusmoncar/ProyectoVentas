package com.backend.TiendaTemplateBackend.application.usecases;

import com.backend.TiendaTemplateBackend.infrastructure.persistence.jpa.ProductImageJpaRepository;
import com.backend.TiendaTemplateBackend.infrastructure.tenant.TenantConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
@RequiredArgsConstructor
public class DeleteProductImageUseCase {

    private final ProductImageJpaRepository productImageJpaRepository;
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
    public void execute(Long productId, String filename) throws IOException {
        Cloudinary cloudinary = getCloudinary();
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