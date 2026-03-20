package com.backend.TiendaTemplateBackend.infrastructure.rest;

import com.backend.TiendaTemplateBackend.application.dto.AuthRequest;
import com.backend.TiendaTemplateBackend.application.dto.AuthResponse;
import com.backend.TiendaTemplateBackend.application.dto.ForgotPasswordRequest;
import com.backend.TiendaTemplateBackend.application.dto.GoogleAuthRequest;
import com.backend.TiendaTemplateBackend.application.dto.LoginRequest;
import com.backend.TiendaTemplateBackend.application.dto.ResetPasswordRequest;
import com.backend.TiendaTemplateBackend.application.usecases.ForgotPasswordUseCase;
import com.backend.TiendaTemplateBackend.application.usecases.GoogleLoginUseCase;
import com.backend.TiendaTemplateBackend.application.usecases.LoginUseCase;
import com.backend.TiendaTemplateBackend.application.usecases.RegisterUseCase;
import com.backend.TiendaTemplateBackend.application.usecases.ResetPasswordUseCase;
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
    private final ForgotPasswordUseCase forgotPasswordUseCase;
    private final ResetPasswordUseCase resetPasswordUseCase;

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

    /**
     * Solicitar restablecimiento de contraseña.
     * Envía un email con el enlace de recuperación si el correo existe en el sistema.
     * Por seguridad, siempre responde con el mismo mensaje.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        forgotPasswordUseCase.execute(request.getEmail());
        return ResponseEntity.ok("Si el correo existe en nuestro sistema, recibirás un enlace de recuperación en breve.");
    }

    /**
     * Restablecer la contraseña usando el token recibido por email.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        resetPasswordUseCase.execute(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("¡Contraseña restablecida exitosamente! Ya puedes iniciar sesión.");
    }
}
