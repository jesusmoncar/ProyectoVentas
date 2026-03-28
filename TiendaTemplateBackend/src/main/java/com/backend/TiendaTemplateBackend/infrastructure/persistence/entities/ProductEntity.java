package com.backend.TiendaTemplateBackend.infrastructure.persistence.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import org.hibernate.annotations.ColumnDefault;
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
    private String pageCode;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private Double basePrice;

    @Column(nullable = false)
    @ColumnDefault("0")
    private Integer discountPercent = 0;

    //relacion con las variantes tallas/colores
    //orphanRemoval asegura que si borras una variante de la lista, se borre de la DB
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariantEntity> variants;

    // relacion con las imagenes del producto (max 5)
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ProductImageEntity> images;

}
