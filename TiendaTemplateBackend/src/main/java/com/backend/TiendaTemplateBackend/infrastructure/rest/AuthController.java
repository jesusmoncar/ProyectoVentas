package com.backend.TiendaTemplateBackend.infrastructure.rest;

import com.backend.TiendaTemplateBackend.application.dto.AuthRequest;
import com.backend.TiendaTemplateBackend.application.dto.LoginRequest;
import com.backend.TiendaTemplateBackend.application.dto.AuthResponse;
import com.backend.TiendaTemplateBackend.application.dto.GoogleAuthRequest;
import com.backend.TiendaTemplateBackend.application.usecases.LoginUseCase;
import com.backend.TiendaTemplateBackend.application.usecases.RegisterUseCase;
import com.backend.TiendaTemplateBackend.application.usecases.GoogleLoginUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final LoginUseCase loginUseCase;
    private final RegisterUseCase registerUseCase;
    private final GoogleLoginUseCase googleLoginUseCase;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(loginUseCase.execute(request));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody AuthRequest request) {
        registerUseCase.execute(request, "ROLE_USER");
        return ResponseEntity.ok("Usuario registrado exitosamente.");
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleAuthRequest request) {
        return ResponseEntity.ok(googleLoginUseCase.execute(request.getAccessToken()));
    }

    // Solo un ADMIN puede crear otro ADMIN
    @PostMapping("/register-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> registerAdmin(@Valid @RequestBody AuthRequest request) {
        registerUseCase.execute(request, "ROLE_ADMIN");
        return ResponseEntity.ok("Administrador registrado exitosamente.");
    }


}
