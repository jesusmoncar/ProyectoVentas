package com.backend.TiendaTemplateBackend.application.usecases;


import com.backend.TiendaTemplateBackend.domain.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteProductUseCase {

    private final ProductRepository productRepository;

    @Transactional
    public void execute(Long id){
        if(!productRepository.existsById(id)){
            throw new RuntimeException("No se puede eliminar el producto " + id);
        }
    }
}
