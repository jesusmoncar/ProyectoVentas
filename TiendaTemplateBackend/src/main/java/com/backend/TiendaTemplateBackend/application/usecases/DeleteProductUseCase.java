package com.backend.TiendaTemplateBackend.application.usecases;


import com.backend.TiendaTemplateBackend.domain.repository.ProductRepository;
import com.backend.TiendaTemplateBackend.infrastructure.persistence.jpa.ProductJpaRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteProductUseCase {

    private final ProductRepository productRepository;
    private final ProductJpaRepository productJpaRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void execute(Long id){
        if(!productRepository.existsById(id)){
            throw new RuntimeException("Producto no encontrado con id: " + id);
        }

        // Desvincula el producto de los order_items existentes (preserva historial)
        entityManager.createNativeQuery(
            "UPDATE order_items SET product_id = NULL WHERE product_id = :pid"
        ).setParameter("pid", id).executeUpdate();

        // Ahora sí podemos borrar el producto (cascadea a variants e images)
        productRepository.deleteById(id);
    }
}
