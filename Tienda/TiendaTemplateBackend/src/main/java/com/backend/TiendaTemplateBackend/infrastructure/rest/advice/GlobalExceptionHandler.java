package com.backend.TiendaTemplateBackend.infrastructure.rest.advice;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    //404 no encontrado
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorMessage>handleRuntimeException(RuntimeException exception, WebRequest request){
        ErrorMessage message = new ErrorMessage(
                HttpStatus.NOT_FOUND.value(),
                LocalDateTime.now(),
                exception.getMessage(),
                request.getDescription(false)
        );
        return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);

    }

    //Validacion de Bean Validation @Valid
    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorMessage> handleValidationException(org.springframework.web.bind.MethodArgumentNotValidException ex) {
        String errorMsg = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .reduce("", (a, b) -> a + " " + b);

        ErrorMessage message = new ErrorMessage(
                HttpStatus.BAD_REQUEST.value(),
                LocalDateTime.now(),
                "Error de validación",
                errorMsg.trim()
        );
        return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
    }

    // Error genérico para cualquier otra cosa (500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorMessage> globalExceptionHandler(Exception ex, WebRequest request) {
        ErrorMessage message = new ErrorMessage(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now(),
                "Ocurrió un error inesperado",
                ex.getMessage()
        );
        return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
