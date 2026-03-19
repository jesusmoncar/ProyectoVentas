package com.backend.TiendaTemplate.insfrastructure.persistence.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
public class ProductVariantEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String sku;

    private String color;
    private String size;
    private Integer stock;
    private Double priceOverride;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private  ProductEntity product;
}
