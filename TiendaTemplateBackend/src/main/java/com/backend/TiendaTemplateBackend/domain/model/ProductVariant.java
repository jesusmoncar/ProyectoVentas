package com.backend.TiendaTemplateBackend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariant {

    //evita vender una combinacion en concreto si no nos queda.
    private Long id;
    private String sku; //Ej: CAM-AZUL-L
    private String color; //Atributo especifico
    private String colorName;
    private String size; //atributo talla especifico
    private Integer stock; //stock de la combinacion especifica
    private Double priceOverride; //Por si una combinacion es mas cara que otra

}
