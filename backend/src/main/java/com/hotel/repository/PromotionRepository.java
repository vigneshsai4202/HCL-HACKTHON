package com.hotel.repository;

import com.hotel.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    Optional<Promotion> findByCodeIgnoreCaseAndActiveTrue(String code);
    List<Promotion> findByActiveTrueAndValidFromLessThanEqualAndValidToGreaterThanEqual(
        LocalDate from, LocalDate to);
}
