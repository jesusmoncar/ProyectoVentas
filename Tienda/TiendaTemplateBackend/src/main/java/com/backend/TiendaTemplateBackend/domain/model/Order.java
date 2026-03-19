package com.backend.TiendaTemplateBackend.domain.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(unique = true, nullable = false, updatable = false)
    private String numeroPedido;

    private LocalDateTime orderDate;
    private Double totalAmount;
    private String status; //PENDING, PAID, SHIPPED
    private String shippingAddress;

    @PrePersist
    private void generateNumeroPedido() {
        if (this.numeroPedido == null) {
            String fecha = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            int random = ThreadLocalRandom.current().nextInt(10000, 99999);
            this.numeroPedido = fecha + random;
        }
    }

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
}
