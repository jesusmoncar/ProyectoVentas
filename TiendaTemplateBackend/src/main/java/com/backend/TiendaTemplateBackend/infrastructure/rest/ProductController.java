package com.backend.TiendaTemplateBackend.infrastructure.rest;

import com.backend.TiendaTemplateBackend.application.dto.ProductRequest;
import com.backend.TiendaTemplateBackend.application.dto.ProductResponse;
import com.backend.TiendaTemplateBackend.application.mapper.ProductMapper;
import com.backend.TiendaTemplateBackend.application.usecases.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/products")
@RequiredArgsConstructor
public class ProductController {

    private final CreateProductUseCase createProductUseCase;
    private final GetProductUseCase getProductUseCase;
    private final UpdateProductUseCase updateProductUseCase;
    private final DeleteProductUseCase deleteProductUseCase;
    private final UploadProductImagesUseCase uploadProductImagesUseCase;
    private final DeleteProductImageUseCase deleteProductImageUseCase;
    private final UpdateGlobalDiscountUseCase updateGlobalDiscountUseCase;
    private final ProductMapper productMapper;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAll() {
        return ResponseEntity.ok(productMapper.toResponseList(getProductUseCase.getAll()));
    }

    @PutMapping("/discount/global")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateGlobalDiscount(@RequestParam("percent") Integer percent) {
        updateGlobalDiscountUseCase.execute(percent);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productMapper.toResponse(getProductUseCase.getById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> update(@PathVariable Long id, @Valid @RequestBody ProductRequest productRequest) {
        return ResponseEntity.ok(productMapper.toResponse(updateProductUseCase.execute(id, productRequest)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        deleteProductUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        return new ResponseEntity<>(productMapper.toResponse(createProductUseCase.execute(request)), HttpStatus.CREATED);
    }

    // Sube entre 1 y 5 imágenes a un producto (máximo 5 en total por producto)
    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> uploadImages(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files) throws IOException {
        return ResponseEntity.ok(productMapper.toResponse(uploadProductImagesUseCase.execute(id, files)));
    }

    // Elimina una imagen específica de un producto
    @DeleteMapping("/{id}/images/{filename:.+}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteImage(
            @PathVariable Long id,
            @PathVariable String filename) throws IOException {
        deleteProductImageUseCase.execute(id, filename);
        return ResponseEntity.noContent().build();
    }
}