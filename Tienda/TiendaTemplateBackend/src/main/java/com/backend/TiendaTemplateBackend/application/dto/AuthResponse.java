package com.backend.TiendaTemplateBackend.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String nombre;
    private String apellido;
    private String telefono;
    private String direccion;
}