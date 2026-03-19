package com.backend.TiendaTemplateBackend.infrastructure.rest.advice;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ErroManagerjava {
    private int statusCode;
    private LocalDateTime timestamp;
    private String message;
    private String description;
}
