package com.backend.TiendaTemplate.insfrastructure.persistence.entities;


import com.backend.TiendaTemplate.domain.model.ProductVariant;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
public class ProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private Double basePrice;

    //relacion con las variantes tallas/colores
    //orphanRemoval asegura que si borras una variante de la lista, se borre de la DB
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariantEntity> variants;


}
