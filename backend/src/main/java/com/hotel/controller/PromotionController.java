package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.entity.Promotion;
import com.hotel.service.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/promotions")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    // GET /promotions/active  (public)
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Promotion>>> getActivePromotions() {
        List<Promotion> promos = promotionService.getActivePromotions();
        return ResponseEntity.ok(new ApiResponse<>(true, "Active promotions", promos));
    }

    // GET /promotions/eligible  (JWT required — returns only what THIS user can use)
    @GetMapping("/eligible")
    public ResponseEntity<ApiResponse<List<Promotion>>> getEligiblePromotions(
            @AuthenticationPrincipal String userEmail) {
        List<Promotion> promos = promotionService.getEligiblePromotions(userEmail);
        return ResponseEntity.ok(new ApiResponse<>(true, "Eligible promotions", promos));
    }
}
