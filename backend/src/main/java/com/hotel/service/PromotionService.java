package com.hotel.service;

import com.hotel.entity.Promotion;
import com.hotel.entity.User;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.PromotionRepository;
import com.hotel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public List<Promotion> getActivePromotions() {
        LocalDate today = LocalDate.now();
        return promotionRepository
            .findByActiveTrueAndValidFromLessThanEqualAndValidToGreaterThanEqual(today, today);
    }

    // Returns only promos the logged-in user is eligible for
    public List<Promotion> getEligiblePromotions(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        long confirmedBookings = bookingRepository.countByUserIdAndStatus(user.getId(), "CONFIRMED");
        boolean isNewUser = confirmedBookings == 0;

        LocalDate today = LocalDate.now();
        List<Promotion> active = promotionRepository
            .findByActiveTrueAndValidFromLessThanEqualAndValidToGreaterThanEqual(today, today);

        return active.stream().filter(p -> {
            // Check loyalty points
            if (user.getLoyaltyPoints() < p.getMinLoyaltyPoints()) return false;
            // Check new user only flag
            if (Boolean.TRUE.equals(p.getNewUserOnly()) && !isNewUser) return false;
            return true;
        }).collect(Collectors.toList());
    }

    // Returns discounted price; throws if code invalid/expired
    public double applyPromoCode(String code, double originalPrice, int userLoyaltyPoints) {
        // Normalize: trim whitespace and uppercase before lookup
        String normalizedCode = code.trim().toUpperCase();

        Promotion promo = promotionRepository.findByCodeIgnoreCaseAndActiveTrue(normalizedCode)
            .orElseThrow(() -> new RuntimeException("Invalid or expired promo code: " + normalizedCode));

        LocalDate today = LocalDate.now();
        if (today.isBefore(promo.getValidFrom()) || today.isAfter(promo.getValidTo())) {
            throw new RuntimeException("Promo code '" + normalizedCode + "' is not valid today");
        }
        if (userLoyaltyPoints < promo.getMinLoyaltyPoints()) {
            throw new RuntimeException("You need " + promo.getMinLoyaltyPoints() + " loyalty points to use this code");
        }

        double discounted;
        if ("PERCENTAGE".equals(promo.getType())) {
            discounted = originalPrice - (originalPrice * promo.getDiscountValue() / 100);
        } else {
            discounted = Math.max(0, originalPrice - promo.getDiscountValue());
        }
        // Round to 2 decimal places
        return Math.round(discounted * 100.0) / 100.0;
    }
}
