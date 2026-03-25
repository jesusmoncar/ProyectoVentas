package com.backend.TiendaTemplateBackend.infrastructure.rest;

import com.backend.TiendaTemplateBackend.application.usecases.GetUserSavedDataUseCase;
import com.backend.TiendaTemplateBackend.application.usecases.SaveCartUseCase;
import com.backend.TiendaTemplateBackend.application.usecases.SaveWishlistUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserDataController {

    private final GetUserSavedDataUseCase getUserSavedDataUseCase;
    private final SaveCartUseCase saveCartUseCase;
    private final SaveWishlistUseCase saveWishlistUseCase;

    /** GET /api/user/saved-data → devuelve carrito y wishlist guardados */
    @GetMapping("/saved-data")
    public ResponseEntity<Map<String, String>> getSavedData(Authentication authentication) {
        return ResponseEntity.ok(getUserSavedDataUseCase.execute(authentication.getName()));
    }

    /** PUT /api/user/cart  body: { "cart": "[...]" } */
    @PutMapping("/cart")
    public ResponseEntity<Void> saveCart(@RequestBody Map<String, String> body,
                                         Authentication authentication) {
        saveCartUseCase.execute(authentication.getName(), body.getOrDefault("cart", "[]"));
        return ResponseEntity.noContent().build();
    }

    /** PUT /api/user/wishlist  body: { "wishlist": "[...]" } */
    @PutMapping("/wishlist")
    public ResponseEntity<Void> saveWishlist(@RequestBody Map<String, String> body,
                                              Authentication authentication) {
        saveWishlistUseCase.execute(authentication.getName(), body.getOrDefault("wishlist", "[]"));
        return ResponseEntity.noContent().build();
    }
}
