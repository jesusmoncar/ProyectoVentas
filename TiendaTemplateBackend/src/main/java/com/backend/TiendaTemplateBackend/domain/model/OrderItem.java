package com.backend.TiendaTemplateBackend.domain.model;


import com.backend.TiendaTemplateBackend.infrastructure.persistence.entities.ProductEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private ProductEntity product;

    private Integer quantity;
    private Double price; //Precio en el momento de la compra
    private String variantLabel; //Variante seleccionada (ej: "Rojo / XL")
}
